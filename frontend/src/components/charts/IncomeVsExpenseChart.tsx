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
import { MonthlyTrendItem } from '../../services/analyticsService';

interface IncomeVsExpenseChartProps {
  data: MonthlyTrendItem[];
}

export const IncomeVsExpenseChart: React.FC<IncomeVsExpenseChartProps> = ({ data }) => {
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
          <p className="text-emerald-600 dark:text-emerald-400 font-semibold">
            Income: {currency}{Number(payload[0].value).toLocaleString()}
          </p>
          <p className="text-rose-500 font-semibold">
            Expenses: {currency}{Number(payload[1].value).toLocaleString()}
          </p>
          {payload[0].value - payload[1].value > 0 ? (
            <p className="text-brand-600 dark:text-brand-400 font-bold border-t border-slate-100 dark:border-slate-800 pt-1">
              Net Savings: +{currency}{(payload[0].value - payload[1].value).toLocaleString()}
            </p>
          ) : null}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{ paddingBottom: '10px', fontSize: '11px' }}
          />
          <Bar dataKey="income" name="Total Income" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expenses" name="Total Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
