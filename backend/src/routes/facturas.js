// Facturación: checkout de la tienda (pasarela ficticia) y administración de facturas.
import { Router } from 'express';
import { pool, transaccion } from '../db.js';
import { r, REGEX, exigir, ErrorValidacion } from '../validaciones.js';

export const IVA = 0.19;
const router = Router();

// Lista de facturas: GET /api/facturas?desde=2026-11-01&hasta=2026-11-30
router.get('/', async (req, res, next) => {
  try {
    const params = [];
    const filtros = [];
    if (req.query.desde) { params.push(req.query.desde); filtros.push(`f.fecha >= $${params.length}::date`); }
    if (req.query.hasta) { params.push(req.query.hasta); filtros.push(`f.fecha < ($${params.length}::date + 1)`); }
    const where = filtros.length ? 'WHERE ' + filtros.join(' AND ') : '';
    const { rows } = await pool.query(`
      SELECT f.*, c.nombres AS cliente, c.documento
        FROM facturas f JOIN clientes c ON c.id = f.cliente_id
        ${where}
       ORDER BY f.fecha DESC`, params);
    res.json(rows);
  } catch (e) { next(e); }
});

// Detalle de una factura: GET /api/facturas/:id
router.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT f.*, c.nombres, c.documento, c.email, c.celular, c.direccion
        FROM facturas f JOIN clientes c ON c.id = f.cliente_id WHERE f.id = $1`, [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Factura no encontrada' });
    const det = await pool.query('SELECT * FROM factura_detalle WHERE factura_id = $1 ORDER BY id', [req.params.id]);
    res.json({ ...rows[0], items: det.rows });
  } catch (e) { next(e); }
});

/**
 * Checkout: POST /api/facturas
 * {
 *   cliente: { documento, nombres, email, celular, direccion },
 *   items:   [ { producto_id, cantidad } ],
 *   pago:    { metodo: 'TARJETA'|'PSE'|'NEQUI', referencia }
 * }
 * Los precios se toman SIEMPRE de la base de datos (no del navegador).
 */
router.post('/', async (req, res, next) => {
  try {
    const { cliente = {}, items = [], pago = {} } = req.body;
    exigir(cliente, {
      documento: [r.requerido, r.regex(REGEX.documento, 'Documento: 6 a 10 dígitos')],
      nombres: [r.requerido, r.regex(REGEX.nombre, 'Solo letras y espacios')],
      email: [r.requerido, r.regex(REGEX.email, 'Correo electrónico inválido')],
      celular: [r.requerido, r.regex(REGEX.celular, 'Celular colombiano inválido')],
    });
    exigir(pago, { metodo: [r.requerido, r.enLista(['TARJETA', 'PSE', 'NEQUI'])], referencia: [r.requerido, r.max(40)] });
    if (!Array.isArray(items) || !items.length) throw new ErrorValidacion({ items: 'El carrito está vacío' });
    if (items.some((i) => !Number.isInteger(Number(i.cantidad)) || Number(i.cantidad) < 1)) {
      throw new ErrorValidacion({ items: 'Cantidades inválidas' });
    }

    const factura = await transaccion(async (db) => {
      // 1. Cliente: se crea o se actualiza por número de documento
      const cli = await db.query(`
        INSERT INTO clientes (documento, nombres, email, celular, direccion)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (documento) DO UPDATE
          SET nombres = EXCLUDED.nombres, email = EXCLUDED.email,
              celular = EXCLUDED.celular, direccion = EXCLUDED.direccion
        RETURNING id`,
        [cliente.documento, cliente.nombres.trim(), cliente.email.trim(), cliente.celular, (cliente.direccion || '').trim()]);

      // 2. Bloquea los productos y verifica stock
      const ids = items.map((i) => Number(i.producto_id));
      const { rows: productos } = await db.query(
        'SELECT * FROM productos WHERE id = ANY($1::int[]) AND activo = TRUE FOR UPDATE', [ids]);
      let subtotal = 0;
      const lineas = items.map((it) => {
        const p = productos.find((x) => x.id === Number(it.producto_id));
        if (!p) throw Object.assign(new Error(`Producto ${it.producto_id} no disponible`), { status: 409 });
        const cant = Number(it.cantidad);
        if (p.stock < cant) throw Object.assign(new Error(`Stock insuficiente para "${p.nombre}" (disponible: ${p.stock})`), { status: 409 });
        const sub = +(p.precio * cant).toFixed(2);
        subtotal += sub;
        return { p, cant, sub };
      });
      const iva = +(subtotal * IVA).toFixed(2);
      const total = +(subtotal + iva).toFixed(2);

      // 3. Encabezado de factura con número consecutivo
      const fac = await db.query(`
        INSERT INTO facturas (cliente_id, subtotal, iva, total, metodo_pago, referencia_pago)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [cli.rows[0].id, subtotal, iva, total, pago.metodo, pago.referencia]);
      const id = fac.rows[0].id;
      const numero = 'AVZ-' + String(id).padStart(6, '0');
      await db.query('UPDATE facturas SET numero = $1 WHERE id = $2', [numero, id]);

      // 4. Detalle + descuento de stock + kardex
      for (const { p, cant, sub } of lineas) {
        await db.query(`
          INSERT INTO factura_detalle (factura_id, producto_id, descripcion, cantidad, precio_unitario, subtotal)
          VALUES ($1, $2, $3, $4, $5, $6)`, [id, p.id, p.nombre, cant, p.precio, sub]);
        const nuevo = p.stock - cant;
        await db.query('UPDATE productos SET stock = $1 WHERE id = $2', [nuevo, p.id]);
        await db.query(`
          INSERT INTO inventario_movimientos (producto_id, tipo, cantidad, saldo, referencia)
          VALUES ($1, 'SALIDA', $2, $3, $4)`, [p.id, -cant, nuevo, `Factura ${numero}`]);
      }
      return id;
    });

    // Devuelve la factura completa
    const { rows } = await pool.query(`
      SELECT f.*, c.nombres, c.documento, c.email, c.celular, c.direccion
        FROM facturas f JOIN clientes c ON c.id = f.cliente_id WHERE f.id = $1`, [factura]);
    const det = await pool.query('SELECT * FROM factura_detalle WHERE factura_id = $1 ORDER BY id', [factura]);
    res.status(201).json({ ...rows[0], items: det.rows });
  } catch (e) { next(e); }
});

// Anular factura: devuelve las unidades al inventario. PATCH /api/facturas/:id/anular
router.patch('/:id/anular', async (req, res, next) => {
  try {
    const resultado = await transaccion(async (db) => {
      const { rows } = await db.query('SELECT * FROM facturas WHERE id = $1 FOR UPDATE', [req.params.id]);
      if (!rows.length) throw Object.assign(new Error('Factura no encontrada'), { status: 404 });
      if (rows[0].estado === 'ANULADA') throw Object.assign(new Error('La factura ya está anulada'), { status: 409 });
      const det = await db.query('SELECT * FROM factura_detalle WHERE factura_id = $1', [req.params.id]);
      for (const d of det.rows) {
        const upd = await db.query('UPDATE productos SET stock = stock + $1 WHERE id = $2 RETURNING stock', [d.cantidad, d.producto_id]);
        await db.query(`
          INSERT INTO inventario_movimientos (producto_id, tipo, cantidad, saldo, referencia)
          VALUES ($1, 'ANULACION', $2, $3, $4)`, [d.producto_id, d.cantidad, upd.rows[0].stock, `Anulación ${rows[0].numero}`]);
      }
      const upd = await db.query(`UPDATE facturas SET estado = 'ANULADA' WHERE id = $1 RETURNING *`, [req.params.id]);
      return upd.rows[0];
    });
    res.json(resultado);
  } catch (e) { next(e); }
});

export default router;
