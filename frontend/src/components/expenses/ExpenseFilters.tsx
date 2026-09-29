import React, { useState } from 'react';
import { Search, Filter, RotateCcw, Download } from 'lucide-react';
import { Category } from '../../types';
import { Button } from '../common/Button';

interface ExpenseFiltersProps {
  categories: Category[];
  filters: {
    search: string;
    category_id: string;
    payment_method: string;
    start_date: string;
    end_date: string;
    min_amount: string;
    max_amount: string;
    sortBy: any;
  };
  onFilterChange: (key: string, value: string) => void;
  onReset: () => void;
  onExport: () => void;
  isExporting?: boolean;
}

export const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({
  categories,
  filters,
  onFilterChange,
  onReset,
  onExport,
  isExporting = false,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm space-y-4">
      {/* Top search & quick controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by description or merchant..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            leftIcon={<Filter className="w-3.5 h-3.5" />}
          >
            {showAdvanced ? 'Hide Filters' : 'Filters'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            isLoading={isExporting}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export CSV
          </Button>

          <button
            onClick={onReset}
            title="Reset Filters"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Advanced Filter Options */}
      {showAdvanced && (
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-in fade-in duration-150">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Category
            </label>
            <select
              value={filters.category_id}
              onChange={(e) => onFilterChange('category_id', e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Payment Method
            </label>
            <select
              value={filters.payment_method}
              onChange={(e) => onFilterChange('payment_method', e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="">All Methods</option>
              <option value="UPI">UPI</option>
              <option value="Cash">Cash</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange('sortBy', e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Amount</option>
              <option value="lowest">Lowest Amount</option>
            </select>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                From Date
              </label>
              <input
                type="date"
                value={filters.start_date}
                onChange={(e) => onFilterChange('start_date', e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
            <div className="flex-1">
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                To Date
              </label>
              <input
                type="date"
                value={filters.end_date}
                onChange={(e) => onFilterChange('end_date', e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
