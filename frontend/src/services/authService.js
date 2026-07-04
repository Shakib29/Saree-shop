// src/services/authService.js
import api from './api';

export const authService = {
  // Customer
  customerRegister: (data) => api.post('/customer/auth/register', data),
  customerLogin: (data) => api.post('/customer/auth/login', data),
  customerProfile: () => api.get('/customer/auth/me'),

  // Admin
  adminLogin: (data) => api.post('/admin/auth/login', data),
  adminProfile: () => api.get('/admin/auth/me'),
};
