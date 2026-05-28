// src/api/dashboardApi.js
import api from './axios';

export const dashboardApi = {
  admin: async () => {
    try {
      const [summary, students, hr, finance, operations, attendance, alerts, activities] = await Promise.all([
        api.get('/dashboard/summary'),
        api.get('/dashboard/students'),
        api.get('/dashboard/hr'),
        api.get('/dashboard/finance'),
        api.get('/dashboard/operations'),
        api.get('/dashboard/attendance'),
        api.get('/dashboard/alerts'),
        api.get('/dashboard/activities')
      ]);
      return {
        data: {
          summary: summary.data?.data,
          students: students.data?.data,
          hr: hr.data?.data,
          finance: finance.data?.data,
          operations: operations.data?.data,
          trends: attendance.data?.data,
          criticalAlerts: alerts.data?.data,
          recentActivity: activities.data?.data
        }
      };
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      throw error;
    }
  },
  student: (id) => api.get(`/dashboard/student/${id}`),
  teacher: (id) => api.get(`/dashboard/teacher/${id}`),
};
