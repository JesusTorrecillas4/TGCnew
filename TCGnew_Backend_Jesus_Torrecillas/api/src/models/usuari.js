const mongoose = require('mongoose'); // Importa mongoose

const usuariSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      minlength: [2, 'El nombre debe tener mínimo 2 caracteres'],
      maxlength: [100, 'El nombre admite máximo 100 caracteres'],
    },
    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      trim: true,
      lowercase: true,
      unique: true, // índice único en MongoDB (no es un validador)
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Formato de email incorrecto'],
    },
    // Aquí se guarda SOLO el hash bcrypt, nunca la contraseña en claro.
    passwordHash: {
      type: String,
      required: true,
      select: false, // no se incluye en las consultas por defecto
    },
    role: {
      type: String,
      enum: ['client', 'admin'],
      default: 'client',
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      // Última barrera: nunca sale passwordHash en una respuesta JSON.
      transform: (doc, ret) => {
        delete ret.passwordHash;
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model('Usuari', usuariSchema);