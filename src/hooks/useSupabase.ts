import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface Counselor {
  id: string;
  name: string;
  email: string;
  is_active: boolean;
}

export const useSupabase = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [counselor, setCounselor] = useState<Counselor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 現在のセッションを取得
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        loadCounselorData(session.user.email!);
      }
      
      setLoading(false);
    });

    // 認証状態の変更を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await loadCounselorData(session.user.email!);
      } else {
        setCounselor(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadCounselorData = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('counselors')
        .select('*')
        .eq('email', email)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('カウンセラーデータ取得エラー:', error);
        return;
      }

      setCounselor(data);
    } catch (error) {
      console.error('カウンセラーデータ読み込みエラー:', error);
    }
  };

  return {
    user,
    session,
    counselor,
    loading,
    isAuthenticated: !!session,
    isCounselor: !!counselor
  };
};