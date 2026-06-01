# Discord Hub MVP - Setup Instructions

## Quick Start After Deployment

### 1. **Create Supabase Project**
- Go to https://supabase.com
- Create a new project
- Copy your **Project URL** and **Anon Key**
- Create the database tables using the SQL below

### 2. **Database Schema (SQL)**
```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  discord_id TEXT UNIQUE,
  discord_username TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  interests TEXT[],
  reputation INTEGER DEFAULT 0,
  total_trades INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Listings table
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  type TEXT NOT NULL CHECK (type IN ('buy', 'sell')),
  offering TEXT NOT NULL,
  looking_for TEXT NOT NULL,
  price NUMERIC,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Servers table
CREATE TABLE servers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES users(id),
  server_name TEXT NOT NULL,
  invite_link TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES users(id),
  receiver_id UUID NOT NULL REFERENCES users(id),
  listing_id UUID REFERENCES listings(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE servers ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
```

### 3. **Environment Variables**
Add to `.env.local` or Vercel dashboard:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=https://slayxovastudio.online
NEXT_PUBLIC_DISCORD_CLIENT_ID=your_discord_app_id
```

### 4. **Discord OAuth Setup**
1. Go to https://discord.com/developers/applications
2. Create a New Application
3. Go to "OAuth2" → "General"
4. Add Redirect URL: `https://slayxovastudio.online/auth/callback`
5. Copy Client ID to `.env.local`
6. In Supabase, go to Authentication → Providers → Discord
7. Paste your Discord credentials

### 5. **Hostinger Domain Setup**
1. In Vercel, go to Settings → Domains
2. Add your domain: `slayxovastudio.online`
3. Vercel will show you DNS records to add
4. Go to Hostinger → Domain Management
5. Update DNS records to point to Vercel
6. Wait 24-48 hours for propagation

## Features Included
✅ User Profiles (Discord & Email auth)
✅ Marketplace (Buy/Sell listings)
✅ Server Directory with Upvoting
✅ Friend Discovery
✅ Real-time Messaging Ready
✅ Reputation System
✅ Discord dark theme with Blurple colors

## Next Steps
1. Add moderation/reporting system
2. Implement real-time chat with Supabase
3. Add payment integration (Stripe)
4. Mobile app (React Native)

Built with ❤️ using Next.js + Supabase + Vercel
