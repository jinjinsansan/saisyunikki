# さくらのサーバー管理システム構築ガイド

## 🏗️ **サーバーサイド構築（PHP）**

### 1. データベース設計

```sql
-- users テーブル
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    line_username VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- diary_entries テーブル
CREATE TABLE diary_entries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    date DATE NOT NULL,
    emotion VARCHAR(100) NOT NULL,
    event TEXT NOT NULL,
    realization TEXT NOT NULL,
    self_esteem_score INT NOT NULL DEFAULT 50,
    worthlessness_score INT NOT NULL DEFAULT 50,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- counselors テーブル
CREATE TABLE counselors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. API エンドポイント（PHP）

#### `/api/auth/counselor.php`
```php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';
require_once '../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

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
    $pdo = new PDO($dsn, $username, $password, $options);
    
    $stmt = $pdo->prepare("SELECT * FROM counselors WHERE email = ? AND is_active = 1");
    $stmt->execute([$email]);
    $counselor = $stmt->fetch();
    
    if (!$counselor || !password_verify($password, $counselor['password_hash'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid credentials']);
        exit;
    }
    
    $payload = [
        'counselor_id' => $counselor['id'],
        'email' => $counselor['email'],
        'exp' => time() + (24 * 60 * 60) // 24時間
    ];
    
    $jwt = JWT::encode($payload, JWT_SECRET, 'HS256');
    
    echo json_encode([
        'token' => $jwt,
        'counselor' => [
            'id' => $counselor['id'],
            'name' => $counselor['name'],
            'email' => $counselor['email']
        ]
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error']);
}
?>
```

#### `/api/admin/diary-entries.php`
```php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once '../config/database.php';
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
    $pdo = new PDO($dsn, $username, $password, $options);
    
    $stmt = $pdo->prepare("
        SELECT 
            de.*,
            u.line_username as user_name
        FROM diary_entries de
        JOIN users u ON de.user_id = u.id
        ORDER BY de.created_at DESC
    ");
    $stmt->execute();
    $entries = $stmt->fetchAll();
    
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
            'createdAt' => $entry['created_at']
        ];
    }, $entries);
    
    echo json_encode($result);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error']);
}
?>
```

#### `/api/admin/statistics.php`
```php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once '../config/database.php';
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
    $pdo = new PDO($dsn, $username, $password, $options);
    
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
    
    // 緊急ケース数（無価値感スコア80以上）
    $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM diary_entries WHERE emotion = '無価値感' AND worthlessness_score > 80");
    $stmt->execute();
    $urgentCases = $stmt->fetch()['count'];
    
    echo json_encode([
        'totalUsers' => (int)$totalUsers,
        'totalEntries' => (int)$totalEntries,
        'todayEntries' => (int)$todayEntries,
        'urgentCases' => (int)$urgentCases
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error']);
}
?>
```

### 3. 設定ファイル

#### `/config/database.php`
```php
<?php
$host = 'mysql**.db.sakura.ne.jp';
$dbname = 'your_database_name';
$username = 'your_username';
$password = 'your_password';

$dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";

$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

define('JWT_SECRET', 'your-secret-key-here');
?>
```

## 🚀 **デプロイ手順**

### 1. フロントエンド
```bash
# 環境変数設定
echo "REACT_APP_SAKURA_API_URL=https://your-domain.sakura.ne.jp/api" > .env

# ビルド
npm run build:sakura

# FTPでアップロード
# dist/ フォルダの内容を /home/your-account/www/ にアップロード
```

### 2. バックエンド
```bash
# PHPファイルをアップロード
# api/ フォルダを /home/your-account/www/api/ にアップロード

# データベース作成
# さくらのコントロールパネルでMySQLデータベースを作成
# 上記SQLを実行してテーブル作成
```

### 3. カウンセラーアカウント作成
```sql
INSERT INTO counselors (name, email, password_hash, is_active) 
VALUES ('田中カウンセラー', 'tanaka@example.com', '$2y$10$...', 1);
```

## 📊 **管理機能**

### ✅ **実装済み機能**
- カウンセラー認証（JWT）
- 日記データ一覧表示
- 高度な検索・フィルター
- 統計ダッシュボード
- 緊急度判定
- リアルタイムデータ更新

### 🔒 **セキュリティ対策**
- JWT認証
- パスワードハッシュ化
- SQLインジェクション対策
- CORS設定
- 入力値検証

この構成により、さくらのサーバーで安全で効率的な管理システムが構築できます！