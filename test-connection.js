// Railway 接続テスト用スクリプト
const { Pool } = require('pg');
const path = require('path');

// .env ファイルから DATABASE_URL を読み込み
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000
});

async function testConnection() {
  try {
    console.log('🔧 設定確認:');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? '設定済み' : '未設定');
    console.log('');
    
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
    console.error('エラーコード:', error.code);
    console.log('\n🔧 トラブルシューティング:');
    console.log('1. DATABASE_URL が正しく設定されているか確認');
    console.log('2. Railway でデータベースが起動しているか確認');
    console.log('3. ネットワーク接続を確認');
    console.log('4. ファイアウォールの設定を確認');
    console.log('5. Railway のデータベースステータスを確認');
  } finally {
    await pool.end();
  }
}

testConnection();