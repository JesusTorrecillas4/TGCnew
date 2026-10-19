const express = require('express'); // Importa Express
const router = express.Router(); // Crea un "mini enrutador" para agrupar rutas
const productController = require('../controllers/productController'); // Importa el controlador (el camarero)
router.post('/', productController.createProduct); // Si llega un POST a "/", ejecuta createProduct (queda como POST /api/products)
module.exports = router; // Exporta el enrutador para usarlo en index.js