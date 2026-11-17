import { useMemo, useState } from 'react';
import Icon from '../components/Icon';
import QREspecie from '../components/QREspecie';
import { Vacio } from '../components/Estados';
import { Link, useNavigate, useQuery } from '../router/Router';
import { CATEGORIAS, ESPECIES, ESTADOS_UICN, categoriaPorId } from '../data/especies';

export default function Especies() {
  const query = useQuery();
  const navigate = useNavigate();
  const categoria = query.get('categoria') || '';
  const [texto, setTexto] = useState('');

  const filtradas = useMemo(() => {
    const t = texto.trim().toLowerCase();
    return ESPECIES.filter((e) => (!categoria || e.categoria === categoria)
      && (!t || `${e.nombre} ${e.cientifico} ${e.habitat}`.toLowerCase().includes(t)));
  }, [categoria, texto]);

  const elegir = (id) => navigate(id ? `/especies?categoria=${id}` : '/especies', { replace: true });

  return (
    <div className="container py-4">
      <h1 className="fw-bold text-avenza">Catálogo de especies</h1>
      <p className="lead">Explora la fauna en cinco categorías. Cada ficha tiene un código QR único que abre su historia completa.</p>

      <div className="row g-3 align-items-end mb-4">
        <div className="col-lg-8">
          <p className="form-label mb-1" id="etiqueta-categorias">Filtrar por categoría</p>
          <div className="d-flex flex-wrap gap-2" role="group" aria-labelledby="etiqueta-categorias">
            <button type="button" className={`btn btn-sm ${!categoria ? 'btn-success' : 'btn-outline-success'}`} aria-pressed={!categoria} onClick={() => elegir('')}>
              Todas ({ESPECIES.length})
            </button>
            {CATEGORIAS.map((c) => (
              <button key={c.id} type="button" className={`btn btn-sm ${categoria === c.id ? 'btn-success' : 'btn-outline-success'}`}
                aria-pressed={categoria === c.id} onClick={() => elegir(c.id)}>
                <Icon name={c.icono} /> {c.nombre} ({ESPECIES.filter((e) => e.categoria === c.id).length})
              </button>
            ))}
          </div>
        </div>
        <div className="col-lg-4">
          <label htmlFor="buscar-especie" className="form-label mb-1">Buscar especie</label>
          <div className="input-group">
            <span className="input-group-text"><Icon name="magnifying-glass" /></span>
            <input id="buscar-especie" type="search" className="form-control" placeholder="Ej. jaguar, páramo…" value={texto} onChange={(e) => setTexto(e.target.value)} />
          </div>
        </div>
      </div>

      <p className="visually-hidden" aria-live="polite">{filtradas.length} especies encontradas</p>
      {filtradas.length === 0 ? (
        <Vacio titulo="No encontramos especies con ese criterio" icono="magnifying-glass">
          <button type="button" className="btn btn-outline-success" onClick={() => { setTexto(''); elegir(''); }}>Limpiar filtros</button>
        </Vacio>
      ) : (
        <div className="row g-4">
          {filtradas.map((e) => <TarjetaEspecie key={e.id} especie={e} />)}
        </div>
      )}
    </div>
  );
}

function TarjetaEspecie({ especie: e }) {
  const cat = categoriaPorId(e.categoria);
  const estado = ESTADOS_UICN[e.estado];
  return (
    <div className="col-md-6 col-xl-4">
      <article className="card h-100 shadow-sm tarjeta-especie">
        <div className="especie-portada" style={{ '--color-cat': cat.color }}>
          <Icon name={e.icono} size="3.5em" />
          <span className={`badge ${estado.clase}`} title={`Estado UICN: ${estado.nombre}`}>{e.estado} · {estado.nombre}</span>
        </div>
        <div className="card-body d-flex gap-3">
          <div className="flex-grow-1">
            <p className="small text-secondary mb-1"><Icon name={cat.icono} /> {cat.nombre}</p>
            <h2 className="h5 card-title mb-0">{e.nombre}</h2>
            <p className="fst-italic text-secondary small">{e.cientifico}</p>
            <p className="card-text small">{e.dato}</p>
          </div>
          <QREspecie especie={e} tamano={96} />
        </div>
        <div className="card-footer bg-transparent border-0 pb-3">
          <Link to={`/especies/${e.slug}`} className="btn btn-success w-100">
            Leer historia completa <span className="visually-hidden">de {e.nombre}</span>
          </Link>
        </div>
      </article>
    </div>
  );
}
