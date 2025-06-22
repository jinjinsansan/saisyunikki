import React, { useState, useEffect } from 'react';
import { Users, Calendar, Heart, Search, Filter, Download, Eye } from 'lucide-react';
import { railwayClient, RailwayJournalEntry } from '../lib/railway';

const AdminPanel: React.FC = () => {
  const [entries, setEntries] = useState<RailwayJournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedEntry, setSelectedEntry] = useState<RailwayJournalEntry | null>(null);

  const emotions = [
    '恐怖', '悲しみ', '怒り', '悔しい', '無価値感', '罪悪感', '寂しさ', '恥ずかしさ'
  ];

  useEffect(() => {
    loadAllEntries();
  }, []);

  const loadAllEntries = async () => {
    setLoading(true);
    try {
      const data = await railwayClient.request('/api/admin/diary');
      setEntries(data);
    } catch (error) {
      console.error('データ読み込みエラー:', error);
      alert('データの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = !searchTerm || 
      entry.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.realization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.line_username?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEmotion = !selectedEmotion || entry.emotion === selectedEmotion;
    const matchesUser = !selectedUser || entry.line_username === selectedUser;
    
    const matchesDateRange = (!dateRange.start || entry.date >= dateRange.start) &&
                            (!dateRange.end || entry.date <= dateRange.end);

    return matchesSearch && matchesEmotion && matchesUser && matchesDateRange;
  });

  const uniqueUsers = [...new Set(entries.map(entry => entry.line_username))].filter(Boolean);

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
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const exportData = () => {
    const csvContent = [
      ['ユーザー名', '日付', '感情', '出来事', '気づき', '自己肯定感', '無価値感', '作成日時'],
      ...filteredEntries.map(entry => [
        entry.line_username || '',
        entry.date,
        entry.emotion,
        entry.event.replace(/"/g, '""'),
        entry.realization.replace(/"/g, '""'),
        entry.self_esteem_score,
        entry.worthlessness_score,
        new Date(entry.created_at).toLocaleString('ja-JP')
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `diary_entries_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto space-y-6 px-2">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-jp-normal">データを読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 px-2">
      {/* ヘッダー */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-jp-bold text-gray-900">カウンセラー管理画面</h1>
            <p className="text-gray-600 font-jp-normal">全ユーザーの感情日記を管理・確認できます</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={exportData}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-jp-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>CSV出力</span>
            </button>
            <button
              onClick={loadAllEntries}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-jp-medium transition-colors"
            >
              <span>更新</span>
            </button>
          </div>
        </div>

        {/* 統計情報 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center space-x-3">
              <Users className="w-6 h-6 text-blue-600" />
              <div>
                <p className="text-blue-600 font-jp-medium text-sm">総ユーザー数</p>
                <p className="text-2xl font-jp-bold text-blue-800">{uniqueUsers.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center space-x-3">
              <Calendar className="w-6 h-6 text-green-600" />
              <div>
                <p className="text-green-600 font-jp-medium text-sm">総日記数</p>
                <p className="text-2xl font-jp-bold text-green-800">{entries.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="flex items-center space-x-3">
              <Heart className="w-6 h-6 text-red-600" />
              <div>
                <p className="text-red-600 font-jp-medium text-sm">無価値感日記</p>
                <p className="text-2xl font-jp-bold text-red-800">
                  {entries.filter(e => e.emotion === '無価値感').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* フィルター */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-jp-medium text-gray-700 mb-2">検索</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ユーザー名、内容で検索..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-jp-normal text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-jp-medium text-gray-700 mb-2">ユーザー</label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-jp-normal text-sm"
              >
                <option value="">全ユーザー</option>
                {uniqueUsers.map(user => (
                  <option key={user} value={user}>{user}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-jp-medium text-gray-700 mb-2">感情</label>
              <select
                value={selectedEmotion}
                onChange={(e) => setSelectedEmotion(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-jp-normal text-sm"
              >
                <option value="">全感情</option>
                {emotions.map(emotion => (
                  <option key={emotion} value={emotion}>{emotion}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-jp-medium text-gray-700 mb-2">期間</label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                  className="flex-1 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-jp-normal text-xs"
                />
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                  className="flex-1 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-jp-normal text-xs"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600 font-jp-normal">
              {filteredEntries.length}件の日記が見つかりました
            </p>
            {(searchTerm || selectedEmotion || selectedUser || dateRange.start || dateRange.end) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedEmotion('');
                  setSelectedUser('');
                  setDateRange({ start: '', end: '' });
                }}
                className="text-sm text-gray-500 hover:text-gray-700 font-jp-normal"
              >
                フィルターをクリア
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 日記一覧 */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-jp-medium text-gray-500 mb-2">
              日記が見つかりません
            </h3>
            <p className="text-gray-400 font-jp-normal">
              検索条件を変更してみてください
            </p>
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <div key={entry.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3 flex-wrap">
                  <span className="font-jp-bold text-gray-900">{entry.line_username}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-jp-medium border ${getEmotionColor(entry.emotion)}`}>
                    {entry.emotion}
                  </span>
                  <span className="text-gray-500 text-sm font-jp-normal">
                    {formatDate(entry.date)}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedEntry(entry)}
                  className="text-blue-600 hover:text-blue-700 p-1"
                  title="詳細表示"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-jp-semibold text-gray-700 mb-2">出来事</h4>
                  <p className="text-gray-600 text-sm font-jp-normal leading-relaxed line-clamp-3">
                    {entry.event}
                  </p>
                </div>
                <div>
                  <h4 className="font-jp-semibold text-gray-700 mb-2">気づき</h4>
                  <p className="text-gray-600 text-sm font-jp-normal leading-relaxed line-clamp-3">
                    {entry.realization}
                  </p>
                </div>
              </div>

              {entry.emotion === '無価値感' && (
                <div className="flex flex-wrap gap-6 text-sm bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500 font-jp-medium">自己肯定感:</span>
                    <span className="font-jp-semibold text-blue-600">
                      {entry.self_esteem_score}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500 font-jp-medium">無価値感:</span>
                    <span className="font-jp-semibold text-red-600">
                      {entry.worthlessness_score}
                    </span>
                  </div>
                </div>
              )}

              <div className="mt-3 text-xs text-gray-400 font-jp-normal">
                作成日時: {new Date(entry.created_at).toLocaleString('ja-JP')}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 詳細モーダル */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-jp-bold text-gray-900">日記詳細</h2>
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-jp-medium text-gray-700 mb-1">ユーザー名</label>
                    <p className="font-jp-bold text-gray-900">{selectedEntry.line_username}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-jp-medium text-gray-700 mb-1">日付</label>
                    <p className="font-jp-bold text-gray-900">{formatDate(selectedEntry.date)}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-jp-medium text-gray-700 mb-1">感情</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-jp-medium border ${getEmotionColor(selectedEntry.emotion)}`}>
                    {selectedEntry.emotion}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-jp-medium text-gray-700 mb-2">出来事</label>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-800 font-jp-normal leading-relaxed whitespace-pre-wrap">
                      {selectedEntry.event}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-jp-medium text-gray-700 mb-2">気づき</label>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-800 font-jp-normal leading-relaxed whitespace-pre-wrap">
                      {selectedEntry.realization}
                    </p>
                  </div>
                </div>

                {selectedEntry.emotion === '無価値感' && (
                  <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <label className="block text-sm font-jp-medium text-gray-700 mb-2">スコア</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-600 font-jp-medium">自己肯定感:</span>
                        <span className="ml-2 font-jp-bold text-blue-600 text-lg">
                          {selectedEntry.self_esteem_score}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 font-jp-medium">無価値感:</span>
                        <span className="ml-2 font-jp-bold text-red-600 text-lg">
                          {selectedEntry.worthlessness_score}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-500 font-jp-normal pt-4 border-t">
                  作成日時: {new Date(selectedEntry.created_at).toLocaleString('ja-JP')}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;