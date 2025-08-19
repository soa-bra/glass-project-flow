// Authentication Provider with Role Management
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type BoardRole = 'host' | 'editor' | 'viewer';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  getBoardRole: (boardId: string) => Promise<BoardRole | null>;
  hasPermission: (boardId: string, minRole: BoardRole) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const getBoardRole = async (boardId: string): Promise<BoardRole | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase.rpc('get_user_board_role', {
        board_id: boardId,
        user_id: user.id
      });

      if (error) {
        console.error('Error getting board role:', error);
        return null;
      }

      return data as BoardRole;
    } catch (error) {
      console.error('Error getting board role:', error);
      return null;
    }
  };

  const hasPermission = async (boardId: string, minRole: BoardRole): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase.rpc('user_has_board_role', {
        board_id: boardId,
        user_id: user.id,
        min_role: minRole
      });

      if (error) {
        console.error('Error checking permissions:', error);
        return false;
      }

      return data === true;
    } catch (error) {
      console.error('Error checking permissions:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    getBoardRole,
    hasPermission,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}