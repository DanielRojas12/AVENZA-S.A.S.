import Carrusel from '../components/Carrusel';
import Acordeon from '../components/Acordeon';
import Icon from '../components/Icon';
import { Link } from '../router/Router';
import { SLIDES, SECCIONES_CORPORATIVAS, EMPRESA } from '../data/empresa';
import { ESPECIES, CATEGORIAS } from '../data/especies';

const ACCESOS = [
  { to: '/zoologicos', titulo: 'Historia de los zoológicos', texto: 'De las colecciones antiguas a los centros de conservación de hoy.', iconoReal: 'binoculars' },
  { to: '/especies', titulo: 'Catálogo de especies', texto: `${ESPECIES.length} fichas en ${CATEGORIAS.length} categorías, cada una con su código QR.`, iconoReal: 'paw' },
  { to: '/tienda', titulo: 'Tienda en línea', texto: 'Pasaportes a parques aliados y souvenirs ecológicos.', iconoReal: 'store' },
  { to: '/recomendador', titulo: 'Recomendador con IA', texto: 'Te sugerimos especies y el pasaporte ideal según tus gustos.', iconoReal: 'robot' },
];

export default function Inicio() {
  return (
    <>
      <Carrusel slides={SLIDES} />

      <section className="container py-5" aria-labelledby="titulo-bienvenida">
        <div className="row align-items-center g-4">
          <div className="col-lg-6">
            <h1 id="titulo-bienvenida" className="display-5 fw-bold text-avenza">{EMPRESA.lema}</h1>
            <p className="lead">
              AVENZA S.A.S. es una plataforma educativa que cuenta cómo los zoológicos pasaron de ser colecciones de
              exhibición a centros de rescate, investigación y conservación de la fauna.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <Link to="/especies" className="btn btn-success btn-lg"><Icon name="paw" /> Explorar especies</Link>
              <Link to="/tienda" className="btn btn-outline-success btn-lg"><Icon name="ticket" /> Comprar pasaportes</Link>
            </div>
          </div>
          <div className="col-lg-6">
            <h2 className="h4 mb-3">Quiénes somos</h2>
            <Acordeon items={SECCIONES_CORPORATIVAS} id="corporativo" abiertoInicial={1} />
          </div>
        </div>
      </section>

      <section className="bg-menta py-5" aria-labelledby="titulo-accesos">
        <div className="container">
          <h2 id="titulo-accesos" className="h3 text-center mb-4">¿Qué puedes hacer en AVENZA?</h2>
          <div className="row g-4">
            {ACCESOS.map((a) => (
              <div className="col-sm-6 col-lg-3" key={a.to}>
                <Link to={a.to} className="tarjeta-acceso card h-100 text-decoration-none">
                  <div className="card-body">
                    <span className="icono-circulo mb-3"><Icon name={a.iconoReal} size="1.6em" /></span>
                    <h3 className="h5 card-title">{a.titulo}</h3>
                    <p className="card-text">{a.texto}</p>
                    <span className="enlace-flecha">Ir ahora <Icon name="arrow-right" /></span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-5" aria-labelledby="titulo-cifras">
        <h2 id="titulo-cifras" className="visually-hidden">AVENZA en cifras</h2>
        <div className="row text-center g-4">
          <Cifra valor={ESPECIES.length} texto="especies con ficha y QR" />
          <Cifra valor={CATEGORIAS.length} texto="categorías de fauna" />
          <Cifra valor={3} texto="parques aliados en Colombia" />
          <Cifra valor={ESPECIES.filter((e) => ['VU', 'EN', 'CR'].includes(e.estado)).length} texto="especies amenazadas explicadas" />
        </div>
      </section>
    </>
  );
}

function Cifra({ valor, texto }) {
  return (
    <div className="col-6 col-md-3">
      <p className="display-4 fw-bold text-avenza mb-0">{valor}</p>
      <p className="mb-0">{texto}</p>
    </div>
  );
}
