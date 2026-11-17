// Campo de formulario con etiqueta, ayuda y mensaje de error accesibles.
export default function Campo({ id, label, error, ayuda, tipo = 'text', as = 'input', opciones = [], className = 'col-md-6', ...props }) {
  const describedBy = [ayuda && `${id}-ayuda`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;
  const comunes = {
    id, name: id, 'aria-invalid': error ? true : undefined, 'aria-describedby': describedBy,
    className: `${as === 'select' ? 'form-select' : 'form-control'} ${error ? 'is-invalid' : ''}`, ...props,
  };
  return (
    <div className={className}>
      <label htmlFor={id} className="form-label">
        {label} {props.required && <span className="text-danger" aria-hidden="true">*</span>}
      </label>
      {as === 'select' ? (
        <select {...comunes}>
          <option value="">Seleccione…</option>
          {opciones.map((o) => (typeof o === 'string' ? <option key={o} value={o}>{o}</option> : <option key={o.value} value={o.value}>{o.label}</option>))}
        </select>
      ) : as === 'textarea' ? (
        <textarea rows={4} {...comunes} />
      ) : (
        <input type={tipo} {...comunes} />
      )}
      {ayuda && <div id={`${id}-ayuda`} className="form-text">{ayuda}</div>}
      {error && <div id={`${id}-error`} className="invalid-feedback d-block">{error}</div>}
    </div>
  );
}
