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
    // クエリパラメータの取得
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;
    $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
    $emotion = $_GET['emotion'] ?? '';
    $user_id = $_GET['user_id'] ?? '';
    $date_from = $_GET['date_from'] ?? '';
    $date_to = $_GET['date_to'] ?? '';
    $alert_level = $_GET['alert_level'] ?? '';
    
    // ベースクエリ
    $where_conditions = [];
    $params = [];
    
    if ($emotion) {
        $where_conditions[] = "de.emotion = ?";
        $params[] = $emotion;
    }
    
    if ($user_id) {
        $where_conditions[] = "de.user_id = ?";
        $params[] = $user_id;
    }
    
    if ($date_from) {
        $where_conditions[] = "de.date >= ?";
        $params[] = $date_from;
    }
    
    if ($date_to) {
        $where_conditions[] = "de.date <= ?";
        $params[] = $date_to;
    }
    
    if ($alert_level) {
        $where_conditions[] = "ea.alert_level = ?";
        $params[] = $alert_level;
    }
    
    $where_clause = $where_conditions ? 'WHERE ' . implode(' AND ', $where_conditions) : '';
    
    $sql = "
        SELECT 
            de.*,
            u.line_username as user_name,
            ea.alert_level,
            ea.is_resolved as alert_resolved
        FROM diary_entries de
        JOIN users u ON de.user_id = u.id
        LEFT JOIN emergency_alerts ea ON de.id = ea.diary_entry_id
        $where_clause
        ORDER BY de.created_at DESC
        LIMIT ? OFFSET ?
    ";
    
    $params[] = $limit;
    $params[] = $offset;
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $entries = $stmt->fetchAll();
    
    // 結果をフォーマット
    $result = array_map(function($entry) {
        return [
            'id' => $entry['id'],
            'date' => $entry['date'],
            'emotion' => $entry['emotion'],
            'event' => $entry['event'],
            'realization' => $entry['realization'],
            'selfEsteemScore' => (int)$entry['self_esteem_score'],
            'worthlessnessScore' => (int)$entry['worthlessness_score'],
            'userId' => $entry['user_id'],
            'userName' => $entry['user_name'],
            'createdAt' => $entry['created_at'],
            'alertLevel' => $entry['alert_level'],
            'alertResolved' => (bool)$entry['alert_resolved']
        ];
    }, $entries);
    
    echo json_encode($result);
    
} catch (Exception $e) {
    error_log('Admin diary entries error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Server error']);
}
?>