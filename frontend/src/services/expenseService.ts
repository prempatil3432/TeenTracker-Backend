import api from './api';
import { Expense } from '../types';

export interface ExpenseQueryParams {
  search?: string;
  category_id?: string;
  payment_method?: string;
  start_date?: string;
  end_date?: string;
  min_amount?: number | string;
  max_amount?: number | string;
  sortBy?: 'newest' | 'oldest' | 'highest' | 'lowest';
  page?: number;
  limit?: number;
}

export interface ExpensesResponse {
  expenses: Expense[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const expenseService = {
  async getExpenses(params: ExpenseQueryParams = {}): Promise<ExpensesResponse> {
    const res = await api.get('/expenses', { params });
    return res.data.data;
  },

  async getExpense(id: string): Promise<Expense> {
    const res = await api.get(`/expenses/${id}`);
    return res.data.data.expense;
  },

  async createExpense(data: {
    category_id?: string | null;
    amount: number;
    description: string;
    expense_date?: string;
    payment_method?: string;
    merchant?: string;
    notes?: string;
  }): Promise<Expense> {
    const res = await api.post('/expenses', data);
    return res.data.data.expense;
  },

  async updateExpense(id: string, updates: Partial<Expense>): Promise<Expense> {
    const res = await api.put(`/expenses/${id}`, updates);
    return res.data.data.expense;
  },

  async deleteExpense(id: string): Promise<void> {
    await api.delete(`/expenses/${id}`);
  },

  async exportCsv(params: ExpenseQueryParams = {}): Promise<Blob> {
    const res = await api.get('/expenses/export', {
      params,
      responseType: 'blob',
    });
    return res.data;
  },
};
