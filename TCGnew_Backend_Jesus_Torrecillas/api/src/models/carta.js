const mongoose = require('mongoose'); 
const cartaSchema = new mongoose.Schema({ 

    nombre: { 
        type: String, 
        required: true, 
        trim: true 
    },

    anime: { 
        type: String,
        required: true 
    },

    rareza: { 
        type: String, 
        required: true 
    },

    tipo: { 
        type: String, 
        required: true 
    }

});

module.exports = mongoose.model('Carta', cartaSchema); 