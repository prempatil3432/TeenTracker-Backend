import api from './api';
import { User } from '../types';

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  async register(data: {
    name: string;
    email: string;
    password: string;
    age?: number;
    currency?: string;
    monthly_allowance?: number;
  }): Promise<AuthResponse> {
    const res = await api.post('/auth/register', data);
    return res.data.data;
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const res = await api.post('/auth/login', data);
    return res.data.data;
  },

  async getMe(): Promise<User> {
    const res = await api.get('/auth/me');
    return res.data.data.user;
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    const res = await api.put('/auth/profile', updates);
    return res.data.data.user;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('teenspend_token');
      localStorage.removeItem('teenspend_user');
    }
  },
};
