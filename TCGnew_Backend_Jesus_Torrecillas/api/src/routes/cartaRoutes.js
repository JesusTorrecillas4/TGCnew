const express = require('express');
const router = express.Router();
const cartaController = require('../controllers/cartaController');
const validateObjectId = require('../middleware/validateObjectId');

router.post('/', cartaController.createCarta);
router.get('/', cartaController.getCartas);
router.get('/:id', validateObjectId(), cartaController.getCartaById);
router.put('/:id', validateObjectId(), cartaController.updateCarta);
router.delete('/:id', validateObjectId(), cartaController.deleteCarta);

module.exports = router;