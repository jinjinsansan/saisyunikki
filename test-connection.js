// Railway 接続テスト用スクリプト
const { Pool } = require('pg');

// .env ファイルから DATABASE_URL を読み込み
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function testConnection() {
  try {
    console.log('Railway データベースに接続中...');
    
    const client = await pool.connect();
    console.log('✅ 接続成功！');
    
    // テストクエリ実行
    const result = await client.query('SELECT NOW()');
    console.log('📅 現在時刻:', result.rows[0].now);
    
    client.release();
    console.log('🎉 Railway データベース接続テスト完了');
    
  } catch (error) {
    console.error('❌ 接続エラー:', error.message);
    console.log('\n🔧 トラブルシューティング:');
    console.log('1. DATABASE_URL が正しく設定されているか確認');
    console.log('2. Railway でデータベースが起動しているか確認');
    console.log('3. ネットワーク接続を確認');
  } finally {
    await pool.end();
  }
}

testConnection();