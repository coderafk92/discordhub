'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import { useAuthStore } from '@/lib/stores/authStore';
import { authService } from '@/lib/utils/authService';
import { listingService } from '@/lib/utils/listingService';
import { Listing } from '@/lib/types';

export default function Marketplace() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuthStore();
  const [listings, setListings] = useState<Listing[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(searchParams.get('type') === 'create');
  const [formData, setFormData] = useState({
    type: 'sell' as 'buy' | 'sell',
    offering: '',
    looking_for: '',
    price: '',
    description: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'buy' | 'sell'>('all');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadListings = async () => {
      const { data } = await listingService.getListings(50);
      setListings(data);
    };

    loadListings();
  }, []);

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      const { data } = await listingService.searchListings(
        searchQuery,
        filterType === 'all' ? undefined : filterType
      );
      setListings(data);
    } else {
      const { data } = await listingService.getListings(50);
      setListings(data);
    }
  };

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setSubmitting(true);
      await listingService.createListing({
        user_id: user.id,
        type: formData.type,
        offering: formData.offering,
        looking_for: formData.looking_for,
        price: formData.price ? parseFloat(formData.price) : null,
        description: formData.description,
        status: 'active',
      });

      setFormData({
        type: 'sell',
        offering: '',
        looking_for: '',
        price: '',
        description: '',
      });
      setShowCreateForm(false);

      const { data } = await listingService.getListings(50);
      setListings(data);
    } finally {
      setSubmitting(false);
    }
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
        <h1 className="text-4xl font-bold text-white mb-8">💎 Marketplace</h1>

        {/* Search Bar */}
        <div className="mb-8 flex gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search listings..."
            className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blurple transition-colors"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-blurple hover:bg-blurple/90 text-white font-semibold rounded-lg transition-colors"
          >
            Search
          </button>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
          >
            + Create Listing
          </button>
        </div>

        {/* Filters */}
        <div className="mb-8 flex gap-2">
          {(['all', 'buy', 'sell'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filterType === type
                  ? 'bg-blurple text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {type === 'all' ? 'All Listings' : type === 'buy' ? '🔍 Want to Buy' : '🛍️ Want to Sell'}
            </button>
          ))}
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="bg-gray-950 border border-blurple/30 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Create New Listing</h2>
            <form onSubmit={handleCreateListing} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'buy' | 'sell' })}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blurple"
                  >
                    <option value="sell">🛍️ Want to Sell</option>
                    <option value="buy">🔍 Want to Buy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Price (Optional)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0"
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blurple"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Offering</label>
                <input
                  type="text"
                  value={formData.offering}
                  onChange={(e) => setFormData({ ...formData, offering: e.target.value })}
                  placeholder="e.g., 5M OWO Cash"
                  required
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blurple"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Looking For</label>
                <input
                  type="text"
                  value={formData.looking_for}
                  onChange={(e) => setFormData({ ...formData, looking_for: e.target.value })}
                  placeholder="e.g., Nitro Gift / Robux"
                  required
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blurple"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add details about your trade..."
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blurple"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-2 bg-blurple hover:bg-blurple/90 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create Listing'}
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

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.length > 0 ? (
            listings.map((listing) => (
              <div key={listing.id} className="bg-gray-950 border border-gray-700 rounded-xl p-6 hover:border-blurple/50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      listing.type === 'sell'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {listing.type === 'sell' ? '🛍️ Selling' : '🔍 Buying'}
                    </span>
                  </div>
                  {listing.price && <span className="text-lg font-bold text-blurple">${listing.price}</span>}
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">{listing.offering}</h3>
                <p className="text-sm text-gray-400 mb-4">Looking for: {listing.looking_for}</p>
                <p className="text-sm text-gray-400 mb-6">{listing.description}</p>

                <div className="flex items-center gap-3 pt-4 border-t border-gray-700">
                  {listing.user?.avatar_url && (
                    <img src={listing.user.avatar_url} alt={listing.user.discord_username} className="w-8 h-8 rounded-full" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{listing.user?.discord_username}</p>
                    <p className="text-xs text-gray-400">⭐ {listing.user?.reputation || 0}</p>
                  </div>
                  <button className="px-4 py-2 bg-blurple hover:bg-blurple/90 text-white text-sm font-semibold rounded-lg transition-colors">
                    Contact
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400 text-lg">No listings found. Create one to get started!</p>
            </div>
          )}
        </div>
      </div>
    </Sidebar>
  );
}
