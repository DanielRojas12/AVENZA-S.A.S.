// Botones de accesibilidad (requisito o / HU-15)
import Icon from '../Icon';
import { useAccesibilidad } from '../../context/AccesibilidadContext';

export default function BarraAccesibilidad() {
  const a = useAccesibilidad();
  return (
    <div className="barra-accesibilidad" role="toolbar" aria-label="Opciones de accesibilidad">
      <div className="container d-flex flex-wrap align-items-center justify-content-end gap-2 py-1">
        <span className="small me-1 d-none d-sm-inline">
          <Icon name="universal-access" /> Accesibilidad:
        </span>
        <button type="button" className="btn btn-sm btn-light" onClick={a.aumentar} disabled={!a.puedeAumentar}
          aria-label="Aumentar tamaño de letra" title="Aumentar tamaño de letra">A+</button>
        <button type="button" className="btn btn-sm btn-light" onClick={a.disminuir} disabled={!a.puedeDisminuir}
          aria-label="Disminuir tamaño de letra" title="Disminuir tamaño de letra">A−</button>
        <button type="button" className="btn btn-sm btn-light" onClick={a.alternarContraste} aria-pressed={a.contraste}
          title="Activar o desactivar alto contraste">
          <Icon name="circle-half-stroke" /> Alto contraste
        </button>
        <button type="button" className="btn btn-sm btn-outline-light" onClick={a.restablecer} title="Restablecer opciones de accesibilidad">
          <Icon name="rotate-left" /> Restablecer
        </button>
        <span className="visually-hidden" aria-live="polite">
          Tamaño de letra {Math.round(a.escala * 100)} por ciento. Alto contraste {a.contraste ? 'activado' : 'desactivado'}.
        </span>
      </div>
    </div>
  );
}
