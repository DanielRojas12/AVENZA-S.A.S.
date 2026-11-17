import { Router } from 'express';
import { pool, transaccion } from '../db.js';
import { crearCrud } from './crudFactory.js';
import { r, REGEX, exigir } from '../validaciones.js';

const reglas = {
  codigo: [r.requerido, r.regex(REGEX.codigo, 'Formato: AAA-XXX (ej. SOU-TER)')],
  nombre: [r.requerido, r.max(120)],
  categoria: [r.requerido, r.enLista(['Pasaporte', 'Souvenir'])],
  precio: [r.requerido, r.numero(0)],
  stock: [r.requerido, r.entero(0)],
  stock_minimo: [r.entero(0)],
};

const router = Router();

// Catálogo público de la tienda: GET /api/productos/catalogo?categoria=Souvenir&q=termo
router.get('/catalogo', async (req, res, next) => {
  try {
    const params = [];
    const filtros = ['activo = TRUE'];
    if (req.query.categoria) { params.push(req.query.categoria); filtros.push(`categoria = $${params.length}`); }
    if (req.query.q) { params.push(`%${req.query.q}%`); filtros.push(`(nombre ILIKE $${params.length} OR descripcion ILIKE $${params.length})`); }
    const { rows } = await pool.query(
      `SELECT id, codigo, nombre, categoria, descripcion, precio, stock, imagen
         FROM productos WHERE ${filtros.join(' AND ')} ORDER BY categoria, nombre`, params);
    res.json(rows);
  } catch (e) { next(e); }
});

// Ajuste manual de inventario: PATCH /api/productos/:id/stock  { cantidad: -3, motivo: 'Avería' }
router.patch('/:id/stock', async (req, res, next) => {
  try {
    exigir(req.body, { cantidad: [r.requerido, (v) => (!Number.isInteger(Number(v)) || Number(v) === 0 ? 'Entero distinto de 0' : null)], motivo: [r.requerido, r.max(60)] });
    const cantidad = Number(req.body.cantidad);
    const producto = await transaccion(async (db) => {
      const { rows } = await db.query('SELECT * FROM productos WHERE id = $1 FOR UPDATE', [req.params.id]);
      if (!rows.length) throw Object.assign(new Error('Producto no encontrado'), { status: 404 });
      const nuevo = rows[0].stock + cantidad;
      if (nuevo < 0) throw Object.assign(new Error(`Stock insuficiente (actual: ${rows[0].stock})`), { status: 409 });
      const upd = await db.query('UPDATE productos SET stock = $1 WHERE id = $2 RETURNING *', [nuevo, req.params.id]);
      await db.query(
        `INSERT INTO inventario_movimientos (producto_id, tipo, cantidad, saldo, referencia) VALUES ($1, 'AJUSTE', $2, $3, $4)`,
        [req.params.id, cantidad, nuevo, req.body.motivo]);
      return upd.rows[0];
    });
    res.json(producto);
  } catch (e) { next(e); }
});

// CRUD estándar (GET, GET/:id, POST, PUT, DELETE)
router.use('/', crearCrud({
  tabla: 'productos',
  campos: ['codigo', 'nombre', 'categoria', 'descripcion', 'precio', 'stock', 'stock_minimo', 'imagen', 'activo'],
  reglas,
  busqueda: ['codigo', 'nombre', 'categoria'],
  orden: 'categoria, nombre',
}));

export default router;
