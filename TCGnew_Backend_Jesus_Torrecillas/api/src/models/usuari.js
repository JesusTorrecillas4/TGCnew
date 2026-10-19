const mongoose = require('mongoose'); // Importa mongoose


const usuariSchema = new mongoose.Schema({ // Define el "molde" de un usuario
    nom: { // Campo: nombre
        type: String, // Tipo texto
        required: true // Obligatorio
    },

    email: { // Campo: correo electrónico
        type: String, // Tipo texto
        required: true, // Obligatorio
        unique: true, // No puede haber dos usuarios con el mismo email
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Debe tener formato de email (algo@algo.algo)
    },

    password: { // Campo: contraseña
        type: String, // Tipo texto
        required: true, // Obligatorio
        minlength: 8, // Mínimo 8 caracteres
        maxlength: 1000 // Máximo 1000 caracteres
    },

    rol: { // Campo: rol del usuario
        type: String, // Tipo texto
        enum: ["usuari", "admin"], // Solo puede ser "usuari" o "admin"
        default: "usuari" // Por defecto es "usuari"
    }
});

module.exports = mongoose.model('Usuari', usuariSchema); // Crea el modelo de usuarios y lo exporta