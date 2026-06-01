'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import { useAuthStore } from '@/lib/stores/authStore';
import { authService } from '@/lib/utils/authService';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  const { user, setUser, loading } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const loadUser = async () => {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      if (!currentUser) {
        router.push('/auth/login');
      }
    };

    if (!user && !loading) {
      loadUser();
    }
  }, [mounted, user, loading, router, setUser]);

  if (!mounted || loading || !user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blurple mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Sidebar>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome back, {user.discord_username}! 👋</h1>
          <p className="text-gray-400">Check out what's happening in the community</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blurple/20 to-purple-500/10 border border-blurple/30 rounded-xl p-6">
            <div className="text-4xl font-bold text-blurple mb-2">{user.total_trades}</div>
            <p className="text-gray-400">Total Trades</p>
          </div>
          <div className="bg-gradient-to-br from-blurple/20 to-purple-500/10 border border-blurple/30 rounded-xl p-6">
            <div className="text-4xl font-bold text-yellow-500 mb-2">⭐ {user.reputation}</div>
            <p className="text-gray-400">Your Reputation</p>
          </div>
          <div className="bg-gradient-to-br from-blurple/20 to-purple-500/10 border border-blurple/30 rounded-xl p-6">
            <div className="text-lg font-semibold text-green-400 mb-2">Active</div>
            <p className="text-gray-400">Status</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-950 border border-gray-700 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/marketplace?type=create"
              className="px-6 py-3 bg-gradient-to-r from-blurple to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity text-center"
            >
              📝 Create Listing
            </Link>
            <Link
              href="/marketplace"
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors text-center"
            >
              🛒 Browse Marketplace
            </Link>
            <Link
              href="/servers"
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors text-center"
            >
              🖥️ Explore Servers
            </Link>
            <Link
              href="/profile"
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors text-center"
            >
              👤 Edit Profile
            </Link>
          </div>
        </div>

        {/* Featured Section */}
        <div className="bg-gray-950 border border-gray-700 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">📈 Getting Started</h2>
          <div className="space-y-4 text-gray-300">
            <p>✅ Complete your profile with a bio and interests</p>
            <p>✅ Create your first trade listing</p>
            <p>✅ Browse and connect with other traders</p>
            <p>✅ Build your reputation by completing trades</p>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
