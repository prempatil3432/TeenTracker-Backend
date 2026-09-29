import api from './api';
import { DashboardSummary, Expense, Budget, SavingsGoal } from '../types';

export interface DashboardResponse {
  summary: DashboardSummary;
  categoryBreakdown: Array<{
    id: string;
    name: string;
    color: string;
    icon: string;
    amount: number;
    count: number;
    percentage: number;
  }>;
  budgetUsage: Budget[];
  weekdaySpending: Array<{
    day: string;
    shortDay: string;
    amount: number;
  }>;
  savingsGoals: SavingsGoal[];
  recentExpenses: Expense[];
}

export interface MonthlyTrendItem {
  month: string;
  year: number;
  fullLabel: string;
  expenses: number;
  income: number;
  savings: number;
}

export const analyticsService = {
  async getDashboard(): Promise<DashboardResponse> {
    const res = await api.get('/analytics/dashboard');
    return res.data.data;
  },

  async getMonthlyTrend(): Promise<MonthlyTrendItem[]> {
    const res = await api.get('/analytics/monthly');
    return res.data.data.trend;
  },

  async getCategoryBreakdown(): Promise<
    Array<{
      id: string;
      name: string;
      color: string;
      icon: string;
      amount: number;
      count: number;
      percentage: number;
    }>
  > {
    const res = await api.get('/analytics/categories');
    return res.data.data.breakdown;
  },

  async getWeeklySpending(): Promise<
    Array<{
      day: string;
      shortDay: string;
      amount: number;
    }>
  > {
    const res = await api.get('/analytics/weekly');
    return res.data.data.weekly;
  },
};
