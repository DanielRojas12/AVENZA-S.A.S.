// CRUD reutilizable (heredado del Laboratorio 4, ahora conectado a Express + Neon).
// Se configura con: título, endpoint y la definición de campos.
import { useCallback, useEffect, useState } from 'react';
import NegocioForm from './NegocioForm';
import NegocioTable from './NegocioTable';
import Confirmar from '../Confirmar';
import { Cargando, ErrorCarga } from '../Estados';
import { useAvisos } from '../../context/AvisosContext';
import { validarFormulario } from '../../helpers/validaciones';
import Icon from '../Icon';

export default function CrudModulo({ titulo, singular, api, endpoint, campos, columnas }) {
  const [registros, setRegistros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [editando, setEditando] = useState(null); // registro en edición o null
  const [aEliminar, setAEliminar] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const avisar = useAvisos();

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      setRegistros(await api.get(endpoint));
    } catch (e) {
      setError(e);
    } finally {
      setCargando(false);
    }
  }, [api, endpoint]);

  useEffect(() => { cargar(); }, [cargar]);

  // Reglas de validación construidas a partir de la configuración de cada campo
  const reglas = Object.fromEntries(campos.map((c) => [c.name, c.reglas || { requerido: c.required }]));

  /** CREATE / UPDATE. Devuelve los errores para que el formulario los muestre. */
  const guardar = async (datos) => {
    const errores = validarFormulario(datos, reglas);
    if (Object.keys(errores).length) return errores;
    const payload = { ...datos };
    campos.forEach((c) => { if (c.type === 'number' && payload[c.name] !== '') payload[c.name] = Number(payload[c.name]); });
    try {
      if (editando) {
        const actualizado = await api.put(`${endpoint}/${editando.id}`, payload);
        setRegistros((rs) => rs.map((r) => (r.id === editando.id ? actualizado : r)));
        avisar(`${singular} actualizado correctamente.`);
      } else {
        const nuevo = await api.post(endpoint, payload);
        setRegistros((rs) => [...rs, nuevo]);
        avisar(`${singular} creado correctamente.`);
      }
      setEditando(null);
      return {};
    } catch (e) {
      avisar(e.statusText, 'danger');
      return e.errores || {};
    }
  };

  /** DELETE (con confirmación previa) */
  const eliminar = async () => {
    try {
      await api.del(`${endpoint}/${aEliminar.id}`);
      setRegistros((rs) => rs.filter((r) => r.id !== aEliminar.id));
      avisar(`${singular} eliminado.`);
    } catch (e) {
      avisar(e.statusText, 'danger');
    } finally {
      setAEliminar(null);
    }
  };

  const idTitulo = `titulo${endpoint.replace(/\W/g, '-')}`;
  const texto = busqueda.trim().toLowerCase();
  const filtrados = texto
    ? registros.filter((r) => columnas.some((c) => String(r[c.name] ?? '').toLowerCase().includes(texto)))
    : registros;

  return (
    <section aria-labelledby={idTitulo}>
      <h2 id={idTitulo} className="h3 mb-3">{titulo}</h2>
      <NegocioForm campos={campos} editando={editando} singular={singular} alGuardar={guardar} alCancelar={() => setEditando(null)} />

      <div className="d-flex flex-wrap justify-content-between align-items-end gap-2 mt-4 mb-2">
        <div>
          <label htmlFor={`buscar${endpoint.replace(/\W/g, '-')}`} className="form-label mb-1">Buscar</label>
          <div className="input-group">
            <span className="input-group-text"><Icon name="magnifying-glass" /></span>
            <input id={`buscar${endpoint.replace(/\W/g, '-')}`} type="search" className="form-control" value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)} placeholder="Escriba para filtrar…" />
          </div>
        </div>
        <p className="mb-0 text-secondary" aria-live="polite">{filtrados.length} de {registros.length} registros</p>
      </div>

      {cargando ? <Cargando /> : error ? <ErrorCarga error={error} alReintentar={cargar} /> : (
        <NegocioTable columnas={columnas} registros={filtrados} titulo={titulo}
          alEditar={(r) => { setEditando(r); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          alEliminar={setAEliminar} />
      )}

      <Confirmar abierto={!!aEliminar} titulo={`Eliminar ${singular.toLowerCase()}`}
        mensaje={<>¿Seguro que desea eliminar <strong>{aEliminar?.[columnas[1]?.name] ?? aEliminar?.id}</strong>? Esta acción no se puede deshacer.</>}
        alConfirmar={eliminar} alCancelar={() => setAEliminar(null)} />
    </section>
  );
}
