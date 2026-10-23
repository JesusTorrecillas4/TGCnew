const AppError = require('../utils/AppError');

// Un ObjectId de MongoDB son 24 caracteres hexadecimales.
const OBJECT_ID = /^[0-9a-fA-F]{24}$/;

// Middleware: comprueba que :id (u otro parámetro) tiene formato válido ANTES de consultar la BD.
// Si no, responde 400 con el formato estándar de error.
const validateObjectId = (param = 'id') => (req, res, next) => {
  if (!OBJECT_ID.test(req.params[param])) {
    return next(
      new AppError(400, 'INVALID_ID', 'El identificador no es válido', [
        { field: param, message: 'Debe ser un ObjectId de 24 caracteres hexadecimales' },
      ])
    );
  }
  next();
};

module.exports = validateObjectId;