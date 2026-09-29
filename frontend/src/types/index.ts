export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  currency: string;
  monthly_allowance: number;
  created_at?: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  color: string;
  icon: string;
  created_at?: string;
}

export interface Expense {
  id: string;
  user_id: string;
  category_id: string | null;
  amount: number;
  description: string;
  expense_date: string;
  payment_method: 'Cash' | 'UPI' | 'Debit Card' | 'Credit Card' | 'Bank Transfer' | 'Other';
  merchant?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
  category?: Category | null;
}

export interface Budget {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  start_date?: string | null;
  end_date?: string | null;
  spent?: number;
  remaining?: number;
  percentage?: number;
  status?: 'normal' | 'caution' | 'warning' | 'over';
  category?: Category | null;
}

export interface SavingsGoal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date?: string | null;
  description?: string | null;
  percentage?: number;
  remaining?: number;
  isCompleted?: boolean;
}

export interface Income {
  id: string;
  user_id: string;
  source: string;
  amount: number;
  income_date: string;
  description?: string | null;
  created_at?: string;
}

export interface DashboardSummary {
  totalIncome: number;
  monthlyAllowance: number;
  totalSpent: number;
  remaining: number;
  savingsRate: number;
  totalSavedInGoals: number;
  expenseCount: number;
  averageDailySpend: number;
  highestExpense: Expense | null;
  topCategory: {
    id: string;
    name: string;
    color: string;
    icon: string;
    amount: number;
    count: number;
    percentage: number;
  } | null;
  monthComparison: {
    difference: number;
    percentage: number;
    increased: boolean;
    decreased: boolean;
    neutral: boolean;
  };
}

export interface InsightSuggestion {
  id: string;
  type: 'category' | 'budget' | 'habit' | 'trend' | 'savings';
  priority: 'urgent' | 'high' | 'medium' | 'positive' | 'low';
  title: string;
  message: string;
  action: string;
  actionUrl: string;
}

export interface FinancialHealth {
  score: 'excellent' | 'good' | 'caution' | 'warning' | 'danger';
  status: string;
  badgeColor: string;
  disclaimer: string;
}

export interface InsightsResponse {
  health: FinancialHealth;
  suggestions: InsightSuggestion[];
}
