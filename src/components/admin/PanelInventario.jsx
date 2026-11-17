// Inventario: ajustes manuales de stock y kardex (historial de movimientos).
import { useCallback, useEffect, useState } from 'react';
import { api } from '../../helpers/api';
import { fecha } from '../../helpers/formato';
import { validarFormulario } from '../../helpers/validaciones';
import { useAvisos } from '../../context/AvisosContext';
import { Cargando, ErrorCarga } from '../Estados';
import Campo from '../Campo';
import Icon from '../Icon';

const COLOR = { ENTRADA: 'text-bg-success', SALIDA: 'text-bg-primary', AJUSTE: 'text-bg-warning', ANULACION: 'text-bg-secondary' };

export default function PanelInventario() {
  const [productos, setProductos] = useState([]);
  const [kardex, setKardex] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [ajuste, setAjuste] = useState({ producto: '', cantidad: '', motivo: '' });
  const [errores, setErrores] = useState({});
  const [error, setError] = useState(null);
  const avisar = useAvisos();

  const cargar = useCallback(async () => {
    setError(null);
    try {
      const [p, k] = await Promise.all([api.get('/productos'), api.get(`/reportes/kardex${filtro ? `?producto_id=${filtro}` : ''}`)]);
      setProductos(p); setKardex(k);
    } catch (e) { setError(e); }
  }, [filtro]);
  useEffect(() => { cargar(); }, [cargar]);

  const cambiar = (e) => { setAjuste({ ...ajuste, [e.target.name]: e.target.value }); setErrores({ ...errores, [e.target.name]: undefined }); };

  const aplicar = async (e) => {
    e.preventDefault();
    const errs = validarFormulario(ajuste, {
      producto: { requerido: true },
      cantidad: { requerido: true, entero: true, custom: (v) => (Number(v) === 0 ? 'Debe ser distinto de 0' : null) },
      motivo: { requerido: true, maxLength: 60 },
    });
    setErrores(errs);
    if (Object.keys(errs).length) return;
    try {
      const p = await api.patch(`/productos/${ajuste.producto}/stock`, { cantidad: Number(ajuste.cantidad), motivo: ajuste.motivo });
      avisar(`Stock de ${p.nombre} actualizado a ${p.stock} unidades.`);
      setAjuste({ producto: '', cantidad: '', motivo: '' });
      cargar();
    } catch (err) { avisar(err.statusText, 'danger'); }
  };

  if (error) return <ErrorCarga error={error} alReintentar={cargar} />;
  if (!kardex) return <Cargando />;

  return (
    <section aria-labelledby="titulo-inventario">
      <h2 id="titulo-inventario" className="h3 mb-3">Inventario y kardex</h2>
      <form className="card card-body shadow-sm mb-4" onSubmit={aplicar} noValidate>
        <p className="fw-semibold">Ajuste manual de stock</p>
        <div className="row g-3">
          <Campo id="producto" label="Producto" as="select" required className="col-md-5" value={ajuste.producto} onChange={cambiar} error={errores.producto}
            opciones={productos.map((p) => ({ value: p.id, label: `${p.codigo} · ${p.nombre} (stock ${p.stock})` }))} />
          <Campo id="cantidad" label="Cantidad (+ entrada / − salida)" tipo="number" step="1" required className="col-md-3" value={ajuste.cantidad} onChange={cambiar} error={errores.cantidad} ayuda="Ej. -2 por avería" />
          <Campo id="motivo" label="Motivo" required className="col-md-4" value={ajuste.motivo} onChange={cambiar} error={errores.motivo} placeholder="Conteo físico, avería…" />
        </div>
        <div className="mt-3"><button type="submit" className="btn btn-warning"><Icon name="boxes-stacked" /> Aplicar ajuste</button></div>
      </form>

      <div className="d-flex flex-wrap align-items-end gap-3 mb-2">
        <div>
          <label htmlFor="filtro-kardex" className="form-label">Ver movimientos de</label>
          <select id="filtro-kardex" className="form-select" value={filtro} onChange={(e) => setFiltro(e.target.value)}>
            <option value="">Todos los productos</option>
            {productos.map((p) => <option key={p.id} value={p.id}>{p.codigo} · {p.nombre}</option>)}
          </select>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-sm table-bordered table-hover">
          <caption className="visually-hidden">Kardex de inventario</caption>
          <thead className="table-dark"><tr><th scope="col">Fecha</th><th scope="col">Producto</th><th scope="col">Tipo</th><th scope="col" className="text-end">Cantidad</th><th scope="col" className="text-end">Saldo</th><th scope="col">Referencia</th></tr></thead>
          <tbody>
            {kardex.map((m) => (
              <tr key={m.id}>
                <td>{fecha(m.fecha)}</td><td>{m.codigo} · {m.nombre}</td>
                <td><span className={`badge ${COLOR[m.tipo]}`}>{m.tipo}</span></td>
                <td className="text-end">{m.cantidad > 0 ? `+${m.cantidad}` : m.cantidad}</td><td className="text-end">{m.saldo}</td><td>{m.referencia}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
