const express = require('express');
const cartaRoutes = require('./routes/cartaRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/userRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(express.json()); // entiende el body en JSON

app.get('/', (req, res) => res.send('API TCGnew arrancado')); // ruta de prueba

app.use('/api/products', cartaRoutes); // nombre que pide el enunciado (producto = carta)
app.use('/api/cartas', cartaRoutes); // alias: tu ruta original sigue funcionando
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);

// RUTA TEMPORAL PARA PROVOCAR EL 500 (borrar después)
//app.get('/api/error-test', () => {
 // throw new Error('Error de prueba');
//});

// IMPORTANTE: el orden importa. Primero las rutas, luego el 404 y al FINAL el manejador de errores.
app.use(notFound);
app.use(errorHandler);

module.exports = app;

