const Carta = require('../models/carta');

const createCarta = async (data) => new Carta(data).save();
const getCartas = async () => Carta.find();
const getCartaById = async (id) => Carta.findById(id);
const updateCarta = async (id, data) =>
  Carta.findByIdAndUpdate(id, data, { new: true, runValidators: true });
const deleteCarta = async (id) => Carta.findByIdAndDelete(id);

module.exports = { createCarta, getCartas, getCartaById, updateCarta, deleteCarta };