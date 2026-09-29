import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { analyticsService, DashboardResponse, MonthlyTrendItem } from '../services/analyticsService';
import { insightService } from '../services/insightService';
import { InsightsResponse } from '../types';
import { StatCard } from '../components/common/StatCard';
import { HealthBadge } from '../components/common/HealthBadge';
import { MonthlyLineChart } from '../components/charts/MonthlyLineChart';
import { CategoryDonutChart } from '../components/charts/CategoryDonutChart';
import { WeeklyBarChart } from '../components/charts/WeeklyBarChart';
import { PageLoading, CardSkeleton } from '../components/common/Loading';
import { Button } from '../components/common/Button';
import { ContributeModal } from '../components/savings/ContributeModal';
import { SavingsGoal } from '../types';
import {
  Wallet,
  CreditCard,
  PiggyBank,
  TrendingDown,
  Sparkles,
  ArrowRight,
  PlusCircle,
  Lightbulb,
  Receipt,
  Target,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const currency = user?.currency || '₹';

  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [monthlyTrend, setMonthlyTrend] = useState<MonthlyTrendItem[]>([]);
  const [insights, setInsights] = useState<InsightsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Contribute modal
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const loadData = useCallback(async () => {
    try {
      const [dash, trend, ins] = await Promise.all([
        analyticsService.getDashboard(),
        analyticsService.getMonthlyTrend(),
        insightService.getInsights(),
      ]);

      setDashboardData(dash);
      setMonthlyTrend(trend);
      setInsights(ins);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    // Listen to global data refresh events (e.g. after adding expense)
    const handleRefresh = () => loadData();
    window.addEventListener('teenspend_refresh_data', handleRefresh);
    return () => window.removeEventListener('teenspend_refresh_data', handleRefresh);
  }, [loadData]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-64 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
        <CardSkeleton count={4} />
      </div>
    );
  }

  const summary = dashboardData?.summary;
  const firstName = user?.name ? user.name.split(' ')[0] : 'there';

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Personalized Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {getGreeting()}, {firstName} 👋
            </h1>
            {insights?.health && <HealthBadge health={insights.health} />}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Here's how your money is doing this month.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/expenses">
            <Button variant="outline" size="sm" leftIcon={<Receipt className="w-4 h-4" />}>
              View All Expenses
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Primary Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Income & Allowance"
          value={`${currency}${(summary?.totalIncome || 0).toLocaleString()}`}
          subtitle={`Allowance: ${currency}${(summary?.monthlyAllowance || 0).toLocaleString()}`}
          icon={<Wallet className="w-5 h-5" />}
          iconBgColor="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        />

        <StatCard
          title="Total Spent"
          value={`${currency}${(summary?.totalSpent || 0).toLocaleString()}`}
          subtitle={`${summary?.expenseCount || 0} transactions this month`}
          icon={<CreditCard className="w-5 h-5" />}
          iconBgColor="bg-rose-500/10 text-rose-600 dark:text-rose-400"
          trend={
            summary?.monthComparison
              ? {
                  value: summary.monthComparison.percentage,
                  isPositive: summary.monthComparison.decreased,
                  label: 'vs last month',
                }
              : undefined
          }
        />

        <StatCard
          title="Remaining Balance"
          value={`${currency}${(summary?.remaining || 0).toLocaleString()}`}
          subtitle={(summary?.remaining || 0) >= 0 ? 'Available pocket money' : 'Overspent this month!'}
          icon={<TrendingDown className="w-5 h-5" />}
          iconBgColor="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
        />

        <StatCard
          title="Total Saved"
          value={`${currency}${(summary?.totalSavedInGoals || 0).toLocaleString()}`}
          subtitle={`Savings rate: ${summary?.savingsRate || 0}%`}
          icon={<PiggyBank className="w-5 h-5" />}
          iconBgColor="bg-brand-500/10 text-brand-600 dark:text-brand-400"
        />
      </div>

      {/* Personalized Smart Money Insights */}
      {insights?.suggestions && insights.suggestions.length > 0 && (
        <div className="bg-gradient-to-r from-brand-900/10 via-indigo-900/10 to-violet-900/10 dark:from-brand-950/40 dark:via-indigo-950/40 dark:to-violet-950/40 border border-brand-200/80 dark:border-brand-900/50 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-brand-500 text-white shadow-sm">
              <Lightbulb className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Smart Money Insights for Alex
            </h3>
            <span className="text-[10px] text-slate-400 ml-auto hidden sm:inline">
              Personalized based on tracked data
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {insights.suggestions.slice(0, 3).map((tip) => (
              <div
                key={tip.id}
                className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-4 flex flex-col justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                    {tip.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {tip.message}
                  </p>
                </div>
                {tip.action && (
                  <Link
                    to={tip.actionUrl}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 mt-3 hover:underline"
                  >
                    <span>{tip.action}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Visualizations: Trend & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Spending Trend (Line Chart) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Monthly Spending Trend
              </h3>
              <p className="text-xs text-slate-400">Past 6 months comparison</p>
            </div>
            <Link
              to="/analytics"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              Full Charts <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <MonthlyLineChart data={monthlyTrend} />
        </div>

        {/* Category Spending (Donut Chart) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Spending by Category
            </h3>
            <p className="text-xs text-slate-400 mb-2">Current month breakdown</p>
          </div>
          <CategoryDonutChart data={dashboardData?.categoryBreakdown || []} />
        </div>
      </div>

      {/* Weekly Spending & Category Budgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Spending Bar Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Weekly Spending Pattern
              </h3>
              <p className="text-xs text-slate-400">Total spent by day of the week</p>
            </div>
          </div>
          <WeeklyBarChart data={dashboardData?.weekdaySpending || []} />
        </div>

        {/* Category Budget Progress */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Category Budgets
              </h3>
              <p className="text-xs text-slate-400">Track against planned limits</p>
            </div>
            <Link
              to="/budgets"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Manage Budgets →
            </Link>
          </div>

          <div className="space-y-4">
            {dashboardData?.budgetUsage && dashboardData.budgetUsage.length > 0 ? (
              dashboardData.budgetUsage.map((budget) => {
                const percentage = budget.percentage || 0;
                const isOver = percentage > 100;
                const isWarning = percentage >= 80 && !isOver;
                const isCaution = percentage >= 60 && percentage < 80;

                const barColor = isOver
                  ? 'bg-rose-500'
                  : isWarning
                  ? 'bg-amber-500'
                  : isCaution
                  ? 'bg-yellow-400'
                  : 'bg-emerald-500';

                return (
                  <div key={budget.id} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-800 dark:text-slate-200">
                        {budget.category?.name || 'Category'}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">
                        {currency}{(budget.spent || 0).toLocaleString()} / {currency}
                        {Number(budget.amount).toLocaleString()} ({percentage}%)
                      </span>
                    </div>

                    <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                        style={{ width: `${Math.min(100, percentage)}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>
                        {isOver
                          ? `Over budget by ${currency}${Math.abs(budget.remaining || 0)}!`
                          : `${currency}${budget.remaining} remaining`}
                      </span>
                      {isOver && (
                        <span className="text-rose-500 font-bold">Exceeded Limit</span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">
                No budgets set yet. Set a budget to stop overspending!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Savings Goals Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Savings Goals 🎯
            </h3>
            <p className="text-xs text-slate-400">Your roadmap to what you want</p>
          </div>
          <Link
            to="/savings"
            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
          >
            All Goals →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dashboardData?.savingsGoals && dashboardData.savingsGoals.length > 0 ? (
            dashboardData.savingsGoals.map((goal) => {
              const current = Number(goal.current_amount || 0);
              const target = Number(goal.target_amount);
              const pct = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
              const isCompleted = current >= target;

              return (
                <div
                  key={goal.id}
                  className="rounded-2xl border border-slate-200/70 dark:border-slate-800/70 p-4 bg-slate-50/50 dark:bg-slate-950/40 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                        {goal.name}
                      </h4>
                      {isCompleted ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                          Achieved! 🎉
                        </span>
                      ) : (
                        <span className="text-xs font-extrabold text-brand-600 dark:text-brand-400">
                          {pct}%
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                      {currency}{current.toLocaleString()} / {currency}{target.toLocaleString()}
                    </p>

                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden mb-3">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-600 to-indigo-500 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedGoal(goal)}
                    leftIcon={<PlusCircle className="w-3.5 h-3.5" />}
                    className="w-full text-xs"
                  >
                    Add Money
                  </Button>
                </div>
              );
            })
          ) : (
            <div className="col-span-3 text-center py-6 text-xs text-slate-400">
              No savings goals yet. Create your first goal to start stacking cash!
            </div>
          )}
        </div>
      </div>

      {/* Quick Deposit Modal */}
      <ContributeModal
        isOpen={Boolean(selectedGoal)}
        onClose={() => setSelectedGoal(null)}
        goal={selectedGoal}
        onSuccess={(completed) => {
          showToast(
            completed
              ? '🎉 GOAL REACHED! You crushed your savings target!'
              : 'Contribution added to goal! 💰',
            'success'
          );
          loadData();
        }}
      />
    </div>
  );
};
