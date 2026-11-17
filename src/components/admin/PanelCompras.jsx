// Compras a proveedores: aumentan el stock y quedan en el kardex.
import { useCallback, useEffect, useState } from 'react';
import { api } from '../../helpers/api';
import { fecha, moneda } from '../../helpers/formato';
import { validarFormulario } from '../../helpers/validaciones';
import { useAvisos } from '../../context/AvisosContext';
import { Cargando, ErrorCarga } from '../Estados';
import Campo from '../Campo';
import Icon from '../Icon';

const INICIAL = { proveedor_id: '', producto_id: '', cantidad: '', costo_unitario: '' };
const REGLAS = {
  proveedor_id: { requerido: true }, producto_id: { requerido: true },
  cantidad: { requerido: true, min: 1, entero: true }, costo_unitario: { requerido: true, min: 0 },
};

export default function PanelCompras() {
  const [compras, setCompras] = useState(null);
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [datos, setDatos] = useState(INICIAL);
  const [errores, setErrores] = useState({});
  const [error, setError] = useState(null);
  const avisar = useAvisos();

  const cargar = useCallback(async () => {
    setError(null);
    try {
      const [c, pr, p] = await Promise.all([api.get('/compras'), api.get('/proveedores'), api.get('/productos')]);
      setCompras(c); setProveedores(pr); setProductos(p);
    } catch (e) { setError(e); }
  }, []);
  useEffect(() => { cargar(); }, [cargar]);

  const cambiar = (e) => { setDatos({ ...datos, [e.target.name]: e.target.value }); setErrores({ ...errores, [e.target.name]: undefined }); };

  const registrar = async (e) => {
    e.preventDefault();
    const errs = validarFormulario(datos, REGLAS);
    setErrores(errs);
    if (Object.keys(errs).length) return;
    try {
      await api.post('/compras', { ...datos, proveedor_id: Number(datos.proveedor_id), producto_id: Number(datos.producto_id), cantidad: Number(datos.cantidad), costo_unitario: Number(datos.costo_unitario) });
      avisar('Compra registrada. El stock del producto se actualizó.');
      setDatos(INICIAL);
      cargar();
    } catch (err) { avisar(err.statusText, 'danger'); setErrores(err.errores || {}); }
  };

  if (error) return <ErrorCarga error={error} alReintentar={cargar} />;
  if (!compras) return <Cargando />;
  const total = Number(datos.cantidad || 0) * Number(datos.costo_unitario || 0);

  return (
    <section aria-labelledby="titulo-compras">
      <h2 id="titulo-compras" className="h3 mb-3">Compras a proveedores</h2>
      <form className="card card-body shadow-sm mb-4" onSubmit={registrar} noValidate>
        <div className="row g-3">
          <Campo id="proveedor_id" label="Proveedor" as="select" required className="col-md-6" value={datos.proveedor_id} onChange={cambiar} error={errores.proveedor_id}
            opciones={proveedores.map((p) => ({ value: p.id, label: p.razon_social }))} />
          <Campo id="producto_id" label="Producto" as="select" required className="col-md-6" value={datos.producto_id} onChange={cambiar} error={errores.producto_id}
            opciones={productos.map((p) => ({ value: p.id, label: `${p.codigo} · ${p.nombre} (stock ${p.stock})` }))} />
          <Campo id="cantidad" label="Cantidad" tipo="number" min="1" required className="col-md-4" value={datos.cantidad} onChange={cambiar} error={errores.cantidad} />
          <Campo id="costo_unitario" label="Costo unitario (COP)" tipo="number" min="0" step="100" required className="col-md-4" value={datos.costo_unitario} onChange={cambiar} error={errores.costo_unitario} />
          <div className="col-md-4 d-flex align-items-end">
            <p className="mb-2">Total compra: <strong>{moneda(total)}</strong></p>
          </div>
        </div>
        <div className="mt-3"><button type="submit" className="btn btn-success"><Icon name="truck" /> Registrar compra</button></div>
      </form>
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <caption className="visually-hidden">Historial de compras</caption>
          <thead className="table-dark"><tr><th scope="col">#</th><th scope="col">Fecha</th><th scope="col">Proveedor</th><th scope="col">Producto</th><th scope="col">Cant.</th><th scope="col">Costo u.</th><th scope="col">Total</th></tr></thead>
          <tbody>
            {compras.length === 0 ? <tr><td colSpan="7" className="text-center">No hay compras registradas</td></tr> : compras.map((c) => (
              <tr key={c.id}><td>{c.id}</td><td>{fecha(c.fecha)}</td><td>{c.proveedor}</td><td>{c.producto}</td><td>{c.cantidad}</td><td>{moneda(c.costo_unitario)}</td><td>{moneda(c.total)}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
