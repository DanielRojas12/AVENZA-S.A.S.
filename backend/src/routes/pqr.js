// Peticiones, Quejas, Reclamos y Sugerencias.
import { Router } from 'express';
import { pool } from '../db.js';
import { r, REGEX, exigir } from '../validaciones.js';

const router = Router();
const TIPOS = ['Petición', 'Queja', 'Reclamo', 'Sugerencia'];
const ESTADOS = ['RADICADA', 'EN TRÁMITE', 'RESUELTA'];

router.post('/', async (req, res, next) => {
  try {
    const b = req.body;
    exigir(b, {
      tipo: [r.requerido, r.enLista(TIPOS)],
      nombre: [r.requerido, r.regex(REGEX.nombre, 'Solo letras y espacios (3 a 80)')],
      documento: [r.requerido, r.regex(REGEX.documento, 'Documento: 6 a 10 dígitos')],
      email: [r.requerido, r.regex(REGEX.email, 'Correo electrónico inválido')],
      celular: [r.requerido, r.regex(REGEX.celular, 'Celular colombiano de 10 dígitos que inicia en 3')],
      asunto: [r.requerido, r.max(120)],
      mensaje: [r.requerido, (v) => (String(v).trim().length < 20 ? 'Describa su solicitud (mínimo 20 caracteres)' : null), r.max(2000)],
      acepta_politica: [(v) => (v !== true ? 'Debe aceptar la política de tratamiento de datos' : null)],
    });
    const { rows } = await pool.query(`
      INSERT INTO pqr (tipo, nombre, documento, email, celular, asunto, mensaje)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, fecha`,
      [b.tipo, b.nombre.trim(), b.documento, b.email.trim(), b.celular, b.asunto.trim(), b.mensaje.trim()]);
    const radicado = `PQR-${new Date(rows[0].fecha).getFullYear()}-${String(rows[0].id).padStart(6, '0')}`;
    await pool.query('UPDATE pqr SET radicado = $1 WHERE id = $2', [radicado, rows[0].id]);
    res.status(201).json({ id: rows[0].id, radicado, fecha: rows[0].fecha });
  } catch (e) { next(e); }
});

// Consulta pública del estado por número de radicado
router.get('/radicado/:radicado', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT radicado, tipo, asunto, estado, respuesta, fecha FROM pqr WHERE radicado = $1', [req.params.radicado.toUpperCase()]);
    if (!rows.length) return res.status(404).json({ error: 'No existe una PQR con ese radicado' });
    res.json(rows[0]);
  } catch (e) { next(e); }
});

// Administración
router.get('/', async (_req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM pqr ORDER BY fecha DESC');
    res.json(rows);
  } catch (e) { next(e); }
});

router.patch('/:id', async (req, res, next) => {
  try {
    exigir(req.body, { estado: [r.requerido, r.enLista(ESTADOS)], respuesta: [r.max(2000)] });
    const { rows } = await pool.query(
      'UPDATE pqr SET estado = $1, respuesta = $2 WHERE id = $3 RETURNING *',
      [req.body.estado, (req.body.respuesta || '').trim(), req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'PQR no encontrada' });
    res.json(rows[0]);
  } catch (e) { next(e); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM pqr WHERE id = $1', [req.params.id]);
    if (!rowCount) return res.status(404).json({ error: 'PQR no encontrada' });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

export default router;
