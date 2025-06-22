import React, { useState } from 'react';
import { Shield, Users, Calendar, MessageCircle, TrendingUp, Search, LogOut, Eye } from 'lucide-react';

interface DiaryEntry {
  id: string;
  date: string;
  emotion: string;
  event: string;
  realization: string;
  selfEsteemScore: number;
  worthlessnessScore: number;
}

const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<DiaryEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState('');

  const emotions = ['恐怖', '悲しみ', '怒り', '悔しい', '無価値感', '罪悪感', '寂しさ', '恥ずかしさ'];

  // デモ用の簡単な認証（実際のプロダクションでは使用しないでください）
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@namisapo.com' && password === 'admin123') {
      setIsAuthenticated(true);
      loadLocalEntries();
      alert('ログインしました！（デモモード）');
    } else {
      alert('メールアドレス: admin@namisapo.com\nパスワード: admin123\nでログインしてください');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setEntries([]);
    setEmail('');
    setPassword('');
  };

  // ローカルストレージからデータを読み込み（デモ用）
  const loadLocalEntries = () => {
    const savedEntries = localStorage.getItem('journalEntries');
    if (savedEntries) {
      const parsedEntries = JSON.parse(savedEntries);
      setEntries(parsedEntries);
      setFilteredEntries(parsedEntries);
    }
  };

  const filterEntries = () => {
    let filtered = [...entries];

    if (searchTerm) {
      filtered = filtered.filter(entry =>
        entry.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.realization.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedEmotion) {
      filtered = filtered.filter(entry => entry.emotion === selectedEmotion);
    }

    setFilteredEntries(filtered);
  };

  React.useEffect(() => {
    filterEntries();
  }, [searchTerm, selectedEmotion, entries]);

  const getEmotionColor = (emotion: string) => {
    const colorMap: { [key: string]: string } = {
      '恐怖': 'bg-purple-100 text-purple-800 border-purple-200',
      '悲しみ': 'bg-blue-100 text-blue-800 border-blue-200',
      '怒り': 'bg-red-100 text-red-800 border-red-200',
      '悔しい': 'bg-green-100 text-green-800 border-green-200',
      '無価値感': 'bg-gray-100 text-gray-800 border-gray-300',
      '罪悪感': 'bg-orange-100 text-orange-800 border-orange-200',
      '寂しさ': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      '恥ずかしさ': 'bg-pink-100 text-pink-800 border-pink-200'
    };
    return colorMap[emotion] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getUrgencyLevel = (entry: DiaryEntry) => {
    if (entry.emotion === '無価値感' && entry.worthlessnessScore > 80) {
      return { level: 'high', color: 'bg-red-500', text: '緊急' };
    } else if (entry.worthlessnessScore > 70) {
      return { level: 'medium', color: 'bg-yellow-500', text: '注意' };
    }
    return { level: 'low', color: 'bg-green-500', text: '安定' };
  };

  // ログイン画面
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-jp-bold text-gray-900 mb-2">
              カウンセラー管理画面
            </h1>
            <p className="text-gray-600 font-jp-normal">
              デモモード - ローカルデータを表示
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-jp-medium text-gray-700 mb-2">
                メールアドレス
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-jp-normal"
                placeholder="admin@namisapo.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-jp-medium text-gray-700 mb-2">
                パスワード
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-jp-normal"
                placeholder="admin123"
                required
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-blue-800 text-sm font-jp-normal">
                <strong>デモ用ログイン情報:</strong><br />
                メール: admin@namisapo.com<br />
                パスワード: admin123
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-jp-medium transition-colors shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
            >
              <Shield className="w-5 h-5" />
              <span>ログイン（デモモード）</span>
            </button>
          </form>

          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-xs text-gray-500">
              一般社団法人NAMIDAサポート協会<br />
              デモ管理システム
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 管理画面メイン
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-jp-bold text-gray-900">カウンセラー管理画面</h1>
                <p className="text-sm text-gray-600 font-jp-normal">
                  デモモード - ローカルデータ表示
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>ログアウト</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-jp-medium text-gray-500">総ユーザー数</p>
                <p className="text-2xl font-jp-bold text-gray-900">1</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MessageCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-jp-medium text-gray-500">総日記数</p>
                <p className="text-2xl font-jp-bold text-gray-900">{entries.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-jp-medium text-gray-500">今日の日記</p>
                <p className="text-2xl font-jp-bold text-gray-900">
                  {entries.filter(e => e.date === new Date().toISOString().split('T')[0]).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-jp-medium text-gray-500">緊急ケース</p>
                <p className="text-2xl font-jp-bold text-gray-900">
                  {entries.filter(e => e.emotion === '無価値感' && e.worthlessnessScore > 80).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* フィルター */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-jp-bold text-gray-900 mb-4">検索・フィルター</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-jp-medium text-gray-700 mb-2">キーワード検索</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="日記内容で検索"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-jp-normal text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-jp-medium text-gray-700 mb-2">感情</label>
              <select
                value={selectedEmotion}
                onChange={(e) => setSelectedEmotion(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-jp-normal text-sm"
              >
                <option value="">すべての感情</option>
                {emotions.map(emotion => (
                  <option key={emotion} value={emotion}>{emotion}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 日記一覧 */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-jp-bold text-gray-900">
              日記一覧 ({filteredEntries.length}件)
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredEntries.length === 0 ? (
              <div className="p-12 text-center">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-jp-medium text-gray-500 mb-2">
                  日記データがありません
                </h3>
                <p className="text-gray-400 font-jp-normal">
                  まず日記を作成してからこの画面をご確認ください
                </p>
              </div>
            ) : (
              filteredEntries.map((entry) => {
                const urgency = getUrgencyLevel(entry);
                return (
                  <div key={entry.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${urgency.color}`}></div>
                        <span className={`px-2 py-1 rounded-full text-xs font-jp-medium border ${getEmotionColor(entry.emotion)}`}>
                          {entry.emotion}
                        </span>
                        <span className="text-sm font-jp-medium text-gray-900">ローカルユーザー</span>
                        <span className="text-sm text-gray-500 font-jp-normal">{formatDate(entry.date)}</span>
                        <span className={`px-2 py-1 rounded text-xs font-jp-medium text-white ${urgency.color}`}>
                          {urgency.text}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-jp-semibold text-gray-700 mb-2 text-sm">出来事</h4>
                        <p className="text-gray-600 text-sm font-jp-normal leading-relaxed">
                          {entry.event}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-jp-semibold text-gray-700 mb-2 text-sm">気づき</h4>
                        <p className="text-gray-600 text-sm font-jp-normal leading-relaxed">
                          {entry.realization}
                        </p>
                      </div>
                    </div>

                    {entry.emotion === '無価値感' && (
                      <div className="flex space-x-6 text-sm bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500 font-jp-medium">自己肯定感:</span>
                          <span className="font-jp-semibold text-blue-600">
                            {entry.selfEsteemScore}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500 font-jp-medium">無価値感:</span>
                          <span className="font-jp-semibold text-red-600">
                            {entry.worthlessnessScore}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;