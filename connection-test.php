<?php
/**
 * さくらのサーバー データベース接続テスト（正しい接続情報版）
 * 提供された情報に基づく正確なテスト
 */

// エラー表示を有効化（テスト用）
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

echo "<h1>🔧 さくらのサーバー データベース接続テスト（正しい接続情報版）</h1>";
echo "<hr>";

// 正しい接続情報（あなたが提供した情報通り）
$host = 'mysql3108.db.sakura.ne.jp';
$dbname = 'blackrabbit685_kanjou_nikki_db';  // 正しいデータベース名
$username = 'blackrabbit685';                // 正しいユーザー名
$password = '040505Aoi';                     // 正しいパスワード（括弧なし）
$port = 3306;

echo "<h2>📋 接続設定情報（正しい情報）</h2>";
echo "<table border='1' style='border-collapse: collapse; margin: 10px 0;'>";
echo "<tr><td><strong>ホスト</strong></td><td>$host</td></tr>";
echo "<tr><td><strong>データベース</strong></td><td>$dbname</td></tr>";
echo "<tr><td><strong>ユーザー</strong></td><td>$username</td></tr>";
echo "<tr><td><strong>パスワード</strong></td><td>040505Aoi</td></tr>";
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
    
    echo "<p style='color: green; font-size: 20px;'>✅ <strong>データベース接続成功！</strong></p>";
    
    // サーバー情報の取得
    echo "<h3>📊 サーバー情報</h3>";
    $stmt = $pdo->query("SELECT VERSION() as version");
    $version = $stmt->fetch();
    echo "<p>MySQL バージョン: <strong>" . $version['version'] . "</strong></p>";
    
    // 現在時刻の取得
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
        echo "<p style='color: blue;'>📊 既存のテーブル (" . count($tables) . "個):</p>";
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
    $permissions = [];
    
    try {
        // SELECT権限のテスト
        $stmt = $pdo->query("SELECT 1 as test_value");
        $result = $stmt->fetch();
        if ($result && $result['test_value'] == 1) {
            $permissions['SELECT'] = true;
            echo "<p style='color: green;'>✅ SELECT権限: OK</p>";
        }
    } catch (PDOException $e) {
        $permissions['SELECT'] = false;
        echo "<p style='color: red;'>❌ SELECT権限: NG - " . $e->getMessage() . "</p>";
    }
    
    try {
        // CREATE権限のテスト
        $timestamp = date('YmdHis');
        $random = mt_rand(1000, 9999);
        $test_table = "test_table_{$timestamp}_{$random}";
        
        $pdo->exec("CREATE TABLE `$test_table` (
            id INT AUTO_INCREMENT PRIMARY KEY, 
            test_data VARCHAR(50) DEFAULT 'test',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");
        $permissions['CREATE'] = true;
        echo "<p style='color: green;'>✅ CREATE権限: OK</p>";
        
        try {
            // INSERT権限のテスト
            $pdo->exec("INSERT INTO `$test_table` (test_data) VALUES ('insert_test')");
            $permissions['INSERT'] = true;
            echo "<p style='color: green;'>✅ INSERT権限: OK</p>";
            
            // UPDATE権限のテスト
            $pdo->exec("UPDATE `$test_table` SET test_data = 'updated_test' WHERE id = 1");
            $permissions['UPDATE'] = true;
            echo "<p style='color: green;'>✅ UPDATE権限: OK</p>";
            
            // DELETE権限のテスト
            $pdo->exec("DELETE FROM `$test_table` WHERE id = 1");
            $permissions['DELETE'] = true;
            echo "<p style='color: green;'>✅ DELETE権限: OK</p>";
            
        } catch (PDOException $e) {
            echo "<p style='color: red;'>❌ INSERT/UPDATE/DELETE権限エラー: " . $e->getMessage() . "</p>";
        }
        
        // テストテーブル削除
        $pdo->exec("DROP TABLE `$test_table`");
        $permissions['DROP'] = true;
        echo "<p style='color: green;'>✅ DROP権限: OK</p>";
        
    } catch (PDOException $e) {
        $permissions['CREATE'] = false;
        echo "<p style='color: red;'>❌ CREATE権限: NG - " . $e->getMessage() . "</p>";
    }
    
    echo "<hr>";
    echo "<h2 style='color: green;'>🎉 接続テスト完了！</h2>";
    echo "<p><strong>結果:</strong> データベース接続は正常に動作しています。</p>";
    
    // 権限チェック結果
    $all_permissions_ok = true;
    foreach ($permissions as $perm => $status) {
        if (!$status) {
            $all_permissions_ok = false;
            break;
        }
    }
    
    if ($all_permissions_ok) {
        echo "<div style='background: #d4edda; padding: 15px; border-radius: 5px; border-left: 4px solid #28a745; margin: 15px 0;'>";
        echo "<h3 style='color: #155724; margin-top: 0;'>✅ 全ての権限確認完了</h3>";
        echo "<p style='color: #155724; margin-bottom: 0;'>必要な権限がすべて確認できました。テーブル作成に進むことができます。</p>";
        echo "</div>";
    }
    
    // 設定ファイル用のコード
    echo "<h3>📝 database.php 用の正しい設定</h3>";
    echo "<pre style='background: #f8f9fa; padding: 15px; border: 1px solid #dee2e6; border-radius: 5px; font-family: monospace;'>";
    echo htmlspecialchars('<?php
// さくらのサーバー用データベース設定（正しい接続情報）
$host = \'mysql3108.db.sakura.ne.jp\';
$dbname = \'blackrabbit685_kanjou_nikki_db\';
$username = \'blackrabbit685\';
$password = \'040505Aoi\';
$port = 3306;

$dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4;port=$port";

$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
];

try {
    $pdo = new PDO($dsn, $username, $password, $options);
} catch (PDOException $e) {
    error_log(\'Database connection failed: \' . $e->getMessage());
    die(\'Database connection failed\');
}
?>');
    echo "</pre>";
    
} catch (PDOException $e) {
    echo "<h2 style='color: red;'>❌ 接続エラー</h2>";
    echo "<div style='background: #f8d7da; padding: 15px; border-radius: 5px; border-left: 4px solid #dc3545;'>";
    echo "<p style='color: #721c24;'><strong>エラーメッセージ:</strong> " . htmlspecialchars($e->getMessage()) . "</p>";
    echo "<p style='color: #721c24;'><strong>エラーコード:</strong> " . $e->getCode() . "</p>";
    echo "</div>";
    
    echo "<h3>🔍 詳細トラブルシューティング</h3>";
    echo "<div style='background: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107;'>";
    echo "<ul style='color: #856404;'>";
    echo "<li><strong>認証エラー (1045):</strong> ユーザー名またはパスワードが間違っています</li>";
    echo "<li><strong>データベース不存在 (1049):</strong> データベース名が間違っているか、データベースが作成されていません</li>";
    echo "<li><strong>接続拒否 (2002):</strong> ホスト名が間違っているか、MySQLサーバーが停止しています</li>";
    echo "<li><strong>権限不足 (1044):</strong> ユーザーにデータベースへのアクセス権限がありません</li>";
    echo "</ul>";
    echo "</div>";
}

echo "<hr>";
echo "<p><small>🕒 テスト実行時刻: " . date('Y-m-d H:i:s') . " (JST)</small></p>";
echo "<p><small>🔧 正しい接続情報版 - あなたが提供した情報通り</small></p>";
?>