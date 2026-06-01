'use client';

import Sidebar from '@/components/layout/Sidebar';
import { useAuthStore } from '@/lib/stores/authStore';

export default function FriendsPage() {
  const { user, loading } = useAuthStore();

  if (loading || !user) {
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
        <h1 className="text-4xl font-bold text-white mb-8">👥 Friends</h1>

        <div className="bg-gray-950 border border-gray-700 rounded-xl p-12 text-center">
          <p className="text-gray-400 text-lg mb-4">Friend feature coming soon</p>
          <p className="text-gray-500">Search for users by interests and add them as friends</p>
        </div>
      </div>
    </Sidebar>
  );
}
