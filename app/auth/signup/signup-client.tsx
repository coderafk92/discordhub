'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/lib/utils/authService';
import { useAuthStore } from '@/lib/stores/authStore';

export default function SignupPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [discordUsername, setDiscordUsername] = useState('');
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState('');

  const interestOptions = ['Gaming', 'Anime', 'Coding', 'Dating', 'Art', 'Music', 'Trading', 'Business'];

  const handleDiscordSignup = async () => {
    try {
      setLoading(true);
      const { error } = await authService.signUpWithDiscord();
      if (error) setError(error.message);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      const { data, error } = await authService.signUpWithEmail(email, password);
      if (error) {
        setError(error.message);
        return;
      }

      if (data?.user) {
        setUserId(data.user.id);
        setStep(2);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      await authService.createUserProfile({
        id: userId,
        discord_id: '',
        discord_username: discordUsername,
      });

      await authService.updateUserProfile(userId, {
        bio: bio || null,
        interests: interests.length > 0 ? interests : null,
      });

      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blurple via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
            Discord Hub
          </h1>
          <p className="text-gray-400">Create your account</p>
        </div>

        <div className="bg-gray-950 border border-blurple/30 rounded-xl p-8 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {step === 1 ? (
            <>
              <button
                onClick={handleDiscordSignup}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-blurple hover:bg-blurple/90 text-white font-semibold rounded-lg transition-colors mb-6 disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.369a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.211.375-.444.865-.607 1.252a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.252.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.028C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.056 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.975 14.975 0 001.293-2.1.073.073 0 00-.041-.102 13.19 13.19 0 01-1.881-.9.074.074 0 01-.008-.123c.126-.095.252-.195.372-.298a.075.075 0 01.078-.01c3.928 1.793 8.18 1.793 12.062 0a.075.075 0 01.079.009c.12.103.246.203.373.298a.074.074 0 01-.006.123 12.36 12.36 0 01-1.881.9.074.074 0 00-.041.102c.36.767.772 1.516 1.293 2.1a.074.074 0 00.084.028 19.963 19.963 0 006.002-3.03.073.073 0 00.03-.055c.5-4.297.063-8.045-.595-11.615a.061.061 0 00-.031-.03zM8.02 15.331c-.999 0-1.822-.922-1.822-2.053 0-1.13.804-2.053 1.822-2.053 1.028 0 1.836.922 1.822 2.053 0 1.13-.794 2.053-1.822 2.053zm7.986 0c-.999 0-1.822-.922-1.822-2.053 0-1.13.804-2.053 1.822-2.053 1.028 0 1.836.922 1.822 2.053 0 1.13-.794 2.053-1.822 2.053z" />
                </svg>
                Sign up with Discord
              </button>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-950 text-gray-400">Or</span>
                </div>
              </div>

              <form onSubmit={handleEmailSignup} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blurple"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blurple"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-2 bg-blurple hover:bg-blurple/90 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? 'Creating account...' : 'Sign Up'}
                </button>
              </form>

              <p className="text-center text-gray-400 text-sm mt-6">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-blurple hover:underline">
                  Sign in
                </Link>
              </p>
            </>
          ) : (
            <>
              <form onSubmit={handleCompleteProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Discord Username
                  </label>
                  <input
                    type="text"
                    value={discordUsername}
                    onChange={(e) => setDiscordUsername(e.target.value)}
                    required
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blurple"
                    placeholder="username#1234"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Bio (Optional)</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blurple"
                    placeholder="Tell us about yourself..."
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Interests (Optional)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {interestOptions.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          interests.includes(interest)
                            ? 'bg-blurple text-white'
                            : 'bg-gray-900 text-gray-300 hover:bg-gray-800'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-2 bg-blurple hover:bg-blurple/90 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? 'Completing...' : 'Complete Profile'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
