import Icon from '../components/Icon';
import { Link } from '../router/Router';
import { LINEA_TIEMPO, PARQUES } from '../data/zoologicos';

export default function Zoologicos() {
  return (
    <div className="container py-4">
      <header className="mb-4">
        <h1 className="fw-bold text-avenza">Historia y evolución de los zoológicos</h1>
        <p className="lead">
          Durante siglos los animales silvestres se mantuvieron como símbolo de poder o curiosidad. Hoy los zoológicos
          modernos se definen por su papel en la conservación, la investigación, la educación y el rescate de fauna.
        </p>
      </header>

      <section aria-labelledby="titulo-linea" className="mb-5">
        <h2 id="titulo-linea" className="h3 mb-4">Línea de tiempo</h2>
        <ol className="linea-tiempo list-unstyled">
          {LINEA_TIEMPO.map((h) => (
            <li key={h.fecha}>
              <p className="linea-fecha">{h.fecha}</p>
              <div className="card shadow-sm">
                <div className="card-body">
                  <h3 className="h5">{h.titulo}</h3>
                  <p className="mb-0">{h.texto}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="titulo-parques">
        <h2 id="titulo-parques" className="h3 mb-2">Principales parques de Colombia</h2>
        <p className="mb-4">Tres centros que combinan visita, educación ambiental y conservación.</p>
        <div className="row g-4">
          {PARQUES.map((p) => (
            <div className="col-lg-4" key={p.id}>
              <article className="card h-100 shadow-sm tarjeta-parque">
                <div className="card-header d-flex align-items-center gap-2">
                  <Icon name={p.icono} size="1.4em" />
                  <h3 className="h5 mb-0">{p.nombre}</h3>
                </div>
                <div className="card-body">
                  <p className="small text-secondary mb-2"><Icon name="location-dot" /> {p.ubicacion}</p>
                  <p className="badge text-bg-success">{p.inicio}</p>
                  <p>{p.resumen}</p>
                  <p className="mb-0 fst-italic">{p.destacado}</p>
                </div>
                <div className="card-footer bg-transparent border-0 pb-3">
                  <Link to="/tienda?categoria=Pasaporte" className="btn btn-outline-success w-100">
                    <Icon name="ticket" /> Ver pasaporte
                  </Link>
                </div>
              </article>
            </div>
          ))}
        </div>
        <p className="small text-secondary mt-3">
          Fuentes: información pública de cada parque y prensa nacional. Los pasaportes de la tienda son productos
          académicos ficticios; consulte tarifas reales en los sitios oficiales de cada parque.
        </p>
      </section>
    </div>
  );
}
