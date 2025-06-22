import React from 'react';
import { Palette, Heart, Brain, Lightbulb } from 'lucide-react';

export default function EmotionTypes() {
  const emotions = [
    {
      name: '無価値感',
      description: '自分には価値がない、存在意義がないと感じる状態',
      examples: ['自分は何をやってもダメだ', '誰からも必要とされていない', '生きている意味がない'],
      color: 'bg-red-50 border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-600'
    },
    {
      name: '悲しみ',
      description: '失望、喪失感、落胆を感じる状態',
      examples: ['大切な人を失った', '期待していたことが叶わなかった', '思い出が切ない'],
      color: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-600'
    },
    {
      name: '怒り',
      description: 'イライラ、憤り、不満を感じる状態',
      examples: ['理不尽な扱いを受けた', '約束を破られた', '思い通りにならない'],
      color: 'bg-orange-50 border-orange-200',
      textColor: 'text-orange-800',
      iconColor: 'text-orange-600'
    },
    {
      name: '恐怖',
      description: '不安、心配、恐れを感じる状態',
      examples: ['将来が不安', '失敗するのが怖い', '人に嫌われるのが心配'],
      color: 'bg-purple-50 border-purple-200',
      textColor: 'text-purple-800',
      iconColor: 'text-purple-600'
    },
    {
      name: '罪悪感',
      description: '自分を責める、申し訳ないと感じる状態',
      examples: ['人を傷つけてしまった', '期待に応えられなかった', '自分のせいだと思う'],
      color: 'bg-gray-50 border-gray-200',
      textColor: 'text-gray-800',
      iconColor: 'text-gray-600'
    },
    {
      name: '寂しさ',
      description: '孤独感、疎外感、一人ぼっちだと感じる状態',
      examples: ['誰も理解してくれない', '一人でいることが多い', 'つながりを感じられない'],
      color: 'bg-indigo-50 border-indigo-200',
      textColor: 'text-indigo-800',
      iconColor: 'text-indigo-600'
    },
    {
      name: '恥ずかしさ',
      description: '自分を恥じる、みっともないと感じる状態',
      examples: ['人前で失敗した', '自分の行動が情けない', '他人の目が気になる'],
      color: 'bg-pink-50 border-pink-200',
      textColor: 'text-pink-800',
      iconColor: 'text-pink-600'
    },
    {
      name: '悔しさ',
      description: '思い通りにならない苛立ち、負けたくない気持ち',
      examples: ['努力が報われなかった', '他人に負けた', '自分の力不足を感じる'],
      color: 'bg-yellow-50 border-yellow-200',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Palette className="w-8 h-8 text-indigo-600 mr-3" />
            <h1 className="text-3xl sm:text-4xl font-jp-bold text-gray-800">感情の種類</h1>
          </div>
          <p className="text-lg text-gray-600 leading-relaxed">
            8つの主要な感情について詳しく学びましょう
          </p>
        </div>

        {/* 感情について */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8 border border-gray-200">
          <div className="text-center mb-6">
            <Brain className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
            <h2 className="text-2xl font-jp-bold text-gray-800 mb-4">感情は心のメッセージ</h2>
            <p className="text-gray-600 leading-relaxed">
              感情は私たちの心が送るメッセージです。<br />
              ネガティブな感情も、私たちに何かを教えてくれる大切な存在です。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
              <Heart className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-jp-bold text-blue-800 mb-2">感じることは自然</h3>
              <p className="text-blue-700 text-sm">どんな感情も自然な反応です</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
              <Lightbulb className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-jp-bold text-green-800 mb-2">気づきの機会</h3>
              <p className="text-green-700 text-sm">感情から学ぶことができます</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
              <Brain className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-jp-bold text-purple-800 mb-2">成長の糧</h3>
              <p className="text-purple-700 text-sm">感情を通して成長できます</p>
            </div>
          </div>
        </div>

        {/* 8つの感情 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {emotions.map((emotion, index) => (
            <div
              key={index}
              className={`${emotion.color} border rounded-2xl p-6 transition-all hover:shadow-lg`}
            >
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 rounded-full bg-white flex items-center justify-center mr-4`}>
                  <Heart className={`w-6 h-6 ${emotion.iconColor}`} fill="currentColor" />
                </div>
                <h3 className={`text-2xl font-jp-bold ${emotion.textColor}`}>
                  {emotion.name}
                </h3>
              </div>
              
              <p className={`${emotion.textColor} mb-4 leading-relaxed`}>
                {emotion.description}
              </p>
              
              <div className={`${emotion.textColor}`}>
                <h4 className="font-jp-bold mb-2">よくある例：</h4>
                <ul className="space-y-1 text-sm">
                  {emotion.examples.map((example, exampleIndex) => (
                    <li key={exampleIndex} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{example}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* 感情との向き合い方 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8 border border-gray-200">
          <h2 className="text-2xl font-jp-bold text-gray-800 mb-6 text-center">感情との向き合い方</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-jp-bold text-gray-800 mb-4 text-green-600">✓ 良い向き合い方</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">感情を否定せず、受け入れる</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">なぜその感情を感じたのか考える</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">日記に書いて整理する</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">必要に応じて人に相談する</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-jp-bold text-gray-800 mb-4 text-red-600">✗ 避けたい向き合い方</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">感情を無視したり押し殺す</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">感情を感じる自分を責める</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">一人で抱え込みすぎる</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">感情に振り回されすぎる</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 日記での活用 */}
        <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl p-6 sm:p-8 text-center border border-indigo-200">
          <h2 className="text-2xl font-jp-bold text-gray-800 mb-4">日記で感情を記録しよう</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            これらの感情を理解したら、実際に日記で記録してみましょう。<br />
            感情を言葉にすることで、心の整理ができます。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="bg-white px-6 py-3 rounded-lg shadow-sm border border-indigo-200">
              <span className="text-indigo-600 font-jp-medium">📖 日記を書く</span>
            </div>
            <div className="bg-white px-6 py-3 rounded-lg shadow-sm border border-indigo-200">
              <span className="text-indigo-600 font-jp-medium">🔍 過去の感情を振り返る</span>
            </div>
            <div className="bg-white px-6 py-3 rounded-lg shadow-sm border border-indigo-200">
              <span className="text-indigo-600 font-jp-medium">📊 感情の変化を確認</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}