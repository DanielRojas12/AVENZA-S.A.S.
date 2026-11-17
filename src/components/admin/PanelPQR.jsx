// Gestión de PQR: cambiar estado y registrar respuesta.
import { useCallback, useEffect, useState } from 'react';
import { api } from '../../helpers/api';
import { fecha } from '../../helpers/formato';
import { useAvisos } from '../../context/AvisosContext';
import { Cargando, ErrorCarga, Vacio } from '../Estados';

const ESTADOS = ['RADICADA', 'EN TRÁMITE', 'RESUELTA'];
const COLOR = { RADICADA: 'text-bg-warning', 'EN TRÁMITE': 'text-bg-info', RESUELTA: 'text-bg-success' };

export default function PanelPQR() {
  const [lista, setLista] = useState(null);
  const [error, setError] = useState(null);
  const avisar = useAvisos();

  const cargar = useCallback(async () => {
    setError(null);
    try { setLista(await api.get('/pqr')); } catch (e) { setError(e); }
  }, []);
  useEffect(() => { cargar(); }, [cargar]);

  const actualizar = async (p, estado, respuesta) => {
    try {
      const nuevo = await api.patch(`/pqr/${p.id}`, { estado, respuesta });
      setLista((l) => l.map((x) => (x.id === p.id ? nuevo : x)));
      avisar(`PQR ${p.radicado} actualizada a ${estado}.`);
    } catch (e) { avisar(e.statusText, 'danger'); }
  };

  if (error) return <ErrorCarga error={error} alReintentar={cargar} />;
  if (!lista) return <Cargando />;
  return (
    <section aria-labelledby="titulo-pqr-admin">
      <h2 id="titulo-pqr-admin" className="h3 mb-3">Peticiones, quejas y reclamos</h2>
      {lista.length === 0 ? <Vacio titulo="No hay PQR radicadas" /> : lista.map((p) => <TarjetaPQR key={p.id} pqr={p} alGuardar={actualizar} />)}
    </section>
  );
}

function TarjetaPQR({ pqr: p, alGuardar }) {
  const [estado, setEstado] = useState(p.estado);
  const [respuesta, setRespuesta] = useState(p.respuesta);
  return (
    <article className="card mb-3 shadow-sm">
      <div className="card-header d-flex flex-wrap justify-content-between gap-2">
        <span><strong>{p.radicado}</strong> · {p.tipo} · {fecha(p.fecha)}</span>
        <span className={`badge ${COLOR[p.estado]}`}>{p.estado}</span>
      </div>
      <div className="card-body">
        <h3 className="h6">{p.asunto}</h3>
        <p className="small text-secondary mb-2">{p.nombre} · C.C. {p.documento} · {p.email} · {p.celular}</p>
        <p>{p.mensaje}</p>
        <form className="row g-2 align-items-end" onSubmit={(e) => { e.preventDefault(); alGuardar(p, estado, respuesta); }}>
          <div className="col-md-3">
            <label htmlFor={`estado-${p.id}`} className="form-label">Estado</label>
            <select id={`estado-${p.id}`} className="form-select" value={estado} onChange={(e) => setEstado(e.target.value)}>
              {ESTADOS.map((e) => <option key={e}>{e}</option>)}
            </select>
          </div>
          <div className="col-md-7">
            <label htmlFor={`resp-${p.id}`} className="form-label">Respuesta al ciudadano</label>
            <input id={`resp-${p.id}`} className="form-control" maxLength={2000} value={respuesta} onChange={(e) => setRespuesta(e.target.value)} />
          </div>
          <div className="col-md-2"><button type="submit" className="btn btn-success w-100">Guardar</button></div>
        </form>
      </div>
    </article>
  );
}
