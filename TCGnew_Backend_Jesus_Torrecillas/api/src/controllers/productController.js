const productService = require('../services/productService'); // Importa el servicio (el cocinero)
const createProduct = async (req, res) => { // req = lo que envía el cliente, res = lo que respondemos
try { // Intenta hacer lo siguiente...
const product = await productService.createProduct(req.body); // Pasa los datos del cliente (req.body) al servicio y espera el resultado
res.status(201).json({ status: 'success', data: product }); // 201 = creado correctamente; devuelve el producto en JSON
} catch (error) { // Si algo falla...
res.status(400).json({ status: 'error', message: error.message }); // 400 = petición incorrecta; devuelve el mensaje de error
}
};
module.exports = { // Exporta las funciones del controlador
createProduct, // Deja disponible createProduct para las rutas
};