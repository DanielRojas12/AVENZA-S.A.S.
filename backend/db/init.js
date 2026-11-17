// Crea las tablas y carga los datos iniciales en la base de datos (Neon o local).
import { readFile } from 'node:fs/promises';
import { pool } from '../src/db.js';

const dir = new URL('.', import.meta.url);

try {
  const schema = await readFile(new URL('schema.sql', dir), 'utf8');
  const seed = await readFile(new URL('seed.sql', dir), 'utf8');
  await pool.query(schema);
  await pool.query(seed);
  console.log('✔ Base de datos creada y poblada correctamente');
} catch (err) {
  console.error('✖ Error inicializando la base de datos:', err.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
