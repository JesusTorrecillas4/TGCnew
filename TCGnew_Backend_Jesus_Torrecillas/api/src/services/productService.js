const Product = require('../models/coleccion_cartas');
const createProduct = async (productData) => { 
const newProduct = new Product(productData);
return await newProduct.save(); 
}; 
module.exports = { 
createProduct, 
}; 
