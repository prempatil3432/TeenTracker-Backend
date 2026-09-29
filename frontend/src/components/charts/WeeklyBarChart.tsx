import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface WeekdayItem {
  day: string;
  shortDay: string;
  amount: number;
}

interface WeeklyBarChartProps {
  data: WeekdayItem[];
}

export const WeeklyBarChart: React.FC<WeeklyBarChartProps> = ({ data }) => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const currency = user?.currency || '₹';

  const gridColor = isDark ? '#1e293b' : '#f1f5f9';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl shadow-xl text-xs space-y-0.5">
          <p className="font-bold text-slate-800 dark:text-slate-100">{item.day}</p>
          <p className="text-brand-600 dark:text-brand-400 font-semibold">
            {currency}{Number(item.amount).toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis
            dataKey="shortDay"
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
            tickFormatter={(val) => `${currency}${val}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`bar-${index}`}
                fill={entry.amount > 0 ? '#6366f1' : isDark ? '#334155' : '#e2e8f0'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
