// src/api/examApi.js
import api from './axios';

export const examApi = {
  getAll:       ()              => api.get('/exams'),
  getByClass:   (classId)      => api.get(`/exams/class/${classId}`),
  create:       (data)          => api.post('/exams', data),
  enterMarks:   (data)          => api.post('/exams/marks/bulk', data),
  getMarks:     (examId)        => api.get(`/exams/${examId}/marks`),
  reportCard:   (id, year)      => api.get(`/exams/report-card/student/${id}?academicYear=${year}`),
  topper:       (examId)        => api.get(`/exams/${examId}/topper`),
};
