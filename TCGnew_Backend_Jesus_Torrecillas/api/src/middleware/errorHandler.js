const mongoose = require('mongoose');
const AppError = require('../utils/AppError');

// Ruta inexistente (se monta DESPUÉS de todas las rutas): crea un 404 y lo pasa al manejador global.
const notFound = (req, res, next) => {
  next(new AppError(404, 'NOT_FOUND', `Ruta no encontrada: ${req.method} ${req.originalUrl}`));
};

// Formato único de error para toda la API:
// { success:false, error:{ code, message, details:[{field,message}] } }
const send = (res, status, code, message, details = []) =>
  res.status(status).json({ success: false, error: { code, message, details } });

// Middleware global de errores (4 parámetros: Express lo reconoce como "error handler").
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // 1. Errores que hemos lanzado nosotros
  if (err instanceof AppError) {
    return send(res, err.statusCode, err.code, err.message, err.details);
  }

  // 2. Validación de Mongoose (required, minlength, enum, match...) -> 422
  if (err instanceof mongoose.Error.ValidationError) {
    const details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return send(res, 422, 'VALIDATION_ERROR', 'Les dades no són vàlides', details);
  }

  // 3. ID con formato incorrecto (CastError de Mongoose) -> 400
  if (err instanceof mongoose.Error.CastError) {
    return send(res, 400, 'INVALID_ID', `Valor no válido para "${err.path}"`, [
      { field: err.path, message: 'Formato incorrecto' },
    ]);
  }

  // 4. Índice único violado (email o slug duplicado): MongoDB devuelve code 11000 -> 409
  //    OJO: "unique" no es un validador de Mongoose, es un índice de MongoDB.
  if (err && (err.code === 11000 || err.code === 11001)) {
    const fields = Object.keys(err.keyPattern || err.keyValue || {});
    const details = fields.map((f) => ({ field: f, message: 'Ya existe un registro con este valor' }));
    return send(res, 409, 'DUPLICATE_KEY', 'El valor ya existe', details);
  }

  // 5. JSON mal formado en el body (lo lanza express.json())
  if (err && err.type === 'entity.parse.failed') {
    return send(res, 400, 'INVALID_JSON', 'El cuerpo de la petición no es un JSON válido');
  }

  // 6. Cualquier otra cosa = error inesperado -> 500.
  //    Se registra en el servidor, pero al cliente NO se le envía la traza ni datos internos.
  console.error(err);
  return send(res, 500, 'INTERNAL_ERROR', 'Error intern del servidor');
};

module.exports = { notFound, errorHandler };