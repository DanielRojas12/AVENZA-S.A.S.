// Consultas e indicadores: ventas, inventario, stock bajo, productos más vendidos y kardex.
import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

router.get('/resumen', async (_req, res, next) => {
  try {
    const [ventas, inventario, stockBajo, top, porDia] = await Promise.all([
      pool.query(`SELECT COUNT(*)::int AS facturas, COALESCE(SUM(total), 0) AS total_ventas,
                         COALESCE(AVG(total), 0) AS ticket_promedio
                    FROM facturas WHERE estado = 'PAGADA'`),
      pool.query(`SELECT COUNT(*)::int AS productos, COALESCE(SUM(stock), 0)::int AS unidades,
                         COALESCE(SUM(stock * precio), 0) AS valor_inventario
                    FROM productos WHERE activo = TRUE`),
      pool.query(`SELECT id, codigo, nombre, stock, stock_minimo FROM productos
                   WHERE activo = TRUE AND stock <= stock_minimo ORDER BY stock`),
      pool.query(`SELECT d.descripcion AS nombre, SUM(d.cantidad)::int AS unidades, SUM(d.subtotal) AS total
                    FROM factura_detalle d JOIN facturas f ON f.id = d.factura_id
                   WHERE f.estado = 'PAGADA'
                   GROUP BY d.descripcion ORDER BY unidades DESC LIMIT 5`),
      pool.query(`SELECT to_char(fecha::date, 'YYYY-MM-DD') AS dia, SUM(total) AS total
                    FROM facturas WHERE estado = 'PAGADA' AND fecha >= NOW() - INTERVAL '30 days'
                   GROUP BY fecha::date ORDER BY fecha::date`),
    ]);
    res.json({
      ventas: ventas.rows[0],
      inventario: inventario.rows[0],
      stock_bajo: stockBajo.rows,
      top_productos: top.rows,
      ventas_por_dia: porDia.rows,
    });
  } catch (e) { next(e); }
});

// Kardex: GET /api/reportes/kardex?producto_id=3
router.get('/kardex', async (req, res, next) => {
  try {
    const params = [];
    let where = '';
    if (req.query.producto_id) { params.push(req.query.producto_id); where = 'WHERE m.producto_id = $1'; }
    const { rows } = await pool.query(`
      SELECT m.*, p.codigo, p.nombre FROM inventario_movimientos m
        JOIN productos p ON p.id = m.producto_id ${where}
       ORDER BY m.fecha DESC, m.id DESC LIMIT 200`, params);
    res.json(rows);
  } catch (e) { next(e); }
});

export default router;
