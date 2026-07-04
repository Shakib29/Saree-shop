// src/services/productService.js
import api from './api';

export const productService = {
  getAll: (params = {}) => api.get('/products', { params }),
  getBySlug: (slug) => api.get(`/products/${slug}`),

  // Admin
  getByIdAdmin: (id) => api.get(`/admin/products/${id}`),
  create: (data) => api.post('/admin/products', data),
  update: (id, data) => api.put(`/admin/products/${id}`, data),
  remove: (id) => api.delete(`/admin/products/${id}`),
  addImage: (id, payload) => api.post(`/admin/products/${id}/images`, payload),
  removeImage: (imageId) => api.delete(`/admin/products/images/${imageId}`),
};
