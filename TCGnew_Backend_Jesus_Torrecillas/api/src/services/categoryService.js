const Category = require('../models/category');
const Carta = require('../models/carta');
const AppError = require('../utils/AppError');
const {
  parsePagination,
  parseSort,
  parseActive,
  parseNameFilter,
  buildPagination,
} = require('../utils/query');

// Lista blanca de campos que el cliente puede enviar
const ALLOWED_FIELDS = ['name', 'slug', 'description', 'active'];
const SORT_FIELDS = ['name', 'slug', 'createdAt', 'updatedAt'];

// Copia solo los campos permitidos; si llega alguno más, error 422.
const pickAllowed = (body = {}) => {
  const unknown = Object.keys(body).filter((k) => !ALLOWED_FIELDS.includes(k));
  if (unknown.length) {
    throw new AppError(
      422,
      'FIELD_NOT_ALLOWED',
      'Hay campos que no se pueden enviar',
      unknown.map((field) => ({ field, message: 'Campo no permitido' }))
    );
  }
  return ALLOWED_FIELDS.reduce((acc, k) => (body[k] !== undefined ? { ...acc, [k]: body[k] } : acc), {});
};

const createCategory = async (body) => new Category(pickAllowed(body)).save();

const getCategories = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const sort = parseSort(query.sort, SORT_FIELDS);
  const filter = {};
  const active = parseActive(query.active);
  const name = parseNameFilter(query.name);
  if (active !== undefined) filter.active = active;
  if (name) filter.name = name;

  const [data, total] = await Promise.all([
    Category.find(filter).sort(sort).skip(skip).limit(limit),
    Category.countDocuments(filter),
  ]);
  return { data, pagination: buildPagination(page, limit, total) };
};

const getCategoryById = async (id) => {
  const category = await Category.findById(id);
  if (!category) throw new AppError(404, 'NOT_FOUND', 'Categoría no encontrada');
  return category;
};

const updateCategory = async (id, body) => {
  const data = pickAllowed(body);
  // runValidators: sin esta opción, los updates NO ejecutan las validaciones del esquema
  const category = await Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!category) throw new AppError(404, 'NOT_FOUND', 'Categoría no encontrada');
  return category;
};

const deleteCategory = async (id) => {
  const inUse = await Carta.exists({ category: id });
  if (inUse) {
    throw new AppError(409, 'CATEGORY_IN_USE', 'No se puede eliminar: hay cartas asignadas a esta categoría');
  }
  const category = await Category.findByIdAndDelete(id);
  if (!category) throw new AppError(404, 'NOT_FOUND', 'Categoría no encontrada');
};

module.exports = { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory };