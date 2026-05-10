// src/api/studentApi.js
import api from './axios';

export const studentApi = {
  getAll:    (page=0, size=10) => api.get(`/students?page=${page}&size=${size}`),
  getById:   (id)              => api.get(`/students/${id}`),
  create:    (data)            => api.post('/students', data),
  update:    (id, data)        => api.put(`/students/${id}`, data),
  delete:    (id)              => api.delete(`/students/${id}`),
  search:    (keyword)         => api.get(`/students/search?keyword=${keyword}`),
  byClass:   (classId)        => api.get(`/students/class/${classId}`),
};