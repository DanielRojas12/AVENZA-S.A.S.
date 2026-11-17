// =========================================================
//  AVENZA S.A.S. - API REST (Express.js + PostgreSQL/Neon)
// =========================================================
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { pool } from './db.js';
import productos from './routes/productos.js';
import clientes from './routes/clientes.js';
import proveedores from './routes/proveedores.js';
import compras from './routes/compras.js';
import facturas from './routes/facturas.js';
import reportes from './routes/reportes.js';
import pqr from './routes/pqr.js';
import ia from './routes/ia.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*' }));
app.use(express.json({ limit: '200kb' }));

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true, db: 'conectada' });
  } catch (e) {
    res.status(500).json({ ok: false, db: 'sin conexión', error: e.message });
  }
});

app.use('/api/productos', productos);
app.use('/api/clientes', clientes);
app.use('/api/proveedores', proveedores);
app.use('/api/compras', compras);
app.use('/api/facturas', facturas);
app.use('/api/reportes', reportes);
app.use('/api/pqr', pqr);
app.use('/api/ia', ia);

// 404 para rutas de la API inexistentes
app.use((req, res) => res.status(404).json({ error: `Ruta ${req.method} ${req.path} no existe` }));

// Manejador central de errores
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  if (err.errores) return res.status(400).json({ error: 'Datos inválidos', errores: err.errores });
  // Códigos de error de PostgreSQL
  if (err.code === '23505') return res.status(409).json({ error: 'Ya existe un registro con ese valor único', detalle: err.detail });
  if (err.code === '23503') return res.status(409).json({ error: 'El registro está relacionado con otros datos y no se puede eliminar/usar', detalle: err.detail });
  if (err.code === '23514' || err.code === '22P02') return res.status(400).json({ error: 'Valor fuera del rango permitido', detalle: err.message });
  const status = err.status || 500;
  if (status === 500) console.error(err);
  res.status(status).json({ error: status === 500 ? 'Error interno del servidor' : err.message });
});

app.listen(PORT, () => console.log(`API AVENZA escuchando en http://localhost:${PORT}/api`));
