const Product = require('../models/coleccion_cartas'); // Importa el modelo de cartas (aquí lo llamas "Product")
const createProduct = async (productData) => { // Recibe los datos que llegaron desde el controlador
const newProduct = new Product(productData); // Crea un documento nuevo con esos datos (todavía no está guardado)
return await newProduct.save(); // Lo guarda en MongoDB, comprueba las reglas del modelo y devuelve el resultado
};
module.exports = { // Exporta las funciones del servicio
createProduct, // Deja disponible createProduct para el controlador
};