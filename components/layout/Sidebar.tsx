'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/stores/authStore';

export default function Sidebar({ children }: { children: ReactNode }) {
  const user = useAuthStore((state) => state.user);

  const navItems = [
    { href: '/dashboard', label: '🏠 Dashboard', icon: '📊' },
    { href: '/marketplace', label: '🛒 Marketplace', icon: '💎' },
    { href: '/servers', label: '🖥️ Servers', icon: '🌐' },
    { href: '/friends', label: '👥 Friends', icon: '🤝' },
    { href: '/messages', label: '💬 Messages', icon: '📧' },
    { href: '/profile', label: '👤 Profile', icon: '⚙️' },
  ];

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-950 border-r border-blurple/30 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-blurple/30">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blurple to-pink-500 bg-clip-text text-transparent">
            Discord Hub
          </h1>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blurple/20 transition-colors text-gray-300 hover:text-white"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Info */}
        {user && (
          <div className="p-4 border-t border-blurple/30 bg-blurple/10">
            <div className="flex items-center gap-3">
              {user.avatar_url && (
                <img
                  src={user.avatar_url}
                  alt={user.discord_username}
                  className="w-10 h-10 rounded-full"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate text-sm">{user.discord_username}</p>
                <p className="text-xs text-gray-400">Reputation: {user.reputation}</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
