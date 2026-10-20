const express = require('express');
const router = express.Router();
const cartaController = require('../controllers/cartaController');

router.post('/', cartaController.createCarta);
router.get('/', cartaController.getCartas);
router.get('/:id', cartaController.getCartaById);
router.put('/:id', cartaController.updateCarta);
router.delete('/:id', cartaController.deleteCarta);

module.exports = router;