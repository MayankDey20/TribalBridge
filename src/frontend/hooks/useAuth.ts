import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { auth } from '../../backend/lib/auth';
import { supabase } from '../../backend/lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const ensureProfileExists = async (user: User) => {
    try {
      // Wait a moment for database trigger to create profile
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if profile exists (it should be created by database trigger)
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (!profile && (!fetchError || fetchError.code === 'PGRST116')) {
        // Profile doesn't exist (trigger failed?), create it manually
        console.log('Profile not found, creating manually...');
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name || null,
          });

        if (insertError) {
          if (insertError.code === '23505') {
            return;
          }
          throw insertError;
        }
      } else if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }
    } catch (error) {}
  };

  useEffect(() => {
    // Get initial user
    auth.getCurrentUser().then(async ({ user }) => {
      if (user) {
        try {
          await ensureProfileExists(user);
        } catch (error) {}
      }
      setUser(user);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange(async (user) => {
      if (user) {
        try {
          await ensureProfileExists(user);
        } catch (error) {}
      }
      setUser(user);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    setLoading(true);
    try {
      const result = await auth.signUp(email, password, fullName);
      if (result.data?.user) {
        await ensureProfileExists(result.data.user);
      }
      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await auth.signIn(email, password);
      if (result.data?.user) {
        await ensureProfileExists(result.data.user);
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const result = await auth.signOut();
      setUser(null);
      return result;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await auth.signInWithGoogle();
      if (result.data?.user) {
        await ensureProfileExists(result.data.user);
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    signInWithGoogle,
    isAuthenticated: !!user,
  };
}