import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-gray-700 bg-gray-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blurple to-pink-500 bg-clip-text text-transparent">
            Discord Hub
          </h1>
          <div className="flex gap-4">
            <Link
              href="/auth/login"
              className="px-6 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="px-6 py-2 bg-blurple hover:bg-blurple/90 text-white font-semibold rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            The Ultimate Discord{" "}
            <span className="bg-gradient-to-r from-blurple via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Community Hub
            </span>
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Trade OWO cash, game items, and NFTs. Find gaming crews. Discover Discord servers.
            Connect with verified traders and build your reputation.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gray-950 border border-blurple/30 rounded-xl p-6">
              <div className="text-4xl mb-3">💎</div>
              <h3 className="text-xl font-bold text-white mb-2">Marketplace</h3>
              <p className="text-gray-400">Trade OWO, Nitro, game items, skins & more</p>
            </div>
            <div className="bg-gray-950 border border-blurple/30 rounded-xl p-6">
              <div className="text-4xl mb-3">🖥️</div>
              <h3 className="text-xl font-bold text-white mb-2">Server Directory</h3>
              <p className="text-gray-400">Discover & join gaming, anime & coding servers</p>
            </div>
            <div className="bg-gray-950 border border-blurple/30 rounded-xl p-6">
              <div className="text-4xl mb-3">⭐</div>
              <h3 className="text-xl font-bold text-white mb-2">Reputation</h3>
              <p className="text-gray-400">Build trust through verified trades & reviews</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="px-8 py-3 bg-gradient-to-r from-blurple to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Join Now
            </Link>
            <Link
              href="/auth/login"
              className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-700 bg-gray-950/80 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-gray-400 text-sm">
          <p>© 2026 Discord Hub. Built with ❤️ for the Discord community.</p>
        </div>
      </footer>
    </div>
  );
}
