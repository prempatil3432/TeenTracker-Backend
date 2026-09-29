import React, { useState, useEffect, useCallback } from 'react';
import { analyticsService, DashboardResponse, MonthlyTrendItem } from '../services/analyticsService';
import { MonthlyLineChart } from '../components/charts/MonthlyLineChart';
import { CategoryDonutChart } from '../components/charts/CategoryDonutChart';
import { WeeklyBarChart } from '../components/charts/WeeklyBarChart';
import { BudgetCompareChart } from '../components/charts/BudgetCompareChart';
import { IncomeVsExpenseChart } from '../components/charts/IncomeVsExpenseChart';
import { StatCard } from '../components/common/StatCard';
import { Spinner } from '../components/common/Loading';
import { useAuth } from '../context/AuthContext';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Sparkles,
  ShoppingBag,
  Award,
  Zap,
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { user } = useAuth();
  const currency = user?.currency || '₹';

  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [monthlyTrend, setMonthlyTrend] = useState<MonthlyTrendItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      setIsLoading(true);
      const [dash, trend] = await Promise.all([
        analyticsService.getDashboard(),
        analyticsService.getMonthlyTrend(),
      ]);
      setDashboardData(dash);
      setMonthlyTrend(trend);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  const summary = dashboardData?.summary;
  const monthComp = summary?.monthComparison;
  const topCat = summary?.topCategory;
  const highestExp = summary?.highestExpense;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Visual Financial Analytics 📈
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Deep-dive into your spending habits, trends, and smart money patterns.
        </p>
      </div>

      {/* Month-over-Month Comparison Spotlight Card (Section 35) */}
      {monthComp && (
        <div className="bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 rounded-3xl p-6 text-white shadow-xl shadow-brand-500/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Month-over-Month Spending Report</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black">
                {monthComp.increased
                  ? `Spending increased by ${monthComp.percentage}% compared with last month`
                  : monthComp.decreased
                  ? `Spending decreased by ${Math.abs(monthComp.percentage)}% compared with last month 🎉`
                  : 'Spending is exactly on par with last month'}
              </h2>
              <p className="text-xs text-brand-100 mt-1 max-w-xl">
                Net difference: {currency}{Math.abs(monthComp.difference).toLocaleString()} ({monthComp.increased ? 'more' : 'less'} spent this month).
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md flex items-center gap-2">
                {monthComp.increased ? (
                  <TrendingUp className="w-6 h-6 text-rose-300" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-emerald-300" />
                )}
                <span className="text-2xl font-black">
                  {monthComp.increased ? `+${monthComp.percentage}%` : `${monthComp.percentage}%`}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4 Financial Analytics Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Daily Average Spend"
          value={`${currency}${(summary?.averageDailySpend || 0).toLocaleString()}`}
          subtitle="Spent per day on average"
          icon={<Calendar className="w-5 h-5" />}
          iconBgColor="bg-blue-500/10 text-blue-600 dark:text-blue-400"
        />

        <StatCard
          title="Top Spending Category"
          value={topCat?.name || 'None'}
          subtitle={topCat ? `${topCat.percentage}% of all expenses` : 'No expenses yet'}
          icon={<ShoppingBag className="w-5 h-5" />}
          iconBgColor="bg-amber-500/10 text-amber-600 dark:text-amber-400"
        />

        <StatCard
          title="Largest Single Expense"
          value={highestExp ? `${currency}${Number(highestExp.amount).toLocaleString()}` : `${currency}0`}
          subtitle={highestExp ? highestExp.description : 'No transactions'}
          icon={<Zap className="w-5 h-5" />}
          iconBgColor="bg-purple-500/10 text-purple-600 dark:text-purple-400"
        />

        <StatCard
          title="Savings Discipline"
          value={`${summary?.savingsRate || 0}%`}
          subtitle="Of income saved this month"
          icon={<Award className="w-5 h-5" />}
          iconBgColor="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        />
      </div>

      {/* CHART 1: Monthly Spending Trend (Line Chart) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Chart 1: Monthly Spending Trend (6 Months)
          </h3>
          <p className="text-xs text-slate-400">
            Track total expenses over time to identify seasonal spikes.
          </p>
        </div>
        <MonthlyLineChart data={monthlyTrend} />
      </div>

      {/* CHART 2 & CHART 3: Category Donut & Weekly Day-of-Week */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CHART 2: Category Breakdown (Donut Chart) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Chart 2: Category Spending Distribution
            </h3>
            <p className="text-xs text-slate-400">
              Where your pocket money goes by category percentage.
            </p>
          </div>
          <CategoryDonutChart data={dashboardData?.categoryBreakdown || []} />
        </div>

        {/* CHART 3: Weekly Spending by Day (Bar Chart) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Chart 3: Weekday Spending Breakdown
            </h3>
            <p className="text-xs text-slate-400">
              Monday to Sunday comparison — pinpoint weekend splurges.
            </p>
          </div>
          <WeeklyBarChart data={dashboardData?.weekdaySpending || []} />
        </div>
      </div>

      {/* CHART 4 & CHART 5: Budget vs Actual & Income vs Expense */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CHART 4: Budget vs Actual Spending (Bar Chart) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Chart 4: Planned Budget vs Actual Spending
            </h3>
            <p className="text-xs text-slate-400">
              Direct comparison between your limit and what you actually spent.
            </p>
          </div>
          <BudgetCompareChart budgets={dashboardData?.budgetUsage || []} />
        </div>

        {/* CHART 5: Income vs Expense Inflows and Outflows */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Chart 5: Income vs Expenses Over Time
            </h3>
            <p className="text-xs text-slate-400">
              Ensure earnings and allowances consistently exceed expenses.
            </p>
          </div>
          <IncomeVsExpenseChart data={monthlyTrend} />
        </div>
      </div>
    </div>
  );
};
