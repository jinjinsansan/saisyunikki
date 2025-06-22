# さくらのサーバーデプロイガイド

## 🎯 概要
「かんじょうにっき」をさくらのサーバーで本格運用するためのデプロイガイドです。

## 📋 前提条件
- さくらのレンタルサーバー（スタンダード以上）
- MySQLデータベース利用可能
- FTPアクセス権限
- PHP 8.0以上

## 🚀 デプロイ手順

### 1. フロントエンドのビルド
```bash
# プロジェクトルートで実行
npm run build:sakura
```

### 2. ファイルアップロード
FTPクライアントを使用して以下をアップロード：
- `dist/` フォルダの全内容 → `/home/your-account/www/`
- `public/.htaccess` → `/home/your-account/www/.htaccess`

### 3. バックエンドAPI開発（次のステップ）
```
/home/your-account/www/api/
├── config/
│   └── database.php
├── auth/
│   └── counselor.php
├── admin/
│   ├── diary-entries.php
│   ├── statistics.php
│   └── users.php
├── diary/
│   └── save.php
└── users/
    └── get-or-create.php
```

### 4. データベース設定
さくらのコントロールパネルでMySQLデータベースを作成し、以下のテーブルを作成：

```sql
-- ユーザーテーブル
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    line_username VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 日記エントリーテーブル
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

-- カウンセラーテーブル
CREATE TABLE counselors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. 環境変数設定
`/home/your-account/www/api/config/database.php` を作成：

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

## 🔒 セキュリティ設定

### SSL証明書
さくらのサーバーでSSL証明書を設定し、HTTPS通信を有効化

### アクセス制限
管理画面へのアクセスをIP制限で保護

### データベースセキュリティ
- 強力なパスワード設定
- 不要な権限の削除
- 定期的なバックアップ

## 📊 監視・運用

### ログ監視
- アクセスログの定期確認
- エラーログの監視
- パフォーマンス監視

### バックアップ
- 日次データベースバックアップ
- 週次ファイルバックアップ
- 月次完全バックアップ

### アップデート
- セキュリティパッチの適用
- 機能追加のデプロイ
- 定期的なメンテナンス

## 🆘 トラブルシューティング

### よくある問題
1. **404エラー**: `.htaccess`の設定確認
2. **データベース接続エラー**: 接続情報の確認
3. **権限エラー**: ファイル権限の確認

### サポート連絡先
- さくらインターネットサポート
- 開発チーム: info@namisapo.com

## 📈 パフォーマンス最適化

### キャッシュ設定
- ブラウザキャッシュの活用
- CDN利用の検討
- 画像最適化

### データベース最適化
- インデックスの最適化
- クエリの最適化
- 不要データの定期削除