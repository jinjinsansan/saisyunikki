<?php
/**
 * さくらのサーバー データベース接続テスト（完全修正版）
 * MySQL 8.0対応 + SQLシンタックス完全修正
 */

// エラー表示を有効化（テスト用）
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

echo "<h1>🔧 さくらのサーバー データベース接続テスト（完全修正版）</h1>";
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
    
    // 現在時刻の取得（MySQL 8.0対応）
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
    
    // 権限確認（安全な方法で）
    echo "<h3>🔐 権限確認</h3>";
    $permissions = [];
    
    try {
        // SELECT権限のテスト
        $stmt = $pdo->query("SELECT 1 as test");
        $permissions['SELECT'] = true;
        echo "<p style='color: green;'>✅ SELECT権限: OK</p>";
    } catch (PDOException $e) {
        $permissions['SELECT'] = false;
        echo "<p style='color: red;'>❌ SELECT権限: NG - " . $e->getMessage() . "</p>";
    }
    
    try {
        // CREATE権限のテスト（一意なテーブル名を使用）
        $test_table = 'test_' . uniqid();
        $pdo->exec("CREATE TABLE IF NOT EXISTS `$test_table` (id INT PRIMARY KEY, test_data VARCHAR(50))");
        $permissions['CREATE'] = true;
        echo "<p style='color: green;'>✅ CREATE権限: OK</p>";
        
        try {
            // INSERT権限のテスト
            $pdo->exec("INSERT INTO `$test_table` (id, test_data) VALUES (1, 'test')");
            $permissions['INSERT'] = true;
            echo "<p style='color: green;'>✅ INSERT権限: OK</p>";
            
            // UPDATE権限のテスト
            $pdo->exec("UPDATE `$test_table` SET test_data = 'updated' WHERE id = 1");
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
        $pdo->exec("DROP TABLE IF EXISTS `$test_table`");
        $permissions['DROP'] = true;
        echo "<p style='color: green;'>✅ DROP権限: OK</p>";
        
    } catch (PDOException $e) {
        $permissions['CREATE'] = false;
        echo "<p style='color: red;'>❌ CREATE権限: NG - " . $e->getMessage() . "</p>";
    }
    
    // 文字セット確認
    echo "<h3>🔤 文字セット確認</h3>";
    try {
        $stmt = $pdo->query("SELECT @@character_set_database as charset, @@collation_database as collation");
        $charset_info = $stmt->fetch();
        if ($charset_info) {
            echo "<p>データベース文字セット: <strong>" . $charset_info['charset'] . "</strong></p>";
            echo "<p>データベース照合順序: <strong>" . $charset_info['collation'] . "</strong></p>";
        }
    } catch (PDOException $e) {
        echo "<p style='color: orange;'>⚠️ 文字セット情報の取得に失敗: " . $e->getMessage() . "</p>";
    }
    
    // 接続情報の詳細確認
    echo "<h3>🔗 接続詳細情報</h3>";
    try {
        $stmt = $pdo->query("SELECT USER() as current_user, CONNECTION_ID() as connection_id");
        $conn_info = $stmt->fetch();
        if ($conn_info) {
            echo "<p>接続ユーザー: <strong>" . $conn_info['current_user'] . "</strong></p>";
            echo "<p>接続ID: <strong>" . $conn_info['connection_id'] . "</strong></p>";
        }
    } catch (PDOException $e) {
        echo "<p style='color: orange;'>⚠️ 接続情報の取得に失敗: " . $e->getMessage() . "</p>";
    }
    
    echo "<hr>";
    echo "<h2 style='color: green;'>🎉 接続テスト完了！</h2>";
    echo "<p><strong>結果:</strong> データベース接続は正常に動作しています。</p>";
    
    // 権限チェック結果
    $all_permissions_ok = array_reduce($permissions, function($carry, $item) {
        return $carry && $item;
    }, true);
    
    if ($all_permissions_ok) {
        echo "<p style='color: green;'><strong>権限:</strong> 必要な権限がすべて確認できました。✅</p>";
        echo "<p><strong>次のステップ:</strong> テーブル作成（スキーマ実行）に進むことができます。</p>";
    } else {
        echo "<p style='color: orange;'><strong>権限:</strong> 一部の権限で問題があります。以下を確認してください：</p>";
        echo "<ul>";
        foreach ($permissions as $perm => $status) {
            if (!$status) {
                echo "<li style='color: red;'>$perm 権限が不足</li>";
            }
        }
        echo "</ul>";
    }
    
    // 設定ファイル用のコード
    echo "<h3>📝 database.php 用の正しい設定</h3>";
    echo "<pre style='background: #f5f5f5; padding: 15px; border: 1px solid #ddd; border-radius: 5px; font-family: monospace;'>";
    echo htmlspecialchars('<?php
$host = \'mysql3108.db.sakura.ne.jp\';
$dbname = \'blackrabbit685_kanjou_nikki_db\';
$username = \'blackrabbit685_kanjou_nikki_db\';
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
    
    echo "<h3>🚀 次のアクション</h3>";
    echo "<div style='background: #e8f5e8; padding: 15px; border-radius: 5px; border-left: 4px solid #4caf50;'>";
    echo "<ol>";
    echo "<li><strong>✅ 接続確認完了</strong> - データベース接続は正常</li>";
    echo "<li><strong>📝 設定ファイル更新</strong> - 上記のコードでdatabase.phpを更新</li>";
    echo "<li><strong>🗄️ スキーマ実行</strong> - テーブル作成SQLを実行</li>";
    echo "<li><strong>🧪 APIテスト</strong> - エンドポイントの動作確認</li>";
    echo "<li><strong>🚀 本格運用開始</strong> - フロントエンドとの連携</li>";
    echo "</ol>";
    echo "</div>";
    
} catch (PDOException $e) {
    echo "<h2 style='color: red;'>❌ 接続エラー</h2>";
    echo "<p style='color: red;'><strong>エラーメッセージ:</strong> " . $e->getMessage() . "</p>";
    echo "<p style='color: red;'><strong>エラーコード:</strong> " . $e->getCode() . "</p>";
    
    echo "<h3>🔍 詳細トラブルシューティング</h3>";
    echo "<div style='background: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107;'>";
    echo "<ul>";
    echo "<li><strong>認証エラー (1045):</strong> ユーザー名またはパスワードが間違っています</li>";
    echo "<li><strong>データベース不存在 (1049):</strong> データベース名が間違っているか、データベースが作成されていません</li>";
    echo "<li><strong>接続拒否 (2002):</strong> ホスト名が間違っているか、MySQLサーバーが停止しています</li>";
    echo "<li><strong>権限不足 (1044):</strong> ユーザーにデータベースへのアクセス権限がありません</li>";
    echo "</ul>";
    echo "</div>";
    
    echo "<h3>📞 サポート情報</h3>";
    echo "<div style='background: #f8d7da; padding: 15px; border-radius: 5px; border-left: 4px solid #dc3545;'>";
    echo "<p><strong>さくらインターネットサポートに連絡する際の情報:</strong></p>";
    echo "<ul>";
    echo "<li>データベース名: $dbname</li>";
    echo "<li>ユーザー名: $username</li>";
    echo "<li>ホスト名: $host</li>";
    echo "<li>エラーコード: " . $e->getCode() . "</li>";
    echo "<li>エラーメッセージ: " . htmlspecialchars($e->getMessage()) . "</li>";
    echo "</ul>";
    echo "</div>";
}

echo "<hr>";
echo "<p><small>🕒 テスト実行時刻: " . date('Y-m-d H:i:s') . " (JST)</small></p>";
echo "<p><small>🔧 テストバージョン: Ultimate Fix v1.0</small></p>";
?>