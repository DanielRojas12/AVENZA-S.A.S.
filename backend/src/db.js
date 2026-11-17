// Conexión a PostgreSQL (Neon) mediante un pool de conexiones.
import 'dotenv/config';
import pg from 'pg';

if (!process.env.DATABASE_URL) {
  console.error('Falta la variable DATABASE_URL en backend/.env');
  process.exit(1);
}

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
});

// Los NUMERIC de PostgreSQL llegan como texto; los convertimos a número.
pg.types.setTypeParser(1700, (valor) => parseFloat(valor));

/** Ejecuta una función dentro de una transacción (BEGIN / COMMIT / ROLLBACK). */
export async function transaccion(fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const resultado = await fn(client);
    await client.query('COMMIT');
    return resultado;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
