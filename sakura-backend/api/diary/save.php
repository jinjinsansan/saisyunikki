<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// プリフライトリクエストの処理
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

// 必須フィールドの検証
$required_fields = ['lineUsername', 'date', 'emotion', 'event', 'realization'];
foreach ($required_fields as $field) {
    if (empty($input[$field])) {
        http_response_code(400);
        echo json_encode(['error' => "Missing required field: $field"]);
        exit;
    }
}

try {
    $pdo->beginTransaction();
    
    // ユーザーを取得または作成
    $stmt = $pdo->prepare("SELECT id FROM users WHERE line_username = ?");
    $stmt->execute([$input['lineUsername']]);
    $user = $stmt->fetch();
    
    if (!$user) {
        $stmt = $pdo->prepare("INSERT INTO users (line_username) VALUES (?)");
        $stmt->execute([$input['lineUsername']]);
        $user_id = $pdo->lastInsertId();
    } else {
        $user_id = $user['id'];
    }
    
    // 日記エントリーを保存
    $stmt = $pdo->prepare("
        INSERT INTO diary_entries 
        (user_id, date, emotion, event, realization, self_esteem_score, worthlessness_score) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");
    
    $stmt->execute([
        $user_id,
        $input['date'],
        $input['emotion'],
        $input['event'],
        $input['realization'],
        $input['selfEsteemScore'] ?? 50,
        $input['worthlessnessScore'] ?? 50
    ]);
    
    $entry_id = $pdo->lastInsertId();
    
    // 緊急度判定
    if ($input['emotion'] === '無価値感') {
        $worthlessness_score = $input['worthlessnessScore'] ?? 50;
        
        if ($worthlessness_score > 80) {
            $alert_level = 'critical';
        } elseif ($worthlessness_score > 70) {
            $alert_level = 'high';
        } elseif ($worthlessness_score > 60) {
            $alert_level = 'medium';
        } else {
            $alert_level = null;
        }
        
        if ($alert_level) {
            $stmt = $pdo->prepare("
                INSERT INTO emergency_alerts (user_id, diary_entry_id, alert_level) 
                VALUES (?, ?, ?)
            ");
            $stmt->execute([$user_id, $entry_id, $alert_level]);
        }
    }
    
    $pdo->commit();
    
    echo json_encode([
        'success' => true,
        'entry_id' => $entry_id,
        'message' => 'Diary entry saved successfully'
    ]);
    
} catch (Exception $e) {
    $pdo->rollBack();
    error_log('Diary save error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save diary entry']);
}
?>