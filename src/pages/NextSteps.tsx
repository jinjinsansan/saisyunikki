import React from 'react';
import { SkipForward, Brain, BookOpen, TrendingUp } from 'lucide-react';

export default function NextSteps() {
  const emotions = [
    { name: '無価値感', color: 'bg-red-100 text-red-800 border-red-200', description: '自分に価値がないと感じる' },
    { name: '悲しみ', color: 'bg-blue-100 text-blue-800 border-blue-200', description: '失望や喪失感を感じる' },
    { name: '怒り', color: 'bg-orange-100 text-orange-800 border-orange-200', description: 'イライラや憤りを感じる' },
    { name: '恐怖', color: 'bg-purple-100 text-purple-800 border-purple-200', description: '不安や心配を感じる' },
    { name: '罪悪感', color: 'bg-gray-100 text-gray-800 border-gray-200', description: '自分を責める気持ち' },
    { name: '寂しさ', color: 'bg-indigo-100 text-indigo-800 border-indigo-200', description: '孤独感や疎外感' },
    { name: '恥ずかしさ', color: 'bg-pink-100 text-pink-800 border-pink-200', description: '自分を恥じる気持ち' },
    { name: '悔しさ', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', description: '思い通りにならない苛立ち' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <SkipForward className="w-8 h-8 text-purple-600 mr-3" />
            <h1 className="text-3xl sm:text-4xl font-jp-bold text-gray-800">次にやること</h1>
          </div>
          <p className="text-lg text-gray-600 leading-relaxed">
            感情について学び、日記を書き始めましょう
          </p>
        </div>

        {/* 感情について学ぶ */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8 border border-gray-200">
          <div className="text-center mb-6">
            <Brain className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h2 className="text-2xl font-jp-bold text-gray-800 mb-4">感情について学ぶ</h2>
            <p className="text-gray-600 leading-relaxed">
              感情は心からのメッセージです。<br />
              まずは8つの主要な感情について理解しましょう。
            </p>
          </div>
        </div>

        {/* 8つの感情 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8 border border-gray-200">
          <h3 className="text-xl font-jp-bold text-gray-800 mb-6 text-center">8つのネガティブな感情</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {emotions.map((emotion, index) => (
              <div
                key={index}
                className={`${emotion.color} border rounded-xl p-4 text-center transition-all hover:shadow-md`}
              >
                <div className="font-jp-bold text-lg mb-2">{emotion.name}</div>
                <div className="text-sm opacity-80">{emotion.description}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-amber-800 text-center">
              💡 これらの感情は自然なものです。感じることを恐れず、受け入れることから始めましょう。
            </p>
          </div>
        </div>

        {/* 日記の書き方 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8 border border-gray-200">
          <div className="text-center mb-6">
            <BookOpen className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-jp-bold text-gray-800 mb-4">日記の書き方</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-white text-sm font-jp-bold">1</span>
              </div>
              <div>
                <h4 className="font-jp-bold text-gray-800 mb-2">日付を選ぶ</h4>
                <p className="text-gray-600">カレンダーから日記を書きたい日を選択します。</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-white text-sm font-jp-bold">2</span>
              </div>
              <div>
                <h4 className="font-jp-bold text-gray-800 mb-2">感情を選ぶ</h4>
                <p className="text-gray-600">その日に最も強く感じた感情を8つの中から選びます。</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-white text-sm font-jp-bold">3</span>
              </div>
              <div>
                <h4 className="font-jp-bold text-gray-800 mb-2">出来事を書く</h4>
                <p className="text-gray-600">その感情を感じるきっかけとなった出来事を具体的に書きます。</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-white text-sm font-jp-bold">4</span>
              </div>
              <div>
                <h4 className="font-jp-bold text-gray-800 mb-2">気づきを書く</h4>
                <p className="text-gray-600">その出来事から学んだことや、新しい視点を記録します。</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-white text-sm font-jp-bold">5</span>
              </div>
              <div>
                <h4 className="font-jp-bold text-gray-800 mb-2">スコアを入力</h4>
                <p className="text-gray-600">無価値感を選んだ場合は、自己肯定感と無価値感のスコアも記録します。</p>
              </div>
            </div>
          </div>
        </div>

        {/* 継続のコツ */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8 border border-gray-200">
          <div className="text-center mb-6">
            <TrendingUp className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-jp-bold text-gray-800 mb-4">継続のコツ</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                  <span className="text-white text-sm font-jp-bold">1</span>
                </div>
                <div>
                  <h4 className="font-jp-bold text-gray-800 mb-1">毎日同じ時間に</h4>
                  <p className="text-gray-600 text-sm">寝る前など、決まった時間に書く習慣をつけましょう。</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                  <span className="text-white text-sm font-jp-bold">2</span>
                </div>
                <div>
                  <h4 className="font-jp-bold text-gray-800 mb-1">短くても大丈夫</h4>
                  <p className="text-gray-600 text-sm">長文である必要はありません。一言でも価値があります。</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                  <span className="text-white text-sm font-jp-bold">3</span>
                </div>
                <div>
                  <h4 className="font-jp-bold text-gray-800 mb-1">完璧を求めない</h4>
                  <p className="text-gray-600 text-sm">書けない日があっても大丈夫。また始めればよいのです。</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                  <span className="text-white text-sm font-jp-bold">4</span>
                </div>
                <div>
                  <h4 className="font-jp-bold text-gray-800 mb-1">変化を楽しむ</h4>
                  <p className="text-gray-600 text-sm">推移グラフで自分の成長を確認し、変化を実感しましょう。</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 次のステップ */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 sm:p-8 text-center border border-purple-200">
          <h2 className="text-2xl font-jp-bold text-gray-800 mb-4">準備完了！</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            感情について学びました。<br />
            さあ、「日記」機能で実際に書き始めてみましょう！
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="bg-white px-6 py-3 rounded-lg shadow-sm border border-purple-200">
              <span className="text-purple-600 font-jp-medium">📖 日記を書く</span>
            </div>
            <div className="bg-white px-6 py-3 rounded-lg shadow-sm border border-purple-200">
              <span className="text-purple-600 font-jp-medium">🔍 過去の日記を見る</span>
            </div>
            <div className="bg-white px-6 py-3 rounded-lg shadow-sm border border-purple-200">
              <span className="text-purple-600 font-jp-medium">📊 推移を確認する</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}