<?php
// さくらのサーバー用データベース設定
// ✅ さくらのサーバー情報で更新済み

// 🔧 さくらのサーバー情報
$host = 'mysql3108.db.sakura.ne.jp';
$dbname = 'blackrabbit685_kanjou_nikki_db';
$username = 'blackrabbit685_kanjou_nikki_db';
$password = '040505Aoi';

// データベース接続設定
$dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4;port=3306";

$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
];

// JWT秘密鍵（本番環境では強力なキーに変更）
define('JWT_SECRET', 'namisapo-jwt-secret-key-2025-change-this-in-production');

// データベース接続
try {
    $pdo = new PDO($dsn, $username, $password, $options);
    
    // 接続成功時のログ（本番環境では削除推奨）
    error_log('Database connection successful to: ' . $host);
    
} catch (PDOException $e) {
    // 接続エラー時の処理
    error_log('Database connection failed: ' . $e->getMessage());
    
    // 本番環境では詳細なエラー情報を隠す
    if (isset($_SERVER['HTTP_HOST'])) {
        http_response_code(500);
        echo json_encode(['error' => 'Database connection failed']);
        exit;
    } else {
        // CLI実行時は詳細エラーを表示
        echo "Database connection failed: " . $e->getMessage() . "\n";
        exit(1);
    }
}

// 🔒 セキュリティ設定
ini_set('display_errors', 0);  // エラー表示を無効化
ini_set('log_errors', 1);      // エラーログを有効化

// 🕒 タイムゾーン設定
date_default_timezone_set('Asia/Tokyo');

// 📝 ログ関数
function logMessage($message, $level = 'INFO') {
    $timestamp = date('Y-m-d H:i:s');
    $logMessage = "[$timestamp] [$level] $message\n";
    error_log($logMessage, 3, '/home/your-account/www/logs/app.log');
}

// 🚨 緊急度判定関数
function getAlertLevel($emotion, $worthlessnessScore) {
    if ($emotion !== '無価値感') {
        return null;
    }
    
    if ($worthlessnessScore > 80) {
        return 'critical';
    } elseif ($worthlessnessScore > 70) {
        return 'high';
    } elseif ($worthlessnessScore > 60) {
        return 'medium';
    }
    
    return null;
}

// 📧 緊急通知関数（実装例）
function sendEmergencyAlert($userId, $alertLevel, $diaryContent) {
    // 実際の通知システムと連携
    // メール、Slack、LINE等での通知
    logMessage("Emergency alert: User $userId, Level $alertLevel", 'ALERT');
    
    // TODO: 実際の通知処理を実装
    // - カウンセラーへのメール通知
    // - 管理画面でのリアルタイム表示
    // - 必要に応じて外部機関への連絡
}

?>