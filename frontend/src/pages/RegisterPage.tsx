import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Button } from '../components/common/Button';
import { Sparkles, Eye, EyeOff, Lock, Mail, User as UserIcon } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('16');
  const [currency, setCurrency] = useState('₹');
  const [monthlyAllowance, setMonthlyAllowance] = useState('5000');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        age: parseInt(age, 10) || 16,
        currency,
        monthly_allowance: parseFloat(monthlyAllowance) || 0,
      });

      showToast('Account created! Welcome to TEENSPEND 🚀', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.email ||
        'Failed to create account';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center px-4 py-12 transition-colors duration-200">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/15 dark:bg-brand-500/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-violet-500 items-center justify-center text-white shadow-xl shadow-brand-500/25 mb-3">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Create your Account
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Start taking control of your pocket money today
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-7 shadow-xl shadow-slate-200/50 dark:shadow-none">
          {error && (
            <div className="p-3 mb-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Your Name"
              placeholder="e.g. Alex Rivera"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<UserIcon className="w-4 h-4" />}
            />

            <Input
              label="Email Address"
              type="email"
              required
              placeholder="alex@teenspend.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <div className="relative">
              <Input
                label="Password (min. 6 characters)"
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

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Age"
                type="number"
                min="10"
                max="25"
                required
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />

              <Select
                label="Currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="₹">₹ (INR - Rupee)</option>
                <option value="$">$ (USD - Dollar)</option>
                <option value="€">€ (EUR - Euro)</option>
                <option value="£">£ (GBP - Pound)</option>
                <option value="A$">A$ (AUD)</option>
                <option value="C$">C$ (CAD)</option>
              </Select>
            </div>

            <Input
              label={`Monthly Pocket Money / Allowance (${currency})`}
              type="number"
              min="0"
              step="100"
              placeholder="5000"
              value={monthlyAllowance}
              onChange={(e) => setMonthlyAllowance(e.target.value)}
              helperText="You can also adjust this later in settings"
            />

            <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-bold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Log in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
