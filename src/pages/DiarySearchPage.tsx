import React, { useState } from 'react';
import { Search, Calendar, Heart, Edit, Trash2, X, Save } from 'lucide-react';

interface JournalEntry {
  id: string;
  date: string;
  emotion: string;
  event: string;
  realization: string;
  selfEsteemScore: number;
  worthlessnessScore: number;
}

interface DiarySearchPageProps {
  journalEntries: JournalEntry[];
  setJournalEntries: React.Dispatch<React.SetStateAction<JournalEntry[]>>;
}

export default function DiarySearchPage({ journalEntries, setJournalEntries }: DiarySearchPageProps) {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [searchEmotion, setSearchEmotion] = useState('');
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [editForm, setEditForm] = useState({
    date: '',
    emotion: '',
    event: '',
    realization: '',
    selfEsteemScore: 50,
    worthlessnessScore: 50
  });

  const emotions = [
    '無価値感', '悲しみ', '怒り', '恐怖', '罪悪感', '寂しさ', '恥ずかしさ', '悔しさ'
  ];

  // 検索フィルタリング
  const filteredEntries = journalEntries.filter(entry => {
    const matchesKeyword = !searchKeyword || 
      entry.event.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      entry.realization.toLowerCase().includes(searchKeyword.toLowerCase());
    
    const matchesDate = !searchDate || entry.date === searchDate;
    const matchesEmotion = !searchEmotion || entry.emotion === searchEmotion;
    
    return matchesKeyword && matchesDate && matchesEmotion;
  });

  // 直近の日記（検索条件がない場合）
  const recentEntries = journalEntries
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const displayEntries = (searchKeyword || searchDate || searchEmotion) ? filteredEntries : recentEntries;

  // 編集開始
  const startEdit = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setEditForm({
      date: entry.date,
      emotion: entry.emotion,
      event: entry.event,
      realization: entry.realization,
      selfEsteemScore: entry.selfEsteemScore,
      worthlessnessScore: entry.worthlessnessScore
    });
  };

  // 編集保存
  const saveEdit = () => {
    if (!editingEntry) return;

    const updatedEntries = journalEntries.map(entry =>
      entry.id === editingEntry.id
        ? { ...entry, ...editForm }
        : entry
    );

    setJournalEntries(updatedEntries);
    localStorage.setItem('journal-entries', JSON.stringify(updatedEntries));
    setEditingEntry(null);
    alert('日記を更新しました！');
  };

  // 削除
  const deleteEntry = (id: string) => {
    if (confirm('この日記を削除しますか？')) {
      const updatedEntries = journalEntries.filter(entry => entry.id !== id);
      setJournalEntries(updatedEntries);
      localStorage.setItem('journal-entries', JSON.stringify(updatedEntries));
      alert('日記を削除しました。');
    }
  };

  const getEmotionColor = (emotion: string) => {
    const colors: { [key: string]: string } = {
      '無価値感': 'bg-red-100 text-red-800 border-red-200',
      '悲しみ': 'bg-blue-100 text-blue-800 border-blue-200',
      '怒り': 'bg-orange-100 text-orange-800 border-orange-200',
      '恐怖': 'bg-purple-100 text-purple-800 border-purple-200',
      '罪悪感': 'bg-gray-100 text-gray-800 border-gray-200',
      '寂しさ': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      '恥ずかしさ': 'bg-pink-100 text-pink-800 border-pink-200',
      '悔しさ': 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return colors[emotion] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl sm:text-4xl font-jp-bold text-gray-800">日記検索</h1>
          </div>
          <p className="text-lg text-gray-600 leading-relaxed">
            過去の日記を検索・閲覧できます
          </p>
        </div>

        {/* 検索フィルター */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8 border border-gray-200">
          <h2 className="text-xl font-jp-bold text-gray-800 mb-4">検索条件</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* キーワード検索 */}
            <div>
              <label className="block text-gray-700 font-jp-medium mb-2">キーワード</label>
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="出来事や気づきから検索"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 日付検索 */}
            <div>
              <label className="block text-gray-700 font-jp-medium mb-2">日付</label>
              <input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 感情検索 */}
            <div>
              <label className="block text-gray-700 font-jp-medium mb-2">感情</label>
              <select
                value={searchEmotion}
                onChange={(e) => setSearchEmotion(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">すべての感情</option>
                {emotions.map(emotion => (
                  <option key={emotion} value={emotion}>{emotion}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 検索リセット */}
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setSearchKeyword('');
                setSearchDate('');
                setSearchEmotion('');
              }}
              className="text-blue-600 hover:text-blue-700 font-jp-medium"
            >
              検索条件をリセット
            </button>
          </div>
        </div>

        {/* 検索結果 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-jp-bold text-gray-800">
              {(searchKeyword || searchDate || searchEmotion) ? '検索結果' : '直近の日記'}
            </h2>
            <span className="text-gray-500 text-sm">
              {displayEntries.length}件
            </span>
          </div>

          {displayEntries.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {(searchKeyword || searchDate || searchEmotion) ? '検索条件に一致する日記が見つかりません' : '日記がまだありません'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {displayEntries.map((entry) => (
                <div key={entry.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-700 font-jp-medium">{entry.date}</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-jp-medium border ${getEmotionColor(entry.emotion)}`}>
                        {entry.emotion}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEdit(entry)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="編集"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteEntry(entry.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="削除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-jp-bold text-gray-800 mb-1">出来事</h4>
                      <p className="text-gray-700 leading-relaxed">{entry.event}</p>
                    </div>
                    <div>
                      <h4 className="font-jp-bold text-gray-800 mb-1">気づき</h4>
                      <p className="text-gray-700 leading-relaxed">{entry.realization}</p>
                    </div>
                    
                    {entry.emotion === '無価値感' && (
                      <div className="grid grid-cols-2 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
                        <div className="text-center">
                          <span className="text-sm text-gray-600">自己肯定感</span>
                          <div className="text-2xl font-jp-bold text-blue-600">{entry.selfEsteemScore}</div>
                        </div>
                        <div className="text-center">
                          <span className="text-sm text-gray-600">無価値感</span>
                          <div className="text-2xl font-jp-bold text-red-600">{entry.worthlessnessScore}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 編集モーダル */}
        {editingEntry && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-jp-bold text-gray-800">日記を編集</h2>
                  <button
                    onClick={() => setEditingEntry(null)}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* 日付 */}
                  <div>
                    <label className="block text-gray-700 font-jp-medium mb-2">日付</label>
                    <input
                      type="date"
                      value={editForm.date}
                      onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* 感情 */}
                  <div>
                    <label className="block text-gray-700 font-jp-medium mb-2">感情</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {emotions.map((emotion) => (
                        <button
                          key={emotion}
                          onClick={() => setEditForm({...editForm, emotion})}
                          className={`p-2 rounded-lg border text-sm font-jp-medium transition-all ${
                            editForm.emotion === emotion
                              ? getEmotionColor(emotion)
                              : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          {emotion}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* スコア（無価値感の場合） */}
                  {editForm.emotion === '無価値感' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-700 font-jp-medium mb-2">
                          自己肯定感: {editForm.selfEsteemScore}
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={editForm.selfEsteemScore}
                          onChange={(e) => setEditForm({...editForm, selfEsteemScore: Number(e.target.value)})}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-jp-medium mb-2">
                          無価値感: {editForm.worthlessnessScore}
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={editForm.worthlessnessScore}
                          onChange={(e) => setEditForm({...editForm, worthlessnessScore: Number(e.target.value)})}
                          className="w-full"
                        />
                      </div>
                    </div>
                  )}

                  {/* 出来事 */}
                  <div>
                    <label className="block text-gray-700 font-jp-medium mb-2">出来事</label>
                    <textarea
                      value={editForm.event}
                      onChange={(e) => setEditForm({...editForm, event: e.target.value})}
                      className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  {/* 気づき */}
                  <div>
                    <label className="block text-gray-700 font-jp-medium mb-2">気づき</label>
                    <textarea
                      value={editForm.realization}
                      onChange={(e) => setEditForm({...editForm, realization: e.target.value})}
                      className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  {/* 保存ボタン */}
                  <div className="flex space-x-4">
                    <button
                      onClick={saveEdit}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-jp-bold transition-colors flex items-center justify-center"
                    >
                      <Save className="w-5 h-5 mr-2" />
                      保存
                    </button>
                    <button
                      onClick={() => setEditingEntry(null)}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg font-jp-bold transition-colors"
                    >
                      キャンセル
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}