
const tokenService = require('../services/token/tokenService');

// Iniciar sesión
const login = async (req, res) => {
    const tokens = await tokenService.login(req.body);

    res.status(200).json({
        success: true,
        data: tokens
    });
};

// Renovar los tokens
const refresh = async (req, res) => {
    const tokens = await tokenService.refresh(req.body.refreshToken);

    res.status(200).json({
        success: true,
        data: tokens
    });
};

// Cerrar sesión
const logout = async (req, res) => {
    await tokenService.logout(req.body.refreshToken);

    res.status(200).json({
        success: true,
        message: 'Sesión cerrada correctamente'
    });
};

module.exports = { login, refresh, logout };
