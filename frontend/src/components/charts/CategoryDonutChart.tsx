import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { useAuth } from '../../context/AuthContext';

interface CategoryItem {
  id: string;
  name: string;
  color: string;
  amount: number;
  percentage: number;
}

interface CategoryDonutChartProps {
  data: CategoryItem[];
}

const DEFAULT_COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#64748b'];

export const CategoryDonutChart: React.FC<CategoryDonutChartProps> = ({ data }) => {
  const { user } = useAuth();
  const currency = user?.currency || '₹';

  const chartData = data && data.length > 0 ? data : [];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl shadow-xl text-xs space-y-0.5">
          <p className="font-bold text-slate-800 dark:text-slate-100">{item.name}</p>
          <p className="text-slate-600 dark:text-slate-300">
            {currency}{Number(item.amount).toLocaleString()} ({item.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  if (!chartData.length) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-400">
        No category expenses recorded yet
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="w-full md:w-1/2 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={4}
              dataKey="amount"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="w-full md:w-1/2 space-y-2 max-h-56 overflow-y-auto pr-2">
        {chartData.map((item, idx) => (
          <div key={item.id || idx} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 truncate">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: item.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length] }}
              />
              <span className="font-medium text-slate-700 dark:text-slate-300 truncate">
                {item.name}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="font-bold text-slate-900 dark:text-white">
                {currency}{Number(item.amount).toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-400 w-10 text-right">
                {item.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
