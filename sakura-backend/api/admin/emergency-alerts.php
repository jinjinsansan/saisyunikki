<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// プリフライトリクエストの処理
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../../config/database.php';
require_once '../auth/verify_token.php';

// JWT認証チェック
$counselor = verifyToken();
if (!$counselor) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // 緊急アラート一覧取得
    try {
        $stmt = $pdo->prepare("
            SELECT 
                ea.*,
                u.line_username as user_name,
                de.emotion,
                de.event,
                de.worthlessness_score,
                c.name as resolved_by_name
            FROM emergency_alerts ea
            JOIN users u ON ea.user_id = u.id
            JOIN diary_entries de ON ea.diary_entry_id = de.id
            LEFT JOIN counselors c ON ea.resolved_by = c.id
            ORDER BY ea.created_at DESC
            LIMIT 100
        ");
        $stmt->execute();
        $alerts = $stmt->fetchAll();
        
        $result = array_map(function($alert) {
            return [
                'id' => $alert['id'],
                'userId' => $alert['user_id'],
                'userName' => $alert['user_name'],
                'diaryEntryId' => $alert['diary_entry_id'],
                'alertLevel' => $alert['alert_level'],
                'emotion' => $alert['emotion'],
                'event' => substr($alert['event'], 0, 100) . '...',
                'worthlessnessScore' => (int)$alert['worthlessness_score'],
                'isResolved' => (bool)$alert['is_resolved'],
                'resolvedBy' => $alert['resolved_by_name'],
                'resolvedAt' => $alert['resolved_at'],
                'createdAt' => $alert['created_at']
            ];
        }, $alerts);
        
        echo json_encode($result);
        
    } catch (Exception $e) {
        error_log('Emergency alerts get error: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Server error']);
    }
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // アラート解決
    $input = json_decode(file_get_contents('php://input'), true);
    $alert_id = $input['alert_id'] ?? '';
    
    if (empty($alert_id)) {
        http_response_code(400);
        echo json_encode(['error' => 'alert_id required']);
        exit;
    }
    
    try {
        $stmt = $pdo->prepare("
            UPDATE emergency_alerts 
            SET is_resolved = 1, resolved_by = ?, resolved_at = NOW() 
            WHERE id = ?
        ");
        $stmt->execute([$counselor['counselor_id'], $alert_id]);
        
        echo json_encode(['success' => true]);
        
    } catch (Exception $e) {
        error_log('Emergency alert resolve error: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Server error']);
    }
    
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>