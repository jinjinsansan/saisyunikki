import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, Heart, Save, Share2 } from 'lucide-react';

interface JournalEntry {
  id: string;
  date: string;
  emotion: string;
  event: string;
  realization: string;
  selfEsteemScore: number;
  worthlessnessScore: number;
}

interface DiaryPageProps {
  journalEntries: JournalEntry[];
  setJournalEntries: React.Dispatch<React.SetStateAction<JournalEntry[]>>;
}

export default function DiaryPage({ journalEntries, setJournalEntries }: DiaryPageProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [event, setEvent] = useState('');
  const [realization, setRealization] = useState('');
  const [selfEsteemScore, setSelfEsteemScore] = useState(50);
  const [worthlessnessScore, setWorthlessnessScore] = useState(50);
  const [showScores, setShowScores] = useState(false);
  const [showShareSuccess, setShowShareSuccess] = useState(false);

  const emotions = [
    { name: '無価値感', color: 'bg-red-100 text-red-800 border-red-200' },
    { name: '悲しみ', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { name: '怒り', color: 'bg-orange-100 text-orange-800 border-orange-200' },
    { name: '恐怖', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    { name: '罪悪感', color: 'bg-gray-100 text-gray-800 border-gray-200' },
    { name: '寂しさ', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
    { name: '恥ずかしさ', color: 'bg-pink-100 text-pink-800 border-pink-200' },
    { name: '悔しさ', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' }
  ];

  // 無価値感が選択された時の処理
  useEffect(() => {
    if (selectedEmotion === '無価値感') {
      setShowScores(true);
      // 初回の無価値感日記の場合、保存されたスコアを適用
      const savedScores = localStorage.getItem('initial-scores');
      const hasWorthlessnessEntry = journalEntries.some(entry => entry.emotion === '無価値感');
      
      if (savedScores && !hasWorthlessnessEntry) {
        const scores = JSON.parse(savedScores);
        setSelfEsteemScore(scores.selfEsteemScore || 50);
        setWorthlessnessScore(scores.worthlessnessScore || 50);
      }
    } else {
      setShowScores(false);
    }
  }, [selectedEmotion, journalEntries]);

  const handleSave = () => {
    if (!selectedEmotion || !event.trim() || !realization.trim()) {
      alert('すべての項目を入力してください。');
      return;
    }

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: selectedDate,
      emotion: selectedEmotion,
      event: event.trim(),
      realization: realization.trim(),
      selfEsteemScore: showScores ? selfEsteemScore : 50,
      worthlessnessScore: showScores ? worthlessnessScore : 50
    };

    const updatedEntries = [...journalEntries, newEntry];
    setJournalEntries(updatedEntries);
    localStorage.setItem('journal-entries', JSON.stringify(updatedEntries));

    // フォームをリセット
    setSelectedEmotion('');
    setEvent('');
    setRealization('');
    setSelfEsteemScore(50);
    setWorthlessnessScore(50);
    setShowScores(false);

    alert('日記を保存しました！');
  };

  // SNSシェア機能
  const handleShare = async () => {
    if (!selectedEmotion) {
      alert('まず感情を選択してください。');
      return;
    }

    const shareText = `今日の感情日記を書きました 📝

感情: ${selectedEmotion}

#かんじょうにっき #感情日記 #自己肯定感

${window.location.origin}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'かんじょうにっき - 今日の感情日記',
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

  const getScoreColor = (score: number, isWorthlessness = false) => {
    if (isWorthlessness) {
      if (score >= 80) return 'text-red-600';
      if (score >= 60) return 'text-orange-500';
      if (score >= 40) return 'text-yellow-600';
      return 'text-green-600';
    } else {
      if (score >= 80) return 'text-green-600';
      if (score >= 60) return 'text-blue-600';
      if (score >= 40) return 'text-yellow-600';
      return 'text-red-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-orange-600 mr-3" />
            <h1 className="text-3xl sm:text-4xl font-jp-bold text-gray-800">日記</h1>
          </div>
          <p className="text-lg text-gray-600 leading-relaxed">
            今日の感情を記録しましょう
          </p>
        </div>

        {/* シェア成功メッセージ */}
        {showShareSuccess && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center">
            クリップボードにコピーしました！
          </div>
        )}

        {/* 日付選択 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <Calendar className="w-6 h-6 text-orange-600 mr-3" />
            <h2 className="text-xl font-jp-bold text-gray-800">日付を選択</h2>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg"
          />
        </div>

        {/* 感情選択 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <Heart className="w-6 h-6 text-orange-600 mr-3" fill="currentColor" />
            <h2 className="text-xl font-jp-bold text-gray-800">感情を選択</h2>
          </div>
          <p className="text-gray-600 mb-4">今日最も強く感じた感情を選んでください</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {emotions.map((emotion) => (
              <button
                key={emotion.name}
                onClick={() => setSelectedEmotion(emotion.name)}
                className={`p-3 rounded-lg border-2 transition-all font-jp-medium ${
                  selectedEmotion === emotion.name
                    ? `${emotion.color} border-current shadow-md`
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {emotion.name}
              </button>
            ))}
          </div>
        </div>

        {/* スコア入力（無価値感の場合のみ表示） */}
        {showScores && (
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6 border border-gray-200">
            <h2 className="text-xl font-jp-bold text-gray-800 mb-4">スコアを入力</h2>
            
            {/* 自己肯定感 */}
            <div className="mb-6">
              <label className="block text-gray-700 font-jp-medium mb-2">
                自己肯定感: <span className={`text-2xl font-jp-bold ${getScoreColor(selfEsteemScore)}`}>{selfEsteemScore}</span>/100
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={selfEsteemScore}
                onChange={(e) => setSelfEsteemScore(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>低い</span>
                <span>高い</span>
              </div>
            </div>

            {/* 無価値感 */}
            <div>
              <label className="block text-gray-700 font-jp-medium mb-2">
                無価値感: <span className={`text-2xl font-jp-bold ${getScoreColor(worthlessnessScore, true)}`}>{worthlessnessScore}</span>/100
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={worthlessnessScore}
                onChange={(e) => setWorthlessnessScore(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>弱い</span>
                <span>強い</span>
              </div>
            </div>
          </div>
        )}

        {/* 出来事入力 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6 border border-gray-200">
          <h2 className="text-xl font-jp-bold text-gray-800 mb-4">出来事</h2>
          <p className="text-gray-600 mb-4">その感情を感じるきっかけとなった出来事を書いてください</p>
          <textarea
            value={event}
            onChange={(e) => setEvent(e.target.value)}
            placeholder="例：仕事でミスをしてしまい、上司に注意された..."
            className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
          />
        </div>

        {/* 気づき入力 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6 border border-gray-200">
          <h2 className="text-xl font-jp-bold text-gray-800 mb-4">気づき</h2>
          <p className="text-gray-600 mb-4">その出来事から学んだことや新しい視点を書いてください</p>
          <textarea
            value={realization}
            onChange={(e) => setRealization(e.target.value)}
            placeholder="例：ミスは誰にでもあること。完璧でなくても価値がある人間だと思えるようになりたい..."
            className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
          />
        </div>

        {/* 保存・シェアボタン */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleSave}
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-xl text-lg font-jp-bold transition-colors shadow-lg flex items-center justify-center"
          >
            <Save className="w-5 h-5 mr-2" />
            保存する
          </button>
          
          <button
            onClick={handleShare}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl text-lg font-jp-bold transition-colors shadow-lg flex items-center justify-center"
          >
            <Share2 className="w-5 h-5 mr-2" />
            シェア
          </button>
        </div>

        {/* ヒント */}
        <div className="mt-8 bg-gradient-to-r from-orange-100 to-pink-100 rounded-2xl p-6 sm:p-8 text-center border border-orange-200">
          <h2 className="text-xl font-jp-bold text-gray-800 mb-4">💡 日記を書くヒント</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="bg-white p-4 rounded-lg border border-orange-200">
              <h3 className="font-jp-bold mb-2">正直に書く</h3>
              <p>ありのままの感情を記録することが大切です</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-orange-200">
              <h3 className="font-jp-bold mb-2">具体的に書く</h3>
              <p>「いつ、どこで、何が」を明確にしましょう</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-orange-200">
              <h3 className="font-jp-bold mb-2">短くても大丈夫</h3>
              <p>一言でも価値のある記録になります</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-orange-200">
              <h3 className="font-jp-bold mb-2">継続が力</h3>
              <p>毎日少しずつでも続けることが重要です</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}