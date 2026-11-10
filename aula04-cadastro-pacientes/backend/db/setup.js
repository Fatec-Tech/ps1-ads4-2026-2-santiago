require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

async function setup() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pacientes (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        cpf VARCHAR(14) UNIQUE NOT NULL,
        email VARCHAR(100),
        telefone VARCHAR(20),
        data_nascimento DATE
      );
    `);

    await pool.query(`
      INSERT INTO pacientes (nome, cpf, email, telefone, data_nascimento)
      VALUES
        ('Maria Silva', '111.111.111-11', 'maria@email.com', '(14) 99999-0001', '1990-05-10'),
        ('João Souza', '222.222.222-22', 'joao@email.com', '(14) 99999-0002', '1985-08-20')
      ON CONFLICT (cpf) DO NOTHING;
    `);

    console.log('Tabela "pacientes" pronta.');
  } catch (err) {
    console.error('Erro ao criar tabela:', err.message);
  } finally {
    await pool.end();
  }
}

setup();