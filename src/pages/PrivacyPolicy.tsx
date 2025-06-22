import React from 'react';
import { FileText, Shield, User, Calendar } from 'lucide-react';

export default function PrivacyPolicy() {
  // 同意履歴の取得
  const getConsentHistory = () => {
    const username = localStorage.getItem('line-username');
    const consentDate = localStorage.getItem('privacyConsentDate');
    const consentGiven = localStorage.getItem('privacyConsentGiven');
    
    return {
      username: username || '未設定',
      consentDate: consentDate ? new Date(consentDate).toLocaleString('ja-JP') : '未設定',
      consentGiven: consentGiven === 'true'
    };
  };

  const consentHistory = getConsentHistory();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl sm:text-4xl font-jp-bold text-gray-800">プライバシーポリシー</h1>
          </div>
          <p className="text-lg text-gray-600 leading-relaxed">
            あなたの個人情報を大切に保護します
          </p>
        </div>

        {/* 同意履歴 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8 border border-gray-200">
          <div className="text-center mb-6">
            <Shield className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-jp-bold text-gray-800 mb-4">同意履歴</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center mb-2">
                <User className="w-5 h-5 text-gray-600 mr-2" />
                <span className="font-jp-medium text-gray-700">ユーザー名</span>
              </div>
              <p className="text-gray-800 font-jp-bold text-lg">{consentHistory.username}</p>
              <p className="text-xs text-gray-500 mt-1">※編集不可</p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center mb-2">
                <Calendar className="w-5 h-5 text-gray-600 mr-2" />
                <span className="font-jp-medium text-gray-700">同意日時</span>
              </div>
              <p className="text-gray-800 font-jp-bold text-lg">{consentHistory.consentDate}</p>
              <p className="text-xs text-gray-500 mt-1">※編集不可</p>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <div className={`inline-flex items-center px-4 py-2 rounded-full ${
              consentHistory.consentGiven 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              <span className="font-jp-medium">
                {consentHistory.consentGiven ? '✓ 同意済み' : '✗ 未同意'}
              </span>
            </div>
          </div>
        </div>

        {/* プライバシーポリシー本文 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8 border border-gray-200">
          <h2 className="text-2xl font-jp-bold text-gray-800 mb-6">プライバシーポリシー</h2>
          
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h3 className="text-xl font-jp-bold text-gray-800 mb-3">1. 個人情報の収集について</h3>
              <p>
                一般社団法人NAMIDAサポート協会（以下「当協会」）は、「かんじょうにっき」サービスの提供にあたり、
                以下の個人情報を収集いたします：
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>LINEユーザー名（ニックネーム可）</li>
                <li>日記の内容（感情、出来事、気づき）</li>
                <li>自己肯定感・無価値感スコア</li>
                <li>アプリの利用状況</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-jp-bold text-gray-800 mb-3">2. 個人情報の利用目的</h3>
              <p>収集した個人情報は、以下の目的で利用いたします：</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>心の健康サポートサービスの提供</li>
                <li>カウンセリングサービスの提供</li>
                <li>緊急時の安全確保</li>
                <li>サービス改善のための統計分析</li>
                <li>重要なお知らせの配信</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-jp-bold text-gray-800 mb-3">3. 個人情報の保護</h3>
              <p>
                当協会は、個人情報の保護を最重要事項として取り組んでおります：
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>適切なセキュリティ対策による情報の保護</li>
                <li>従業員への個人情報保護教育の徹底</li>
                <li>第三者への不正な提供の禁止</li>
                <li>定期的なセキュリティ監査の実施</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-jp-bold text-gray-800 mb-3">4. 第三者提供について</h3>
              <p>
                以下の場合を除き、個人情報を第三者に提供することはありません：
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>ご本人の同意がある場合</li>
                <li>法令に基づく場合</li>
                <li>生命、身体の安全確保のため緊急性がある場合</li>
                <li>専門医療機関への紹介が必要な場合（事前同意あり）</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-jp-bold text-gray-800 mb-3">5. データの保存期間</h3>
              <p>
                個人情報は、サービス提供に必要な期間のみ保存いたします：
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>日記データ：サービス利用期間中</li>
                <li>相談記録：最終相談から3年間</li>
                <li>統計データ：個人を特定できない形で永続保存</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-jp-bold text-gray-800 mb-3">6. ご本人の権利</h3>
              <p>
                個人情報に関して、以下の権利を有しております：
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>個人情報の開示請求</li>
                <li>個人情報の訂正・削除請求</li>
                <li>個人情報の利用停止請求</li>
                <li>サービスの利用停止・退会</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-jp-bold text-gray-800 mb-3">7. お問い合わせ</h3>
              <p>
                個人情報の取り扱いに関するお問い合わせは、以下までご連絡ください：
              </p>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-3">
                <p className="font-jp-medium">一般社団法人NAMIDAサポート協会</p>
                <p>個人情報保護担当</p>
                <p>📧 privacy@namisapo.com</p>
                <p>📞 03-1234-5678</p>
                <p>受付時間：平日 9:00-17:00</p>
              </div>
            </section>
          </div>
        </div>

        {/* 重要な注意事項 */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 sm:p-8 mb-8">
          <h2 className="text-2xl font-jp-bold text-amber-800 mb-4">重要な注意事項</h2>
          <div className="space-y-3 text-amber-700">
            <p>
              <strong>緊急時の対応：</strong>
              自傷行為や自殺念慮など、生命に関わる緊急事態が疑われる場合、
              個人情報保護よりも生命の安全を優先し、適切な機関に連絡する場合があります。
            </p>
            <p>
              <strong>データの安全性：</strong>
              現在、データはお使いのデバイスのローカルストレージに保存されています。
              デバイスの紛失や故障に備え、定期的なバックアップをお勧めします。
            </p>
            <p>
              <strong>サービスの改善：</strong>
              より良いサービス提供のため、個人を特定できない形で統計データを活用させていただきます。
            </p>
          </div>
        </div>

        {/* 最終更新日 */}
        <div className="text-center text-gray-500 text-sm">
          <p>最終更新日：2025年1月21日</p>
          <p>一般社団法人NAMIDAサポート協会</p>
        </div>
      </div>
    </div>
  );
}