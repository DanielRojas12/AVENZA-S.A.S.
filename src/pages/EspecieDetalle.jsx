import Icon from '../components/Icon';
import QREspecie, { urlEspecie } from '../components/QREspecie';
import { Link, useParams } from '../router/Router';
import { ESPECIES, ESTADOS_UICN, categoriaPorId, especiePorSlug } from '../data/especies';
import NoEncontrado from './NoEncontrado';

export default function EspecieDetalle() {
  const { slug } = useParams();
  const e = especiePorSlug(slug);
  if (!e) return <NoEncontrado />;

  const cat = categoriaPorId(e.categoria);
  const estado = ESTADOS_UICN[e.estado];
  const i = ESPECIES.indexOf(e);
  const anterior = ESPECIES[(i - 1 + ESPECIES.length) % ESPECIES.length];
  const siguiente = ESPECIES[(i + 1) % ESPECIES.length];

  return (
    <article className="container py-4">
      <div className="especie-hero rounded-4 p-4 p-md-5 mb-4" style={{ '--color-cat': cat.color }}>
        <div className="row align-items-center g-4">
          <div className="col-md-8">
            <p className="mb-1"><Icon name={cat.icono} /> {cat.nombre}</p>
            <h1 className="display-5 fw-bold mb-0">{e.nombre}</h1>
            <p className="fs-4 fst-italic mb-3">{e.cientifico}</p>
            <span className={`badge fs-6 ${estado.clase}`}>Estado UICN: {estado.nombre} ({e.estado})</span>
          </div>
          <div className="col-md-4 text-center">
            <Icon name={e.icono} size="7em" />
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <h2 className="h3">Su historia</h2>
          {e.historia.map((p) => <p key={p.slice(0, 30)} className="fs-5">{p}</p>)}
          <div className="alert alert-success d-flex gap-2" role="note">
            <Icon name="circle-info" className="mt-1" />
            <p className="mb-0"><strong>¿Sabías que…?</strong> {e.dato}</p>
          </div>
        </div>
        <aside className="col-lg-4" aria-labelledby="titulo-ficha">
          <div className="card shadow-sm mb-3">
            <div className="card-body">
              <h2 id="titulo-ficha" className="h5">Ficha técnica</h2>
              <dl className="ficha mb-0">
                <dt>Hábitat</dt><dd>{e.habitat}</dd>
                <dt>Distribución</dt><dd>{e.distribucion}</dd>
                <dt>Dieta</dt><dd>{e.dieta}</dd>
                <dt>Tamaño</dt><dd>{e.tamano}</dd>
              </dl>
            </div>
          </div>
          <div className="card shadow-sm text-center">
            <div className="card-body">
              <h2 className="h5">Comparte esta historia</h2>
              <QREspecie especie={e} tamano={180} />
              <p className="small text-break mt-2 mb-2">{urlEspecie(e.slug)}</p>
              <button type="button" className="btn btn-outline-success btn-sm" onClick={() => window.print()}>
                <Icon name="print" /> Imprimir ficha con QR
              </button>
            </div>
          </div>
        </aside>
      </div>

      <nav className="d-flex justify-content-between mt-5 gap-2" aria-label="Otras especies">
        <Link to={`/especies/${anterior.slug}`} className="btn btn-outline-secondary"><Icon name="chevron-left" /> {anterior.nombre}</Link>
        <Link to="/especies" className="btn btn-link">Volver al catálogo</Link>
        <Link to={`/especies/${siguiente.slug}`} className="btn btn-outline-secondary">{siguiente.nombre} <Icon name="chevron-right" /></Link>
      </nav>
    </article>
  );
}
