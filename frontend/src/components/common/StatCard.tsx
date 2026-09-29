import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  trend?: {
    value: number;
    label?: string;
    isPositive?: boolean; // If higher is better or worse
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  iconBgColor = 'bg-brand-500/10 text-brand-600 dark:text-brand-400',
  trend,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </p>
        <div className={`p-2.5 rounded-xl ${iconBgColor}`}>
          {icon}
        </div>
      </div>

      <div className="mt-2.5">
        <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {value}
        </h4>
        {subtitle && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {subtitle}
          </p>
        )}
      </div>

      {trend && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center text-xs">
          {trend.value > 0 ? (
            <span
              className={`flex items-center font-semibold mr-1.5 ${
                trend.isPositive !== false ? 'text-emerald-500' : 'text-rose-500'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
              +{trend.value}%
            </span>
          ) : trend.value < 0 ? (
            <span
              className={`flex items-center font-semibold mr-1.5 ${
                trend.isPositive !== false ? 'text-emerald-500' : 'text-rose-500'
              }`}
            >
              <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
              {trend.value}%
            </span>
          ) : (
            <span className="flex items-center text-slate-400 font-medium mr-1.5">
              <Minus className="w-3.5 h-3.5 mr-0.5" />
              0%
            </span>
          )}
          <span className="text-slate-400 dark:text-slate-500">{trend.label || 'vs last month'}</span>
        </div>
      )}
    </div>
  );
};
