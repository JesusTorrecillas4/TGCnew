
const jwt = require('jsonwebtoken');

// Comprueba que el usuario tenga un Access Token válido
const authMiddleware = (req, res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Access Token obligatorio'
        });
    }

    const token = authorization.split(' ')[1];

    try {
        // Verifica la firma y la caducidad del token
        const payload = jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET
        );

        req.user = payload;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Access Token inválido o caducado'
        });
    }
};

module.exports = authMiddleware;
