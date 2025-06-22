import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Menu, 
  X, 
  BookOpen, 
  Search, 
  TrendingUp, 
  Home,
  HelpCircle,
  Play,
  SkipForward,
  Palette,
  Shield,
  FileText,
  Share2
} from 'lucide-react';

// Pages
import HowTo from './pages/HowTo';
import FirstSteps from './pages/FirstSteps';
import NextSteps from './pages/NextSteps';
import EmotionTypes from './pages/EmotionTypes';
import Support from './pages/Support';
import PrivacyPolicy from './pages/PrivacyPolicy';
import DiaryPage from './pages/DiaryPage';
import DiarySearchPage from './pages/DiarySearchPage';

// Components
import PrivacyConsent from './components/PrivacyConsent';
import Chat from './components/Chat';

// Types
interface JournalEntry {
  id: string;
  date: string;
  emotion: string;
  event: string;
  realization: string;
  selfEsteemScore: number;
  worthlessnessScore: number;
}

type PageType = 'home' | 'howto' | 'firststeps' | 'nextsteps' | 'emotions' | 'support' | 'privacy' | 'diary' | 'search' | 'trends';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPrivacyConsent, setShowPrivacyConsent] = useState(false);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  // テストデータの自動生成
  useEffect(() => {
    const existingEntries = localStorage.getItem('journal-entries');
    if (!existingEntries) {
      const testData: JournalEntry[] = [
        {
          id: '1',
          date: '2025-01-21',
          emotion: '無価値感',
          event: '仕事でミスをしてしまい、上司に注意された。自分は何をやってもダメだと感じた。',
          realization: 'ミスは誰にでもあること。完璧でなくても価値がある人間だと思えるようになりたい。',
          selfEsteemScore: 25,
          worthlessnessScore: 75
        },
        {
          id: '2',
          date: '2025-01-20',
          emotion: '悲しみ',
          event: '友人との約束をキャンセルされた。一人で過ごす時間が増えて寂しく感じた。',
          realization: '人にはそれぞれ事情がある。自分の時間も大切にできる機会だと考えよう。',
          selfEsteemScore: 40,
          worthlessnessScore: 60
        },
        {
          id: '3',
          date: '2025-01-19',
          emotion: '怒り',
          event: '電車で席を譲らない人を見てイライラした。マナーの悪さに腹が立った。',
          realization: '他人をコントロールはできない。自分ができることに集中しよう。',
          selfEsteemScore: 50,
          worthlessnessScore: 50
        },
        {
          id: '4',
          date: '2025-01-18',
          emotion: '恐怖',
          event: '明日のプレゼンテーションが不安で眠れない。失敗したらどうしようと考えてしまう。',
          realization: '準備はしっかりできている。完璧でなくても最善を尽くせば十分。',
          selfEsteemScore: 35,
          worthlessnessScore: 65
        },
        {
          id: '5',
          date: '2025-01-17',
          emotion: '罪悪感',
          event: '家族との時間を作れずにいる。仕事ばかりで申し訳ない気持ちになった。',
          realization: '家族のために頑張っていることも愛情の表現。バランスを見直そう。',
          selfEsteemScore: 45,
          worthlessnessScore: 55
        },
        {
          id: '6',
          date: '2025-01-16',
          emotion: '寂しさ',
          event: '一人で映画を見に行った。周りはカップルや友人同士で、孤独を感じた。',
          realization: '一人の時間も貴重。自分と向き合う良い機会だと捉えよう。',
          selfEsteemScore: 30,
          worthlessnessScore: 70
        },
        {
          id: '7',
          date: '2025-01-15',
          emotion: '恥ずかしさ',
          event: '会議で発言したことが的外れだった。みんなの前で恥をかいた気分になった。',
          realization: '発言する勇気があったことは評価できる。次回はもっと良くなる。',
          selfEsteemScore: 40,
          worthlessnessScore: 60
        },
        {
          id: '8',
          date: '2025-01-14',
          emotion: '悔しさ',
          event: '同期が昇進した。自分だけ取り残された気分で悔しい。',
          realization: '人それぞれペースがある。自分の成長に集中しよう。',
          selfEsteemScore: 35,
          worthlessnessScore: 65
        },
        {
          id: '9',
          date: '2025-01-13',
          emotion: '無価値感',
          event: 'SNSで他人の成功を見て、自分は何も成し遂げていないと感じた。',
          realization: 'SNSは一部分だけ。自分なりの価値と成長があることを忘れずに。',
          selfEsteemScore: 20,
          worthlessnessScore: 80
        },
        {
          id: '10',
          date: '2025-01-12',
          emotion: '悲しみ',
          event: 'ペットが病気になった。大切な存在を失うかもしれない不安で涙が出た。',
          realization: '今この瞬間を大切に過ごそう。愛情を注げることに感謝したい。',
          selfEsteemScore: 45,
          worthlessnessScore: 55
        }
      ];
      
      localStorage.setItem('journal-entries', JSON.stringify(testData));
      setJournalEntries(testData);
    } else {
      setJournalEntries(JSON.parse(existingEntries));
    }
  }, []);

  // 初回アクセス時の処理
  useEffect(() => {
    const consentGiven = localStorage.getItem('privacyConsentGiven');
    const savedUsername = localStorage.getItem('line-username');
    
    if (consentGiven !== 'true' || !savedUsername) {
      setShowPrivacyConsent(true);
    } else {
      setCurrentPage('howto');
    }
  }, []);

  const handlePrivacyConsent = (username: string) => {
    localStorage.setItem('privacyConsentGiven', 'true');
    localStorage.setItem('line-username', username);
    const consentDate = new Date().toISOString();
    localStorage.setItem('privacyConsentDate', consentDate);
    setShowPrivacyConsent(false);
    setCurrentPage('howto');
  };

  const menuItems = [
    { id: 'home', label: 'TOP', icon: Home },
    { id: 'howto', label: '使い方', icon: HelpCircle },
    { id: 'firststeps', label: '最初にやること', icon: Play },
    { id: 'nextsteps', label: '次にやること', icon: SkipForward },
    { id: 'emotions', label: '感情の種類', icon: Palette },
    { id: 'support', label: 'サポートについて', icon: Shield },
    { id: 'privacy', label: '同意文', icon: FileText },
    { id: 'diary', label: '日記', icon: BookOpen },
    { id: 'search', label: '日記検索', icon: Search },
    { id: 'trends', label: '無価値感推移', icon: TrendingUp }
  ];

  const handleMenuClick = (pageId: string) => {
    if (pageId === 'diary' || pageId === 'search' || pageId === 'trends') {
      if (!checkAccessPermission()) return;
    }
    setCurrentPage(pageId as PageType);
    setIsMenuOpen(false);
  };

  const checkAccessPermission = () => {
    const consentGiven = localStorage.getItem('privacyConsentGiven');
    const savedUsername = localStorage.getItem('line-username');
    
    if (consentGiven !== 'true' || !savedUsername) {
      alert('日記機能をご利用いただくには、プライバシーポリシーへの同意とLINEユーザー名の入力が必要です。');
      setCurrentPage('home');
      return false;
    }
    return true;
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div className="min-h-screen bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-50 flex items-center justify-center p-4">
            <div className="text-center max-w-md mx-auto">
              <div className="mb-8">
                <div className="w-32 h-32 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <Heart className="w-16 h-16 text-orange-400" fill="currentColor" />
                </div>
                <h1 className="text-4xl md:text-6xl font-jp-bold text-gray-800 mb-4">
                  かんじょうにっき
                </h1>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  一般社団法人NAMIDAサポート協会
                </p>
              </div>
              
              <button
                onClick={() => {
                  const consentGiven = localStorage.getItem('privacyConsentGiven');
                  const savedUsername = localStorage.getItem('line-username');
                  
                  if (consentGiven !== 'true' || !savedUsername) {
                    setShowPrivacyConsent(true);
                  } else {
                    setCurrentPage('howto');
                  }
                }}
                className="bg-orange-400 hover:bg-orange-500 text-white px-8 py-4 rounded-full text-xl font-jp-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                はじめる
              </button>
            </div>
          </div>
        );
      case 'howto':
        return <HowTo />;
      case 'firststeps':
        return <FirstSteps />;
      case 'nextsteps':
        return <NextSteps />;
      case 'emotions':
        return <EmotionTypes />;
      case 'support':
        return <Support />;
      case 'privacy':
        return <PrivacyPolicy />;
      case 'diary':
        return <DiaryPage journalEntries={journalEntries} setJournalEntries={setJournalEntries} />;
      case 'search':
        return <DiarySearchPage journalEntries={journalEntries} setJournalEntries={setJournalEntries} />;
      case 'trends':
        return <TrendsPage journalEntries={journalEntries} />;
      default:
        return <HowTo />;
    }
  };

  if (showPrivacyConsent) {
    return <PrivacyConsent onConsent={handlePrivacyConsent} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Heart className="w-8 h-8 text-orange-400 mr-3" fill="currentColor" />
              <h1 className="text-xl font-jp-bold text-gray-800">かんじょうにっき</h1>
            </div>
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* サイドメニュー */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
        isMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center">
              <Heart className="w-6 h-6 text-orange-400 mr-2" fill="currentColor" />
              <span className="font-jp-bold text-gray-800">メニュー</span>
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="space-y-1 px-3">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMenuClick(item.id)}
                    className={`w-full flex items-center px-3 py-3 text-left rounded-lg transition-colors ${
                      currentPage === item.id
                        ? 'bg-orange-50 text-orange-600 border-l-4 border-orange-400'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span className="font-jp-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        </div>
      </div>

      {/* オーバーレイ */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* メインコンテンツ */}
      <main className="relative">
        {renderPage()}
      </main>
    </div>
  );
}

// 無価値感推移ページコンポーネント
function TrendsPage({ journalEntries }: { journalEntries: JournalEntry[] }) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('month');
  const [showShareSuccess, setShowShareSuccess] = useState(false);

  // 期間フィルタリング
  const getFilteredEntries = () => {
    const now = new Date();
    const entries = journalEntries.filter(entry => entry.emotion === '無価値感');
    
    switch (selectedPeriod) {
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return entries.filter(entry => new Date(entry.date) >= weekAgo);
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return entries.filter(entry => new Date(entry.date) >= monthAgo);
      case 'all':
      default:
        return entries;
    }
  };

  const filteredEntries = getFilteredEntries();

  // 初期スコアの取得
  const getInitialScores = () => {
    const savedScores = localStorage.getItem('initial-scores');
    if (savedScores) {
      const scores = JSON.parse(savedScores);
      return {
        selfEsteem: scores.selfEsteemScore || 50,
        worthlessness: scores.worthlessnessScore || 50
      };
    }
    return { selfEsteem: 50, worthlessness: 50 };
  };

  const initialScores = getInitialScores();

  // グラフデータの準備
  const graphData = () => {
    const data = [...filteredEntries]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-10); // 最大10ポイント

    // 初期スコアを最初のデータポイントとして追加
    if (data.length > 0) {
      const firstEntry = data[0];
      const dayBefore = new Date(new Date(firstEntry.date).getTime() - 24 * 60 * 60 * 1000);
      
      return [
        {
          date: dayBefore.toISOString().split('T')[0],
          selfEsteemScore: initialScores.selfEsteem,
          worthlessnessScore: initialScores.worthlessness,
          isInitial: true
        },
        ...data.map(entry => ({
          date: entry.date,
          selfEsteemScore: entry.selfEsteemScore,
          worthlessnessScore: entry.worthlessnessScore,
          isInitial: false
        }))
      ];
    }

    return [];
  };

  const chartData = graphData();

  // SVGグラフの描画
  const renderGraph = () => {
    if (chartData.length === 0) {
      return (
        <div className="h-64 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>無価値感の日記データがありません</p>
          </div>
        </div>
      );
    }

    const width = 600;
    const height = 300;
    const padding = 50;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;

    const maxScore = 100;
    const minScore = 0;

    const getX = (index: number) => padding + (index / (chartData.length - 1)) * graphWidth;
    const getY = (score: number) => padding + ((maxScore - score) / (maxScore - minScore)) * graphHeight;

    // 自己肯定感のパス
    const selfEsteemPath = chartData
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${getX(index)} ${getY(point.selfEsteemScore)}`)
      .join(' ');

    // 無価値感のパス
    const worthlessnessPath = chartData
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${getX(index)} ${getY(point.worthlessnessScore)}`)
      .join(' ');

    return (
      <div className="w-full overflow-x-auto">
        <svg width={width} height={height} className="mx-auto">
          {/* グリッドライン */}
          {[0, 25, 50, 75, 100].map(score => (
            <g key={score}>
              <line
                x1={padding}
                y1={getY(score)}
                x2={width - padding}
                y2={getY(score)}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
              <text
                x={padding - 10}
                y={getY(score) + 4}
                textAnchor="end"
                className="text-xs fill-gray-500"
              >
                {score}
              </text>
            </g>
          ))}

          {/* 自己肯定感ライン */}
          <path
            d={selfEsteemPath}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 無価値感ライン */}
          <path
            d={worthlessnessPath}
            fill="none"
            stroke="#ef4444"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* データポイント */}
          {chartData.map((point, index) => (
            <g key={index}>
              {/* 自己肯定感ポイント */}
              <circle
                cx={getX(index)}
                cy={getY(point.selfEsteemScore)}
                r="6"
                fill="#3b82f6"
                stroke="white"
                strokeWidth="2"
                className="hover:r-8 transition-all cursor-pointer"
              >
                <title>{`${point.date}: 自己肯定感 ${point.selfEsteemScore}点`}</title>
              </circle>

              {/* 無価値感ポイント */}
              <circle
                cx={getX(index)}
                cy={getY(point.worthlessnessScore)}
                r="6"
                fill="#ef4444"
                stroke="white"
                strokeWidth="2"
                className="hover:r-8 transition-all cursor-pointer"
              >
                <title>{`${point.date}: 無価値感 ${point.worthlessnessScore}点`}</title>
              </circle>

              {/* 初期スコアマーク */}
              {point.isInitial && (
                <text
                  x={getX(index)}
                  y={getY(point.selfEsteemScore) - 15}
                  textAnchor="middle"
                  className="text-xs fill-blue-600 font-medium"
                >
                  初期
                </text>
              )}
            </g>
          ))}

          {/* 軸ラベル */}
          <text
            x={width / 2}
            y={height - 10}
            textAnchor="middle"
            className="text-sm fill-gray-700"
          >
            日付
          </text>
          <text
            x={15}
            y={height / 2}
            textAnchor="middle"
            transform={`rotate(-90 15 ${height / 2})`}
            className="text-sm fill-gray-700"
          >
            スコア
          </text>
        </svg>
      </div>
    );
  };

  // 統計情報
  const getStats = () => {
    if (filteredEntries.length === 0) return null;

    const avgSelfEsteem = Math.round(
      filteredEntries.reduce((sum, entry) => sum + entry.selfEsteemScore, 0) / filteredEntries.length
    );
    const avgWorthlessness = Math.round(
      filteredEntries.reduce((sum, entry) => sum + entry.worthlessnessScore, 0) / filteredEntries.length
    );

    return { avgSelfEsteem, avgWorthlessness };
  };

  const stats = getStats();

  // 感情の出現頻度
  const getEmotionFrequency = () => {
    const now = new Date();
    let allEntries = journalEntries;

    switch (selectedPeriod) {
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        allEntries = journalEntries.filter(entry => new Date(entry.date) >= weekAgo);
        break;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        allEntries = journalEntries.filter(entry => new Date(entry.date) >= monthAgo);
        break;
    }

    const frequency: { [key: string]: number } = {};
    allEntries.forEach(entry => {
      frequency[entry.emotion] = (frequency[entry.emotion] || 0) + 1;
    });

    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  };

  const emotionFreq = getEmotionFrequency();

  // SNSシェア機能
  const handleShare = async () => {
    const periodText = selectedPeriod === 'week' ? '1週間' : selectedPeriod === 'month' ? '1ヶ月' : '全期間';
    const recordCount = filteredEntries.length;
    const topEmotion = emotionFreq.length > 0 ? emotionFreq[0] : null;
    
    const shareText = `📊 無価値感推移レポート（${periodText}）

📝 記録数: ${recordCount}件
😔 最も多い感情: ${topEmotion ? `${topEmotion[0]} (${topEmotion[1]}回)` : 'なし'}

#かんじょうにっき #感情日記 #無価値感推移

${window.location.origin}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'かんじょうにっき - 無価値感推移',
          text: shareText
        });
      } catch (error) {
        console.log('シェアがキャンセルされました');
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      setShowShareSuccess(true);
      setTimeout(() => setShowShareSuccess(false), 2000);
    }
  };

  const getPeriodText = () => {
    switch (selectedPeriod) {
      case 'week': return '1週間';
      case 'month': return '1ヶ月';
      case 'all': return '全期間';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-jp-bold text-gray-800">無価値感推移</h1>
          </div>
          <p className="text-gray-600">あなたの心の変化を可視化します</p>
        </div>

        {/* 期間選択とシェアボタン */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex space-x-2">
            {[
              { key: 'week', label: '1週間' },
              { key: 'month', label: '1ヶ月' },
              { key: 'all', label: '全期間' }
            ].map(period => (
              <button
                key={period.key}
                onClick={() => setSelectedPeriod(period.key as any)}
                className={`px-4 py-2 rounded-lg font-jp-medium transition-colors ${
                  selectedPeriod === period.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-blue-50'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleShare}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-jp-medium"
          >
            <Share2 className="w-4 h-4 mr-2" />
            シェア
          </button>
        </div>

        {/* シェア成功メッセージ */}
        {showShareSuccess && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center">
            クリップボードにコピーしました！
          </div>
        )}

        {/* グラフエリア */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-jp-bold text-gray-800">
              推移グラフ（{getPeriodText()}）
            </h2>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span>自己肯定感</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span>無価値感</span>
              </div>
            </div>
          </div>
          
          {renderGraph()}
        </div>

        {/* 統計情報 */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-jp-bold text-gray-800 mb-4">平均スコア</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">自己肯定感</span>
                  <span className="text-2xl font-jp-bold text-blue-600">{stats.avgSelfEsteem}点</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">無価値感</span>
                  <span className="text-2xl font-jp-bold text-red-600">{stats.avgWorthlessness}点</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-jp-bold text-gray-800 mb-4">記録状況</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">無価値感の記録</span>
                  <span className="text-2xl font-jp-bold text-purple-600">{filteredEntries.length}件</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">期間</span>
                  <span className="text-lg font-jp-medium text-gray-800">{getPeriodText()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 感情の出現頻度 */}
        {emotionFreq.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-jp-bold text-gray-800 mb-4">
              感情の出現頻度（{getPeriodText()}）
            </h3>
            <div className="space-y-3">
              {emotionFreq.map(([emotion, count], index) => (
                <div key={emotion} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 text-white text-xs flex items-center justify-center mr-3">
                      {index + 1}
                    </span>
                    <span className="font-jp-medium">{emotion}</span>
                  </div>
                  <span className="text-lg font-jp-bold text-gray-700">{count}回</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;