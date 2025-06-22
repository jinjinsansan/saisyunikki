import React from 'react';
import { Heart, Target, TrendingUp, MessageCircle } from 'lucide-react';

export default function HowTo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* ヘッダー */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-orange-400 mr-3" fill="currentColor" />
            <h1 className="text-3xl sm:text-4xl font-jp-bold text-gray-800">使い方</h1>
          </div>
          <p className="text-lg text-gray-600 leading-relaxed">
            かんじょうにっきで心の健康をサポートしましょう
          </p>
        </div>

        {/* メインコンテンツ */}
        <div className="space-y-8">
          {/* 心の中の方程式 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-jp-bold text-gray-800 mb-4">心の中の方程式</h2>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <div className="text-xl sm:text-2xl font-jp-bold text-amber-800 mb-2">
                  出来事 + 受け取り方 = 感情
                </div>
                <p className="text-amber-700 text-sm sm:text-base">
                  同じ出来事でも、受け取り方によって感情は変わります
                </p>
              </div>
            </div>
          </div>

          {/* 3つのステップ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* ステップ1 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-jp-bold text-gray-800 mb-2">1. 現状把握</h3>
              </div>
              <div className="space-y-3 text-gray-600">
                <p>まずは「最初にやること」で現在の心の状態を測定します。</p>
                <p>自己肯定感と無価値感のスコアを記録しましょう。</p>
              </div>
            </div>

            {/* ステップ2 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-green-600" fill="currentColor" />
                </div>
                <h3 className="text-xl font-jp-bold text-gray-800 mb-2">2. 日記記録</h3>
              </div>
              <div className="space-y-3 text-gray-600">
                <p>日々の感情を「日記」機能で記録します。</p>
                <p>出来事、感情、気づきを書き留めることで心を整理できます。</p>
              </div>
            </div>

            {/* ステップ3 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-jp-bold text-gray-800 mb-2">3. 変化確認</h3>
              </div>
              <div className="space-y-3 text-gray-600">
                <p>「無価値感推移」で心の変化をグラフで確認できます。</p>
                <p>継続することで成長を実感できるでしょう。</p>
              </div>
            </div>
          </div>

          {/* 重要なポイント */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200">
            <h2 className="text-2xl font-jp-bold text-gray-800 mb-6 text-center">重要なポイント</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <span className="text-white text-sm font-jp-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-jp-bold text-gray-800 mb-1">継続が大切</h4>
                    <p className="text-gray-600 text-sm">毎日少しずつでも記録を続けることで、心の変化に気づけます。</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <span className="text-white text-sm font-jp-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-jp-bold text-gray-800 mb-1">正直に記録</h4>
                    <p className="text-gray-600 text-sm">ありのままの感情を記録することで、真の成長につながります。</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <span className="text-white text-sm font-jp-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-jp-bold text-gray-800 mb-1">振り返りの時間</h4>
                    <p className="text-gray-600 text-sm">定期的に過去の記録を見返し、成長を実感しましょう。</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <span className="text-white text-sm font-jp-bold">4</span>
                  </div>
                  <div>
                    <h4 className="font-jp-bold text-gray-800 mb-1">サポート活用</h4>
                    <p className="text-gray-600 text-sm">困ったときは「サポートについて」を確認し、適切な支援を受けましょう。</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 次のステップ */}
          <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-2xl p-6 sm:p-8 text-center border border-orange-200">
            <h2 className="text-2xl font-jp-bold text-gray-800 mb-4">さあ、始めましょう！</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              まずは「最初にやること」で現在の心の状態を測定してみましょう。<br />
              あなたの心の健康をサポートする旅が始まります。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="bg-white px-6 py-3 rounded-lg shadow-sm border border-orange-200">
                <span className="text-orange-600 font-jp-medium">📝 最初にやること</span>
              </div>
              <div className="bg-white px-6 py-3 rounded-lg shadow-sm border border-orange-200">
                <span className="text-orange-600 font-jp-medium">📖 日記を書く</span>
              </div>
              <div className="bg-white px-6 py-3 rounded-lg shadow-sm border border-orange-200">
                <span className="text-orange-600 font-jp-medium">📊 推移を確認</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}