// Indicadores del negocio: ventas, inventario, stock bajo y productos más vendidos.
import { useCallback, useEffect, useState } from 'react';
import { api } from '../../helpers/api';
import { moneda } from '../../helpers/formato';
import { Cargando, ErrorCarga } from '../Estados';
import Icon from '../Icon';

export default function PanelResumen() {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(null);
  const cargar = useCallback(async () => {
    setError(null);
    try { setDatos(await api.get('/reportes/resumen')); } catch (e) { setError(e); }
  }, []);
  useEffect(() => { cargar(); }, [cargar]);

  if (error) return <ErrorCarga error={error} alReintentar={cargar} />;
  if (!datos) return <Cargando />;
  const { ventas, inventario, stock_bajo: bajo, top_productos: top } = datos;
  const maxTop = Math.max(1, ...top.map((t) => t.unidades));

  return (
    <section aria-labelledby="titulo-resumen-admin">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 id="titulo-resumen-admin" className="h3 mb-0">Resumen del negocio</h2>
        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={cargar}><Icon name="rotate-left" /> Actualizar</button>
      </div>
      <div className="row g-3 mb-4">
        <Kpi icono="chart-line" titulo="Ventas totales" valor={moneda(ventas.total_ventas)} />
        <Kpi icono="file-invoice" titulo="Facturas pagadas" valor={ventas.facturas} />
        <Kpi icono="wallet" titulo="Ticket promedio" valor={moneda(ventas.ticket_promedio)} />
        <Kpi icono="boxes-stacked" titulo="Valor del inventario" valor={moneda(inventario.valor_inventario)} detalle={`${inventario.unidades} unidades en ${inventario.productos} productos`} />
      </div>
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-body">
              <h3 className="h5"><Icon name="triangle-exclamation" className="text-danger" /> Productos con stock bajo</h3>
              {bajo.length === 0 ? <p className="mb-0">Todo el inventario está por encima del mínimo.</p> : (
                <ul className="list-group list-group-flush">
                  {bajo.map((p) => (
                    <li key={p.id} className="list-group-item d-flex justify-content-between">
                      <span>{p.codigo} · {p.nombre}</span>
                      <span className="badge text-bg-danger">{p.stock} / mín. {p.stock_minimo}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-body">
              <h3 className="h5"><Icon name="chart-line" /> Productos más vendidos</h3>
              {top.length === 0 ? <p className="mb-0">Aún no hay ventas registradas.</p> : (
                <ul className="list-unstyled mb-0 barras">
                  {top.map((t) => (
                    <li key={t.nombre}>
                      <div className="d-flex justify-content-between small"><span>{t.nombre}</span><span>{t.unidades} u · {moneda(t.total)}</span></div>
                      <div className="barra" role="presentation"><span style={{ width: `${(t.unidades / maxTop) * 100}%` }} /></div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Kpi({ icono, titulo, valor, detalle }) {
  return (
    <div className="col-sm-6 col-xl-3">
      <div className="card kpi h-100">
        <div className="card-body">
          <p className="small text-secondary mb-1"><Icon name={icono} /> {titulo}</p>
          <p className="fs-4 fw-bold mb-0">{valor}</p>
          {detalle && <p className="small text-secondary mb-0">{detalle}</p>}
        </div>
      </div>
    </div>
  );
}
