// Fábrica de rutas CRUD reutilizable (misma idea del CrudModulo del Laboratorio 4,
// pero ahora del lado del servidor y contra PostgreSQL).
import { Router } from 'express';
import { pool } from '../db.js';
import { exigir } from '../validaciones.js';

/**
 * @param {object} cfg
 * @param {string} cfg.tabla       Nombre de la tabla
 * @param {string[]} cfg.campos    Columnas editables (lista blanca: evita inyección SQL)
 * @param {object} cfg.reglas      Reglas de validación por campo
 * @param {string[]} cfg.busqueda  Columnas en las que busca el parámetro ?q=
 * @param {string} cfg.orden       Cláusula ORDER BY
 */
export function crearCrud({ tabla, campos, reglas, busqueda = [], orden = 'id' }) {
  const router = Router();

  // READ (lista) — GET /api/<tabla>?q=texto
  router.get('/', async (req, res, next) => {
    try {
      const params = [];
      let where = '';
      if (req.query.q && busqueda.length) {
        params.push(`%${req.query.q}%`);
        where = 'WHERE ' + busqueda.map((c) => `${c}::text ILIKE $1`).join(' OR ');
      }
      const { rows } = await pool.query(`SELECT * FROM ${tabla} ${where} ORDER BY ${orden}`, params);
      res.json(rows);
    } catch (e) { next(e); }
  });

  // READ (uno) — GET /api/<tabla>/:id
  router.get('/:id', async (req, res, next) => {
    try {
      const { rows } = await pool.query(`SELECT * FROM ${tabla} WHERE id = $1`, [req.params.id]);
      if (!rows.length) return res.status(404).json({ error: 'Registro no encontrado' });
      res.json(rows[0]);
    } catch (e) { next(e); }
  });

  // CREATE — POST /api/<tabla>
  router.post('/', async (req, res, next) => {
    try {
      const datos = limpiar(req.body, campos);
      exigir(datos, reglas);
      const cols = Object.keys(datos);
      const valores = Object.values(datos);
      const marcadores = cols.map((_, i) => `$${i + 1}`).join(', ');
      const { rows } = await pool.query(
        `INSERT INTO ${tabla} (${cols.join(', ')}) VALUES (${marcadores}) RETURNING *`, valores);
      res.status(201).json(rows[0]);
    } catch (e) { next(e); }
  });

  // UPDATE — PUT /api/<tabla>/:id
  router.put('/:id', async (req, res, next) => {
    try {
      const datos = limpiar(req.body, campos);
      exigir(datos, reglas);
      const cols = Object.keys(datos);
      const sets = cols.map((c, i) => `${c} = $${i + 1}`).join(', ');
      const { rows } = await pool.query(
        `UPDATE ${tabla} SET ${sets} WHERE id = $${cols.length + 1} RETURNING *`,
        [...Object.values(datos), req.params.id]);
      if (!rows.length) return res.status(404).json({ error: 'Registro no encontrado' });
      res.json(rows[0]);
    } catch (e) { next(e); }
  });

  // DELETE — DELETE /api/<tabla>/:id
  router.delete('/:id', async (req, res, next) => {
    try {
      const { rowCount } = await pool.query(`DELETE FROM ${tabla} WHERE id = $1`, [req.params.id]);
      if (!rowCount) return res.status(404).json({ error: 'Registro no encontrado' });
      res.json({ ok: true });
    } catch (e) { next(e); }
  });

  return router;
}

/** Deja solo los campos permitidos y recorta espacios. */
function limpiar(body = {}, campos) {
  const datos = {};
  for (const c of campos) {
    if (body[c] !== undefined) datos[c] = typeof body[c] === 'string' ? body[c].trim() : body[c];
  }
  return datos;
}
