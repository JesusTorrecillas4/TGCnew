const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      minlength: [3, 'El nombre debe tener mínimo 3 caracteres'],
    },
    slug: {
      type: String,
      required: [true, 'El slug es obligatorio'],
      trim: true,
      lowercase: true,
      unique: true, // OJO: esto crea un ÍNDICE único en MongoDB, no es una validación de Mongoose
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'El slug solo admite minúsculas, números y guiones'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'La descripción admite máximo 500 caracteres'],
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true } // createdAt y updatedAt automáticos
);

module.exports = mongoose.model('Category', categorySchema);