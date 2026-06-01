'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import { useAuthStore } from '@/lib/stores/authStore';
import { authService } from '@/lib/utils/authService';
import { serverService } from '@/lib/utils/serverService';
import { Server } from '@/lib/types';

export default function ServersPage() {
  const router = useRouter();
  const { user, loading } = useAuthStore();
  const [servers, setServers] = useState<Server[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Gaming');
  const [formData, setFormData] = useState({
    server_name: '',
    invite_link: '',
    description: '',
    category: 'Gaming',
  });
  const [submitting, setSubmitting] = useState(false);

  const categories = ['Gaming', 'Anime', 'Art', 'Trading', 'Music', 'Tech', 'Dating', 'Business'];

  useEffect(() => {
    const loadServers = async () => {
      const { data } = await serverService.getServersByCategory(selectedCategory);
      setServers(data);
    };

    loadServers();
  }, [selectedCategory]);

  const handleCreateServer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setSubmitting(true);
      await serverService.createServer({
        owner_id: user.id,
        server_name: formData.server_name,
        invite_link: formData.invite_link,
        description: formData.description,
        category: formData.category,
        upvotes: 0,
      });

      setFormData({
        server_name: '',
        invite_link: '',
        description: '',
        category: 'Gaming',
      });
      setShowCreateForm(false);

      const { data } = await serverService.getServersByCategory(selectedCategory);
      setServers(data);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvote = async (serverId: string) => {
    await serverService.upvoteServer(serverId);
    const { data } = await serverService.getServersByCategory(selectedCategory);
    setServers(data);
  };

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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">🖥️ Server Directory</h1>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
          >
            + Add Server
          </button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="bg-gray-950 border border-blurple/30 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Add Your Server</h2>
            <form onSubmit={handleCreateServer} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Server Name</label>
                  <input
                    type="text"
                    value={formData.server_name}
                    onChange={(e) => setFormData({ ...formData, server_name: e.target.value })}
                    required
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blurple"
                    placeholder="My Awesome Server"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blurple"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Discord Invite Link</label>
                <input
                  type="url"
                  value={formData.invite_link}
                  onChange={(e) => setFormData({ ...formData, invite_link: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blurple"
                  placeholder="https://discord.gg/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blurple"
                  placeholder="Describe your server..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-2 bg-blurple hover:bg-blurple/90 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Adding...' : 'Add Server'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Categories */}
        <div className="mb-8 overflow-x-auto flex gap-2 pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-blurple text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Servers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servers.length > 0 ? (
            servers.map((server) => (
              <div key={server.id} className="bg-gray-950 border border-gray-700 rounded-xl p-6 hover:border-blurple/50 transition-colors">
                <h3 className="text-xl font-bold text-white mb-2">{server.server_name}</h3>
                <p className="text-sm text-gray-400 mb-4">{server.description}</p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <span className="text-sm text-yellow-500 font-semibold">👍 {server.upvotes} upvotes</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpvote(server.id)}
                      className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors"
                    >
                      👍 Upvote
                    </button>
                    <a
                      href={server.invite_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-blurple hover:bg-blurple/90 text-white text-sm rounded-lg transition-colors"
                    >
                      Join
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400 text-lg">No servers in this category yet. Be the first to add one!</p>
            </div>
          )}
        </div>
      </div>
    </Sidebar>
  );
}
