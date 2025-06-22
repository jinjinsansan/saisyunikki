<?php
/**
 * さくらのサーバー データベース接続テスト（修正版）
 * パスワードエスケープ対応
 */

// エラー表示を有効化（テスト用）
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

echo "<h1>🔧 さくらのサーバー データベース接続テスト（修正版）</h1>";
echo "<hr>";

// 複数のパスワードパターンでテスト
$test_passwords = [
    '[040505Aoi]',           // 元のパスワード
    '040505Aoi',             // 括弧なし
    '\[040505Aoi\]',         // エスケープ版
    urlencode('[040505Aoi]') // URLエンコード版
];

// データベース設定
$host = 'mysql3108.db.sakura.ne.jp';
$dbname = 'kanjou_nikki_db';
$username = 'blackrabbit685_kanjou_nikki_db';
$port = 3306;

echo "<h2>📋 接続設定情報</h2>";
echo "<table border='1' style='border-collapse: collapse; margin: 10px 0;'>";
echo "<tr><td><strong>ホスト</strong></td><td>$host</td></tr>";
echo "<tr><td><strong>データベース</strong></td><td>$dbname</td></tr>";
echo "<tr><td><strong>ユーザー</strong></td><td>$username</td></tr>";
echo "<tr><td><strong>ポート</strong></td><td>$port</td></tr>";
echo "</table>";

$success = false;
$working_password = null;

echo "<h2>🔌 複数パスワードパターンでテスト中...</h2>";

foreach ($test_passwords as $index => $password) {
    echo "<h3>テスト " . ($index + 1) . ": ";
    
    // パスワード表示（セキュリティのため一部マスク）
    $masked_password = substr($password, 0, 2) . str_repeat('*', strlen($password) - 4) . substr($password, -2);
    echo "パスワード形式: $masked_password</h3>";
    
    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4;port=$port";
    
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
    ];
    
    try {
        echo "<p>⏳ 接続中...</p>";
        $pdo = new PDO($dsn, $username, $password, $options);
        
        echo "<p style='color: green;'>✅ <strong>接続成功！</strong></p>";
        $success = true;
        $working_password = $password;
        
        // サーバー情報の取得
        echo "<h4>📊 サーバー情報</h4>";
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
        
        // テーブル一覧
        echo "<h4>📋 既存テーブル確認</h4>";
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
        echo "<h4>🔐 権限確認</h4>";
        try {
            // SELECT権限
            $stmt = $pdo->query("SELECT 1 as test");
            echo "<p style='color: green;'>✅ SELECT権限: OK</p>";
            
            // CREATE権限（テストテーブル作成）
            $pdo->exec("CREATE TABLE IF NOT EXISTS connection_test (id INT PRIMARY KEY, test_data VARCHAR(50))");
            echo "<p style='color: green;'>✅ CREATE権限: OK</p>";
            
            // INSERT権限
            $pdo->exec("INSERT IGNORE INTO connection_test (id, test_data) VALUES (1, 'test')");
            echo "<p style='color: green;'>✅ INSERT権限: OK</p>";
            
            // UPDATE権限
            $pdo->exec("UPDATE connection_test SET test_data = 'updated' WHERE id = 1");
            echo "<p style='color: green;'>✅ UPDATE権限: OK</p>";
            
            // DELETE権限
            $pdo->exec("DELETE FROM connection_test WHERE id = 1");
            echo "<p style='color: green;'>✅ DELETE権限: OK</p>";
            
            // DROP権限
            $pdo->exec("DROP TABLE IF EXISTS connection_test");
            echo "<p style='color: green;'>✅ DROP権限: OK</p>";
            
        } catch (PDOException $e) {
            echo "<p style='color: red;'>❌ 権限エラー: " . $e->getMessage() . "</p>";
        }
        
        break; // 成功したらループを抜ける
        
    } catch (PDOException $e) {
        echo "<p style='color: red;'>❌ 接続失敗: " . $e->getMessage() . "</p>";
        echo "<hr>";
    }
}

if ($success) {
    echo "<hr>";
    echo "<h2 style='color: green;'>🎉 接続テスト完了！</h2>";
    echo "<p><strong>結果:</strong> データベース接続は正常に動作しています。</p>";
    echo "<p><strong>使用するパスワード:</strong> " . htmlspecialchars($working_password) . "</p>";
    echo "<p><strong>次のステップ:</strong> database.php ファイルを更新してテーブル作成に進んでください。</p>";
    
    // 設定ファイル用のコード生成
    echo "<h3>📝 database.php 用設定</h3>";
    echo "<pre style='background: #f5f5f5; padding: 10px; border: 1px solid #ddd;'>";
    echo htmlspecialchars('$password = \'' . addslashes($working_password) . '\';');
    echo "</pre>";
    
} else {
    echo "<hr>";
    echo "<h2 style='color: red;'>❌ 全ての接続テストが失敗</h2>";
    
    echo "<h3>🔍 次に確認すべき項目</h3>";
    echo "<ol>";
    echo "<li><strong>さくらのコントロールパネルで確認:</strong>";
    echo "<ul>";
    echo "<li>データベースが正しく作成されているか</li>";
    echo "<li>ユーザー名が正確か</li>";
    echo "<li>パスワードが正確か</li>";
    echo "<li>データベースの状態（有効/無効）</li>";
    echo "</ul></li>";
    echo "<li><strong>ネットワーク確認:</strong>";
    echo "<ul>";
    echo "<li>さくらのサーバーからMySQLサーバーへの接続</li>";
    echo "<li>ファイアウォール設定</li>";
    echo "</ul></li>";
    echo "<li><strong>権限確認:</strong>";
    echo "<ul>";
    echo "<li>データベースユーザーの権限設定</li>";
    echo "<li>接続元IPの制限</li>";
    echo "</ul></li>";
    echo "</ol>";
    
    echo "<h3>📞 サポート</h3>";
    echo "<p>さくらインターネットのサポートに以下の情報を伝えてください：</p>";
    echo "<ul>";
    echo "<li>データベース名: $dbname</li>";
    echo "<li>ユーザー名: $username</li>";
    echo "<li>エラー: Access denied (認証エラー)</li>";
    echo "</ul>";
}

echo "<hr>";
echo "<p><small>テスト実行時刻: " . date('Y-m-d H:i:s') . "</small></p>";
?>