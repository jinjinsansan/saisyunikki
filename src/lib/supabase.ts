import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase環境変数が設定されていません');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// カウンセラー認証
export const signInCounselor = async (email: string, password: string) => {
  try {
    // まずカウンセラーテーブルでメールアドレスを確認
    const { data: counselor, error: counselorError } = await supabase
      .from('counselors')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single();

    if (counselorError || !counselor) {
      throw new Error('認証されたカウンセラーではありません');
    }

    // Supabase Authでサインイン
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return {
      user: data.user,
      counselor: counselor,
      session: data.session
    };
  } catch (error) {
    console.error('カウンセラーログインエラー:', error);
    throw error;
  }
};

// カウンセラーログアウト
export const signOutCounselor = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
};

// 日記エントリー取得（カウンセラー用）
export const getDiaryEntries = async () => {
  try {
    const { data, error } = await supabase
      .from('diary_entries')
      .select(`
        *,
        users (
          line_username
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data.map(entry => ({
      ...entry,
      userName: entry.users?.line_username || 'Unknown User'
    }));
  } catch (error) {
    console.error('日記データ取得エラー:', error);
    throw error;
  }
};

// ユーザー日記保存
export const saveDiaryEntry = async (entry: {
  userId: string;
  date: string;
  emotion: string;
  event: string;
  realization: string;
  selfEsteemScore: number;
  worthlessnessScore: number;
}) => {
  try {
    const { data, error } = await supabase
      .from('diary_entries')
      .insert([entry])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('日記保存エラー:', error);
    throw error;
  }
};

// ユーザー作成または取得
export const getOrCreateUser = async (lineUsername: string) => {
  try {
    // 既存ユーザーを検索
    let { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('line_username', lineUsername)
      .single();

    if (error && error.code === 'PGRST116') {
      // ユーザーが存在しない場合は作成
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([{ line_username: lineUsername }])
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      user = newUser;
    } else if (error) {
      throw error;
    }

    return user;
  } catch (error) {
    console.error('ユーザー取得/作成エラー:', error);
    throw error;
  }
};

// ユーザーの日記取得
export const getUserDiaryEntries = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('diary_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('ユーザー日記取得エラー:', error);
    throw error;
  }
};