import { supabase } from '../supabase';
import { Listing } from '../types';

export const listingService = {
  async createListing(listing: Omit<Listing, 'id' | 'created_at' | 'updated_at'>) {
    if (!supabase) throw new Error('Supabase not initialized');
    const { data, error } = await supabase
      .from('listings')
      .insert([listing])
      .select()
      .single();

    return { data, error };
  },

  async getListings(limit = 20, offset = 0) {
    if (!supabase) return { data: [], error: null };
    const { data, error } = await supabase
      .from('listings')
      .select('*, user:users(*)')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    return { data: data as (Listing & { user: any })[] || [], error };
  },

  async searchListings(query: string, type?: 'buy' | 'sell') {
    if (!supabase) return { data: [], error: null };
    let query_builder = supabase
      .from('listings')
      .select('*, user:users(*)')
      .eq('status', 'active')
      .or(`offering.ilike.%${query}%,looking_for.ilike.%${query}%`);

    if (type) {
      query_builder = query_builder.eq('type', type);
    }

    const { data, error } = await query_builder.order('created_at', { ascending: false });

    return { data: data as (Listing & { user: any })[] || [], error };
  },

  async getUserListings(userId: string) {
    if (!supabase) return { data: [], error: null };
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    return { data: data as Listing[] || [], error };
  },

  async updateListing(id: string, updates: Partial<Listing>) {
    if (!supabase) throw new Error('Supabase not initialized');
    const { data, error } = await supabase
      .from('listings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  },

  async deleteListing(id: string) {
    if (!supabase) throw new Error('Supabase not initialized');
    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id);

    return { error };
  },
};
