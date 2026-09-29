import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Budget } from '../../types';

interface BudgetCompareChartProps {
  budgets: Budget[];
}

export const BudgetCompareChart: React.FC<BudgetCompareChartProps> = ({ budgets }) => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const currency = user?.currency || '₹';

  const gridColor = isDark ? '#1e293b' : '#f1f5f9';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  const chartData = budgets.map((b) => ({
    name: b.category?.name || 'Category',
    budget: Number(b.amount),
    spent: Number(b.spent || 0),
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-xl text-xs space-y-1">
          <p className="font-bold text-slate-800 dark:text-slate-100">{label}</p>
          <p className="text-slate-600 dark:text-slate-400">
            Planned Budget: {currency}{Number(payload[0].value).toLocaleString()}
          </p>
          <p className="text-brand-600 dark:text-brand-400 font-bold">
            Actual Spent: {currency}{Number(payload[1].value).toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  if (!chartData.length) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-400">
        No active budgets set for comparison
      </div>
    );
  }

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis
            dataKey="name"
            stroke={textColor}
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => (val.length > 10 ? `${val.substring(0, 10)}...` : val)}
          />
          <YAxis
            stroke={textColor}
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => `${currency}${val}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{ paddingBottom: '10px', fontSize: '11px' }}
          />
          <Bar dataKey="budget" name="Budget Limit" fill={isDark ? '#334155' : '#cbd5e1'} radius={[4, 4, 0, 0]} />
          <Bar dataKey="spent" name="Spent Amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
