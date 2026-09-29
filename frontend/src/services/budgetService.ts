import api from './api';
import { Budget } from '../types';

export const budgetService = {
  async getBudgets(): Promise<Budget[]> {
    const res = await api.get('/budgets');
    return res.data.data.budgets;
  },

  async getBudget(id: string): Promise<Budget> {
    const res = await api.get(`/budgets/${id}`);
    return res.data.data.budget;
  },

  async createBudget(data: {
    category_id: string;
    amount: number;
    period?: 'weekly' | 'monthly' | 'yearly';
    start_date?: string;
    end_date?: string;
  }): Promise<Budget> {
    const res = await api.post('/budgets', data);
    return res.data.data.budget;
  },

  async updateBudget(id: string, updates: Partial<Budget>): Promise<Budget> {
    const res = await api.put(`/budgets/${id}`, updates);
    return res.data.data.budget;
  },

  async deleteBudget(id: string): Promise<void> {
    await api.delete(`/budgets/${id}`);
  },
};
