const mongoose = require('mongoose');

const coleccionCartaSchema = new mongoose.Schema({

    userId: {
        type: String,
        required: true
    },

    cartaId: {
        type: String,
        required: true
    },

    preuVenta: {
        type: Number,
        required: true,
        min: 0
    },

    estadoVenta: {
        type: String,
        required: true,
        enum: ["disponible", "vendida", "reservada"],
        default: "disponible"
    }

});

module.exports = mongoose.model('ColeccionCarta', coleccionCartaSchema);