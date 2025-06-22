<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// プリフライトリクエストの処理
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../../config/database.php';
require_once '../auth/verify_token.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// JWT認証チェック
$counselor = verifyToken();
if (!$counselor) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

try {
    // 総ユーザー数
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM users");
    $totalUsers = $stmt->fetch()['count'];
    
    // 総日記数
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM diary_entries");
    $totalEntries = $stmt->fetch()['count'];
    
    // 今日の日記数
    $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM diary_entries WHERE date = CURDATE()");
    $stmt->execute();
    $todayEntries = $stmt->fetch()['count'];
    
    // 緊急ケース数（未解決のアラート）
    $stmt = $pdo->prepare("
        SELECT COUNT(*) as count 
        FROM emergency_alerts 
        WHERE is_resolved = 0 AND alert_level IN ('high', 'critical')
    ");
    $stmt->execute();
    $urgentCases = $stmt->fetch()['count'];
    
    // アクティブユーザー数（過去7日間に日記を書いたユーザー）
    $stmt = $pdo->prepare("
        SELECT COUNT(DISTINCT user_id) as count 
        FROM diary_entries 
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    ");
    $stmt->execute();
    $activeUsers = $stmt->fetch()['count'];
    
    // 感情別統計（過去30日間）
    $stmt = $pdo->prepare("
        SELECT emotion, COUNT(*) as count 
        FROM diary_entries 
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY emotion 
        ORDER BY count DESC
    ");
    $stmt->execute();
    $emotionStats = $stmt->fetchAll();
    
    // 無価値感スコア平均（過去30日間）
    $stmt = $pdo->prepare("
        SELECT AVG(worthlessness_score) as avg_score 
        FROM diary_entries 
        WHERE emotion = '無価値感' 
        AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    ");
    $stmt->execute();
    $avgWorthlessnessScore = $stmt->fetch()['avg_score'];
    
    echo json_encode([
        'totalUsers' => (int)$totalUsers,
        'totalEntries' => (int)$totalEntries,
        'todayEntries' => (int)$todayEntries,
        'urgentCases' => (int)$urgentCases,
        'activeUsers' => (int)$activeUsers,
        'emotionStats' => $emotionStats,
        'avgWorthlessnessScore' => $avgWorthlessnessScore ? round($avgWorthlessnessScore, 1) : null
    ]);
    
} catch (Exception $e) {
    error_log('Admin statistics error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Server error']);
}
?>