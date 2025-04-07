const { Pool } = require('pg');
require('dotenv').config();

// Configuración manual - Usa estos valores directamente sin depender de variables de entorno
const pool = new Pool({
  host: '192.168.1.146',
  user: 'postgres',
  password: 'daniela3005.',
  database: 'HappyFaces', 
  port: 5432
});

// Función para ejecutar consultas
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Error executing query', { text, error });
    throw error;
  }
};

// Probar la conexión al iniciar
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error connecting to database:', err.stack);
  }
  console.log('Successfully connected to PostgreSQL database');
  console.log('Base de datos conectada:', pool.options.database);
  release();
});

module.exports = {
  query,
  pool
};