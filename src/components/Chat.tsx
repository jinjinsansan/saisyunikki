import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Bot, User, AlertTriangle } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 初期メッセージ
  useEffect(() => {
    const initialMessage: Message = {
      id: '1',
      content: 'こんにちは！心のサポートチャットです。今日はどのような気持ちですか？何でもお気軽にお話しください。',
      isUser: false,
      timestamp: new Date()
    };
    setMessages([initialMessage]);
  }, []);

  // メッセージが追加されたら自動スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 自動応答のロジック
  const generateResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // 緊急度の高いキーワード
    const emergencyKeywords = ['死にたい', '消えたい', '自殺', '終わりにしたい', '生きていたくない'];
    if (emergencyKeywords.some(keyword => message.includes(keyword))) {
      return '大変つらい気持ちを抱えていらっしゃるのですね。一人で抱え込まず、専門の相談窓口にご連絡ください。\n\n🆘 いのちの電話: 0570-783-556（24時間対応）\n\nあなたの命は大切です。必ず誰かがあなたを支えてくれます。';
    }

    // 感情に関するキーワード
    if (message.includes('悲しい') || message.includes('つらい')) {
      return 'つらい気持ちを抱えていらっしゃるのですね。そのお気持ちを受け止めています。感情を言葉にすることは、とても勇気のいることです。日記に書いてみることで、気持ちが整理されることもありますよ。';
    }

    if (message.includes('不安') || message.includes('心配')) {
      return '不安な気持ちでいっぱいなのですね。不安を感じることは自然なことです。深呼吸をして、今この瞬間に意識を向けてみてください。一歩ずつ、ゆっくりと進んでいきましょう。';
    }

    if (message.includes('怒り') || message.includes('イライラ')) {
      return '怒りの感情を感じていらっしゃるのですね。怒りも大切な感情の一つです。何かに対する不満や期待があるからこそ生まれる感情です。その背景にある気持ちを探ってみませんか？';
    }

    if (message.includes('寂しい') || message.includes('孤独')) {
      return '寂しさを感じていらっしゃるのですね。一人ではありません。ここにいる私たちがあなたのことを大切に思っています。つながりを感じられるよう、一緒に考えていきましょう。';
    }

    // ポジティブなキーワード
    if (message.includes('ありがとう') || message.includes('感謝')) {
      return 'こちらこそ、お話しいただきありがとうございます。あなたの気持ちを聞かせていただけることを嬉しく思います。いつでもお話しください。';
    }

    if (message.includes('良くなった') || message.includes('元気')) {
      return 'それは素晴らしいですね！気持ちが前向きになられたこと、とても嬉しく思います。その調子で、一歩ずつ進んでいってくださいね。';
    }

    // 日記に関する質問
    if (message.includes('日記') || message.includes('書き方')) {
      return '日記を書くことは心の整理にとても効果的です。まずは今日感じた感情を一つ選んで、それを感じたきっかけとなった出来事を書いてみてください。完璧である必要はありません。';
    }

    // デフォルトの応答
    const defaultResponses = [
      'お話しいただき、ありがとうございます。あなたの気持ちを大切に受け止めています。もう少し詳しく聞かせていただけますか？',
      'そのような気持ちを抱えていらっしゃるのですね。一人で抱え込まず、こうしてお話しいただけて良かったです。',
      'あなたの感情は大切なメッセージです。どのような時にそう感じることが多いですか？',
      'お気持ちを聞かせていただき、ありがとうございます。今、一番つらいと感じていることは何でしょうか？'
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // 応答を生成（少し遅延を入れて自然な感じに）
    setTimeout(() => {
      const response = generateResponse(userMessage.content);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000 + Math.random() * 2000); // 1-3秒のランダムな遅延
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <MessageCircle className="w-8 h-8 text-green-600 mr-3" />
            <h1 className="text-3xl sm:text-4xl font-jp-bold text-gray-800">心のサポートチャット</h1>
          </div>
          <p className="text-lg text-gray-600 leading-relaxed">
            あなたの気持ちをお聞かせください
          </p>
        </div>

        {/* 注意事項 */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <div className="flex items-center mb-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 mr-2" />
            <span className="font-jp-bold text-amber-800">重要なお知らせ</span>
          </div>
          <p className="text-amber-700 text-sm">
            現在はテスト版のチャット機能です。緊急時は専門の相談窓口（いのちの電話: 0570-783-556）にご連絡ください。
          </p>
        </div>

        {/* チャットエリア */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 h-[600px] flex flex-col">
          {/* メッセージ表示エリア */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-[80%] ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {/* アバター */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.isUser ? 'bg-blue-500' : 'bg-green-500'
                  }`}>
                    {message.isUser ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-white" />
                    )}
                  </div>

                  {/* メッセージバブル */}
                  <div className={`rounded-2xl px-4 py-3 ${
                    message.isUser
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    <p className={`text-xs mt-2 ${
                      message.isUser ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString('ja-JP', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* ローディング表示 */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl px-4 py-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* 入力エリア */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-3">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="メッセージを入力してください..."
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                rows={2}
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className={`px-6 py-3 rounded-lg font-jp-medium transition-colors ${
                  inputMessage.trim() && !isLoading
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* サポート情報 */}
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-jp-bold text-gray-800 mb-4">専門的なサポートが必要な場合</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h4 className="font-jp-bold text-red-800 mb-2">緊急時</h4>
              <p className="text-red-700 text-sm mb-2">いのちの電話</p>
              <p className="text-red-800 font-jp-bold">0570-783-556</p>
              <p className="text-red-600 text-xs">24時間365日対応</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-jp-bold text-blue-800 mb-2">専門相談</h4>
              <p className="text-blue-700 text-sm mb-2">NAMIDAサポート協会</p>
              <p className="text-blue-800 font-jp-bold">counselor@namisapo.com</p>
              <p className="text-blue-600 text-xs">平日 9:00-17:00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}