import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Sun,
  Moon,
  Plus,
  LogOut,
  User as UserIcon,
  Bell,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { Button } from '../common/Button';

interface NavbarProps {
  onOpenAddExpense: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAddExpense }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Brand logo */}
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                TEENSPEND
              </span>
              <span className="hidden sm:inline-block ml-1.5 px-1.5 py-0.5 text-[10px] font-bold bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 rounded-md">
                PRO
              </span>
            </div>
          </Link>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick Add Expense Button */}
          <Button
            size="sm"
            onClick={onOpenAddExpense}
            leftIcon={<Plus className="w-4 h-4" />}
            className="hidden sm:inline-flex"
          >
            Add Expense
          </Button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Notifications</h4>
                  <span className="text-[10px] bg-brand-100 dark:bg-brand-950 text-brand-600 font-semibold px-2 py-0.5 rounded-full">
                    2 New
                  </span>
                </div>
                <div className="mt-3 space-y-3">
                  <div className="text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">Welcome to TEENSPEND! 🚀</p>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">Start tracking your spending and crush your savings goals.</p>
                  </div>
                  <div className="text-xs p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-800/30">
                    <p className="font-semibold text-amber-800 dark:text-amber-200">Budget Alert ⚠️</p>
                    <p className="text-amber-700 dark:text-amber-300 mt-0.5">You're approaching your Shopping category budget limit.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="User menu"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-500 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="hidden md:inline-block text-xs font-semibold text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
                {user?.name?.split(' ')[0]}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                onClick={() => setIsDropdownOpen(false)}
              >
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.name}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                </div>

                <Link
                  to="/settings"
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-slate-400" />
                  Account & Settings
                </Link>

                <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
