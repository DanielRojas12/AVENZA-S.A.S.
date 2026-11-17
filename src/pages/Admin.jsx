// Panel administrativo (HU-11): CRUD, stock, inventario, facturación y PQR sobre Express + Neon.
import { useState } from 'react';
import CrudModulo from '../components/admin/CrudModulo';
import PanelResumen from '../components/admin/PanelResumen';
import PanelCompras from '../components/admin/PanelCompras';
import PanelFacturas from '../components/admin/PanelFacturas';
import PanelInventario from '../components/admin/PanelInventario';
import PanelPQR from '../components/admin/PanelPQR';
import Icon from '../components/Icon';
import { api } from '../helpers/api';
import {
  CAMPOS_PRODUCTO, COLUMNAS_PRODUCTO, CAMPOS_CLIENTE, COLUMNAS_CLIENTE, CAMPOS_PROVEEDOR, COLUMNAS_PROVEEDOR,
} from '../components/admin/configuracion';

const PESTANAS = [
  { id: 'resumen', texto: 'Resumen', icono: 'chart-line', render: () => <PanelResumen /> },
  { id: 'productos', texto: 'Productos', icono: 'store', render: () => <CrudModulo titulo="Gestión de productos" singular="Producto" api={api} endpoint="/productos" campos={CAMPOS_PRODUCTO} columnas={COLUMNAS_PRODUCTO} /> },
  { id: 'clientes', texto: 'Clientes', icono: 'users', render: () => <CrudModulo titulo="Gestión de clientes" singular="Cliente" api={api} endpoint="/clientes" campos={CAMPOS_CLIENTE} columnas={COLUMNAS_CLIENTE} /> },
  { id: 'proveedores', texto: 'Proveedores', icono: 'truck', render: () => <CrudModulo titulo="Gestión de proveedores" singular="Proveedor" api={api} endpoint="/proveedores" campos={CAMPOS_PROVEEDOR} columnas={COLUMNAS_PROVEEDOR} /> },
  { id: 'compras', texto: 'Compras', icono: 'bag-shopping', render: () => <PanelCompras /> },
  { id: 'facturas', texto: 'Facturación', icono: 'file-invoice', render: () => <PanelFacturas /> },
  { id: 'inventario', texto: 'Inventario', icono: 'boxes-stacked', render: () => <PanelInventario /> },
  { id: 'pqr', texto: 'PQR', icono: 'comments', render: () => <PanelPQR /> },
];

export default function Admin() {
  const [activa, setActiva] = useState('resumen');
  const pestana = PESTANAS.find((p) => p.id === activa);

  const teclado = (e, i) => {
    let j = null;
    if (e.key === 'ArrowRight') j = (i + 1) % PESTANAS.length;
    if (e.key === 'ArrowLeft') j = (i - 1 + PESTANAS.length) % PESTANAS.length;
    if (j !== null) { setActiva(PESTANAS[j].id); document.getElementById(`tab-${PESTANAS[j].id}`)?.focus(); }
  };

  return (
    <div className="container py-4">
      <h1 className="fw-bold text-avenza"><Icon name="user-gear" /> Panel administrativo</h1>
      <p className="mb-3">Operaciones sobre la base de datos PostgreSQL (Neon) a través de la API de Express.js.</p>
      <div className="alert alert-warning small" role="note">
        Entorno académico: en producción este panel debe protegerse con autenticación y roles.
      </div>
      <div className="nav nav-pills flex-wrap gap-1 mb-4 pestanas-admin" role="tablist" aria-label="Módulos administrativos">
        {PESTANAS.map((p, i) => (
          <button key={p.id} id={`tab-${p.id}`} type="button" role="tab" aria-selected={activa === p.id} aria-controls="panel-admin"
            tabIndex={activa === p.id ? 0 : -1} className={`nav-link ${activa === p.id ? 'active' : ''}`}
            onClick={() => setActiva(p.id)} onKeyDown={(e) => teclado(e, i)}>
            <Icon name={p.icono} /> {p.texto}
          </button>
        ))}
      </div>
      <div id="panel-admin" role="tabpanel" aria-labelledby={`tab-${activa}`} tabIndex={0}>
        <div key={activa}>{pestana.render()}</div>
      </div>
    </div>
  );
}
