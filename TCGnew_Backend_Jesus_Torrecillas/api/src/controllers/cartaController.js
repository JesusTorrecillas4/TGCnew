const cartaService = require('../services/cartaService');

const createCarta = async (req, res) => {
  try {
    const carta = await cartaService.createCarta(req.body);
    res.status(201).json({ status: 'success', data: carta });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

const getCartas = async (req, res) => {
  try {
    const cartas = await cartaService.getCartas();
    res.status(200).json({ status: 'success', data: cartas });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const getCartaById = async (req, res) => {
  try {
    const carta = await cartaService.getCartaById(req.params.id);
    if (!carta) return res.status(404).json({ status: 'error', message: 'Carta no encontrada' });
    res.status(200).json({ status: 'success', data: carta });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

const updateCarta = async (req, res) => {
  try {
    const carta = await cartaService.updateCarta(req.params.id, req.body);
    if (!carta) return res.status(404).json({ status: 'error', message: 'Carta no encontrada' });
    res.status(200).json({ status: 'success', data: carta });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

const deleteCarta = async (req, res) => {
  try {
    const carta = await cartaService.deleteCarta(req.params.id);
    if (!carta) return res.status(404).json({ status: 'error', message: 'Carta no encontrada' });
    res.status(200).json({ status: 'success', data: carta });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

module.exports = { createCarta, getCartas, getCartaById, updateCarta, deleteCarta };