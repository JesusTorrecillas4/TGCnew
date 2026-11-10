
import './Home.css';

// Array con las cartas que mostraremos en la tienda
const cartas = [
  {
    id: 1,
    nombre: 'Monkey D. Luffy',
    anime: 'One Piece',
    rareza: 'Legendaria',
    precio: 49.99,
    imagen: 'https://placehold.co/240x320?text=Luffy'
  },
  {
    id: 2,
    nombre: 'Roronoa Zoro',
    anime: 'One Piece',
    rareza: 'Épica',
    precio: 29.99,
    imagen: 'https://placehold.co/240x320?text=Zoro'
  },
  {
    id: 3,
    nombre: 'Portgas D. Ace',
    anime: 'One Piece',
    rareza: 'Rara',
    precio: 19.99,
    imagen: 'https://placehold.co/240x320?text=Ace'
  }
];

function Home() {
  return (
    <main className="home">
      <h1>Bienvenido a TCGnew</h1>
      <p>Compra y colecciona tus cartas favoritas</p>

      <h2>Cartas destacadas</h2>

      <div className="cartas-grid">
        {cartas.map((carta) => (
          <div className="carta" key={carta.id}>
            <img src={carta.imagen} alt={carta.nombre} />

            <h3>{carta.nombre}</h3>
            <p>{carta.anime}</p>
            <p>Rareza: {carta.rareza}</p>
            <strong>{carta.precio.toFixed(2)} €</strong>

            <button type="button">Ver carta</button>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Home;
