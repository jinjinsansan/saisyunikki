const { Pool } = require('pg');
const path = require('path');

// .env ファイルを明示的に読み込み
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Railway の DATABASE_URL を使用
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 20
});

// 接続エラーハンドリング
pool.on('error', (err) => {
  console.error('データベース接続エラー:', err);
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
    console.error('エラーコード:', error.code);
    throw error;
  }
};

module.exports = { pool, initDatabase };