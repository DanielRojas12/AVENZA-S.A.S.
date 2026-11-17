// Acordeón accesible para la información corporativa (requisito m / HU-03).
import { useState } from 'react';

export default function Acordeon({ items, abiertoInicial = 0, id = 'acordeon' }) {
  const [abierto, setAbierto] = useState(abiertoInicial);
  return (
    <div className="accordion" id={id}>
      {items.map((item, i) => {
        const estaAbierto = abierto === i;
        return (
          <div className="accordion-item" key={item.id}>
            <h3 className="accordion-header" id={`${id}-h-${item.id}`}>
              <button className={`accordion-button ${estaAbierto ? '' : 'collapsed'}`} type="button"
                aria-expanded={estaAbierto} aria-controls={`${id}-p-${item.id}`}
                onClick={() => setAbierto(estaAbierto ? -1 : i)}>
                {item.titulo}
              </button>
            </h3>
            <div id={`${id}-p-${item.id}`} className={`accordion-collapse collapse ${estaAbierto ? 'show' : ''}`}
              role="region" aria-labelledby={`${id}-h-${item.id}`}>
              <div className="accordion-body">
                {item.contenido?.map((p) => <p key={p.slice(0, 20)}>{p}</p>)}
                {item.lista && <ul className="mb-0">{item.lista.map((l) => <li key={l}>{l}</li>)}</ul>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
