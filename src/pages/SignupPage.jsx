import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, AlertCircle, Loader } from 'lucide-react';

export default function SignupPage({ theme = 'light' }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      await signup(email, password, name);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={theme === 'dark' ? 'min-h-screen bg-[#1F1F1F] flex items-center justify-center px-4' : 'min-h-screen bg-[#FAFAF8] flex items-center justify-center px-4'}>
      <div className="w-full max-w-md">
        <div className={theme === 'dark' ? 'bg-[#2A2A2A] rounded-lg shadow-xl p-8' : 'bg-white rounded-lg shadow-xl p-8'}>
          <div className="text-center mb-8">
            <h1 className={theme === 'dark' ? 'text-3xl font-bold text-[#FFD400]' : 'text-3xl font-bold text-[#5A2D0C]'}>LampandGlow</h1>
            <p className={theme === 'dark' ? 'text-stone-300 mt-2' : 'text-stone-600 mt-2'}>Create your account</p>
          </div>

          {error && (
            <div className={theme === 'dark' ? 'bg-red-900/20 border border-red-700 rounded-lg p-4 mb-6 flex items-start gap-3' : 'bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3'}>
              <AlertCircle className="text-[#E53935] flex-shrink-0 mt-0.5" size={20} />
              <p className={theme === 'dark' ? 'text-red-300 text-sm' : 'text-red-700 text-sm'}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={theme === 'dark' ? 'block text-sm font-medium text-stone-200 mb-1' : 'block text-sm font-medium text-stone-700 mb-1'}>Name</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-3 text-stone-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={theme === 'dark' ? 'w-full pl-10 pr-4 py-2 border border-stone-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-[#2A2A2A] text-stone-100 placeholder:text-stone-500' : 'w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-stone-900 placeholder:text-stone-400'}
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className={theme === 'dark' ? 'block text-sm font-medium text-stone-200 mb-1' : 'block text-sm font-medium text-stone-700 mb-1'}>Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-3 text-stone-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={theme === 'dark' ? 'w-full pl-10 pr-4 py-2 border border-stone-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-[#2A2A2A] text-stone-100 placeholder:text-stone-500' : 'w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-stone-900 placeholder:text-stone-400'}
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className={theme === 'dark' ? 'block text-sm font-medium text-stone-200 mb-1' : 'block text-sm font-medium text-stone-700 mb-1'}>Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-3 text-stone-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={theme === 'dark' ? 'w-full pl-10 pr-4 py-2 border border-stone-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-[#2A2A2A] text-stone-100 placeholder:text-stone-500' : 'w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-stone-900 placeholder:text-stone-400'}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className={theme === 'dark' ? 'block text-sm font-medium text-stone-200 mb-1' : 'block text-sm font-medium text-stone-700 mb-1'}>Confirm Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-3 text-stone-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={theme === 'dark' ? 'w-full pl-10 pr-4 py-2 border border-stone-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-[#2A2A2A] text-stone-100 placeholder:text-stone-500' : 'w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-stone-900 placeholder:text-stone-400'}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5A2D0C] hover:bg-[#7A4A20] text-white font-semibold py-2.5 rounded-lg transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading && <Loader size={18} className="animate-spin" />}
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <div className={theme === 'dark' ? 'mt-6 pt-6 border-t border-stone-700' : 'mt-6 pt-6 border-t border-stone-200'}>
            <p className={theme === 'dark' ? 'text-center text-stone-300 text-sm' : 'text-center text-stone-600 text-sm'}>
              Already have an account?{' '}
              <Link to="/login" className="text-[#FFD400] hover:text-[#FFE566] font-semibold">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}