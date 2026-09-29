import api from './api';
import { Category } from '../types';

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    const res = await api.get('/categories');
    return res.data.data.categories;
  },

  async createCategory(data: { name: string; color?: string; icon?: string }): Promise<Category> {
    const res = await api.post('/categories', data);
    return res.data.data.category;
  },

  async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    const res = await api.put(`/categories/${id}`, data);
    return res.data.data.category;
  },

  async deleteCategory(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};
