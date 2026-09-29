import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://teentracker-backend-qi30.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('teenspend_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to catch 401s and handle errors cleanly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't auto-redirect if we are already on login or checking auth
      const isAuthRoute =
        window.location.pathname === '/login' ||
        window.location.pathname === '/register';
      if (!isAuthRoute && localStorage.getItem('teenspend_token')) {
        localStorage.removeItem('teenspend_token');
        localStorage.removeItem('teenspend_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
