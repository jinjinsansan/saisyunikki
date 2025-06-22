// さくらのサーバー 接続テスト用スクリプト
const mysql = require('mysql2/promise');
const path = require('path');

// .env ファイルから設定を読み込み
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

async function testSakuraConnection() {
  try {
    console.log('🔧 設定確認:');
    console.log('DB_HOST:', process.env.DB_HOST || '未設定');
    console.log('DB_USER:', process.env.DB_USER || '未設定');
    console.log('DB_NAME:', process.env.DB_NAME || '未設定');
    console.log('');
    
    console.log('さくらのサーバー データベースに接続中...');
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306
    });
    
    console.log('✅ 接続成功！');
    
    // テストクエリ実行
    const [rows] = await connection.execute('SELECT NOW() as current_time');
    console.log('📅 現在時刻:', rows[0].current_time);
    
    await connection.end();
    console.log('🎉 さくらのサーバー データベース接続テスト完了');
    
  } catch (error) {
    console.error('❌ 接続エラー:', error.message);
    console.error('エラーコード:', error.code);
    console.log('\n🔧 トラブルシューティング:');
    console.log('1. さくらのサーバーでデータベースが作成されているか確認');
    console.log('2. データベースのホスト名、ユーザー名、パスワードが正しいか確認');
    console.log('3. データベースへのアクセス権限があるか確認');
    console.log('4. .env ファイルの設定を確認');
  }
}

testSakuraConnection();