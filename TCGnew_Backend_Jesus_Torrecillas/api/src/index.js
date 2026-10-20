require('dotenv').config(); // Lee el archivo .env y carga sus variables (ej: MONGO_URI) en process.env
const express = require('express'); // Importa Express, la librería para crear el servidor web
const connectDB = require('./config/db'); // Importa la función que conecta con MongoDB
const app = express(); // Crea la aplicación (el servidor)
const cartaRoutes = require('./routes/cartaRoutes'); // Importem les rutes → importa las rutas de cartas

app.use(express.json()); // Permite que el servidor entienda los datos que llegan en formato JSON
connectDB(); // Ejecuta la conexión a la base de datos al arrancar
app.get('/', (req, res) => res.send('API TCGnew arrancado')); // Ruta de prueba: al abrir "/" responde este texto
// Muntem les rutes de cartes sota el prefix '/api/cartas'
app.use('/api/cartas', cartaRoutes); // Todas las rutas de cartaRoutes empiezan por /api/cartas
const PORT = process.env.PORT || 3000; // Usa el puerto del .env; si no existe, usa el 3000

app.listen(PORT, () => console.log(`Servidor escoltant al port ${PORT}`)); // Arranca el servidor y avisa por consola