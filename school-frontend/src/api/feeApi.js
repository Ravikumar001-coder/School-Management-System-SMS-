// src/api/feeApi.js
import api from './axios';

export const feeApi = {
  collect:        (data)      => api.post('/fees/pay', data),
  getById:        (id)        => api.get(`/fees/${id}`),
  all:            ()          => api.get('/fees/all'),
  studentFees:    (id)        => api.get(`/fees/student/${id}`),
  studentSummary: (id)        => api.get(`/fees/student/${id}/summary`),
  pending:        ()          => api.get('/fees/pending'),
  monthlyReport:  (m, y)     => api.get(`/fees/report/monthly?month=${m}&year=${y}`),
};
