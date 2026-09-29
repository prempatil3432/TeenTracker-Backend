import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Sparkles, Eye, EyeOff, Lock, Mail, PlayCircle, UserPlus } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { SignUpModal } from '../components/auth/SignUpModal';

export const LoginPage: React.FC = () => {
  const { login, loginAsDemo } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login({ email, password });
      showToast('Welcome back! 🚀', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError(null);
    setIsDemoLoading(true);
    try {
      await loginAsDemo();
      showToast('Logged in as Alex Rivera (Demo Teen)! 🎮', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      setError('Failed to log in as demo user');
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center px-4 py-12 transition-colors duration-200">
      {/* Decorative gradient blur */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/15 dark:bg-brand-500/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="relative w-full max-w-md">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-violet-500 items-center justify-center text-white shadow-xl shadow-brand-500/25 mb-3">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            TEENSPEND
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Master your money. Level up your savings.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-7 shadow-xl shadow-slate-200/50 dark:shadow-none">
          {/* Quick Action buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isDemoLoading || isLoading}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold transition-all shadow-sm group"
            >
              <PlayCircle className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
              <span>{isDemoLoading ? 'Loading Demo...' : '⚡ Quick Demo (Alex)'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSignUpOpen(true)}
              disabled={isDemoLoading || isLoading}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/30 text-brand-700 dark:text-brand-300 text-xs font-bold transition-all shadow-sm group"
            >
              <UserPlus className="w-4 h-4 text-brand-500 group-hover:scale-110 transition-transform" />
              <span>✨ Sign Up Pop-up</span>
            </button>
          </div>

          <div className="relative flex py-2 items-center mb-4">
            <div className="flex-grow border-t border-slate-100 dark:border-slate-800" />
            <span className="flex-shrink mx-3 text-[11px] font-semibold uppercase text-slate-400">
              Or sign in with email
            </span>
            <div className="flex-grow border-t border-slate-100 dark:border-slate-800" />
          </div>

          {error && (
            <div className="p-3 mb-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              required
              autoFocus
              placeholder="alex@teenspend.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-[34px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Don't have an account yet?{' '}
            <button
              type="button"
              onClick={() => setIsSignUpOpen(true)}
              className="font-bold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Sign up with Pop-up
            </button>
            <span className="mx-1.5 text-slate-300 dark:text-slate-700">|</span>
            <Link
              to="/register"
              className="text-slate-500 dark:text-slate-400 hover:underline"
            >
              Full Page
            </Link>
          </div>
        </div>
      </div>

      {/* Sign Up Pop-up Modal */}
      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
        onSwitchToLogin={() => setIsSignUpOpen(false)}
      />
    </div>
  );
};
