// src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach the correct token depending on which area of the app is calling.
// Admin routes start with /admin, everything else is treated as customer/guest.
api.interceptors.request.use((config) => {
  const isAdminRoute = config.url?.startsWith('/admin');
  const token = isAdminRoute
    ? localStorage.getItem('hoj_admin_token')
    : localStorage.getItem('hoj_customer_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global response handling — surface a consistent error shape to callers.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong. Please try again.';
    return Promise.reject({ ...error, message });
  }
);

export default api;
