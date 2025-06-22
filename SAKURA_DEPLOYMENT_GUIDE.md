# さくらのサーバー本格運用デプロイガイド

## 🚀 **デプロイ手順**

### **1. さくらのサーバー準備**
1. **さくらのレンタルサーバー（スタンダード以上）**を契約
2. **MySQLデータベース**を作成
3. **FTPアクセス情報**を確認

### **2. データベースセットアップ**
```sql
-- さくらのコントロールパネルでMySQLデータベースを作成後、
-- sakura-backend/database/schema.sql を実行
```

### **3. バックエンドファイルのアップロード**
FTPクライアントを使用して以下をアップロード：
```
/home/your-account/www/api/
├── config/
│   └── database.php          # データベース設定
├── auth/
│   ├── counselor.php         # カウンセラー認証
│   └── verify_token.php      # トークン検証
├── diary/
│   └── save.php              # 日記保存
├── admin/
│   ├── diary-entries.php     # 日記一覧
│   ├── statistics.php        # 統計情報
│   └── emergency-alerts.php  # 緊急アラート
├── chat/
│   └── messages.php          # チャット機能
└── .htaccess                 # Apache設定
```

### **4. フロントエンド設定更新**
環境変数を設定：
```javascript
// .env ファイル
VITE_SAKURA_API_URL=https://your-domain.sakura.ne.jp/api
```

### **5. フロントエンドビルド＆デプロイ**
```bash
# ビルド
npm run build

# FTPでアップロード
# dist/ フォルダの内容を /home/your-account/www/ にアップロード
```

## 🔧 **設定ファイル更新**

### **database.php の設定**
```php
$host = 'mysql**.db.sakura.ne.jp';     // さくらのMySQLホスト
$dbname = 'your_database_name';         // データベース名
$username = 'your_username';            // ユーザー名
$password = 'your_password';            // パスワード
```

## 📊 **管理機能**

### **カウンセラー管理画面**
- URL: `https://your-domain.sakura.ne.jp/#/admin`
- 初期アカウント:
  - Email: `tanaka@namisapo.com`
  - Password: `counselor123`

### **主な機能**
✅ **日記データ管理**
- 全ユーザーの日記一覧表示
- 感情・日付・ユーザーでの絞り込み
- 緊急度判定とアラート

✅ **統計ダッシュボード**
- 総ユーザー数・日記数
- 今日の日記数
- 緊急ケース数
- 感情別統計

✅ **緊急対応システム**
- 無価値感スコア80以上で自動アラート
- カウンセラーへの即座通知
- 対応履歴管理

✅ **チャット機能**
- ユーザーとカウンセラーの1対1チャット
- リアルタイムメッセージング
- 未読管理

## 🔒 **セキュリティ対策**

### **実装済み**
- JWT認証システム
- パスワードハッシュ化
- SQLインジェクション対策
- CORS設定
- 入力値検証

### **追加推奨**
- SSL証明書の設定
- IP制限（管理画面）
- 定期的なバックアップ
- ログ監視

## 📈 **運用監視**

### **ログ確認**
```bash
# エラーログ確認
tail -f /home/your-account/www/logs/error.log

# アクセスログ確認
tail -f /home/your-account/www/logs/access.log
```

### **データベース監視**
- 接続数監視
- クエリパフォーマンス
- ストレージ使用量

## 🆘 **緊急時対応**

### **緊急アラート発生時**
1. **管理画面で確認**
2. **ユーザーに連絡**
3. **必要に応じて専門機関に連携**
4. **対応完了後にアラート解決**

### **システム障害時**
1. **ログ確認**
2. **データベース接続確認**
3. **バックアップからの復旧**

## 📞 **サポート**

### **技術サポート**
- さくらインターネット: https://help.sakura.ad.jp/
- 開発チーム: info@namisapo.com

### **緊急連絡先**
- 一般社団法人NAMIDAサポート協会
- 24時間対応: 緊急時のみ

---

この構成により、さくらのサーバーで安全で効率的な本格運用が可能になります！