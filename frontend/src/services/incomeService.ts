import api from './api';
import { Income } from '../types';

export interface IncomeQueryParams {
  start_date?: string;
  end_date?: string;
  source?: string;
}

export const incomeService = {
  async getIncomeList(params: IncomeQueryParams = {}): Promise<{ incomeList: Income[]; totalIncome: number }> {
    const res = await api.get('/income', { params });
    return res.data.data;
  },

  async getIncome(id: string): Promise<Income> {
    const res = await api.get(`/income/${id}`);
    return res.data.data.income;
  },

  async createIncome(data: {
    source: string;
    amount: number;
    income_date?: string;
    description?: string;
  }): Promise<Income> {
    const res = await api.post('/income', data);
    return res.data.data.income;
  },

  async updateIncome(id: string, updates: Partial<Income>): Promise<Income> {
    const res = await api.put(`/income/${id}`, updates);
    return res.data.data.income;
  },

  async deleteIncome(id: string): Promise<void> {
    await api.delete(`/income/${id}`);
  },

  async exportCsv(params: IncomeQueryParams = {}): Promise<Blob> {
    const res = await api.get('/income/export', {
      params,
      responseType: 'blob',
    });
    return res.data;
  },
};
