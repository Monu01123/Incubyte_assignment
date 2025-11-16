import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogIn } from 'lucide-react';

interface LoginFormProps {
  onToggleForm: () => void;
}

export function LoginForm({ onToggleForm }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="glass-effect rounded-2xl p-8 card-shadow animate-scaleIn">
        <div className="flex items-center justify-center mb-6 animate-slideInDown">
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-4 rounded-full shadow-lg shadow-amber-600/50 animate-glow">
            <LogIn className="w-6 h-6 text-white" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-amber-900 to-orange-700 bg-clip-text text-transparent mb-2">Welcome Back</h2>
        <p className="text-center text-gray-600 mb-6">Sign in to your sweet account</p>

        {error && (
          <div className="bg-red-50/80 backdrop-blur border border-red-200/50 text-red-700 px-4 py-3 rounded-lg mb-4 animate-slideInLeft">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300/50 rounded-lg bg-white/50 backdrop-blur-sm input-glow placeholder-gray-400"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300/50 rounded-lg bg-white/50 backdrop-blur-sm input-glow placeholder-gray-400"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-medium py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-amber-600/30 transform hover:-translate-y-0.5 animate-fadeInUp"
            style={{ animationDelay: '0.3s' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={onToggleForm}
              className="text-amber-600 hover:text-amber-700 font-medium transition-colors duration-300 hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
