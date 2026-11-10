const mongoose = require('mongoose');

// Esquema para guardar los refresh tokens
const tokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuari',
        required: true
    },

    tokenHash: {
        type: String,
        required: true
    },

    expiresAt: {
        type: Date,
        required: true
    },

    revoked: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Token', tokenSchema);