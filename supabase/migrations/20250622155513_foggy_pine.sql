-- かんじょうにっき Supabaseスキーマ
-- SQL Editorで実行してください

-- ユーザーテーブル
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    line_username TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 日記エントリーテーブル
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

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_diary_entries_user_id ON diary_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_diary_entries_date ON diary_entries(date);
CREATE INDEX IF NOT EXISTS idx_diary_entries_emotion ON diary_entries(emotion);
CREATE INDEX IF NOT EXISTS idx_diary_entries_created_at ON diary_entries(created_at);

-- Row Level Security (RLS) を有効化
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE diary_entries ENABLE ROW LEVEL SECURITY;

-- ポリシー作成（管理者は全データにアクセス可能）
CREATE POLICY "管理者は全ユーザーデータを閲覧可能" ON users
    FOR ALL USING (true);

CREATE POLICY "管理者は全日記データを閲覧可能" ON diary_entries
    FOR ALL USING (true);

-- ユーザーは自分のデータのみアクセス可能
CREATE POLICY "ユーザーは自分のデータのみアクセス" ON users
    FOR ALL USING (auth.uid()::text = id::text);

CREATE POLICY "ユーザーは自分の日記のみアクセス" ON diary_entries
    FOR ALL USING (
        user_id IN (
            SELECT id FROM users WHERE line_username = current_setting('app.current_user', true)
        )
    );