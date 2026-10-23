const cartaService = require('../services/cartaService');

// Mismo formato de respuesta que el resto de la API: { success, data }.
// Los errores los gestiona el middleware global (middleware/errorHandler.js).

const createCarta = async (req, res) => {
  const carta = await cartaService.createCarta(req.body);
  res.status(201).json({ success: true, data: carta });
};

const getCartas = async (req, res) => {
  const cartas = await cartaService.getCartas();
  res.status(200).json({ success: true, data: cartas });
};

const getCartaById = async (req, res) => {
  const carta = await cartaService.getCartaById(req.params.id);
  res.status(200).json({ success: true, data: carta });
};

const updateCarta = async (req, res) => {
  const carta = await cartaService.updateCarta(req.params.id, req.body);
  res.status(200).json({ success: true, data: carta });
};

const deleteCarta = async (req, res) => {
  await cartaService.deleteCarta(req.params.id);
  res.status(204).send();
};

module.exports = { createCarta, getCartas, getCartaById, updateCarta, deleteCarta };