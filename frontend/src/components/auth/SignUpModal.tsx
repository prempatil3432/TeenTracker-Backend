import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Eye, EyeOff, Lock, Mail, User as UserIcon, Sparkles } from 'lucide-react';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin?: () => void;
}

export const SignUpModal: React.FC<SignUpModalProps> = ({
  isOpen,
  onClose,
  onSwitchToLogin,
}) => {
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
      onClose();
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Your Teen Account 🚀"
      description="Start mastering your pocket money, budgets, and savings goals."
      maxWidth="md"
    >
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
          helperText="You can adjust this anytime in Settings"
        />

        <div className="pt-2">
          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            Create Account & Launch
          </Button>
        </div>

        <div className="text-center pt-2 text-xs text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onSwitchToLogin) onSwitchToLogin();
            }}
            className="font-bold text-brand-600 dark:text-brand-400 hover:underline"
          >
            Sign in
          </button>
        </div>
      </form>
    </Modal>
  );
};
