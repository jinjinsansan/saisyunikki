<?php
/**
 * さくらのサーバー データベース接続テスト（SQLエラー修正版）
 * 正しい接続情報で更新 + SQLシンタックス修正
 */

// エラー表示を有効化（テスト用）
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

echo "<h1>🔧 さくらのサーバー データベース接続テスト（SQLエラー修正版）</h1>";
echo "<hr>";

// 正しい接続情報
$host = 'mysql3108.db.sakura.ne.jp';
$dbname = 'blackrabbit685_kanjou_nikki_db';
$username = 'blackrabbit685_kanjou_nikki_db';
$password = '040505Aoi';
$port = 3306;

echo "<h2>📋 接続設定情報</h2>";
echo "<table border='1' style='border-collapse: collapse; margin: 10px 0;'>";
echo "<tr><td><strong>ホスト</strong></td><td>$host</td></tr>";
echo "<tr><td><strong>データベース</strong></td><td>$dbname</td></tr>";
echo "<tr><td><strong>ユーザー</strong></td><td>$username</td></tr>";
echo "<tr><td><strong>ポート</strong></td><td>$port</td></tr>";
echo "</table>";

$dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4;port=$port";

$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
];

echo "<h2>🔌 接続テスト実行中...</h2>";

try {
    echo "<p>⏳ データベースに接続中...</p>";
    $pdo = new PDO($dsn, $username, $password, $options);
    
    echo "<p style='color: green; font-size: 18px;'>✅ <strong>データベース接続成功！</strong></p>";
    
    // サーバー情報の取得
    echo "<h3>📊 サーバー情報</h3>";
    $stmt = $pdo->query("SELECT VERSION() as version");
    $version = $stmt->fetch();
    echo "<p>MySQL バージョン: <strong>" . $version['version'] . "</strong></p>";
    
    // 現在時刻の取得（修正版）
    $stmt = $pdo->query("SELECT NOW() as current_time");
    $time = $stmt->fetch();
    echo "<p>サーバー時刻: <strong>" . $time['current_time'] . "</strong></p>";
    
    // データベース確認
    $stmt = $pdo->query("SELECT DATABASE() as current_db");
    $db = $stmt->fetch();
    echo "<p>現在のデータベース: <strong>" . $db['current_db'] . "</strong></p>";
    
    // テーブル一覧の確認
    echo "<h3>📋 既存テーブル確認</h3>";
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll();
    
    if (count($tables) > 0) {
        echo "<p style='color: blue;'>📊 既存のテーブル:</p>";
        echo "<ul>";
        foreach ($tables as $table) {
            $tableName = array_values($table)[0];
            echo "<li><strong>$tableName</strong></li>";
        }
        echo "</ul>";
    } else {
        echo "<p style='color: orange;'>⚠️ テーブルが見つかりません。スキーマの作成が必要です。</p>";
    }
    
    // 権限確認
    echo "<h3>🔐 権限確認</h3>";
    $permissions_ok = true;
    
    try {
        // SELECT権限のテスト
        $stmt = $pdo->query("SELECT 1 as test");
        echo "<p style='color: green;'>✅ SELECT権限: OK</p>";
        
        // CREATE権限のテスト（テストテーブル作成）
        $pdo->exec("CREATE TABLE IF NOT EXISTS connection_test (id INT PRIMARY KEY, test_data VARCHAR(50))");
        echo "<p style='color: green;'>✅ CREATE権限: OK</p>";
        
        // INSERT権限のテスト
        $pdo->exec("INSERT IGNORE INTO connection_test (id, test_data) VALUES (1, 'test')");
        echo "<p style='color: green;'>✅ INSERT権限: OK</p>";
        
        // UPDATE権限のテスト
        $pdo->exec("UPDATE connection_test SET test_data = 'updated' WHERE id = 1");
        echo "<p style='color: green;'>✅ UPDATE権限: OK</p>";
        
        // DELETE権限のテスト
        $pdo->exec("DELETE FROM connection_test WHERE id = 1");
        echo "<p style='color: green;'>✅ DELETE権限: OK</p>";
        
        // テストテーブル削除
        $pdo->exec("DROP TABLE IF EXISTS connection_test");
        echo "<p style='color: green;'>✅ DROP権限: OK</p>";
        
    } catch (PDOException $e) {
        echo "<p style='color: red;'>❌ 権限エラー: " . $e->getMessage() . "</p>";
        $permissions_ok = false;
    }
    
    // 文字セット確認
    echo "<h3>🔤 文字セット確認</h3>";
    try {
        $stmt = $pdo->query("SHOW VARIABLES LIKE 'character_set_database'");
        $charset = $stmt->fetch();
        if ($charset) {
            echo "<p>データベース文字セット: <strong>" . $charset['Value'] . "</strong></p>";
        }
        
        $stmt = $pdo->query("SHOW VARIABLES LIKE 'collation_database'");
        $collation = $stmt->fetch();
        if ($collation) {
            echo "<p>データベース照合順序: <strong>" . $collation['Value'] . "</strong></p>";
        }
    } catch (PDOException $e) {
        echo "<p style='color: orange;'>⚠️ 文字セット情報の取得に失敗: " . $e->getMessage() . "</p>";
    }
    
    echo "<hr>";
    echo "<h2 style='color: green;'>🎉 接続テスト完了！</h2>";
    echo "<p><strong>結果:</strong> データベース接続は正常に動作しています。</p>";
    
    if ($permissions_ok) {
        echo "<p style='color: green;'><strong>権限:</strong> 必要な権限がすべて確認できました。</p>";
        echo "<p><strong>次のステップ:</strong> テーブル作成（スキーマ実行）に進むことができます。</p>";
    } else {
        echo "<p style='color: orange;'><strong>権限:</strong> 一部の権限で問題があります。管理者に確認してください。</p>";
    }
    
    // 設定ファイル用のコード
    echo "<h3>📝 database.php 用の正しい設定</h3>";
    echo "<pre style='background: #f5f5f5; padding: 15px; border: 1px solid #ddd; border-radius: 5px;'>";
    echo htmlspecialchars('$host = \'mysql3108.db.sakura.ne.jp\';
$dbname = \'blackrabbit685_kanjou_nikki_db\';
$username = \'blackrabbit685_kanjou_nikki_db\';
$password = \'040505Aoi\';');
    echo "</pre>";
    
    echo "<h3>🚀 次のアクション</h3>";
    echo "<ol>";
    echo "<li><strong>database.php を更新</strong> - 上記の設定を使用</li>";
    echo "<li><strong>スキーマファイルを実行</strong> - テーブルを作成</li>";
    echo "<li><strong>APIエンドポイントをテスト</strong> - 機能確認</li>";
    echo "</ol>";
    
} catch (PDOException $e) {
    echo "<h2 style='color: red;'>❌ 接続エラー</h2>";
    echo "<p style='color: red;'><strong>エラーメッセージ:</strong> " . $e->getMessage() . "</p>";
    
    echo "<h3>🔍 トラブルシューティング</h3>";
    echo "<ul>";
    echo "<li>さくらのコントロールパネルでデータベース設定を再確認</li>";
    echo "<li>データベース名とユーザー名が同じであることを確認</li>";
    echo "<li>パスワードに特殊文字が含まれていないことを確認</li>";
    echo "<li>データベースが有効になっているか確認</li>";
    echo "</ul>";
}

echo "<hr>";
echo "<p><small>テスト実行時刻: " . date('Y-m-d H:i:s') . "</small></p>";
?>