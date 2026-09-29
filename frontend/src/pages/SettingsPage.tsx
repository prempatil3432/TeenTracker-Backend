import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Button } from '../components/common/Button';
import {
  User,
  Moon,
  Sun,
  ShieldAlert,
  Save,
  LogOut,
  Info,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SettingsPage: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [age, setAge] = useState(String(user?.age || 16));
  const [currency, setCurrency] = useState(user?.currency || '₹');
  const [monthlyAllowance, setMonthlyAllowance] = useState(String(user?.monthly_allowance || 5000));
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await updateUser({
        name: name.trim(),
        age: parseInt(age, 10) || 16,
        currency,
        monthly_allowance: parseFloat(monthlyAllowance) || 0,
      });
      showToast('Profile and settings updated! ⚙️', 'success');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update settings', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    showToast('Signed out cleanly', 'info');
    navigate('/login');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Settings & Profile ⚙️
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize your currency, allowance, and personal preferences.
        </p>
      </div>

      {/* Profile & Financial Settings */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-brand-500" />
          <span>Profile Information</span>
        </h3>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              label="Email Address"
              value={user?.email || ''}
              disabled
              helperText="Email cannot be changed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Age"
              type="number"
              min="10"
              max="25"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />

            <Select
              label="Preferred Currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="₹">₹ (INR - Rupee)</option>
              <option value="$">$ (USD - Dollar)</option>
              <option value="€">€ (EUR - Euro)</option>
              <option value="£">£ (GBP - British Pound)</option>
              <option value="A$">A$ (AUD - Australian Dollar)</option>
              <option value="C$">C$ (CAD - Canadian Dollar)</option>
            </Select>

            <Input
              label="Monthly Allowance / Pocket Money"
              type="number"
              min="0"
              step="100"
              value={monthlyAllowance}
              onChange={(e) => setMonthlyAllowance(e.target.value)}
            />
          </div>

          <div className="flex justify-end pt-3">
            <Button type="submit" isLoading={isLoading} leftIcon={<Save className="w-4 h-4" />}>
              Save Preferences
            </Button>
          </div>
        </form>
      </div>

      {/* Appearance & Dark Mode Toggle */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            {theme === 'dark' ? <Moon className="w-4 h-4 text-brand-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <span>Interface Theme</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Current mode: <strong className="capitalize">{theme}</strong>
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={toggleTheme}>
          Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
        </Button>
      </div>

      {/* Educational & Financial Safety Disclaimer (Section 51) */}
      <div className="bg-slate-50 dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 text-xs space-y-2">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold">
          <Info className="w-4 h-4 text-brand-500 shrink-0" />
          <span>About TEENSPEND Financial Literacy</span>
        </div>
        <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
          TEENSPEND is an educational personal finance tracker built specifically for teenagers to develop
          smart money management habits, visualize where pocket money goes, and set positive savings goals.
          Suggestions and financial health indicators are educational observations derived solely from
          your entered data and do not constitute professional financial or investment advice.
        </p>
      </div>

      {/* Danger Zone */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-rose-200/80 dark:border-rose-900/40 p-6 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            <span>Account Session</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Sign out of this browser session.
          </p>
        </div>

        <Button variant="danger" size="sm" onClick={handleLogout} leftIcon={<LogOut className="w-4 h-4" />}>
          Sign Out
        </Button>
      </div>
    </div>
  );
};
