import React from 'react';
import { Shield, Phone, Heart, Users, Clock, MapPin } from 'lucide-react';

export default function Support() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-green-600 mr-3" />
            <h1 className="text-3xl sm:text-4xl font-jp-bold text-gray-800">サポートについて</h1>
          </div>
          <p className="text-lg text-gray-600 leading-relaxed">
            あなたの心の健康を全力でサポートします
          </p>
        </div>

        {/* 緊急時の対応 */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 sm:p-8 mb-8">
          <div className="text-center mb-6">
            <Phone className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-jp-bold text-red-800 mb-4">緊急時のサポート</h2>
            <p className="text-red-700 leading-relaxed">
              今すぐ誰かと話したい、危険を感じている場合は、以下にご連絡ください。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-red-200">
              <h3 className="font-jp-bold text-red-800 mb-3">いのちの電話</h3>
              <p className="text-red-700 text-2xl font-jp-bold mb-2">0570-783-556</p>
              <p className="text-red-600 text-sm">24時間365日対応</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-red-200">
              <h3 className="font-jp-bold text-red-800 mb-3">こころの健康相談統一ダイヤル</h3>
              <p className="text-red-700 text-2xl font-jp-bold mb-2">0570-064-556</p>
              <p className="text-red-600 text-sm">平日 9:30-17:30</p>
            </div>
          </div>
        </div>

        {/* 3つのサポート */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* 専門カウンセラー */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-blue-600" fill="currentColor" />
              </div>
              <h3 className="text-xl font-jp-bold text-gray-800 mb-2">専門カウンセラー</h3>
            </div>
            <div className="space-y-3 text-gray-600">
              <p>資格を持った専門カウンセラーがあなたの心に寄り添います。</p>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-blue-800 text-sm font-jp-medium">
                  📧 counselor@namisapo.com<br />
                  📞 03-1234-5678
                </p>
              </div>
            </div>
          </div>

          {/* ピアサポート */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-jp-bold text-gray-800 mb-2">ピアサポート</h3>
            </div>
            <div className="space-y-3 text-gray-600">
              <p>同じような経験を持つ仲間との支え合いの場を提供します。</p>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <p className="text-green-800 text-sm font-jp-medium">
                  💬 オンライングループ<br />
                  🗓️ 毎週土曜日 14:00-16:00
                </p>
              </div>
            </div>
          </div>

          {/* 24時間サポート */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-jp-bold text-gray-800 mb-2">24時間サポート</h3>
            </div>
            <div className="space-y-3 text-gray-600">
              <p>緊急時には24時間体制でサポートを提供します。</p>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <p className="text-purple-800 text-sm font-jp-medium">
                  🚨 緊急ホットライン<br />
                  📱 080-1234-5678
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 相談の流れ */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8 border border-gray-200">
          <h2 className="text-2xl font-jp-bold text-gray-800 mb-6 text-center">相談の流れ</h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-white text-sm font-jp-bold">1</span>
              </div>
              <div>
                <h4 className="font-jp-bold text-gray-800 mb-2">初回相談</h4>
                <p className="text-gray-600">まずはお気軽にご連絡ください。現在の状況をお聞かせいただきます。</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-white text-sm font-jp-bold">2</span>
              </div>
              <div>
                <h4 className="font-jp-bold text-gray-800 mb-2">サポート計画</h4>
                <p className="text-gray-600">あなたに最適なサポート方法を一緒に考え、計画を立てます。</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-white text-sm font-jp-bold">3</span>
              </div>
              <div>
                <h4 className="font-jp-bold text-gray-800 mb-2">継続サポート</h4>
                <p className="text-gray-600">定期的なフォローアップで、あなたの成長を継続的にサポートします。</p>
              </div>
            </div>
          </div>
        </div>

        {/* 団体について */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8 border border-gray-200">
          <div className="text-center mb-6">
            <MapPin className="w-12 h-12 text-teal-500 mx-auto mb-4" />
            <h2 className="text-2xl font-jp-bold text-gray-800 mb-4">一般社団法人NAMIDAサポート協会について</h2>
          </div>
          
          <div className="space-y-4 text-gray-600">
            <p className="leading-relaxed">
              私たちは、心の健康に悩む方々を支援することを目的とした一般社団法人です。
              専門的な知識と温かい心で、一人ひとりに寄り添ったサポートを提供しています。
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <h4 className="font-jp-bold text-gray-800 mb-2">私たちの使命</h4>
                <ul className="space-y-1 text-sm">
                  <li>• 心の健康に関する正しい知識の普及</li>
                  <li>• 専門的なカウンセリングサービスの提供</li>
                  <li>• 地域コミュニティでの支援ネットワーク構築</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-jp-bold text-gray-800 mb-2">サポート実績</h4>
                <ul className="space-y-1 text-sm">
                  <li>• 年間相談件数: 1,200件以上</li>
                  <li>• 専門カウンセラー: 15名在籍</li>
                  <li>• サポートグループ: 月8回開催</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* お問い合わせ */}
        <div className="bg-gradient-to-r from-green-100 to-teal-100 rounded-2xl p-6 sm:p-8 text-center border border-green-200">
          <h2 className="text-2xl font-jp-bold text-gray-800 mb-4">お気軽にご相談ください</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            どんな小さなことでも構いません。<br />
            あなたの心の健康を守るために、私たちがここにいます。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="bg-white px-6 py-3 rounded-lg shadow-sm border border-green-200">
              <span className="text-green-600 font-jp-medium">📧 メール相談</span>
            </div>
            <div className="bg-white px-6 py-3 rounded-lg shadow-sm border border-green-200">
              <span className="text-green-600 font-jp-medium">📞 電話相談</span>
            </div>
            <div className="bg-white px-6 py-3 rounded-lg shadow-sm border border-green-200">
              <span className="text-green-600 font-jp-medium">👥 対面相談</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}