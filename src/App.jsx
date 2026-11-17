import { Routes } from './router/Router';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Inicio from './pages/Inicio';
import Zoologicos from './pages/Zoologicos';
import Especies from './pages/Especies';
import EspecieDetalle from './pages/EspecieDetalle';
import Tienda from './pages/Tienda';
import Carrito from './pages/Carrito';
import Pago from './pages/Pago';
import Factura from './pages/Factura';
import Admin from './pages/Admin';
import Desarrolladores from './pages/Desarrolladores';
import DesarrolladorPerfil from './pages/DesarrolladorPerfil';
import Contacto from './pages/Contacto';
import DatosPersonales from './pages/DatosPersonales';
import Recomendador from './pages/Recomendador';
import NoEncontrado from './pages/NoEncontrado';

// Tabla de rutas de la SPA (HU-01)
const RUTAS = [
  { path: '/', element: Inicio, title: 'Inicio' },
  { path: '/zoologicos', element: Zoologicos, title: 'Historia de los zoológicos' },
  { path: '/especies', element: Especies, title: 'Catálogo de especies' },
  { path: '/especies/:slug', element: EspecieDetalle, title: 'Historia de la especie' },
  { path: '/tienda', element: Tienda, title: 'Tienda' },
  { path: '/carrito', element: Carrito, title: 'Carrito de compras' },
  { path: '/pago', element: Pago, title: 'Pago seguro' },
  { path: '/factura/:id', element: Factura, title: 'Factura' },
  { path: '/admin', element: Admin, title: 'Panel administrativo' },
  { path: '/desarrolladores', element: Desarrolladores, title: 'Equipo de desarrollo' },
  { path: '/desarrolladores/:id', element: DesarrolladorPerfil, title: 'Perfil del desarrollador' },
  { path: '/contacto', element: Contacto, title: 'Contacto y PQR' },
  { path: '/datos-personales', element: DatosPersonales, title: 'Tratamiento de datos personales' },
  { path: '/recomendador', element: Recomendador, title: 'Recomendador con IA' },
];

export default function App() {
  return (
    <>
      <Header />
      <main id="contenido" tabIndex={-1}>
        <Routes rutas={RUTAS} noEncontrado={NoEncontrado} />
      </main>
      <Footer />
    </>
  );
}
