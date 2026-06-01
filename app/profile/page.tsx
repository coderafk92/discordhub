'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import { useAuthStore } from '@/lib/stores/authStore';
import { authService } from '@/lib/utils/authService';

export default function ProfilePage() {
  const router = useRouter();
  const { user, setUser, loading } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    discord_username: '',
    bio: '',
    interests: [] as string[],
  });
  const [submitting, setSubmitting] = useState(false);

  const interestOptions = ['Gaming', 'Anime', 'Coding', 'Dating', 'Art', 'Music', 'Trading', 'Business'];

  useEffect(() => {
    if (user) {
      setFormData({
        discord_username: user.discord_username,
        bio: user.bio || '',
        interests: user.interests || [],
      });
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setSubmitting(true);
      const updated = await authService.updateUserProfile(user.id, {
        discord_username: formData.discord_username,
        bio: formData.bio || null,
        interests: formData.interests.length > 0 ? formData.interests : null,
      });

      if (updated.data) {
        setUser(updated.data);
        setEditing(false);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
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
        <h1 className="text-4xl font-bold text-white mb-8">👤 Your Profile</h1>

        <div className="max-w-2xl">
          {/* Profile Card */}
          <div className="bg-gray-950 border border-blurple/30 rounded-xl p-8 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-6">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.discord_username} className="w-24 h-24 rounded-full" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blurple to-purple-600 flex items-center justify-center">
                    <span className="text-3xl">👤</span>
                  </div>
                )}
                <div>
                  <h2 className="text-3xl font-bold text-white">{user.discord_username}</h2>
                  <p className="text-gray-400">Member since {new Date(user.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <button
                onClick={() => setEditing(!editing)}
                className="px-6 py-2 bg-blurple hover:bg-blurple/90 text-white font-semibold rounded-lg transition-colors"
              >
                {editing ? 'Cancel' : '✏️ Edit'}
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-900 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Total Trades</p>
                <p className="text-2xl font-bold text-blurple">{user.total_trades}</p>
              </div>
              <div className="bg-gray-900 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Reputation</p>
                <p className="text-2xl font-bold text-yellow-500">⭐ {user.reputation}</p>
              </div>
              <div className="bg-gray-900 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Status</p>
                <p className="text-lg font-bold text-green-400">● Online</p>
              </div>
            </div>

            {/* Bio */}
            <div className="border-t border-gray-700 pt-6">
              <p className="text-sm text-gray-400 mb-2">About Me</p>
              <p className="text-white text-lg">{user.bio || 'No bio yet. Add one to let others know about you!'}</p>
            </div>

            {/* Interests */}
            {user.interests && user.interests.length > 0 && (
              <div className="border-t border-gray-700 pt-6 mt-6">
                <p className="text-sm text-gray-400 mb-3">Interests</p>
                <div className="flex flex-wrap gap-2">
                  {user.interests.map((interest) => (
                    <span key={interest} className="px-3 py-1 bg-blurple/20 text-blurple rounded-full text-sm font-medium">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Edit Form */}
          {editing && (
            <div className="bg-gray-950 border border-blurple/30 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Edit Profile</h2>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Discord Username</label>
                  <input
                    type="text"
                    value={formData.discord_username}
                    onChange={(e) => setFormData({ ...formData, discord_username: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blurple"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blurple"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">Interests</label>
                  <div className="grid grid-cols-2 gap-2">
                    {interestOptions.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          formData.interests.includes(interest)
                            ? 'bg-blurple text-white'
                            : 'bg-gray-900 text-gray-300 hover:bg-gray-800'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-6 py-2 bg-blurple hover:bg-blurple/90 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="flex-1 px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </Sidebar>
  );
}
