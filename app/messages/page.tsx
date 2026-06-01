'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { useAuthStore } from '@/lib/stores/authStore';
import { authService } from '@/lib/utils/authService';

export default function MessagesPage() {
  const { user, loading } = useAuthStore();
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    if (user) {
      // Placeholder: In production, load conversations from database
      setConversations([]);
    }
  }, [user]);

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
        <h1 className="text-4xl font-bold text-white mb-8">💬 Messages</h1>

        {conversations.length === 0 ? (
          <div className="bg-gray-950 border border-gray-700 rounded-xl p-12 text-center">
            <p className="text-gray-400 text-lg mb-4">No messages yet</p>
            <p className="text-gray-500">Start trading and connect with other users to begin conversations</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {conversations.map((conv: any) => (
              <div key={conv.id} className="bg-gray-950 border border-gray-700 rounded-xl p-6 hover:border-blurple/50 transition-colors cursor-pointer">
                {/* Messages will display here */}
              </div>
            ))}
          </div>
        )}
      </div>
    </Sidebar>
  );
}
