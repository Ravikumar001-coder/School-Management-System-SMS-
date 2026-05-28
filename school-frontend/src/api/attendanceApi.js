// src/api/attendanceApi.js
import api from './axios';

export const attendanceApi = {
  markBulk:      (data)               => api.post('/attendance/bulk', data),
  studentReport: (id, from, to)       => api.get(`/attendance/student/${id}?from=${from}&to=${to}`),
  classReport:   (classId, date, subId, period) => 
    api.get(`/attendance/class/${classId}?date=${date}${subId ? `&subjectId=${subId}` : ''}${period ? `&periodNumber=${period}` : ''}`),
};
