import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { MonthlyTrendItem } from '../../services/analyticsService';

interface MonthlyLineChartProps {
  data: MonthlyTrendItem[];
}

export const MonthlyLineChart: React.FC<MonthlyLineChartProps> = ({ data }) => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const currency = user?.currency || '₹';

  const gridColor = isDark ? '#1e293b' : '#f1f5f9';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-xl text-xs space-y-1">
          <p className="font-bold text-slate-800 dark:text-slate-100">{label}</p>
          <p className="text-brand-600 dark:text-brand-400 font-semibold">
            Expenses: {currency}{Number(payload[0].value).toLocaleString()}
          </p>
          {payload[1] && (
            <p className="text-emerald-500 font-semibold">
              Income: {currency}{Number(payload[1].value).toLocaleString()}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis
            dataKey="month"
            stroke={textColor}
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke={textColor}
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => `${currency}${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="expenses"
            stroke="#8b5cf6"
            strokeWidth={3}
            dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: isDark ? '#0f172a' : '#ffffff' }}
            activeDot={{ r: 6, fill: '#7c3aed' }}
          />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#10b981"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={{ r: 3, fill: '#10b981' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
