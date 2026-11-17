// Catálogo comercial (requisito q / HU-08), conectado a Express + Neon.
import { useCallback, useEffect, useState } from 'react';
import Icon from '../components/Icon';
import { Cargando, ErrorCarga, Vacio } from '../components/Estados';
import { api } from '../helpers/api';
import { moneda } from '../helpers/formato';
import { useCarrito } from '../context/CarritoContext';
import { useAvisos } from '../context/AvisosContext';
import { Link, useNavigate, useQuery } from '../router/Router';

const FILTROS = [
  { id: '', texto: 'Todo' },
  { id: 'Pasaporte', texto: 'Pasaportes', icono: 'ticket' },
  { id: 'Souvenir', texto: 'Souvenirs ecológicos', icono: 'leaf' },
];

export default function Tienda() {
  const query = useQuery();
  const navigate = useNavigate();
  const categoria = query.get('categoria') || '';
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [texto, setTexto] = useState('');

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      setProductos(await api.get(`/productos/catalogo${categoria ? `?categoria=${categoria}` : ''}`));
    } catch (e) { setError(e); } finally { setCargando(false); }
  }, [categoria]);

  useEffect(() => { cargar(); }, [cargar]);

  const t = texto.trim().toLowerCase();
  const visibles = t ? productos.filter((p) => `${p.nombre} ${p.descripcion}`.toLowerCase().includes(t)) : productos;

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-3">
        <div>
          <h1 className="fw-bold text-avenza mb-1">Tienda AVENZA</h1>
          <p className="lead mb-0">Pasaportes a parques aliados y souvenirs ecológicos. Precios en pesos colombianos (COP) antes de IVA.</p>
        </div>
        <Link to="/carrito" className="btn btn-outline-success"><Icon name="cart-shopping" /> Ver carrito</Link>
      </div>

      <div className="row g-3 align-items-end mb-4">
        <div className="col-md-7">
          <div className="btn-group flex-wrap" role="group" aria-label="Filtrar productos por categoría">
            {FILTROS.map((f) => (
              <button key={f.id} type="button" aria-pressed={categoria === f.id}
                className={`btn ${categoria === f.id ? 'btn-success' : 'btn-outline-success'}`}
                onClick={() => navigate(f.id ? `/tienda?categoria=${f.id}` : '/tienda', { replace: true })}>
                {f.icono && <Icon name={f.icono} />} {f.texto}
              </button>
            ))}
          </div>
        </div>
        <div className="col-md-5">
          <label htmlFor="buscar-producto" className="form-label mb-1">Buscar producto</label>
          <input id="buscar-producto" type="search" className="form-control" placeholder="Ej. termo, Cali…" value={texto} onChange={(e) => setTexto(e.target.value)} />
        </div>
      </div>

      {cargando ? <Cargando texto="Cargando catálogo…" /> : error ? <ErrorCarga error={error} alReintentar={cargar} /> : visibles.length === 0 ? (
        <Vacio titulo="No hay productos que coincidan" icono="store" />
      ) : (
        <div className="row g-4">
          {visibles.map((p) => <TarjetaProducto key={p.id} producto={p} />)}
        </div>
      )}
    </div>
  );
}

function TarjetaProducto({ producto: p }) {
  const { agregar, items } = useCarrito();
  const avisar = useAvisos();
  const [cantidad, setCantidad] = useState(1);
  const enCarrito = items.find((i) => i.id === p.id)?.cantidad || 0;
  const disponible = p.stock - enCarrito;
  const agotado = p.stock === 0;

  const alAgregar = (e) => {
    e.preventDefault();
    const agregadas = agregar(p, cantidad);
    if (agregadas === 0) avisar(`Ya tienes en el carrito todas las unidades disponibles de ${p.nombre}.`, 'warning');
    else if (agregadas < cantidad) avisar(`Solo se agregaron ${agregadas} unidades de ${p.nombre} por disponibilidad.`, 'warning');
    else avisar(`${agregadas} × ${p.nombre} agregado al carrito.`);
    setCantidad(1);
  };

  return (
    <div className="col-sm-6 col-lg-4 col-xl-3">
      <article className="card h-100 shadow-sm tarjeta-producto">
        <img src={p.imagen} alt="" className="card-img-top" width="600" height="400" loading="lazy" />
        <div className="card-body d-flex flex-column">
          <p className="small mb-1"><span className={`badge ${p.categoria === 'Pasaporte' ? 'text-bg-primary' : 'text-bg-success'}`}>{p.categoria}</span></p>
          <h2 className="h6 card-title">{p.nombre}</h2>
          <p className="card-text small flex-grow-1">{p.descripcion}</p>
          <p className="fs-5 fw-bold mb-1">{moneda(p.precio)}</p>
          <p className={`small mb-2 ${p.stock <= 5 ? 'text-danger fw-semibold' : 'text-secondary'}`}>
            {agotado ? 'Agotado' : p.stock <= 5 ? `¡Últimas ${p.stock} unidades!` : `${p.stock} disponibles`}
          </p>
          <form className="d-flex gap-2" onSubmit={alAgregar}>
            <label htmlFor={`cant-${p.id}`} className="visually-hidden">Cantidad de {p.nombre}</label>
            <input id={`cant-${p.id}`} type="number" className="form-control" style={{ maxWidth: '5rem' }} min="1" max={Math.max(1, disponible)}
              value={cantidad} disabled={disponible <= 0} onChange={(e) => setCantidad(Math.max(1, Math.min(Number(e.target.value) || 1, disponible)))} />
            <button type="submit" className="btn btn-success flex-grow-1" disabled={disponible <= 0}>
              <Icon name="cart-shopping" /> {agotado ? 'Agotado' : disponible <= 0 ? 'En carrito' : 'Agregar'}
            </button>
          </form>
        </div>
      </article>
    </div>
  );
}
