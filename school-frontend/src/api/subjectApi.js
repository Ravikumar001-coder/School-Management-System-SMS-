// src/api/subjectApi.js
import api from './axios';

export const subjectApi = {
  getAll:  ()         => api.get('/subjects'),
  getById: (id)       => api.get(`/subjects/${id}`),
  create:  (data)     => api.post('/subjects', data),
  update:  (id, data) => api.put(`/subjects/${id}`, data),
  delete:  (id)       => api.delete(`/subjects/${id}`),
};
