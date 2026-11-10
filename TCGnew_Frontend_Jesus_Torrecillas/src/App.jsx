
import { Link, Outlet } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <div>
      {/* Menú para navegar entre páginas */}
      <nav>
        <Link to="/">Inicio</Link> |{' '}
        <Link to="/login">Login</Link> |{' '}
        <Link to="/register">Registro</Link>
      </nav>

      {/* Aquí aparece la página seleccionada */}
      <Outlet />
    </div>
  );
}

export default App;
