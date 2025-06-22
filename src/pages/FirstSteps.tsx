import React, { useState, useEffect } from 'react';
import { Play, Heart, Save } from 'lucide-react';

export default function FirstSteps() {
  const [selfEsteemScore, setSelfEsteemScore] = useState(50);
  const [worthlessnessScore, setWorthlessnessScore] = useState(50);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentDay, setCurrentDay] = useState(new Date().getDate());
  const [isSaved, setIsSaved] = useState(false);

  // 保存済みデータの読み込み
  useEffect(() => {
    const savedScores = localStorage.getItem('initial-scores');
    if (savedScores) {
      const scores = JSON.parse(savedScores);
      setSelfEsteemScore(scores.selfEsteemScore || 50);
      setWorthlessnessScore(scores.worthlessnessScore || 50);
      setCurrentMonth(scores.measurementMonth || new Date().getMonth() + 1);
      setCurrentDay(scores.measurementDay || new Date().getDate());
      setIsSaved(true);
    }
  }, []);

  const handleSave = () => {
    const scores = {
      selfEsteemScore,
      worthlessnessScore,
      measurementMonth: currentMonth,
      measurementDay: currentDay,
      savedAt: new Date().toISOString()
    };
    
    localStorage.setItem('initial-scores', JSON.stringify(scores));
    setIsSaved(true);
    
    // 保存完了メッセージを表示
    alert('保存しました！');
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

  const getScoreDescription = (score: number, isWorthlessness = false) => {
    if (isWorthlessness) {
      if (score >= 80) return '非常に強い';
      if (score >= 60) return '強い';
      if (score >= 40) return '中程度';
      return '軽度';
    } else {
      if (score >= 80) return '非常に高い';
      if (score >= 60) return '高い';
      if (score >= 40) return '中程度';
      return '低い';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Play className="w-8 h-8 text-green-600 mr-3" />
            <h1 className="text-3xl sm:text-4xl font-jp-bold text-gray-800">最初にやること</h1>
          </div>
          <p className="text-lg text-gray-600 leading-relaxed">
            現在の心の状態を測定しましょう
          </p>
        </div>

        {/* 説明セクション */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8 border border-gray-200">
          <div className="text-center mb-6">
            <Heart className="w-12 h-12 text-green-500 mx-auto mb-4" fill="currentColor" />
            <h2 className="text-2xl font-jp-bold text-gray-800 mb-4">心の状態測定</h2>
            <p className="text-gray-600 leading-relaxed">
              まずは今の心の状態を数値で記録します。<br />
              正直な気持ちで、直感的に答えてください。
            </p>
          </div>
        </div>

        {/* 測定日設定 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8 border border-gray-200">
          <h3 className="text-xl font-jp-bold text-gray-800 mb-4 text-center">測定日</h3>
          <div className="flex justify-center items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-gray-700 font-jp-medium">月:</label>
              <select
                value={currentMonth}
                onChange={(e) => setCurrentMonth(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}月</option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-gray-700 font-jp-medium">日:</label>
              <select
                value={currentDay}
                onChange={(e) => setCurrentDay(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}日</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 自己肯定感測定 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8 border border-gray-200">
          <h3 className="text-xl font-jp-bold text-gray-800 mb-6 text-center">自己肯定感</h3>
          <div className="mb-6">
            <p className="text-gray-600 text-center mb-4">
              「自分には価値がある」と感じる度合いはどのくらいですか？
            </p>
            <div className="text-center mb-4">
              <span className={`text-4xl font-jp-bold ${getScoreColor(selfEsteemScore)}`}>
                {selfEsteemScore}
              </span>
              <span className="text-gray-500 ml-2">/ 100</span>
              <div className={`text-lg font-jp-medium mt-2 ${getScoreColor(selfEsteemScore)}`}>
                {getScoreDescription(selfEsteemScore)}
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={selfEsteemScore}
              onChange={(e) => setSelfEsteemScore(Number(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #ef4444 0%, #f59e0b 25%, #3b82f6 50%, #10b981 75%, #10b981 100%)`
              }}
            />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>0 (全くない)</span>
              <span>50 (普通)</span>
              <span>100 (とても高い)</span>
            </div>
          </div>
        </div>

        {/* 無価値感測定 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8 border border-gray-200">
          <h3 className="text-xl font-jp-bold text-gray-800 mb-6 text-center">無価値感</h3>
          <div className="mb-6">
            <p className="text-gray-600 text-center mb-4">
              「自分には価値がない」と感じる度合いはどのくらいですか？
            </p>
            <div className="text-center mb-4">
              <span className={`text-4xl font-jp-bold ${getScoreColor(worthlessnessScore, true)}`}>
                {worthlessnessScore}
              </span>
              <span className="text-gray-500 ml-2">/ 100</span>
              <div className={`text-lg font-jp-medium mt-2 ${getScoreColor(worthlessnessScore, true)}`}>
                {getScoreDescription(worthlessnessScore, true)}
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={worthlessnessScore}
              onChange={(e) => setWorthlessnessScore(Number(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #10b981 0%, #f59e0b 25%, #f59e0b 50%, #ef4444 75%, #ef4444 100%)`
              }}
            />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>0 (全くない)</span>
              <span>50 (普通)</span>
              <span>100 (とても強い)</span>
            </div>
          </div>
        </div>

        {/* 保存ボタン */}
        <div className="text-center mb-8">
          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl text-lg font-jp-bold transition-colors shadow-lg flex items-center mx-auto"
          >
            <Save className="w-5 h-5 mr-2" />
            {isSaved ? '更新する' : '保存する'}
          </button>
          {isSaved && (
            <p className="text-green-600 mt-3 font-jp-medium">
              ✓ 保存済み
            </p>
          )}
        </div>

        {/* 次のステップ */}
        <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-6 sm:p-8 text-center border border-green-200">
          <h2 className="text-2xl font-jp-bold text-gray-800 mb-4">測定完了！</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            現在の心の状態が記録されました。<br />
            次は「次にやること」で感情について学び、日記を書き始めましょう。
          </p>
          <div className="bg-white px-6 py-3 rounded-lg shadow-sm border border-green-200 inline-block">
            <span className="text-green-600 font-jp-medium">📚 次にやること → 日記を書く</span>
          </div>
        </div>
      </div>
    </div>
  );
}