-- Discord Hub MVP - Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor to set up all tables

-- ============================================
-- 1. USERS TABLE (Profiles)
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  discord_username TEXT,
  discord_id TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT DEFAULT '',
  interests TEXT[] DEFAULT '{}',
  reputation INTEGER DEFAULT 0,
  total_trades INTEGER DEFAULT 0,
  online_status TEXT DEFAULT 'offline',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 2. LISTINGS TABLE (Marketplace)
-- ============================================
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('buy', 'sell')),
  offering TEXT NOT NULL,
  looking_for TEXT NOT NULL,
  price DECIMAL(10,2),
  description TEXT DEFAULT '',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 3. SERVERS TABLE (Directory)
-- ============================================
CREATE TABLE servers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  server_name TEXT NOT NULL,
  invite_link TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT DEFAULT '',
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 4. MESSAGES TABLE (Chat)
-- ============================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 5. TRADE REVIEWS TABLE (Reputation)
-- ============================================
CREATE TABLE trade_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reviewed_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 6. UPVOTES TABLE (Server Directory)
-- ============================================
CREATE TABLE server_upvotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  server_id UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, server_id)
);

-- ============================================
-- INDEXES (Performance Optimization)
-- ============================================
CREATE INDEX idx_listings_user_id ON listings(user_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_type ON listings(type);
CREATE INDEX idx_servers_owner_id ON servers(owner_id);
CREATE INDEX idx_servers_category ON servers(category);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_trade_reviews_reviewed_user_id ON trade_reviews(reviewed_user_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_discord_id ON users(discord_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS) - ENABLE
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE servers ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE server_upvotes ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES - USERS
-- ============================================
-- Allow users to read all profiles
CREATE POLICY "Users can read all profiles" ON users
  FOR SELECT USING (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow users to insert their own profile (signup)
CREATE POLICY "Users can create their own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- RLS POLICIES - LISTINGS
-- ============================================
-- Allow users to read all listings
CREATE POLICY "Listings are readable by everyone" ON listings
  FOR SELECT USING (true);

-- Allow users to create listings
CREATE POLICY "Users can create listings" ON listings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own listings
CREATE POLICY "Users can update their own listings" ON listings
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own listings
CREATE POLICY "Users can delete their own listings" ON listings
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- RLS POLICIES - SERVERS
-- ============================================
-- Allow users to read all servers
CREATE POLICY "Servers are readable by everyone" ON servers
  FOR SELECT USING (true);

-- Allow users to create servers
CREATE POLICY "Users can create servers" ON servers
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Allow users to update their own servers
CREATE POLICY "Users can update their own servers" ON servers
  FOR UPDATE USING (auth.uid() = owner_id);

-- Allow users to delete their own servers
CREATE POLICY "Users can delete their own servers" ON servers
  FOR DELETE USING (auth.uid() = owner_id);

-- ============================================
-- RLS POLICIES - MESSAGES
-- ============================================
-- Allow users to read their own messages
CREATE POLICY "Users can read their messages" ON messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Allow users to send messages
CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Allow users to update their own messages
CREATE POLICY "Users can update their messages" ON messages
  FOR UPDATE USING (auth.uid() = sender_id);

-- ============================================
-- RLS POLICIES - TRADE REVIEWS
-- ============================================
-- Allow users to read all reviews
CREATE POLICY "Reviews are readable by everyone" ON trade_reviews
  FOR SELECT USING (true);

-- Allow users to create reviews
CREATE POLICY "Users can create reviews" ON trade_reviews
  FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- ============================================
-- RLS POLICIES - SERVER UPVOTES
-- ============================================
-- Allow users to read all upvotes
CREATE POLICY "Upvotes are readable" ON server_upvotes
  FOR SELECT USING (true);

-- Allow users to add upvotes
CREATE POLICY "Users can upvote servers" ON server_upvotes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to remove their upvotes
CREATE POLICY "Users can remove their upvotes" ON server_upvotes
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- VIEWS (Helper Queries)
-- ============================================

-- View for listings with user info
CREATE OR REPLACE VIEW listings_with_user AS
SELECT 
  l.*,
  u.discord_username,
  u.avatar_url,
  u.reputation
FROM listings l
JOIN users u ON l.user_id = u.id;

-- View for servers with owner info
CREATE OR REPLACE VIEW servers_with_user AS
SELECT 
  s.*,
  u.discord_username,
  u.avatar_url,
  COUNT(su.id) as upvote_count
FROM servers s
JOIN users u ON s.owner_id = u.id
LEFT JOIN server_upvotes su ON s.id = su.server_id
GROUP BY s.id, u.id;

-- ============================================
-- STORAGE BUCKETS (for images)
-- ============================================
-- Create storage bucket for avatars
-- Note: Do this in Supabase UI -> Storage -> Create new bucket
-- Name: avatars, Privacy: Public
-- Name: screenshots, Privacy: Private

-- ============================================
-- DONE!
-- ============================================
-- Your Discord Hub database is now ready!
-- All tables, indexes, RLS policies, and views are set up.
