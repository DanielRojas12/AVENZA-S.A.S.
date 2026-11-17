// Factura electrónica (resumen de facturación, HU-10). Imprimible.
import { useCallback, useEffect, useState } from 'react';
import Icon from '../components/Icon';
import { Cargando, ErrorCarga } from '../components/Estados';
import { api } from '../helpers/api';
import { fecha, moneda } from '../helpers/formato';
import { Link, useParams } from '../router/Router';
import { EMPRESA } from '../data/empresa';

export default function Factura() {
  const { id } = useParams();
  const [factura, setFactura] = useState(null);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    setError(null);
    try { setFactura(await api.get(`/facturas/${id}`)); } catch (e) { setError(e); }
  }, [id]);
  useEffect(() => { cargar(); }, [cargar]);

  if (error) return <div className="container py-4"><ErrorCarga error={error} alReintentar={cargar} /></div>;
  if (!factura) return <Cargando texto="Cargando factura…" />;
  const f = factura;

  return (
    <div className="container py-4">
      <div className="d-print-none mb-3">
        {f.estado === 'PAGADA' && (
          <div className="alert alert-success d-flex gap-2 align-items-center" role="status">
            <Icon name="check" size="1.5em" />
            <div><strong>¡Compra exitosa!</strong> Tu pago fue aprobado. Conserva esta factura; también puedes imprimirla o guardarla en PDF.</div>
          </div>
        )}
        <ol className="pasos list-unstyled d-flex flex-wrap gap-3" aria-label="Pasos de la compra">
          <li className="hecho"><Icon name="check" /> 1. Carrito</li>
          <li className="hecho"><Icon name="check" /> 2. Datos y pago</li>
          <li className="actual" aria-current="step">3. Factura</li>
        </ol>
      </div>

      <article className="factura card shadow-sm" aria-labelledby="titulo-factura">
        <div className="card-body p-4 p-md-5">
          <div className="d-flex flex-wrap justify-content-between gap-3 border-bottom pb-3 mb-3">
            <div>
              <img src="/img/logo-avenza.png" alt="AVENZA S.A.S." width="133" height="120" />
              <p className="small mb-0 mt-2">NIT {EMPRESA.nit}<br />{EMPRESA.direccion}<br />{EMPRESA.email}</p>
            </div>
            <div className="text-md-end">
              <h1 id="titulo-factura" className="h3 mb-1">Factura de venta</h1>
              <p className="fs-4 fw-bold text-avenza mb-1">{f.numero}</p>
              <p className="mb-1">{fecha(f.fecha)}</p>
              <span className={`badge ${f.estado === 'PAGADA' ? 'text-bg-success' : 'text-bg-danger'}`}>{f.estado}</span>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <h2 className="h6 text-uppercase text-secondary">Cliente</h2>
              <p className="mb-0">{f.nombres}<br />C.C. {f.documento}<br />{f.email} · {f.celular}{f.direccion && <><br />{f.direccion}</>}</p>
            </div>
            <div className="col-md-6 text-md-end">
              <h2 className="h6 text-uppercase text-secondary">Pago</h2>
              <p className="mb-0">Método: {f.metodo_pago}<br />Referencia: {f.referencia_pago}<br />Pasarela: AvenzaPay (simulada)</p>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table">
              <caption className="visually-hidden">Detalle de la factura {f.numero}</caption>
              <thead><tr><th scope="col">Descripción</th><th scope="col" className="text-center">Cant.</th><th scope="col" className="text-end">Valor unitario</th><th scope="col" className="text-end">Subtotal</th></tr></thead>
              <tbody>
                {f.items.map((d) => (
                  <tr key={d.id}><td>{d.descripcion}</td><td className="text-center">{d.cantidad}</td><td className="text-end">{moneda(d.precio_unitario)}</td><td className="text-end">{moneda(d.subtotal)}</td></tr>
                ))}
              </tbody>
              <tfoot>
                <tr><th scope="row" colSpan="3" className="text-end">Subtotal</th><td className="text-end">{moneda(f.subtotal)}</td></tr>
                <tr><th scope="row" colSpan="3" className="text-end">IVA 19 %</th><td className="text-end">{moneda(f.iva)}</td></tr>
                <tr className="fs-5"><th scope="row" colSpan="3" className="text-end">Total</th><td className="text-end fw-bold">{moneda(f.total)}</td></tr>
              </tfoot>
            </table>
          </div>
          <p className="small text-secondary mb-0">Documento generado con fines académicos. No constituye factura electrónica ante la DIAN.</p>
        </div>
      </article>

      <div className="d-flex flex-wrap gap-2 mt-3 d-print-none">
        <button type="button" className="btn btn-success" onClick={() => window.print()}><Icon name="print" /> Imprimir / guardar PDF</button>
        <Link to="/tienda" className="btn btn-outline-success">Seguir comprando</Link>
        <Link to="/" className="btn btn-link">Ir al inicio</Link>
      </div>
    </div>
  );
}
