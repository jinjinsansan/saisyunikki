import { createClient } from '@supabase/supabase-js';

// 環境変数の取得
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const isDevMode = import.meta.env.VITE_DEV_MODE === 'true';

// Supabaseクライアントの初期化（環境変数がある場合のみ）
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// データベース型定義
export interface JournalEntry {
  id: string;
  date: string;
  emotion: string;
  event: string;
  realization: string;
  selfEsteemScore: number;
  worthlessnessScore: number;
  userId?: string;
  userName?: string;
  createdAt?: string;
}

export interface User {
  id: string;
  lineUsername: string;
  createdAt: string;
}

// **安全なデータ取得関数（フォールバック付き）**
export const getOrCreateUser = async (lineUsername: string): Promise<User> => {
  // 開発モードまたはSupabaseが利用できない場合はローカルユーザーを返す
  if (isDevMode || !supabase) {
    return {
      id: 'local-user',
      lineUsername,
      createdAt: new Date().toISOString()
    };
  }

  try {
    // Supabaseでユーザーを取得または作成
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('line_username', lineUsername)
      .single();

    if (existingUser && !fetchError) {
      return {
        id: existingUser.id,
        lineUsername: existingUser.line_username,
        createdAt: existingUser.created_at
      };
    }

    // ユーザーが存在しない場合は作成
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert([{ line_username: lineUsername }])
      .select()
      .single();

    if (createError) throw createError;

    return {
      id: newUser.id,
      lineUsername: newUser.line_username,
      createdAt: newUser.created_at
    };
  } catch (error) {
    console.warn('Supabase操作に失敗、ローカルモードにフォールバック:', error);
    // エラーの場合はローカルユーザーを返す
    return {
      id: 'local-user',
      lineUsername,
      createdAt: new Date().toISOString()
    };
  }
};

// **安全な日記保存関数（二重保存）**
export const saveDiaryEntry = async (entry: Omit<JournalEntry, 'id'>): Promise<string> => {
  const entryId = Date.now().toString();
  const fullEntry = { ...entry, id: entryId };

  // **必ずローカルストレージに保存（安全性確保）**
  try {
    const existingEntries = localStorage.getItem('journalEntries');
    const entries = existingEntries ? JSON.parse(existingEntries) : [];
    entries.unshift(fullEntry);
    localStorage.setItem('journalEntries', JSON.stringify(entries));
    console.log('✅ ローカルストレージに保存完了');
  } catch (error) {
    console.error('ローカルストレージ保存エラー:', error);
  }

  // **Supabaseにも保存を試行（失敗してもOK）**
  if (!isDevMode && supabase) {
    try {
      const lineUsername = localStorage.getItem('line-username') || 'anonymous';
      const user = await getOrCreateUser(lineUsername);

      const { error } = await supabase
        .from('diary_entries')
        .insert([{
          user_id: user.id,
          date: entry.date,
          emotion: entry.emotion,
          event: entry.event,
          realization: entry.realization,
          self_esteem_score: entry.selfEsteemScore,
          worthlessness_score: entry.worthlessnessScore
        }]);

      if (error) throw error;
      console.log('✅ Supabaseにも保存完了');
    } catch (error) {
      console.warn('Supabase保存に失敗（ローカル保存は成功）:', error);
    }
  }

  return entryId;
};

// **安全な日記取得関数（ローカル優先）**
export const getUserDiaryEntries = async (): Promise<JournalEntry[]> => {
  // **まずローカルストレージから取得**
  try {
    const savedEntries = localStorage.getItem('journalEntries');
    if (savedEntries) {
      const localEntries = JSON.parse(savedEntries);
      console.log('✅ ローカルデータを取得:', localEntries.length, '件');
      return localEntries;
    }
  } catch (error) {
    console.error('ローカルストレージ読み込みエラー:', error);
  }

  // **Supabaseからも取得を試行**
  if (!isDevMode && supabase) {
    try {
      const lineUsername = localStorage.getItem('line-username') || 'anonymous';
      const user = await getOrCreateUser(lineUsername);

      const { data, error } = await supabase
        .from('diary_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedEntries = data.map(entry => ({
        id: entry.id.toString(),
        date: entry.date,
        emotion: entry.emotion,
        event: entry.event,
        realization: entry.realization,
        selfEsteemScore: entry.self_esteem_score,
        worthlessnessScore: entry.worthlessness_score
      }));

      console.log('✅ Supabaseデータを取得:', formattedEntries.length, '件');
      return formattedEntries;
    } catch (error) {
      console.warn('Supabase取得に失敗、空配列を返す:', error);
    }
  }

  return [];
};

// **管理者用：全ユーザーの日記取得**
export const getAllDiaryEntries = async (): Promise<JournalEntry[]> => {
  if (isDevMode || !supabase) {
    // 開発モードではローカルデータを返す
    try {
      const savedEntries = localStorage.getItem('journalEntries');
      if (savedEntries) {
        const entries = JSON.parse(savedEntries);
        return entries.map((entry: any) => ({
          ...entry,
          userId: 'local-user',
          userName: 'ローカルユーザー',
          createdAt: entry.date
        }));
      }
    } catch (error) {
      console.error('ローカルデータ取得エラー:', error);
    }
    return [];
  }

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

    if (error) throw error;

    return data.map(entry => ({
      id: entry.id.toString(),
      date: entry.date,
      emotion: entry.emotion,
      event: entry.event,
      realization: entry.realization,
      selfEsteemScore: entry.self_esteem_score,
      worthlessnessScore: entry.worthlessness_score,
      userId: entry.user_id,
      userName: entry.users?.line_username || '不明',
      createdAt: entry.created_at
    }));
  } catch (error) {
    console.error('全日記取得エラー:', error);
    return [];
  }
};

// **接続状態確認**
export const checkSupabaseConnection = async (): Promise<boolean> => {
  if (!supabase) return false;
  
  try {
    const { error } = await supabase.from('users').select('count').limit(1);
    return !error;
  } catch {
    return false;
  }
};