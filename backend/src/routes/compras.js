// Compras a proveedores: registran entrada de inventario.
import { Router } from 'express';
import { pool, transaccion } from '../db.js';
import { r, exigir } from '../validaciones.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT c.*, p.nombre AS producto, pr.razon_social AS proveedor
        FROM compras c
        JOIN productos p ON p.id = c.producto_id
        JOIN proveedores pr ON pr.id = c.proveedor_id
       ORDER BY c.fecha DESC`);
    res.json(rows);
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    exigir(req.body, {
      proveedor_id: [r.requerido, r.entero(1)],
      producto_id: [r.requerido, r.entero(1)],
      cantidad: [r.requerido, r.entero(1)],
      costo_unitario: [r.requerido, r.numero(0)],
    });
    const { proveedor_id, producto_id } = req.body;
    const cantidad = Number(req.body.cantidad);
    const costo = Number(req.body.costo_unitario);

    const compra = await transaccion(async (db) => {
      const prod = await db.query('UPDATE productos SET stock = stock + $1 WHERE id = $2 RETURNING stock', [cantidad, producto_id]);
      if (!prod.rows.length) throw Object.assign(new Error('Producto no encontrado'), { status: 404 });
      const { rows } = await db.query(
        `INSERT INTO compras (proveedor_id, producto_id, cantidad, costo_unitario, total)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [proveedor_id, producto_id, cantidad, costo, cantidad * costo]);
      await db.query(
        `INSERT INTO inventario_movimientos (producto_id, tipo, cantidad, saldo, referencia)
         VALUES ($1, 'ENTRADA', $2, $3, $4)`,
        [producto_id, cantidad, prod.rows[0].stock, `Compra #${rows[0].id}`]);
      return rows[0];
    });
    res.status(201).json(compra);
  } catch (e) { next(e); }
});

export default router;
