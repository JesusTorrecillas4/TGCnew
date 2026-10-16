const mongoose = require('mongoose');


const usuariSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },

    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 1000
    },

    rol: {
        type: String,
        enum: ["usuari", "admin"],
        default: "usuari"
    }
});

module.exports = mongoose.model('Usuari', usuariSchema);