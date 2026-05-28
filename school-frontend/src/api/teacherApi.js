// src/api/teacherApi.js
import api from './axios';

export const teacherApi = {
  getAll:  (page=0, size=10, filters = {}) => {
    const params = new URLSearchParams({ page, size, ...filters });
    return api.get(`/teachers?${params.toString()}`);
  },
  getById: (id)              => api.get(`/teachers/${id}`),
  create:  (data)            => api.post('/teachers', data),
  update:  (id, data)        => api.put(`/teachers/${id}`, data),
  delete:  (id)              => api.delete(`/teachers/${id}`),
  search:  (keyword)         => api.get(`/teachers/search?keyword=${keyword}`),
};