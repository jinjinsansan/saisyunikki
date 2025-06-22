<?php
// さくらのサーバー用データベース設定
$host = 'mysql**.db.sakura.ne.jp'; // さくらのサーバーのMySQLホスト
$dbname = 'your_database_name';     // データベース名
$username = 'your_username';        // ユーザー名
$password = 'your_password';        // パスワード

$dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";

$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

// JWT秘密鍵（本番環境では環境変数から取得）
define('JWT_SECRET', 'your-jwt-secret-key-change-this-in-production');

try {
    $pdo = new PDO($dsn, $username, $password, $options);
} catch (PDOException $e) {
    error_log('Database connection failed: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}
?>