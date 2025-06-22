-- かんじょうにっき Supabaseポリシー修正
-- 既存のポリシーを削除してから新しく作成

-- 既存のポリシーを削除（エラーを避けるためIF EXISTSを使用）
DROP POLICY IF EXISTS "管理者は全ユーザーデータを閲覧可能" ON users;
DROP POLICY IF EXISTS "管理者は全日記データを閲覧可能" ON diary_entries;
DROP POLICY IF EXISTS "ユーザーは自分のデータのみアクセス" ON users;
DROP POLICY IF EXISTS "ユーザーは自分の日記のみアクセス" ON diary_entries;

-- テーブルが存在しない場合は作成
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    line_username TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS diary_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    emotion TEXT NOT NULL,
    event TEXT NOT NULL,
    realization TEXT NOT NULL,
    self_esteem_score INTEGER NOT NULL DEFAULT 50,
    worthlessness_score INTEGER NOT NULL DEFAULT 50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス作成（IF NOT EXISTSで安全に）
CREATE INDEX IF NOT EXISTS idx_diary_entries_user_id ON diary_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_diary_entries_date ON diary_entries(date);
CREATE INDEX IF NOT EXISTS idx_diary_entries_emotion ON diary_entries(emotion);
CREATE INDEX IF NOT EXISTS idx_diary_entries_created_at ON diary_entries(created_at);

-- Row Level Security (RLS) を有効化
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE diary_entries ENABLE ROW LEVEL SECURITY;

-- 新しいポリシーを作成（一意な名前を使用）
CREATE POLICY "admin_users_access_v2" ON users
    FOR ALL USING (true);

CREATE POLICY "admin_diary_access_v2" ON diary_entries
    FOR ALL USING (true);

CREATE POLICY "user_own_data_access_v2" ON users
    FOR ALL USING (auth.uid()::text = id::text);

CREATE POLICY "user_own_diary_access_v2" ON diary_entries
    FOR ALL USING (
        user_id IN (
            SELECT id FROM users WHERE line_username = current_setting('app.current_user', true)
        )
    );

-- 管理者用のテストデータ挿入（重複を避ける）
INSERT INTO users (line_username) 
VALUES ('test_user_admin') 
ON CONFLICT (line_username) DO NOTHING;

-- テストデータ用の日記エントリー
INSERT INTO diary_entries (user_id, date, emotion, event, realization, self_esteem_score, worthlessness_score)
SELECT 
    u.id,
    CURRENT_DATE,
    '無価値感',
    'テスト用の出来事です。管理画面での表示確認用のサンプルデータです。',
    'テスト用の気づきです。システムが正常に動作していることを確認できます。',
    30,
    70
FROM users u 
WHERE u.line_username = 'test_user_admin'
AND NOT EXISTS (
    SELECT 1 FROM diary_entries de 
    WHERE de.user_id = u.id 
    AND de.event LIKE 'テスト用の出来事です%'
);