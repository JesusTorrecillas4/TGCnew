// Error "controlado" de la aplicación.
// Lo lanzamos nosotros (throw new AppError(...)) cuando sabemos qué ha pasado y qué código HTTP toca.
// El middleware global (middleware/errorHandler.js) lo convierte en la respuesta JSON estándar.
class AppError extends Error {
  /**
   * @param {number} statusCode  Código HTTP (400, 404, 409, 422...)
   * @param {string} code        Código interno legible por máquinas (VALIDATION_ERROR, NOT_FOUND...)
   * @param {string} message     Mensaje para el cliente
   * @param {Array}  details     Lista opcional [{ field, message }]
   */
  constructor(statusCode, code, message, details = []) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

module.exports = AppError;