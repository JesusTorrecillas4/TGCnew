const mongoose = require('mongoose'); // Importa mongoose
const bcrypt = require('bcrypt');

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

// NUEVO: Hashear la contraseña antes de guardar
usuariSchema.pre('save', async function () {

  // Si la contraseña no ha cambiado, no hacemos nada
  if (!this.isModified('passwordHash')) return;

  // Generamos la sal
  const salt = await bcrypt.genSalt(10);

  // Convertimos la contraseña en un hash
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);

});


module.exports = mongoose.model('Usuari', usuariSchema);