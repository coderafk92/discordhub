import { supabase } from '../supabase';
import { User } from '../types';

export const authService = {
  async signUpWithDiscord() {
    if (!supabase) throw new Error('Supabase not initialized');
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    });
    return { data, error };
  },

  async signUpWithEmail(email: string, password: string) {
    if (!supabase) throw new Error('Supabase not initialized');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  },

  async signInWithEmail(email: string, password: string) {
    if (!supabase) throw new Error('Supabase not initialized');
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  async signOut() {
    if (!supabase) throw new Error('Supabase not initialized');
    return await supabase.auth.signOut();
  },

  async getCurrentUser() {
    if (!supabase) return null;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    return error ? null : (data as User);
  },

  async createUserProfile(userData: {
    id: string;
    discord_id: string;
    discord_username: string;
    avatar_url?: string;
  }) {
    if (!supabase) throw new Error('Supabase not initialized');
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();

    return { data, error };
  },

  async updateUserProfile(userId: string, updates: Partial<User>) {
    if (!supabase) throw new Error('Supabase not initialized');
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    return { data, error };
  },
};
