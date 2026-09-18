import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [staffProfile, setStaffProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch staff profile from the staff table
  const fetchStaffProfile = async (userId) => {
    if (!userId) {
      setStaffProfile(null);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (!error && data) {
        setStaffProfile(data);
      } else {
        // If no explicit staff row exists yet, build a minimal profile from user metadata/email
        setStaffProfile(null);
      }
    } catch (err) {
      console.error('[Auth] Error loading staff profile:', err);
    }
  };

  useEffect(() => {
    // 1. Check current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchStaffProfile(session.user.id);
      }
      setLoading(false);
    });

    // 2. Subscribe to auth changes (sign in, sign out, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchStaffProfile(session.user.id);
      } else {
        setStaffProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign in with email and password
  const signInWithPassword = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) {
      throw error;
    }
    return data;
  };

  // Sign out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('[Auth] Sign out error:', error);
      throw error;
    }
    setSession(null);
    setUser(null);
    setStaffProfile(null);
  };

  const value = {
    session,
    user,
    staffProfile,
    loading,
    isAuthenticated: !!user,
    signInWithPassword,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
