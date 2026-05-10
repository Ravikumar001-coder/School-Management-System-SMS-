// src/api/dashboardApi.js
import api from './axios';

export const dashboardApi = {
  admin: () => api.get('/dashboard/admin'),
  student: (id) => api.get(`/dashboard/student/${id}`),
  teacher: (id) => api.get(`/dashboard/teacher/${id}`),
};
