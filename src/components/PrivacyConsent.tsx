import React, { useState } from 'react';
import { Shield, Heart, Lock, Eye, Users, Database } from 'lucide-react';

interface PrivacyConsentProps {
  onConsent: (username: string) => void;
}

export default function PrivacyConsent({ onConsent }: PrivacyConsentProps) {
  const [username, setUsername] = useState('');
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      alert('LINEユーザー名を入力してください。');
      return;
    }
    if (!agreed) {
      alert('プライバシーポリシーに同意してください。');
      return;
    }
    onConsent(username.trim());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-jp-bold text-gray-800 mb-2">プライバシー同意</h1>
          <p className="text-gray-600 leading-relaxed">
            「かんじょうにっき」をご利用いただく前に、<br />
            プライバシーポリシーをご確認ください。
          </p>
        </div>

        {/* プライバシー情報 */}
        <div className="space-y-6 mb-8">
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center mb-3">
              <Database className="w-6 h-6 text-blue-600 mr-3" />
              <h3 className="text-lg font-jp-bold text-blue-800">収集する情報</h3>
            </div>
            <ul className="text-blue-700 space-y-1 text-sm">
              <li>• LINEユーザー名（ニックネーム可）</li>
              <li>• 日記の内容（感情、出来事、気づき）</li>
              <li>• 自己肯定感・無価値感スコア</li>
            </ul>
          </div>

          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <div className="flex items-center mb-3">
              <Eye className="w-6 h-6 text-green-600 mr-3" />
              <h3 className="text-lg font-jp-bold text-green-800">利用目的</h3>
            </div>
            <ul className="text-green-700 space-y-1 text-sm">
              <li>• 心の健康サポートサービスの提供</li>
              <li>• カウンセリングサービスの提供</li>
              <li>• 緊急時の安全確保</li>
            </ul>
          </div>

          <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center mb-3">
              <Lock className="w-6 h-6 text-purple-600 mr-3" />
              <h3 className="text-lg font-jp-bold text-purple-800">データ保護</h3>
            </div>
            <ul className="text-purple-700 space-y-1 text-sm">
              <li>• 適切なセキュリティ対策による保護</li>
              <li>• 第三者への不正な提供の禁止</li>
              <li>• 緊急時のみ専門機関との連携</li>
            </ul>
          </div>

          <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
            <div className="flex items-center mb-3">
              <Users className="w-6 h-6 text-orange-600 mr-3" />
              <h3 className="text-lg font-jp-bold text-orange-800">運営団体</h3>
            </div>
            <p className="text-orange-700 text-sm">
              一般社団法人NAMIDAサポート協会が責任を持って運営しています。
            </p>
          </div>
        </div>

        {/* フォーム */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ユーザー名入力 */}
          <div>
            <label className="block text-gray-700 font-jp-medium mb-2">
              LINEユーザー名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ニックネームでも構いません"
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              required
            />
            <p className="text-gray-500 text-sm mt-1">
              ※ 本名である必要はありません。ニックネームでも大丈夫です。
            </p>
          </div>

          {/* 同意チェックボックス */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 mr-3 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                required
              />
              <div className="text-gray-700">
                <span className="font-jp-medium">
                  上記のプライバシーポリシーに同意します
                </span>
                <p className="text-sm text-gray-600 mt-1">
                  個人情報の収集・利用・保護について理解し、同意いたします。
                </p>
              </div>
            </label>
          </div>

          {/* 送信ボタン */}
          <button
            type="submit"
            disabled={!username.trim() || !agreed}
            className={`w-full py-4 rounded-xl text-lg font-jp-bold transition-all ${
              username.trim() && agreed
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Heart className="w-5 h-5 inline mr-2" fill="currentColor" />
            同意して始める
          </button>
        </form>

        {/* 注意事項 */}
        <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-amber-800 text-sm text-center">
            <strong>重要：</strong> 
            緊急時（自傷行為や自殺念慮など）には、あなたの安全のため、
            適切な専門機関に連絡する場合があります。
          </p>
        </div>
      </div>
    </div>
  );
}