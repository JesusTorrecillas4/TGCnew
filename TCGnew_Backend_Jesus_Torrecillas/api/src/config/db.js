const mongoose = require('mongoose'); // Importa mongoose, la librería para hablar con MongoDB
const connectDB = async () => { // Función asíncrona (conectar tarda un poco, por eso async)
try { // Intenta hacer lo siguiente...
await mongoose.connect(process.env.MONGO_URI); // Se conecta a MongoDB usando la dirección del .env y espera a que termine
console.log('MongoDB connectat correctament'); // Si llega aquí, la conexión ha ido bien
} catch (err) { // ...y si algo falla, entra aquí
console.error(err.message); // Muestra el motivo del error en la consola
process.exit(1); // Cierra el programa (el 1 significa "terminó con error")
}
};
module.exports = connectDB; // Exporta la función para poder usarla en index.js