import React, { useState } from 'react';
import AdminLogin from '../components/AdminLogin';
import AdminDashboard from '../components/AdminDashboard';
import { signInCounselor, signOutCounselor } from '../lib/supabase';
import { useSupabase } from '../hooks/useSupabase';

const AdminPage: React.FC = () => {
  const { isAuthenticated, isCounselor, counselor, loading } = useSupabase();
  const [loginError, setLoginError] = useState('');

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoginError('');
      await signInCounselor(email, password);
      return true;
    } catch (error: any) {
      setLoginError(error.message || 'ログインに失敗しました');
      return false;
    }
  };

  const handleLogout = async () => {
    try {
      await signOutCounselor();
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-jp-normal">認証状態を確認中...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isCounselor) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <AdminDashboard 
      onLogout={handleLogout} 
      counselorName={counselor?.name || 'カウンセラー'} 
    />
  );
};

export default AdminPage;