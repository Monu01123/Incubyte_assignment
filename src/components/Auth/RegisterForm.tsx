import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserPlus } from 'lucide-react';

interface RegisterFormProps {
  onToggleForm: () => void;
}

export function RegisterForm({ onToggleForm }: RegisterFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(email, password, fullName);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="glass-effect rounded-3xl p-8 md:p-10 card-shadow animate-scaleIn border border-amber-200/30 shadow-2xl">
        {/* Icon Header */}
        <div className="flex items-center justify-center mb-6 animate-slideInDown">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-amber-500 to-orange-600 p-5 rounded-full shadow-2xl shadow-amber-600/50 animate-glow">
              <UserPlus className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>

        {/* Title Section */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold font-serif bg-gradient-to-r from-amber-900 via-orange-700 to-amber-900 bg-clip-text text-transparent mb-3">
            Join Our Family
          </h2>
          <p className="text-gray-700 font-serif italic mb-2">
            "Begin your journey of divine sweetness"
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent"></div>
            <span className="text-amber-600 text-sm">✨</span>
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent"></div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50/90 backdrop-blur-md border-2 border-red-200/70 text-red-800 px-4 py-3 rounded-xl mb-6 animate-slideInLeft shadow-lg">
            <div className="flex items-center gap-2">
              <span className="text-red-600">⚠️</span>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            <label className="block text-sm font-semibold text-gray-700 mb-2 font-serif">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3.5 border-2 border-amber-200/50 rounded-xl bg-white/80 backdrop-blur-sm input-glow placeholder-gray-400 focus:border-amber-400 focus:bg-white transition-all duration-300"
                placeholder="Enter your full name"
                required
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-400">
                👤
              </div>
            </div>
          </div>

          <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <label className="block text-sm font-semibold text-gray-700 mb-2 font-serif">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 border-2 border-amber-200/50 rounded-xl bg-white/80 backdrop-blur-sm input-glow placeholder-gray-400 focus:border-amber-400 focus:bg-white transition-all duration-300"
                placeholder="Enter your email"
                required
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-400">
                ✉️
              </div>
            </div>
          </div>

          <div className="animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <label className="block text-sm font-semibold text-gray-700 mb-2 font-serif">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 border-2 border-amber-200/50 rounded-xl bg-white/80 backdrop-blur-sm input-glow placeholder-gray-400 focus:border-amber-400 focus:bg-white transition-all duration-300"
                placeholder="Create a password (min. 6 characters)"
                required
                minLength={6}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-400">
                🔒
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1.5 font-serif italic">May your password be strong and secure</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 hover:from-amber-700 hover:via-orange-700 hover:to-amber-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-2xl hover:shadow-amber-600/40 transform hover:-translate-y-1 animate-fadeInUp relative overflow-hidden group"
            style={{ animationDelay: '0.4s' }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <span className="text-xl">✨</span>
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-amber-200/50 text-center animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
          <p className="text-gray-600 font-serif">
            Already have an account?{' '}
            <button
              onClick={onToggleForm}
              className="text-amber-700 hover:text-amber-800 font-semibold transition-colors duration-300 hover:underline decoration-2 underline-offset-2"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
