// Slide publicitario con 5 imágenes (requisito k / HU-02).
// Accesible: botones con nombre, indicadores, pausa automática y control por teclado.
import { useEffect, useState } from 'react';
import { Link } from '../router/Router';
import Icon from './Icon';

export default function Carrusel({ slides, intervalo = 6000 }) {
  const [actual, setActual] = useState(0);
  const [pausado, setPausado] = useState(false);
  const total = slides.length;
  const ir = (i) => setActual((i + total) % total);

  useEffect(() => {
    if (pausado) return undefined;
    const id = setInterval(() => setActual((a) => (a + 1) % total), intervalo);
    return () => clearInterval(id);
  }, [pausado, intervalo, total]);

  const teclado = (e) => {
    if (e.key === 'ArrowRight') ir(actual + 1);
    if (e.key === 'ArrowLeft') ir(actual - 1);
  };

  return (
    <section className="carrusel" aria-roledescription="carrusel" aria-label="Campañas de AVENZA"
      onKeyDown={teclado} onMouseEnter={() => setPausado(true)} onMouseLeave={() => setPausado(false)}>
      <div className="carrusel-pista" aria-live={pausado ? 'polite' : 'off'}>
        {slides.map((s, i) => (
          <div key={s.titulo} className={`carrusel-item ${i === actual ? 'activo' : ''}`} role="group"
            aria-roledescription="diapositiva" aria-label={`${i + 1} de ${total}: ${s.titulo}`} aria-hidden={i !== actual}>
            <img src={s.imagen} alt={s.alt} width="1600" height="600" />
            <div className="carrusel-texto">
              <p className="h1 fw-bold">{s.titulo}</p>
              <p className="lead">{s.texto}</p>
              <Link to={s.enlace} className="btn btn-warning btn-lg" tabIndex={i === actual ? 0 : -1}>
                {s.cta} <Icon name="arrow-right" />
              </Link>
            </div>
          </div>
        ))}
      </div>
      <button type="button" className="carrusel-control anterior" onClick={() => ir(actual - 1)} aria-label="Diapositiva anterior">
        <Icon name="chevron-left" size="1.5em" />
      </button>
      <button type="button" className="carrusel-control siguiente" onClick={() => ir(actual + 1)} aria-label="Diapositiva siguiente">
        <Icon name="chevron-right" size="1.5em" />
      </button>
      <div className="carrusel-indicadores">
        <button type="button" className="carrusel-pausa" onClick={() => setPausado(!pausado)}
          aria-label={pausado ? 'Reanudar rotación automática' : 'Pausar rotación automática'}>
          <Icon name={pausado ? 'play' : 'pause'} />
        </button>
        {slides.map((s, i) => (
          <button key={s.titulo} type="button" className={i === actual ? 'activo' : ''} onClick={() => ir(i)}
            aria-label={`Ir a la diapositiva ${i + 1}: ${s.titulo}`} aria-current={i === actual} />
        ))}
      </div>
    </section>
  );
}
