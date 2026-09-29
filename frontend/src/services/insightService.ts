import api from './api';
import { InsightsResponse } from '../types';

export const insightService = {
  async getInsights(): Promise<InsightsResponse> {
    const res = await api.get('/insights');
    return res.data.data;
  },
};
