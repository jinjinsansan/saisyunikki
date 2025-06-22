// Railway API クライアント
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface RailwayJournalEntry {
  id: number;
  user_id: number;
  date: string;
  emotion: string;
  event: string;
  realization: string;
  self_esteem_score: number;
  worthlessness_score: number;
  created_at: string;
  line_username?: string;
}

class RailwayClient {
  private async request(endpoint: string, options: RequestInit = {}) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.warn('Railway API エラー (オフラインモード):', error);
      throw error;
    }
  }

  // ユーザー作成または取得
  async createOrGetUser(lineUsername: string) {
    return this.request('/api/users', {
      method: 'POST',
      body: JSON.stringify({ line_username: lineUsername }),
    });
  }

  // 日記エントリー保存
  async saveDiaryEntry(entry: {
    line_username: string;
    date: string;
    emotion: string;
    event: string;
    realization: string;
    self_esteem_score: number;
    worthlessness_score: number;
  }) {
    return this.request('/api/diary', {
      method: 'POST',
      body: JSON.stringify(entry),
    });
  }

  // 日記エントリー取得
  async getDiaryEntries(lineUsername: string): Promise<RailwayJournalEntry[]> {
    return this.request(`/api/diary/${lineUsername}`);
  }

  // ヘルスチェック
  async healthCheck() {
    return this.request('/api/health');
  }

  // 同期状態チェック
  async checkConnection(): Promise<boolean> {
    try {
      await this.healthCheck();
      return true;
    } catch {
      return false;
    }
  }
}

export const railwayClient = new RailwayClient();

// ローカルストレージとRailwayの同期ユーティリティ
export const syncWithRailway = async (
  localEntries: any[],
  lineUsername: string
): Promise<{ success: boolean; synced: number; errors: number }> => {
  let synced = 0;
  let errors = 0;

  // Railway接続チェック
  const isConnected = await railwayClient.checkConnection();
  if (!isConnected) {
    console.log('Railway接続なし - ローカルモードで継続');
    return { success: false, synced: 0, errors: 0 };
  }

  // ユーザー作成または取得
  try {
    await railwayClient.createOrGetUser(lineUsername);
  } catch (error) {
    console.error('ユーザー作成エラー:', error);
    return { success: false, synced: 0, errors: 1 };
  }

  // 各エントリーを同期
  for (const entry of localEntries) {
    try {
      await railwayClient.saveDiaryEntry({
        line_username: lineUsername,
        date: entry.date,
        emotion: entry.emotion,
        event: entry.event,
        realization: entry.realization,
        self_esteem_score: entry.selfEsteemScore,
        worthlessness_score: entry.worthlessnessScore,
      });
      synced++;
    } catch (error) {
      console.error('エントリー同期エラー:', error);
      errors++;
    }
  }

  return { success: synced > 0, synced, errors };
};