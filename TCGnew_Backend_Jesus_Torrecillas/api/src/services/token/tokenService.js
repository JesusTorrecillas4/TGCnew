
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const User = require('../../models/usuari');
const Token = require('../../models/tokens');

// Duración de los tokens
const ACCESS_DURATION = '15m';
const REFRESH_DURATION = '7d';

// Guardamos un hash del refresh token en MongoDB
const hashToken = (token) => {
    return crypto.createHash('sha256').update(token).digest('hex');
};

// Genera los dos tokens
const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { id: user._id.toString(), role: user.role },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: ACCESS_DURATION }
    );

    const refreshToken = jwt.sign(
        { id: user._id.toString(), jti: crypto.randomUUID() },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: REFRESH_DURATION }
    );

    return { accessToken, refreshToken };
};

// Guarda el refresh token en MongoDB
const saveRefreshToken = async (user, refreshToken) => {
    await Token.create({
        user: user._id,
        tokenHash: hashToken(refreshToken),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        revoked: false
    });
};

// LOGIN: comprueba el usuario y genera tokens
const login = async ({ email, password } = {}) => {
    if (typeof email !== 'string' || typeof password !== 'string') {
        const error = new Error('Email y contraseña obligatorios');
        error.status = 400;
        throw error;
    }

    const user = await User.findOne({
        email: email.trim().toLowerCase(),
        active: true
    }).select('+passwordHash');

    const valid = user
        ? await bcrypt.compare(password, user.passwordHash)
        : false;

    if (!valid) {
        const error = new Error('Credenciales incorrectas');
        error.status = 401;
        throw error;
    }

    const tokens = generateTokens(user);
    await saveRefreshToken(user, tokens.refreshToken);

    return tokens;
};

// REFRESH: renueva los tokens e invalida el anterior
const refresh = async (refreshToken) => {
    if (typeof refreshToken !== 'string' || !refreshToken) {
        const error = new Error('Refresh token obligatorio');
        error.status = 400;
        throw error;
    }

    const payload = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET
    );

    const oldToken = await Token.findOne({
        tokenHash: hashToken(refreshToken)
    });

    // Si el token ya fue usado o revocado, rechazamos su reutilización
    if (!oldToken || oldToken.revoked || oldToken.expiresAt <= new Date()) {
        // Revoca las sesiones activas del usuario ante una reutilización
        await Token.updateMany(
            { user: payload.id, revoked: false },
            { revoked: true }
        );

        const error = new Error('Refresh token inválido o reutilizado');
        error.status = 401;
        throw error;
    }

    if (oldToken.user.toString() !== payload.id) {
        const error = new Error('Refresh token inválido');
        error.status = 401;
        throw error;
    }

    const user = await User.findOne({
        _id: payload.id,
        active: true
    });

    if (!user) {
        const error = new Error('Usuario no disponible');
        error.status = 401;
        throw error;
    }

    // Cambio atómico: solo una petición puede consumir este token
    const consumed = await Token.findOneAndUpdate(
        { _id: oldToken._id, revoked: false },
        { revoked: true },
        { new: true }
    );

    if (!consumed) {
        await Token.updateMany(
            { user: payload.id, revoked: false },
            { revoked: true }
        );

        const error = new Error('Refresh token reutilizado');
        error.status = 401;
        throw error;
    }

    const tokens = generateTokens(user);
    await saveRefreshToken(user, tokens.refreshToken);

    return tokens;
};

// LOGOUT: invalida el refresh token
const logout = async (refreshToken) => {
    if (typeof refreshToken !== 'string' || !refreshToken) {
        const error = new Error('Refresh token obligatorio');
        error.status = 400;
        throw error;
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    await Token.updateOne(
        { tokenHash: hashToken(refreshToken) },
        { revoked: true }
    );
};

module.exports = { login, refresh, logout };
