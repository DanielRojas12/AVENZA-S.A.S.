// Definición de campos y columnas de cada módulo CRUD (constantes estables).
import { moneda } from '../../helpers/formato';

export const CAMPOS_PRODUCTO = [
  { name: 'codigo', label: 'Código', required: true, placeholder: 'SOU-TER', reglas: { requerido: true, regex: 'codigo' }, ayuda: 'AAA-XXX en mayúsculas' },
  { name: 'nombre', label: 'Nombre', required: true, reglas: { requerido: true, maxLength: 120 }, col: 'col-md-8' },
  { name: 'categoria', label: 'Categoría', as: 'select', options: ['Pasaporte', 'Souvenir'], required: true, reglas: { requerido: true } },
  { name: 'precio', label: 'Precio (COP)', type: 'number', min: 0, step: 100, required: true, reglas: { requerido: true, min: 0 } },
  { name: 'stock', label: 'Stock', type: 'number', min: 0, step: 1, required: true, reglas: { requerido: true, min: 0, entero: true } },
  { name: 'stock_minimo', label: 'Stock mínimo', type: 'number', min: 0, step: 1, default: 5, reglas: { min: 0, entero: true }, ayuda: 'Genera alerta de reposición' },
  { name: 'imagen', label: 'URL de la imagen', default: '/img/productos/generico.svg', reglas: { regex: 'url' }, col: 'col-md-8' },
  { name: 'activo', label: 'Visible en la tienda', type: 'checkbox', default: true },
  { name: 'descripcion', label: 'Descripción', as: 'textarea', reglas: { maxLength: 500 }, col: 'col-12' },
];
export const COLUMNAS_PRODUCTO = [
  { name: 'codigo', label: 'Código' },
  { name: 'nombre', label: 'Nombre' },
  { name: 'categoria', label: 'Categoría' },
  { name: 'precio', label: 'Precio', render: (r) => moneda(r.precio) },
  { name: 'stock', label: 'Stock', render: (r) => <span className={r.stock <= r.stock_minimo ? 'badge text-bg-danger' : ''}>{r.stock}</span> },
  { name: 'activo', label: 'Estado', render: (r) => (r.activo ? 'Activo' : 'Oculto') },
];

export const CAMPOS_CLIENTE = [
  { name: 'documento', label: 'Documento', required: true, inputMode: 'numeric', reglas: { requerido: true, regex: 'documento' } },
  { name: 'nombres', label: 'Nombre completo', required: true, reglas: { requerido: true, regex: 'nombre' }, col: 'col-md-8' },
  { name: 'email', label: 'Correo', type: 'email', required: true, reglas: { requerido: true, regex: 'email' } },
  { name: 'celular', label: 'Celular', type: 'tel', required: true, inputMode: 'numeric', reglas: { requerido: true, regex: 'celular' } },
  { name: 'direccion', label: 'Dirección', reglas: { maxLength: 150 } },
];
export const COLUMNAS_CLIENTE = [
  { name: 'documento', label: 'Documento' },
  { name: 'nombres', label: 'Nombre' },
  { name: 'email', label: 'Correo' },
  { name: 'celular', label: 'Celular' },
];

export const CAMPOS_PROVEEDOR = [
  { name: 'nit', label: 'NIT', required: true, placeholder: '900123456-1', reglas: { requerido: true, regex: 'nit' } },
  { name: 'razon_social', label: 'Razón social', required: true, reglas: { requerido: true, maxLength: 120 }, col: 'col-md-8' },
  { name: 'contacto', label: 'Persona de contacto', required: true, reglas: { requerido: true, regex: 'nombre' } },
  { name: 'email', label: 'Correo', type: 'email', required: true, reglas: { requerido: true, regex: 'email' } },
  { name: 'celular', label: 'Celular', type: 'tel', required: true, inputMode: 'numeric', reglas: { requerido: true, regex: 'celular' } },
  { name: 'ciudad', label: 'Ciudad', required: true, reglas: { requerido: true, maxLength: 60 } },
];
export const COLUMNAS_PROVEEDOR = [
  { name: 'nit', label: 'NIT' },
  { name: 'razon_social', label: 'Razón social' },
  { name: 'contacto', label: 'Contacto' },
  { name: 'celular', label: 'Celular' },
  { name: 'ciudad', label: 'Ciudad' },
];
