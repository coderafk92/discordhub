import { supabase } from '../supabase';
import { Server } from '../types';

export const serverService = {
  async createServer(server: Omit<Server, 'id' | 'created_at'>) {
    if (!supabase) throw new Error('Supabase not initialized');
    const { data, error } = await supabase
      .from('servers')
      .insert([server])
      .select()
      .single();

    return { data, error };
  },

  async getServers(limit = 20, offset = 0) {
    if (!supabase) return { data: [], error: null };
    const { data, error } = await supabase
      .from('servers')
      .select('*, owner:users(*)')
      .order('upvotes', { ascending: false })
      .range(offset, offset + limit - 1);

    return { data: data as (Server & { owner: any })[] || [], error };
  },

  async getServersByCategory(category: string, limit = 20, offset = 0) {
    if (!supabase) return { data: [], error: null };
    const { data, error } = await supabase
      .from('servers')
      .select('*, owner:users(*)')
      .eq('category', category)
      .order('upvotes', { ascending: false })
      .range(offset, offset + limit - 1);

    return { data: data as (Server & { owner: any })[] || [], error };
  },

  async searchServers(query: string) {
    if (!supabase) return { data: [], error: null };
    const { data, error } = await supabase
      .from('servers')
      .select('*, owner:users(*)')
      .or(`server_name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('upvotes', { ascending: false });

    return { data: data as (Server & { owner: any })[] || [], error };
  },

  async upvoteServer(id: string) {
    if (!supabase) throw new Error('Supabase not initialized');
    const { data: server, error: getError } = await supabase
      .from('servers')
      .select('upvotes')
      .eq('id', id)
      .single();

    if (getError) return { error: getError };

    const { data, error } = await supabase
      .from('servers')
      .update({ upvotes: (server?.upvotes || 0) + 1 })
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  },

  async deleteServer(id: string) {
    if (!supabase) throw new Error('Supabase not initialized');
    const { error } = await supabase
      .from('servers')
      .delete()
      .eq('id', id);

    return { error };
  },
};
