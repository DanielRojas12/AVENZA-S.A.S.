// Recomendador interactivo con Inteligencia Artificial (requisito j / HU-14).
// 1° intenta con Google Gemini a través del backend; si no está disponible usa el motor local TF-IDF.
import { useEffect, useState } from 'react';
import Icon from '../components/Icon';
import Campo from '../components/Campo';
import { api } from '../helpers/api';
import { moneda } from '../helpers/formato';
import { INTERESES, recomendarLocal } from '../ia/recomendadorLocal';
import { ESPECIES, ESTADOS_UICN, categoriaPorId } from '../data/especies';
import { useCarrito } from '../context/CarritoContext';
import { useAvisos } from '../context/AvisosContext';
import { Link } from '../router/Router';

export default function Recomendador() {
  const [intereses, setIntereses] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [pensando, setPensando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [pasaportes, setPasaportes] = useState([]);
  const { agregar } = useCarrito();
  const avisar = useAvisos();

  useEffect(() => {
    api.get('/productos/catalogo?categoria=Pasaporte').then(setPasaportes).catch(() => setPasaportes([]));
  }, []);

  const alternar = (id) => setIntereses((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id]));

  const recomendar = async (e) => {
    e.preventDefault();
    if (!intereses.length && mensaje.trim().length < 3) {
      setError('Elige al menos un interés o escribe qué te gustaría conocer.');
      return;
    }
    setError('');
    setPensando(true);
    setResultado(null);
    let r = null;
    try {
      r = await api.post('/ia/recomendar', {
        intereses: INTERESES.filter((i) => intereses.includes(i.id)).map((i) => i.etiqueta),
        mensaje,
        catalogo: {
          especies: ESPECIES.map(({ id, nombre, categoria, tags, habitat }) => ({ id, nombre, categoria, tags, habitat })),
          pasaportes: pasaportes.map(({ id, nombre, descripcion }) => ({ id, nombre, descripcion })),
        },
      });
    } catch {
      r = recomendarLocal(intereses, mensaje, pasaportes); // respaldo sin conexión a la IA externa
    }
    setPensando(false);
    if (!r) setError('No encontramos coincidencias. Prueba con otras palabras, por ejemplo "selva", "aves" o "río".');
    setResultado(r);
  };

  const pasaporte = resultado?.pasaporte && pasaportes.find((p) => p.id === resultado.pasaporte.id);

  return (
    <div className="container py-4">
      <h1 className="fw-bold text-avenza"><Icon name="robot" /> Recomendador con IA</h1>
      <p className="lead">Cuéntanos qué te gusta y la inteligencia artificial te sugerirá especies para conocer y el pasaporte ideal.</p>

      <form className="card card-body shadow-sm mb-4" onSubmit={recomendar} noValidate>
        <fieldset>
          <legend className="h5">1. ¿Qué te interesa?</legend>
          <div className="d-flex flex-wrap gap-2">
            {INTERESES.map((i) => (
              <div key={i.id}>
                <input type="checkbox" className="btn-check" id={`int-${i.id}`} checked={intereses.includes(i.id)} onChange={() => alternar(i.id)} />
                <label className="btn btn-outline-success btn-sm" htmlFor={`int-${i.id}`}>{i.etiqueta}</label>
              </div>
            ))}
          </div>
        </fieldset>
        <div className="row mt-3">
          <Campo id="mensaje" label="2. Escríbelo con tus palabras (opcional)" as="textarea" className="col-12" maxLength={500} value={mensaje}
            onChange={(e) => setMensaje(e.target.value)} placeholder="Ej.: Quiero ir con mis hijos a ver animales de río y de la Amazonía, vivimos en Bogotá"
            ayuda="Puedes mencionar tu ciudad, con quién viajas o los animales que te gustan." />
        </div>
        {error && <p className="text-danger mt-2 mb-0" role="alert">{error}</p>}
        <div className="mt-3">
          <button type="submit" className="btn btn-success btn-lg" disabled={pensando}>
            <Icon name="robot" /> {pensando ? 'Analizando…' : 'Recomendarme'}
          </button>
        </div>
      </form>

      {pensando && <div className="text-center py-4" role="status"><div className="spinner-grow text-success" aria-hidden="true" /><p>La IA está analizando tus intereses…</p></div>}

      {resultado && (
        <section aria-labelledby="titulo-resultado" aria-live="polite">
          <div className="alert alert-success d-flex gap-2">
            <Icon name="robot" size="1.5em" />
            <div>
              <h2 id="titulo-resultado" className="h5 mb-1">Tus recomendaciones</h2>
              <p className="mb-1">{resultado.mensaje}</p>
              <p className="small mb-0">Motor utilizado: <strong>{resultado.fuente}</strong></p>
            </div>
          </div>
          <div className="row g-4">
            {resultado.especies.map((r) => {
              const e = ESPECIES.find((x) => x.id === r.id);
              if (!e) return null;
              const cat = categoriaPorId(e.categoria);
              return (
                <div className="col-md-4" key={e.id}>
                  <article className="card h-100 shadow-sm">
                    <div className="especie-portada" style={{ '--color-cat': cat.color }}>
                      <Icon name={e.icono} size="3em" />
                      <span className={`badge ${ESTADOS_UICN[e.estado].clase}`}>{ESTADOS_UICN[e.estado].nombre}</span>
                    </div>
                    <div className="card-body">
                      <h3 className="h5">{e.nombre}</h3>
                      {r.afinidad !== undefined && (
                        <div className="mb-2">
                          <span className="small">Afinidad {r.afinidad}%</span>
                          <div className="progress" role="progressbar" aria-label={`Afinidad con ${e.nombre}`} aria-valuenow={r.afinidad} aria-valuemin="0" aria-valuemax="100">
                            <div className="progress-bar bg-success" style={{ width: `${r.afinidad}%` }} />
                          </div>
                        </div>
                      )}
                      <p className="small mb-0">{r.razon}</p>
                    </div>
                    <div className="card-footer bg-transparent border-0 pb-3">
                      <Link to={`/especies/${e.slug}`} className="btn btn-outline-success w-100">Leer su historia</Link>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
          {pasaporte && (
            <div className="card shadow-sm mt-4">
              <div className="row g-0 align-items-center">
                <div className="col-md-3"><img src={pasaporte.imagen} alt="" className="img-fluid rounded-start" width="600" height="400" /></div>
                <div className="col-md-9">
                  <div className="card-body">
                    <p className="small text-secondary mb-1"><Icon name="ticket" /> Pasaporte sugerido</p>
                    <h3 className="h5">{pasaporte.nombre} · {moneda(pasaporte.precio)}</h3>
                    <p>{resultado.pasaporte.razon}</p>
                    <button type="button" className="btn btn-success" disabled={pasaporte.stock === 0}
                      onClick={() => { if (agregar(pasaporte, 1)) avisar(`${pasaporte.nombre} agregado al carrito.`); else avisar('No hay más unidades disponibles.', 'warning'); }}>
                      <Icon name="cart-shopping" /> Agregar al carrito
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
