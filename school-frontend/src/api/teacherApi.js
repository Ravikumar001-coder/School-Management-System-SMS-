// src/api/teacherApi.js
import api from './axios';

export const teacherApi = {
  getAll:  (page=0, size=10) => api.get(`/teachers?page=${page}&size=${size}`),
  getById: (id)              => api.get(`/teachers/${id}`),
  create:  (data)            => api.post('/teachers', data),
  update:  (id, data)        => api.put(`/teachers/${id}`, data),
  delete:  (id)              => api.delete(`/teachers/${id}`),
  search:  (keyword)         => api.get(`/teachers/search?keyword=${keyword}`),
};