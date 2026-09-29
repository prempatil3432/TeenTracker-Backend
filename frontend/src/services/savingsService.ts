import api from './api';
import { SavingsGoal } from '../types';

export const savingsService = {
  async getGoals(): Promise<SavingsGoal[]> {
    const res = await api.get('/savings');
    return res.data.data.goals;
  },

  async getGoal(id: string): Promise<SavingsGoal> {
    const res = await api.get(`/savings/${id}`);
    return res.data.data.goal;
  },

  async createGoal(data: {
    name: string;
    target_amount: number;
    current_amount?: number;
    target_date?: string;
    description?: string;
  }): Promise<SavingsGoal> {
    const res = await api.post('/savings', data);
    return res.data.data.goal;
  },

  async updateGoal(id: string, updates: Partial<SavingsGoal>): Promise<SavingsGoal> {
    const res = await api.put(`/savings/${id}`, updates);
    return res.data.data.goal;
  },

  async deleteGoal(id: string): Promise<void> {
    await api.delete(`/savings/${id}`);
  },

  async contribute(id: string, amount: number): Promise<{ goal: SavingsGoal; isCompleted: boolean }> {
    const res = await api.post(`/savings/${id}/contribute`, { amount });
    return res.data.data;
  },
};
