<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// プリフライトリクエストの処理
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // メッセージ取得
    $line_username = $_GET['line_username'] ?? '';
    
    if (empty($line_username)) {
        http_response_code(400);
        echo json_encode(['error' => 'line_username required']);
        exit;
    }
    
    try {
        // ユーザーIDを取得
        $stmt = $pdo->prepare("SELECT id FROM users WHERE line_username = ?");
        $stmt->execute([$line_username]);
        $user = $stmt->fetch();
        
        if (!$user) {
            echo json_encode([]);
            exit;
        }
        
        // メッセージを取得
        $stmt = $pdo->prepare("
            SELECT 
                cm.*,
                c.name as counselor_name
            FROM chat_messages cm
            LEFT JOIN counselors c ON cm.counselor_id = c.id
            WHERE cm.user_id = ?
            ORDER BY cm.created_at ASC
            LIMIT 100
        ");
        $stmt->execute([$user['id']]);
        $messages = $stmt->fetchAll();
        
        // 未読メッセージを既読にする
        $stmt = $pdo->prepare("
            UPDATE chat_messages 
            SET is_read = 1 
            WHERE user_id = ? AND is_counselor = 1 AND is_read = 0
        ");
        $stmt->execute([$user['id']]);
        
        $result = array_map(function($message) {
            return [
                'id' => $message['id'],
                'content' => $message['content'],
                'is_counselor' => (bool)$message['is_counselor'],
                'sender_name' => $message['is_counselor'] ? $message['counselor_name'] : null,
                'created_at' => $message['created_at']
            ];
        }, $messages);
        
        echo json_encode($result);
        
    } catch (Exception $e) {
        error_log('Chat messages get error: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Server error']);
    }
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // メッセージ送信
    $input = json_decode(file_get_contents('php://input'), true);
    
    $line_username = $input['lineUsername'] ?? '';
    $content = $input['content'] ?? '';
    
    if (empty($line_username) || empty($content)) {
        http_response_code(400);
        echo json_encode(['error' => 'lineUsername and content required']);
        exit;
    }
    
    try {
        $pdo->beginTransaction();
        
        // ユーザーを取得または作成
        $stmt = $pdo->prepare("SELECT id FROM users WHERE line_username = ?");
        $stmt->execute([$line_username]);
        $user = $stmt->fetch();
        
        if (!$user) {
            $stmt = $pdo->prepare("INSERT INTO users (line_username) VALUES (?)");
            $stmt->execute([$line_username]);
            $user_id = $pdo->lastInsertId();
        } else {
            $user_id = $user['id'];
        }
        
        // メッセージを保存
        $stmt = $pdo->prepare("
            INSERT INTO chat_messages (user_id, content, is_counselor) 
            VALUES (?, ?, 0)
        ");
        $stmt->execute([$user_id, $content]);
        
        $message_id = $pdo->lastInsertId();
        
        $pdo->commit();
        
        echo json_encode([
            'success' => true,
            'message_id' => $message_id
        ]);
        
    } catch (Exception $e) {
        $pdo->rollBack();
        error_log('Chat message send error: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Failed to send message']);
    }
    
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>