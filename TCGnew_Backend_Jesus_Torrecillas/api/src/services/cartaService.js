const Carta = require('../models/carta');
const Category = require('../models/category');
const AppError = require('../utils/AppError');

// Si se envía category, debe ser un ObjectId válido de una categoría que exista.
const checkCategory = async (category) => {
  if (category === undefined || category === null) return;
  if (!/^[0-9a-fA-F]{24}$/.test(String(category))) {
    throw new AppError(400, 'INVALID_ID', 'El identificador de categoría no es válido', [
      { field: 'category', message: 'Debe ser un ObjectId de 24 caracteres hexadecimales' },
    ]);
  }
  if (!(await Category.exists({ _id: category }))) {
    throw new AppError(404, 'NOT_FOUND', 'La categoría indicada no existe');
  }
};

// populate(): sustituye el _id de category por { name, slug } al devolver la carta
const withCategory = (query) => query.populate('category', 'name slug');

const createCarta = async (data) => {
  await checkCategory(data.category);
  const carta = await new Carta(data).save();
  return carta.populate('category', 'name slug');
};

const getCartas = async () => withCategory(Carta.find());

const getCartaById = async (id) => {
  const carta = await withCategory(Carta.findById(id));
  if (!carta) throw new AppError(404, 'NOT_FOUND', 'Carta no encontrada');
  return carta;
};

const updateCarta = async (id, data) => {
  await checkCategory(data.category);
  const carta = await withCategory(
    Carta.findByIdAndUpdate(id, data, { new: true, runValidators: true })
  );
  if (!carta) throw new AppError(404, 'NOT_FOUND', 'Carta no encontrada');
  return carta;
};

const deleteCarta = async (id) => {
  const carta = await Carta.findByIdAndDelete(id);
  if (!carta) throw new AppError(404, 'NOT_FOUND', 'Carta no encontrada');
};

module.exports = { createCarta, getCartas, getCartaById, updateCarta, deleteCarta };