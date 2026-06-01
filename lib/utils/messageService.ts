import { supabase } from '../supabase';
import { Message } from '../types';

export const messageService = {
  async sendMessage(senderId: string, receiverId: string, content: string, listingId?: string) {
    if (!supabase) throw new Error('Supabase not initialized');
    const { data, error } = await supabase
      .from('messages')
      .insert([{
        sender_id: senderId,
        receiver_id: receiverId,
        content,
        listing_id: listingId || null,
      }])
      .select('*, sender:users(*), receiver:users(*)')
      .single();

    return { data, error };
  },

  async getConversation(userId: string, otherUserId: string) {
    if (!supabase) return { data: [], error: null };
    const { data, error } = await supabase
      .from('messages')
      .select('*, sender:users(*), receiver:users(*)')
      .or(
        `and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`
      )
      .order('created_at', { ascending: true });

    return { data: data as Message[] || [], error };
  },

  async getInbox(userId: string) {
    if (!supabase) return { data: [], error: null };
    const { data, error } = await supabase
      .from('messages')
      .select('*, sender:users(*), receiver:users(*)')
      .eq('receiver_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    return { data: data as Message[] || [], error };
  },

  subscribeToMessages(userId: string, callback: (message: Message) => void) {
    if (!supabase) return null;
    return supabase
      .channel(`messages-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${userId}`,
        },
        (payload) => callback(payload.new as Message)
      )
      .subscribe();
  },
};
