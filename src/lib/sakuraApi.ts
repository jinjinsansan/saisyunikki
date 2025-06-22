// さくらのサーバー用API接続
const SAKURA_API_BASE = import.meta.env.VITE_SAKURA_API_URL || 'https://your-domain.sakura.ne.jp/api';

interface JournalEntry {
  id: string;
  date: string;
  emotion: string;
  event: string;
  realization: string;
  selfEsteemScore: number;
  worthlessnessScore: number;
  userId: string;
  userName: string;
  createdAt: string;
}

interface User {
  id: string;
  lineUsername: string;
  createdAt: string;
}

interface Counselor {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
}

// カウンセラー認証
export const authenticateCounselor = async (email: string, password: string) => {
  try {
    const response = await fetch(`${SAKURA_API_BASE}/auth/counselor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('認証に失敗しました');
    }

    const data = await response.json();
    
    // JWTトークンをローカルストレージに保存
    localStorage.setItem('counselor_token', data.token);
    localStorage.setItem('counselor_info', JSON.stringify(data.counselor));
    
    return data;
  } catch (error) {
    console.error('カウンセラー認証エラー:', error);
    throw error;
  }
};

// 認証トークン取得
const getAuthToken = () => {
  return localStorage.getItem('counselor_token');
};

// 認証ヘッダー作成
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// 全ユーザーの日記データ取得
export const getAllDiaryEntries = async (): Promise<JournalEntry[]> => {
  try {
    const response = await fetch(`${SAKURA_API_BASE}/admin/diary-entries`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('日記データの取得に失敗しました');
    }

    return await response.json();
  } catch (error) {
    console.error('日記データ取得エラー:', error);
    throw error;
  }
};

// ユーザー一覧取得
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch(`${SAKURA_API_BASE}/admin/users`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('ユーザーデータの取得に失敗しました');
    }

    return await response.json();
  } catch (error) {
    console.error('ユーザーデータ取得エラー:', error);
    throw error;
  }
};

// 統計情報取得
export const getStatistics = async () => {
  try {
    const response = await fetch(`${SAKURA_API_BASE}/admin/statistics`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('統計データの取得に失敗しました');
    }

    return await response.json();
  } catch (error) {
    console.error('統計データ取得エラー:', error);
    throw error;
  }
};

// ユーザー日記保存（フロントエンド用）
export const saveDiaryEntry = async (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => {
  try {
    const response = await fetch(`${SAKURA_API_BASE}/diary/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entry),
    });

    if (!response.ok) {
      throw new Error('日記の保存に失敗しました');
    }

    return await response.json();
  } catch (error) {
    console.error('日記保存エラー:', error);
    throw error;
  }
};

// ユーザー作成または取得
export const getOrCreateUser = async (lineUsername: string): Promise<User> => {
  try {
    const response = await fetch(`${SAKURA_API_BASE}/users/get-or-create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lineUsername }),
    });

    if (!response.ok) {
      throw new Error('ユーザーの取得/作成に失敗しました');
    }

    return await response.json();
  } catch (error) {
    console.error('ユーザー取得/作成エラー:', error);
    throw error;
  }
};

// ログアウト
export const logoutCounselor = () => {
  localStorage.removeItem('counselor_token');
  localStorage.removeItem('counselor_info');
};

// 認証状態確認
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  return !!token;
};

// カウンセラー情報取得
export const getCounselorInfo = (): Counselor | null => {
  const info = localStorage.getItem('counselor_info');
  return info ? JSON.parse(info) : null;
};