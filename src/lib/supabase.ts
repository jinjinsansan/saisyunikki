// Supabaseクライアント設定（既存機能に影響しない追加機能として実装）
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Supabaseが設定されていない場合はnullを返す（ローカルストレージ機能を維持）
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// 既存のローカルストレージ機能を維持しつつ、Supabaseにも保存する関数
export const saveDiaryEntry = async (entry: any) => {
  // 1. まずローカルストレージに保存（既存機能を維持）
  const existingEntries = localStorage.getItem('journalEntries');
  const entries = existingEntries ? JSON.parse(existingEntries) : [];
  entries.unshift(entry);
  localStorage.setItem('journalEntries', JSON.stringify(entries));
  
  // 2. Supabaseが利用可能な場合のみ、追加でSupabaseにも保存
  if (supabase) {
    try {
      // ユーザーを取得または作成
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('line_username', entry.lineUsername)
        .single();

      let userId;
      if (userError && userError.code === 'PGRST116') {
        // ユーザーが存在しない場合は作成
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert([{ line_username: entry.lineUsername }])
          .select('id')
          .single();
        
        if (createError) throw createError;
        userId = newUser.id;
      } else if (userError) {
        throw userError;
      } else {
        userId = user.id;
      }

      // 日記エントリーを保存
      const { error: entryError } = await supabase
        .from('diary_entries')
        .insert([{
          user_id: userId,
          date: entry.date,
          emotion: entry.emotion,
          event: entry.event,
          realization: entry.realization,
          self_esteem_score: entry.selfEsteemScore || 50,
          worthlessness_score: entry.worthlessnessScore || 50
        }]);

      if (entryError) throw entryError;
      console.log('✅ Supabaseにも保存されました');
    } catch (error) {
      console.log('⚠️ Supabaseへの保存に失敗しましたが、ローカルストレージには保存されています:', error);
      // エラーが発生してもローカルストレージ機能は動作し続ける
    }
  }
  
  return entry;
};

// 管理画面用：全ユーザーの日記データを取得
export const getAllDiaryEntries = async () => {
  if (!supabase) {
    throw new Error('Supabaseが設定されていません');
  }

  const { data, error } = await supabase
    .from('diary_entries')
    .select(`
      *,
      users (
        line_username
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// カウンセラー認証
export const authenticateCounselor = async (email: string, password: string) => {
  if (!supabase) {
    throw new Error('Supabaseが設定されていません');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

// カウンセラーログアウト
export const logoutCounselor = async () => {
  if (!supabase) return;
  
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// 現在のカウンセラー情報を取得
export const getCurrentCounselor = async () => {
  if (!supabase) return null;
  
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};