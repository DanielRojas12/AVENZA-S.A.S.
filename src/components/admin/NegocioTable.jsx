// Tabla dinámica con acciones de editar y eliminar.
import Icon from '../Icon';

export default function NegocioTable({ columnas, registros, titulo, alEditar, alEliminar }) {
  return (
    <div className="table-responsive">
      <table className="table table-hover table-bordered align-middle">
        <caption className="visually-hidden">{titulo}</caption>
        <thead className="table-dark">
          <tr>
            {columnas.map((c) => <th scope="col" key={c.name}>{c.label}</th>)}
            <th scope="col" className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {registros.length === 0 ? (
            <tr><td colSpan={columnas.length + 1} className="text-center">No hay registros en {titulo}</td></tr>
          ) : registros.map((r) => (
            <tr key={r.id}>
              {columnas.map((c) => <td key={c.name}>{c.render ? c.render(r) : r[c.name]}</td>)}
              <td className="text-center text-nowrap">
                <button type="button" className="btn btn-sm btn-outline-primary me-1" onClick={() => alEditar(r)}
                  aria-label={`Editar registro ${r.id}`} title="Editar"><Icon name="pen" /></button>
                <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => alEliminar(r)}
                  aria-label={`Eliminar registro ${r.id}`} title="Eliminar"><Icon name="trash" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
