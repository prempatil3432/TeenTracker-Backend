import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, Sparkles } from 'lucide-react';
import { FinancialHealth } from '../../types';

export const HealthBadge: React.FC<{ health: FinancialHealth }> = ({ health }) => {
  const getBadgeConfig = () => {
    switch (health.score) {
      case 'excellent':
        return {
          icon: <Sparkles className="w-4 h-4 text-emerald-500" />,
          bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300',
          dot: 'bg-emerald-500',
        };
      case 'good':
        return {
          icon: <ShieldCheck className="w-4 h-4 text-indigo-500" />,
          bg: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300',
          dot: 'bg-indigo-500',
        };
      case 'warning':
      case 'caution':
        return {
          icon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
          bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300',
          dot: 'bg-amber-500',
        };
      case 'danger':
        return {
          icon: <AlertOctagon className="w-4 h-4 text-rose-500" />,
          bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300',
          dot: 'bg-rose-500',
        };
      default:
        return {
          icon: <ShieldCheck className="w-4 h-4 text-slate-500" />,
          bg: 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300',
          dot: 'bg-slate-500',
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <div
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold shadow-sm ${config.bg}`}
    >
      <span className="relative flex h-2 w-2">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.dot}`}
        />
        <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dot}`} />
      </span>
      {config.icon}
      <span>{health.status}</span>
    </div>
  );
};
