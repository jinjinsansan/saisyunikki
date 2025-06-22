const mysql = require('mysql2/promise');
const path = require('path');

// .env ファイルを明示的に読み込み
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// さくらのサーバー用 MySQL 接続設定
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mysql123.db.sakura.ne.jp', // さくらのDBホスト名
  user: process.env.DB_USER || 'your_username',
  password: process.env.DB_PASSWORD || 'your_password',
  database: process.env.DB_NAME || 'your_database',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: false // さくらのサーバーは通常SSL不要
});

// テーブル作成
const initDatabase = async () => {
  try {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        line_username VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS diary_entries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        date DATE NOT NULL,
        emotion VARCHAR(100) NOT NULL,
        event TEXT NOT NULL,
        realization TEXT NOT NULL,
        self_esteem_score INT DEFAULT 50,
        worthlessness_score INT DEFAULT 50,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    console.log('さくらのサーバー データベース初期化完了');
  } catch (error) {
    console.error('データベース初期化エラー:', error);
    throw error;
  }
};

module.exports = { pool, initDatabase };