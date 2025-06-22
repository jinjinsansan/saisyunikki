import React, { useState, useEffect } from 'react';
import { Shield, Users, Calendar, MessageCircle, TrendingUp, Search, LogOut, RefreshCw, Database, Wifi, WifiOff, AlertTriangle, Clock, Filter, Eye, UserCheck, Star, ArrowUp, ArrowDown } from 'lucide-react';
import { getAllDiaryEntries, checkSupabaseConnection, JournalEntry } from '../lib/supabase';

const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState<'all' | 'urgent' | 'attention' | 'stable'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'urgency' | 'user'>('urgency');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [assignedCounselor, setAssignedCounselor] = useState('');
  const [currentCounselor, setCurrentCounselor] = useState('');
  const [viewMode, setViewMode] = useState<'all' | 'assigned' | 'unassigned'>('all');
  const [loading, setLoading] = useState(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const [dataSource, setDataSource] = useState<'local' | 'supabase'>('local');

  const emotions = ['恐怖', '悲しみ', '怒り', '悔しい', '無価値感', '罪悪感', '寂しさ', '恥ずかしさ'];
  const counselors = ['仁カウンセラー', 'AOIカウンセラー', 'あさみカウンセラー', 'SHUカウンセラー', 'ゆーちゃカウンセラー', 'sammyカウンセラー'];

  // Supabase接続状態をチェック
  useEffect(() => {
    const checkConnection = async () => {
      const connected = await checkSupabaseConnection();
      setIsSupabaseConnected(connected);
      setDataSource(connected ? 'supabase' : 'local');
    };
    
    if (isAuthenticated) {
      checkConnection();
    }
  }, [isAuthenticated]);

  // 認証処理
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // カウンセラー別ログイン
    const counselorCredentials = {
      'jin@namisapo.com': { password: 'counselor123', name: '仁カウンセラー' },
      'aoi@namisapo.com': { password: 'counselor123', name: 'AOIカウンセラー' },
      'asami@namisapo.com': { password: 'counselor123', name: 'あさみカウンセラー' },
      'shu@namisapo.com': { password: 'counselor123', name: 'SHUカウンセラー' },
      'yucha@namisapo.com': { password: 'counselor123', name: 'ゆーちゃカウンセラー' },
      'sammy@namisapo.com': { password: 'counselor123', name: 'sammyカウンセラー' }
    };

    const credential = counselorCredentials[email as keyof typeof counselorCredentials];
    
    if (credential && password === credential.password) {
      setIsAuthenticated(true);
      setCurrentCounselor(credential.name);
      loadEntries();
    } else {
      alert('正しいメールアドレスとパスワードを入力してください。');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setEntries([]);
    setEmail('');
    setPassword('');
    setCurrentCounselor('');
  };

  // データ読み込み
  const loadEntries = async () => {
    setLoading(true);
    try {
      const data = await getAllDiaryEntries();
      
      // ローカルストレージから担当者情報を取得
      const assignments = JSON.parse(localStorage.getItem('counselorAssignments') || '{}');
      const priorities = JSON.parse(localStorage.getItem('entryPriorities') || '{}');
      
      const enrichedData = data.map(entry => ({
        ...entry,
        assignedCounselor: assignments[entry.id] || '',
        priority: priorities[entry.id] || 'normal',
        isRead: JSON.parse(localStorage.getItem('readEntries') || '{}')[entry.id] || false
      }));
      
      setEntries(enrichedData);
      setFilteredEntries(enrichedData);
      console.log(`✅ ${enrichedData.length}件のデータを読み込みました (${dataSource})`);
    } catch (error) {
      console.error('データ読み込みエラー:', error);
      // エラーの場合はローカルデータにフォールバック
      const savedEntries = localStorage.getItem('journalEntries');
      if (savedEntries) {
        const localData = JSON.parse(savedEntries).map((entry: any) => ({
          ...entry,
          userId: 'local-user',
          userName: 'ローカルユーザー',
          createdAt: entry.date,
          assignedCounselor: '',
          priority: 'normal',
          isRead: false
        }));
        setEntries(localData);
        setFilteredEntries(localData);
        setDataSource('local');
      }
    } finally {
      setLoading(false);
    }
  };

  // 担当者割り当て
  const assignCounselor = (entryId: string, counselor: string) => {
    const assignments = JSON.parse(localStorage.getItem('counselorAssignments') || '{}');
    assignments[entryId] = counselor;
    localStorage.setItem('counselorAssignments', JSON.stringify(assignments));
    
    setEntries(prev => prev.map(entry => 
      entry.id === entryId ? { ...entry, assignedCounselor: counselor } : entry
    ));
  };

  // 優先度設定
  const setPriority = (entryId: string, priority: 'high' | 'normal' | 'low') => {
    const priorities = JSON.parse(localStorage.getItem('entryPriorities') || '{}');
    priorities[entryId] = priority;
    localStorage.setItem('entryPriorities', JSON.stringify(priorities));
    
    setEntries(prev => prev.map(entry => 
      entry.id === entryId ? { ...entry, priority } : entry
    ));
  };

  // 既読マーク
  const markAsRead = (entryId: string) => {
    const readEntries = JSON.parse(localStorage.getItem('readEntries') || '{}');
    readEntries[entryId] = true;
    localStorage.setItem('readEntries', JSON.stringify(readEntries));
    
    setEntries(prev => prev.map(entry => 
      entry.id === entryId ? { ...entry, isRead: true } : entry
    ));
  };

  // フィルタリングとソート
  const filterAndSortEntries = () => {
    let filtered = [...entries];

    // 基本フィルター
    if (searchTerm) {
      filtered = filtered.filter(entry =>
        entry.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.realization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (entry.userName && entry.userName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedEmotion) {
      filtered = filtered.filter(entry => entry.emotion === selectedEmotion);
    }

    // 緊急度フィルター
    if (urgencyFilter !== 'all') {
      filtered = filtered.filter(entry => {
        const urgency = getUrgencyLevel(entry);
        switch (urgencyFilter) {
          case 'urgent': return urgency.level === 'high';
          case 'attention': return urgency.level === 'medium';
          case 'stable': return urgency.level === 'low';
          default: return true;
        }
      });
    }

    // 担当者フィルター
    if (assignedCounselor) {
      filtered = filtered.filter(entry => entry.assignedCounselor === assignedCounselor);
    }

    // 表示モードフィルター
    if (viewMode === 'assigned') {
      filtered = filtered.filter(entry => entry.assignedCounselor === currentCounselor);
    } else if (viewMode === 'unassigned') {
      filtered = filtered.filter(entry => !entry.assignedCounselor);
    }

    // ソート
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'urgency':
          const urgencyA = getUrgencyLevel(a);
          const urgencyB = getUrgencyLevel(b);
          const urgencyOrder = { high: 3, medium: 2, low: 1 };
          comparison = urgencyOrder[urgencyB.level as keyof typeof urgencyOrder] - urgencyOrder[urgencyA.level as keyof typeof urgencyOrder];
          break;
        case 'date':
          comparison = new Date(b.date).getTime() - new Date(a.date).getTime();
          break;
        case 'user':
          comparison = (a.userName || '').localeCompare(b.userName || '');
          break;
      }
      
      return sortOrder === 'desc' ? comparison : -comparison;
    });

    setFilteredEntries(filtered);
  };

  useEffect(() => {
    filterAndSortEntries();
  }, [searchTerm, selectedEmotion, urgencyFilter, assignedCounselor, viewMode, sortBy, sortOrder, entries]);

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

  const getUrgencyLevel = (entry: JournalEntry) => {
    if (entry.emotion === '無価値感' && entry.worthlessnessScore > 80) {
      return { level: 'high', color: 'bg-red-500', text: '緊急' };
    } else if (entry.worthlessnessScore > 70) {
      return { level: 'medium', color: 'bg-yellow-500', text: '注意' };
    }
    return { level: 'low', color: 'bg-green-500', text: '安定' };
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // 統計計算
  const stats = {
    totalUsers: new Set(entries.map(e => e.userId)).size,
    totalEntries: entries.length,
    todayEntries: entries.filter(e => e.date === new Date().toISOString().split('T')[0]).length,
    urgentCases: entries.filter(e => e.emotion === '無価値感' && e.worthlessnessScore > 80).length,
    myAssigned: entries.filter(e => e.assignedCounselor === currentCounselor).length,
    unassigned: entries.filter(e => !e.assignedCounselor).length
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
              効率的な日記管理システム
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
                placeholder="例: tanaka@namisapo.com"
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
                placeholder="パスワードを入力"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-jp-medium transition-colors shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
            >
              <Shield className="w-5 h-5" />
              <span>ログイン</span>
            </button>
          </form>

          <div className="mt-6 pt-6 border-t">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-jp-bold text-blue-900 mb-2 text-sm">カウンセラー専用アカウント</h3>
              <div className="text-xs text-blue-800 space-y-1">
                <p>• 仁カウンセラー: jin@namisapo.com</p>
                <p>• AOIカウンセラー: aoi@namisapo.com</p>
                <p>• あさみカウンセラー: asami@namisapo.com</p>
                <p>• SHUカウンセラー: shu@namisapo.com</p>
                <p>• ゆーちゃカウンセラー: yucha@namisapo.com</p>
                <p>• sammyカウンセラー: sammy@namisapo.com</p>
                <p className="mt-2 font-jp-medium">パスワード: counselor123</p>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              一般社団法人NAMIDAサポート協会<br />
              カウンセラー管理システム
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
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-blue-600 font-jp-medium">{currentCounselor}</span>
                  {isSupabaseConnected ? (
                    <div className="flex items-center space-x-1">
                      <Wifi className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600 font-jp-medium">Supabase接続中</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1">
                      <WifiOff className="w-4 h-4 text-orange-600" />
                      <span className="text-sm text-orange-600 font-jp-medium">ローカルモード</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={loadEntries}
                disabled={loading}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>更新</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>ログアウト</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* 統計カード */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <Users className="h-6 w-6 text-blue-600" />
              <div className="ml-3">
                <p className="text-xs font-jp-medium text-gray-500">総ユーザー</p>
                <p className="text-lg font-jp-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <MessageCircle className="h-6 w-6 text-green-600" />
              <div className="ml-3">
                <p className="text-xs font-jp-medium text-gray-500">総日記数</p>
                <p className="text-lg font-jp-bold text-gray-900">{stats.totalEntries}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <Calendar className="h-6 w-6 text-yellow-600" />
              <div className="ml-3">
                <p className="text-xs font-jp-medium text-gray-500">今日の日記</p>
                <p className="text-lg font-jp-bold text-gray-900">{stats.todayEntries}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <div className="ml-3">
                <p className="text-xs font-jp-medium text-gray-500">緊急ケース</p>
                <p className="text-lg font-jp-bold text-gray-900">{stats.urgentCases}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <UserCheck className="h-6 w-6 text-purple-600" />
              <div className="ml-3">
                <p className="text-xs font-jp-medium text-gray-500">私の担当</p>
                <p className="text-lg font-jp-bold text-gray-900">{stats.myAssigned}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <Clock className="h-6 w-6 text-orange-600" />
              <div className="ml-3">
                <p className="text-xs font-jp-medium text-gray-500">未割当</p>
                <p className="text-lg font-jp-bold text-gray-900">{stats.unassigned}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 表示モード切り替え */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex space-x-2">
              {[
                { key: 'all', label: 'すべて', icon: MessageCircle },
                { key: 'assigned', label: '私の担当', icon: UserCheck },
                { key: 'unassigned', label: '未割当', icon: Clock }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setViewMode(key as any)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-jp-medium transition-colors ${
                    viewMode === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-jp-medium text-gray-700">ソート:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="urgency">緊急度</option>
                  <option value="date">日付</option>
                  <option value="user">ユーザー</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-1 text-gray-600 hover:text-gray-900"
                >
                  {sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* フィルター */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-jp-bold text-gray-900 mb-4">検索・フィルター</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-jp-medium text-gray-700 mb-2">キーワード検索</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="日記内容、ユーザー名で検索"
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

            <div>
              <label className="block text-sm font-jp-medium text-gray-700 mb-2">緊急度</label>
              <select
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-jp-normal text-sm"
              >
                <option value="all">すべて</option>
                <option value="urgent">緊急</option>
                <option value="attention">注意</option>
                <option value="stable">安定</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-jp-medium text-gray-700 mb-2">担当者</label>
              <select
                value={assignedCounselor}
                onChange={(e) => setAssignedCounselor(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-jp-normal text-sm"
              >
                <option value="">すべての担当者</option>
                {counselors.map(counselor => (
                  <option key={counselor} value={counselor}>{counselor}</option>
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
                  {loading ? 'データを読み込み中...' : '該当する日記がありません'}
                </h3>
                <p className="text-gray-400 font-jp-normal">
                  {loading ? 'しばらくお待ちください' : 'フィルター条件を変更してお試しください'}
                </p>
              </div>
            ) : (
              filteredEntries.map((entry) => {
                const urgency = getUrgencyLevel(entry);
                return (
                  <div key={entry.id} className={`p-6 transition-colors ${entry.isRead ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3 flex-wrap">
                        <div className={`w-3 h-3 rounded-full ${urgency.color}`}></div>
                        <span className={`px-2 py-1 rounded-full text-xs font-jp-medium border ${getEmotionColor(entry.emotion)}`}>
                          {entry.emotion}
                        </span>
                        <span className="text-sm font-jp-medium text-gray-900">
                          {entry.userName || 'ユーザー'}
                        </span>
                        <span className="text-sm text-gray-500 font-jp-normal">{formatDate(entry.date)}</span>
                        <span className={`px-2 py-1 rounded text-xs font-jp-medium text-white ${urgency.color}`}>
                          {urgency.text}
                        </span>
                        {entry.priority !== 'normal' && (
                          <span className={`px-2 py-1 rounded-full text-xs font-jp-medium border ${getPriorityColor(entry.priority)}`}>
                            {entry.priority === 'high' ? '高優先度' : '低優先度'}
                          </span>
                        )}
                        {!entry.isRead && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-jp-medium">
                            未読
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {!entry.isRead && (
                          <button
                            onClick={() => markAsRead(entry.id)}
                            className="text-blue-600 hover:text-blue-700 p-1"
                            title="既読にする"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        
                        <select
                          value={entry.priority || 'normal'}
                          onChange={(e) => setPriority(entry.id, e.target.value as any)}
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                          title="優先度設定"
                        >
                          <option value="high">高</option>
                          <option value="normal">普通</option>
                          <option value="low">低</option>
                        </select>
                        
                        <select
                          value={entry.assignedCounselor || ''}
                          onChange={(e) => assignCounselor(entry.id, e.target.value)}
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                          title="担当者割り当て"
                        >
                          <option value="">未割当</option>
                          {counselors.map(counselor => (
                            <option key={counselor} value={counselor}>
                              {counselor.replace('カウンセラー', '')}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {entry.assignedCounselor && (
                      <div className="mb-3">
                        <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-jp-medium">
                          <UserCheck className="w-3 h-3 mr-1" />
                          担当: {entry.assignedCounselor}
                        </span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-jp-semibold text-gray-700 mb-2 text-sm">出来事</h4>
                        <p className="text-gray-600 text-sm font-jp-normal leading-relaxed">
                          {entry.event.length > 100 ? `${entry.event.substring(0, 100)}...` : entry.event}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-jp-semibold text-gray-700 mb-2 text-sm">気づき</h4>
                        <p className="text-gray-600 text-sm font-jp-normal leading-relaxed">
                          {entry.realization.length > 100 ? `${entry.realization.substring(0, 100)}...` : entry.realization}
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