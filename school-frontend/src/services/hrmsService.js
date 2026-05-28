import api from '../api/axios';

export const hrmsService = {
  // Staff Onboarding
  onboardStaff: async (staffData) => {
    const response = await api.post('/hrms/staff', staffData);
    return response.data;
  },
  
  getAllStaff: async (page = 0, size = 10) => {
    const response = await api.get('/hrms/staff', { params: { page, size } });
    return response.data;
  },

  // Payroll
  runPayroll: async (month, year, branchId) => {
    const response = await api.post('/hrms/payroll/run', { month, year, branchId });
    return response.data;
  },
  
  getAllPayrollRuns: async (page = 0, size = 10) => {
    const response = await api.get('/hrms/payroll/runs', { params: { page, size } });
    return response.data;
  },

  // Leave Management
  getPendingLeaves: async () => {
    const response = await api.get('/hrms/leave/pending');
    return response.data;
  },

  approveLeave: async (id, approverId) => {
    const response = await api.put(`/hrms/leave/${id}/approve`, null, { params: { approverId } });
    return response.data;
  },

  rejectLeave: async (id, approverId, reason) => {
    const response = await api.put(`/hrms/leave/${id}/reject`, null, { params: { approverId, reason } });
    return response.data;
  }
};
