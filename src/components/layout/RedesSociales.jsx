// Acceso a las 4 redes sociales (requisito g / HU-12)
import Icon from '../Icon';
import { EMPRESA } from '../../data/empresa';

export default function RedesSociales({ grande = false }) {
  return (
    <ul className={`redes list-unstyled d-flex flex-wrap gap-2 mb-0 ${grande ? 'redes-grandes' : ''}`}>
      {EMPRESA.redes.map((r) => (
        <li key={r.nombre}>
          <a href={r.url} target="_blank" rel="noopener noreferrer" className={`btn-red ${r.clase}`}
            aria-label={`${r.nombre} de AVENZA (se abre en una nueva pestaña)`} title={r.nombre}>
            <Icon name={r.icono} size={grande ? '1.5em' : '1.15em'} />
            {grande && <span>{r.nombre}</span>}
          </a>
        </li>
      ))}
    </ul>
  );
}
