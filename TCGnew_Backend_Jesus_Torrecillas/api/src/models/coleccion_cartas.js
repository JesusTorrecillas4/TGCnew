const mongoose = require('mongoose'); // Importa mongoose

const coleccionCartaSchema = new mongoose.Schema({ // Define la estructura (el "molde") de una carta de la colección

    userId: { // Campo: id del usuario dueño de la carta
        type: String, // Tipo texto
        required: true // Obligatorio
    },

    cartaId: { // Campo: id de la carta
        type: String, // Tipo texto
        required: true // Obligatorio
    },

    preuVenta: { // Campo: precio de venta
        type: Number, // Tipo número
        required: true, // Obligatorio
        min: 0 // No puede ser negativo
    },

    estadoVenta: { // Campo: estado de la venta
        type: String, // Tipo texto
        required: true, // Obligatorio
        enum: ["disponible", "vendida", "reservada"], // Solo se permiten estos tres valores
        default: "disponible" // Si no se indica, vale "disponible"
    }

});

module.exports = mongoose.model('ColeccionCarta', coleccionCartaSchema); // Crea el modelo (con él se guardan y buscan datos) y lo exporta