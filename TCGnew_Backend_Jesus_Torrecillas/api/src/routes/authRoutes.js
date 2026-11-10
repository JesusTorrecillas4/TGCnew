
const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

// Iniciar sesión
router.post('/login', authController.login);

// Renovar tokens
router.post('/refresh', authController.refresh);

// Cerrar sesión
router.post('/logout', authController.logout);

const authMiddleware = require('../middleware/authMiddleware');

// Solo se puede acceder con un Access Token válido
router.get('/perfil', authMiddleware, (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    });
});

module.exports = router;
