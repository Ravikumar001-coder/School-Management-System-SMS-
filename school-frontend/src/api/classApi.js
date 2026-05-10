// src/api/classApi.js
import api from './axios';

export const classApi = {
  getAll:  ()         => api.get('/classes'),
  getById: (id)       => api.get(`/classes/${id}`),
  create:  (data)     => api.post('/classes', data),
  update:  (id, data) => api.put(`/classes/${id}`, data),
  delete:  (id)       => api.delete(`/classes/${id}`),
};
