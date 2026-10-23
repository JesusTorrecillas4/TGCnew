const bcrypt = require('bcrypt');
const User = require('../models/usuari');
const AppError = require('../utils/AppError');
const {
  parsePagination,
  parseSort,
  parseActive,
  parseNameFilter,
  buildPagination,
} = require('../utils/query');

const SALT_ROUNDS = 12; // coste de bcrypt: más alto = más seguro y más lento
const MIN_PASSWORD = 12;
const MAX_PASSWORD = 72; // bcrypt solo usa los primeros 72 bytes
// El cliente solo puede enviar estos campos. role, active y passwordHash NUNCA.
const ALLOWED_FIELDS = ['name', 'email', 'password'];
const SORT_FIELDS = ['name', 'email', 'createdAt', 'updatedAt'];

const validationError = (details) =>
  new AppError(422, 'VALIDATION_ERROR', 'Les dades no són vàlides', details);

const rejectUnknownFields = (body) => {
  const unknown = Object.keys(body).filter((k) => !ALLOWED_FIELDS.includes(k));
  if (unknown.length) {
    throw new AppError(
      422,
      'FIELD_NOT_ALLOWED',
      'Hay campos que no se pueden enviar',
      unknown.map((field) => ({ field, message: 'Campo no permitido' }))
    );
  }
};

const checkPassword = (password) => {
  if (typeof password !== 'string' || password.length < MIN_PASSWORD) {
    throw validationError([
      { field: 'password', message: `La contraseña debe tener mínimo ${MIN_PASSWORD} caracteres` },
    ]);
  }
  if (Buffer.byteLength(password) > MAX_PASSWORD) {
    throw validationError([
      { field: 'password', message: `La contraseña admite máximo ${MAX_PASSWORD} bytes` },
    ]);
  }
};

const createUser = async (body = {}) => {
  rejectUnknownFields(body);
  checkPassword(body.password);
  const passwordHash = await bcrypt.hash(body.password, SALT_ROUNDS);
  // role y active NO vienen del body: el servidor usa los valores por defecto (client / true)
  const user = await new User({ name: body.name, email: body.email, passwordHash }).save();
  return user; // toJSON elimina passwordHash
};

const getUsers = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const sort = parseSort(query.sort, SORT_FIELDS);
  const filter = {};
  const active = parseActive(query.active);
  const name = parseNameFilter(query.name);
  if (active !== undefined) filter.active = active;
  if (name) filter.name = name;

  const [data, total] = await Promise.all([
    User.find(filter).sort(sort).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);
  return { data, pagination: buildPagination(page, limit, total) };
};

const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new AppError(404, 'NOT_FOUND', 'Usuario no encontrado');
  return user;
};

const updateUser = async (id, body = {}) => {
  rejectUnknownFields(body);
  const data = {};
  if (body.name !== undefined) data.name = body.name;
  if (body.email !== undefined) data.email = body.email;
  if (body.password !== undefined) {
    checkPassword(body.password);
    data.passwordHash = await bcrypt.hash(body.password, SALT_ROUNDS);
  }
  const user = await User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!user) throw new AppError(404, 'NOT_FOUND', 'Usuario no encontrado');
  return user;
};

// Baja LÓGICA: el usuario no se borra, solo se marca active=false
const deactivateUser = async (id) => {
  const user = await User.findByIdAndUpdate(id, { active: false }, { new: true });
  if (!user) throw new AppError(404, 'NOT_FOUND', 'Usuario no encontrado');
  return user;
};

module.exports = { createUser, getUsers, getUserById, updateUser, deactivateUser };