import { useState } from 'react';
import { Link, NavLink, useRouter } from '../../router/Router';
import { useCarrito } from '../../context/CarritoContext';
import BarraAccesibilidad from './BarraAccesibilidad';
import Icon from '../Icon';

const MENU = [
  { to: '/', texto: 'Inicio', exacto: true },
  { to: '/zoologicos', texto: 'Zoológicos' },
  { to: '/especies', texto: 'Especies' },
  { to: '/tienda', texto: 'Tienda' },
  { to: '/recomendador', texto: 'Recomendador IA' },
  { to: '/desarrolladores', texto: 'Equipo' },
  { to: '/contacto', texto: 'Contacto y PQR' },
  { to: '/admin', texto: 'Administración' },
];

export default function Header() {
  const [abierto, setAbierto] = useState(false);
  const { unidades } = useCarrito();
  const { pathname } = useRouter();

  return (
    <header>
      <a className="saltar-contenido" href="#contenido">Saltar al contenido principal</a>
      <BarraAccesibilidad />
      <nav className="navbar navbar-expand-xl navbar-avenza" aria-label="Navegación principal">
        <div className="container">
          <Link to="/" className="navbar-brand" aria-label="AVENZA S.A.S. - ir al inicio">
            <span className="logo-chip"><img src="/img/logo-avenza.png" alt="" width="71" height="64" /></span>
          </Link>
          <div className="d-flex align-items-center gap-2 order-xl-last">
            <Link to="/carrito" className="btn btn-carrito position-relative" aria-label={`Carrito de compras, ${unidades} productos`}>
              <Icon name="cart-shopping" size="1.25em" />
              {unidades > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark" aria-hidden="true">
                  {unidades}
                </span>
              )}
            </Link>
            <button className="navbar-toggler" type="button" aria-controls="menu-principal" aria-expanded={abierto}
              aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'} onClick={() => setAbierto(!abierto)}>
              <Icon name={abierto ? 'xmark' : 'bars'} size="1.25em" />
            </button>
          </div>
          <div className={`collapse navbar-collapse ${abierto ? 'show' : ''}`} id="menu-principal">
            <ul className="navbar-nav ms-auto me-xl-3">
              {MENU.map((m) => (
                <li className="nav-item" key={m.to}>
                  <NavLink to={m.to} exacto={m.exacto} className="nav-link" onClick={() => setAbierto(false)}>{m.texto}</NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
      {pathname !== '/' && <Migas />}
    </header>
  );
}

const NOMBRES = {
  zoologicos: 'Zoológicos', especies: 'Especies', tienda: 'Tienda', carrito: 'Carrito', pago: 'Pago',
  factura: 'Factura', admin: 'Administración', desarrolladores: 'Equipo', contacto: 'Contacto y PQR',
  'datos-personales': 'Datos personales', recomendador: 'Recomendador IA',
};

const SIN_ENLACE = ['factura'];

/** Migas de pan: el usuario siempre sabe dónde está (Nielsen #1). */
function Migas() {
  const { pathname } = useRouter();
  const partes = pathname.split('/').filter(Boolean);
  return (
    <nav aria-label="Ruta de navegación" className="migas">
      <ol className="breadcrumb container mb-0 py-2">
        <li className="breadcrumb-item"><Link to="/">Inicio</Link></li>
        {partes.map((p, i) => {
          const ruta = '/' + partes.slice(0, i + 1).join('/');
          const ultimo = i === partes.length - 1;
          const texto = NOMBRES[p] || decodeURIComponent(p).replace(/-/g, ' ');
          return (
            <li key={ruta} className={`breadcrumb-item ${ultimo ? 'active' : ''}`} aria-current={ultimo ? 'page' : undefined}>
              {ultimo || !NOMBRES[p] || SIN_ENLACE.includes(p) ? <span className={NOMBRES[p] ? undefined : 'text-capitalize'}>{texto}</span> : <Link to={ruta}>{texto}</Link>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
