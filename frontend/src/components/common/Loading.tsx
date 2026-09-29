import React from 'react';
import { Loader2 } from 'lucide-react';

export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({
  size = 'md',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return <Loader2 className={`animate-spin text-brand-600 ${sizeStyles[size]} ${className}`} />;
};

export const PageLoading: React.FC<{ message?: string }> = ({ message = 'Loading TEENSPEND...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
      <Spinner size="lg" />
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">{message}</p>
    </div>
  );
};

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="w-24 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="w-8 h-8 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          </div>
          <div className="w-32 h-7 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="w-20 h-3 bg-slate-200 dark:bg-slate-800 rounded" />
        </div>
      ))}
    </div>
  );
};
