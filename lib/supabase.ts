import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          discord_id: string;
          discord_username: string;
          avatar_url: string | null;
          bio: string | null;
          interests: string[] | null;
          reputation: number;
          total_trades: number;
          created_at: string;
          updated_at: string;
        };
      };
      listings: {
        Row: {
          id: string;
          user_id: string;
          type: 'buy' | 'sell';
          offering: string;
          looking_for: string;
          price: number | null;
          description: string;
          status: 'active' | 'completed' | 'cancelled';
          created_at: string;
          updated_at: string;
        };
      };
      servers: {
        Row: {
          id: string;
          owner_id: string;
          server_name: string;
          invite_link: string;
          category: string;
          description: string;
          upvotes: number;
          created_at: string;
        };
      };
      messages: {
        Row: {
          id: string;
          sender_id: string;
          receiver_id: string;
          listing_id: string | null;
          content: string;
          created_at: string;
        };
      };
    };
  };
};
