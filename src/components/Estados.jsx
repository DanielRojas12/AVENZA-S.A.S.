// Componentes de estado: cargando, error y vacío (Nielsen #1 y #9).
import Icon from './Icon';

export function Cargando({ texto = 'Cargando información…' }) {
  return (
    <div className="text-center py-5" role="status">
      <div className="spinner-border text-success mb-2" aria-hidden="true" />
      <p className="mb-0">{texto}</p>
    </div>
  );
}

export function ErrorCarga({ error, alReintentar }) {
  return (
    <div className="alert alert-danger d-flex flex-column flex-sm-row align-items-sm-center gap-3" role="alert">
      <Icon name="triangle-exclamation" size="2em" />
      <div className="flex-grow-1">
        <p className="fw-bold mb-1">No pudimos cargar la información.</p>
        <p className="mb-0 small">{error?.statusText || 'Error desconocido'}</p>
      </div>
      {alReintentar && <button type="button" className="btn btn-outline-danger" onClick={alReintentar}><Icon name="rotate-left" /> Reintentar</button>}
    </div>
  );
}

export function Vacio({ titulo, children, icono = 'circle-info' }) {
  return (
    <div className="text-center py-5 px-3 bg-light rounded-3">
      <Icon name={icono} size="2.5em" className="text-secondary mb-3" />
      <p className="h5">{titulo}</p>
      {children}
    </div>
  );
}
