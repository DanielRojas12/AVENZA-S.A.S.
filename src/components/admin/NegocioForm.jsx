// Formulario dinámico: se genera a partir de la lista de campos.
import { useEffect, useState } from 'react';
import Campo from '../Campo';
import Icon from '../Icon';

const vacio = (campos) => Object.fromEntries(campos.map((c) => [c.name, c.default ?? '']));

export default function NegocioForm({ campos, editando, singular, alGuardar, alCancelar }) {
  const [datos, setDatos] = useState(() => vacio(campos));
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);

  // Al elegir "Editar" en la tabla, el formulario se llena automáticamente
  useEffect(() => {
    setErrores({});
    setDatos(editando ? Object.fromEntries(campos.map((c) => [c.name, editando[c.name] ?? ''])) : vacio(campos));
  }, [editando, campos]);

  const cambiar = (e) => {
    const { name, value, type, checked } = e.target;
    setDatos((d) => ({ ...d, [name]: type === 'checkbox' ? checked : value }));
    if (errores[name]) setErrores((er) => ({ ...er, [name]: undefined }));
  };

  const enviar = async (e) => {
    e.preventDefault();
    setEnviando(true);
    const err = await alGuardar(datos);
    setEnviando(false);
    setErrores(err);
    if (!Object.keys(err).length && !editando) setDatos(vacio(campos));
    else if (Object.keys(err).length) document.getElementById(Object.keys(err)[0])?.focus();
  };

  return (
    <form onSubmit={enviar} noValidate className="card card-body shadow-sm">
      <p className="fw-semibold mb-3">
        {editando ? <>Editando {singular.toLowerCase()} <span className="badge text-bg-warning">ID {editando.id}</span></> : `Nuevo ${singular.toLowerCase()}`}
      </p>
      <div className="row g-3">
        {campos.map((c) => (
          c.type === 'checkbox' ? (
            <div className="col-md-4 d-flex align-items-end" key={c.name}>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id={c.name} name={c.name} checked={!!datos[c.name]} onChange={cambiar} />
                <label className="form-check-label" htmlFor={c.name}>{c.label}</label>
              </div>
            </div>
          ) : (
            <Campo key={c.name} id={c.name} label={c.label} tipo={c.type || 'text'} as={c.as} opciones={c.options}
              value={datos[c.name]} onChange={cambiar} error={errores[c.name]} ayuda={c.ayuda}
              required={c.required} min={c.min} step={c.step} placeholder={c.placeholder} maxLength={c.maxLength}
              inputMode={c.inputMode} className={c.col || 'col-md-4'} />
          )
        ))}
      </div>
      <div className="d-flex gap-2 mt-3">
        <button type="submit" className="btn btn-success" disabled={enviando}>
          <Icon name="check" /> {enviando ? 'Guardando…' : editando ? 'Actualizar' : 'Guardar'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => { alCancelar(); setDatos(vacio(campos)); setErrores({}); }}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
