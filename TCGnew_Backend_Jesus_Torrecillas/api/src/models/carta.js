const mongoose = require('mongoose');

// "Carta" es el producto de tu tienda (equivale al "Product" del enunciado).
const cartaSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
    },
    anime: {
      type: String,
      required: [true, 'El anime es obligatorio'],
    },
    rareza: {
      type: String,
      required: [true, 'La rareza es obligatoria'],
    },
    tipo: {
      type: String,
      required: [true, 'El tipo es obligatorio'],
    },
    // NUEVO (Sesión 6): relación con Category. Guarda solo el _id; con populate() se obtiene el objeto.
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Carta', cartaSchema);