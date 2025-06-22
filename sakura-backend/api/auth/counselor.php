<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

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
$email = $input['email'] ?? '';
$password = $input['password'] ?? '';

if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(['error' => 'Email and password required']);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT * FROM counselors WHERE email = ? AND is_active = 1");
    $stmt->execute([$email]);
    $counselor = $stmt->fetch();
    
    if (!$counselor || !password_verify($password, $counselor['password_hash'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid credentials']);
        exit;
    }
    
    // ログイン時刻を更新
    $updateStmt = $pdo->prepare("UPDATE counselors SET last_login = NOW() WHERE id = ?");
    $updateStmt->execute([$counselor['id']]);
    
    // JWTトークンの生成（簡易版）
    $payload = [
        'counselor_id' => $counselor['id'],
        'email' => $counselor['email'],
        'exp' => time() + (24 * 60 * 60) // 24時間
    ];
    
    $jwt = base64_encode(json_encode($payload));
    
    echo json_encode([
        'token' => $jwt,
        'counselor' => [
            'id' => $counselor['id'],
            'name' => $counselor['name'],
            'email' => $counselor['email']
        ]
    ]);
    
} catch (Exception $e) {
    error_log('Counselor authentication error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Server error']);
}
?>