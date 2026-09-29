import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Target,
  Wallet,
  BarChart3,
  Settings,
  HelpCircle,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/expenses', label: 'Expenses', icon: Receipt },
    { to: '/budgets', label: 'Budgets', icon: PieChart },
    { to: '/savings', label: 'Savings Goals', icon: Target },
    { to: '/income', label: 'Income & Allowance', icon: Wallet },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-950/50 p-4 shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="space-y-1">
        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
          Menu
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/25'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Teen Money Tip Card in Sidebar */}
      <div className="mt-auto p-4 rounded-2xl bg-gradient-to-br from-brand-50 to-indigo-50/50 dark:from-brand-950/30 dark:to-slate-900 border border-brand-100 dark:border-brand-900/40">
        <div className="flex items-center gap-2 text-brand-700 dark:text-brand-300 font-bold text-xs mb-1">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Quick Money Tip</span>
        </div>
        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
          Try the <strong>50/30/20 rule</strong>: 50% for needs, 30% for fun, and 20% right into your savings goal!
        </p>
      </div>
    </aside>
  );
};
