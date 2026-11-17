// Consulta de facturación con filtros por fecha y anulación.
import { useCallback, useEffect, useState } from 'react';
import { api } from '../../helpers/api';
import { fecha, moneda } from '../../helpers/formato';
import { useAvisos } from '../../context/AvisosContext';
import { Link } from '../../router/Router';
import { Cargando, ErrorCarga } from '../Estados';
import Confirmar from '../Confirmar';
import Icon from '../Icon';

export default function PanelFacturas() {
  const [facturas, setFacturas] = useState(null);
  const [error, setError] = useState(null);
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [aAnular, setAAnular] = useState(null);
  const avisar = useAvisos();

  const cargar = useCallback(async () => {
    setError(null);
    const q = new URLSearchParams();
    if (desde) q.set('desde', desde);
    if (hasta) q.set('hasta', hasta);
    try { setFacturas(await api.get(`/facturas?${q}`)); } catch (e) { setError(e); }
  }, [desde, hasta]);
  useEffect(() => { cargar(); }, [cargar]);

  const anular = async () => {
    try {
      await api.patch(`/facturas/${aAnular.id}/anular`);
      avisar(`Factura ${aAnular.numero} anulada; las unidades regresaron al inventario.`);
      cargar();
    } catch (e) { avisar(e.statusText, 'danger'); } finally { setAAnular(null); }
  };

  const pagadas = (facturas || []).filter((f) => f.estado === 'PAGADA');
  const total = pagadas.reduce((s, f) => s + f.total, 0);

  return (
    <section aria-labelledby="titulo-facturas">
      <h2 id="titulo-facturas" className="h3 mb-3">Facturación</h2>
      <div className="row g-3 align-items-end mb-3">
        <div className="col-sm-4 col-md-3">
          <label htmlFor="f-desde" className="form-label">Desde</label>
          <input id="f-desde" type="date" className="form-control" value={desde} onChange={(e) => setDesde(e.target.value)} />
        </div>
        <div className="col-sm-4 col-md-3">
          <label htmlFor="f-hasta" className="form-label">Hasta</label>
          <input id="f-hasta" type="date" className="form-control" value={hasta} min={desde || undefined} onChange={(e) => setHasta(e.target.value)} />
        </div>
        <div className="col-sm-4 col-md-6">
          <p className="mb-2" aria-live="polite">{pagadas.length} facturas pagadas · <strong>{moneda(total)}</strong></p>
        </div>
      </div>
      {error ? <ErrorCarga error={error} alReintentar={cargar} /> : !facturas ? <Cargando /> : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <caption className="visually-hidden">Facturas</caption>
            <thead className="table-dark"><tr><th scope="col">Número</th><th scope="col">Fecha</th><th scope="col">Cliente</th><th scope="col">Método</th><th scope="col">Total</th><th scope="col">Estado</th><th scope="col">Acciones</th></tr></thead>
            <tbody>
              {facturas.length === 0 ? <tr><td colSpan="7" className="text-center">No hay facturas en el rango seleccionado</td></tr> : facturas.map((f) => (
                <tr key={f.id}>
                  <td>{f.numero}</td><td>{fecha(f.fecha)}</td><td>{f.cliente}<br /><span className="small text-secondary">C.C. {f.documento}</span></td>
                  <td>{f.metodo_pago}</td><td>{moneda(f.total)}</td>
                  <td><span className={`badge ${f.estado === 'PAGADA' ? 'text-bg-success' : 'text-bg-danger'}`}>{f.estado}</span></td>
                  <td className="text-nowrap">
                    <Link to={`/factura/${f.id}`} className="btn btn-sm btn-outline-primary me-1" aria-label={`Ver factura ${f.numero}`}><Icon name="file-invoice" /></Link>
                    <button type="button" className="btn btn-sm btn-outline-danger" disabled={f.estado !== 'PAGADA'} onClick={() => setAAnular(f)} aria-label={`Anular factura ${f.numero}`}>Anular</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Confirmar abierto={!!aAnular} titulo="Anular factura" textoConfirmar="Sí, anular"
        mensaje={<>¿Anular la factura <strong>{aAnular?.numero}</strong> por {moneda(aAnular?.total)}? Las unidades vendidas regresarán al inventario.</>}
        alConfirmar={anular} alCancelar={() => setAAnular(null)} />
    </section>
  );
}
