export interface User {
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
}

export interface Listing {
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
  user?: User;
}

export interface Server {
  id: string;
  owner_id: string;
  server_name: string;
  invite_link: string;
  category: string;
  description: string;
  upvotes: number;
  created_at: string;
  owner?: User;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  listing_id: string | null;
  content: string;
  created_at: string;
  sender?: User;
  receiver?: User;
}
