const { Pool } = require('pg');

// Railway の DATABASE_URL を使用
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// テーブル作成
const initDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        line_username VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS diary_entries (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        date DATE NOT NULL,
        emotion VARCHAR(100) NOT NULL,
        event TEXT NOT NULL,
        realization TEXT NOT NULL,
        self_esteem_score INTEGER DEFAULT 50,
        worthlessness_score INTEGER DEFAULT 50,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('データベース初期化完了');
  } catch (error) {
    console.error('データベース初期化エラー:', error);
  }
};

module.exports = { pool, initDatabase };