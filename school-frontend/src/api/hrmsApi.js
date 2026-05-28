import api from './axios';

export const hrmsApi = {
    // Staff Management
    onboardStaff: async (staffData) => {
        const response = await api.post('/hrms/staff/onboard', staffData);
        return response.data;
    },

    // Payroll Management
    runPayroll: async (month, year, branchId, processedById) => {
        const response = await api.post('/hrms/payroll/run', { month, year, branchId }, {
            params: { month, year, branchId, processedById }
        });
        return response.data;
    },

    // Leave Management
    getPendingLeaves: async () => {
        const response = await api.get('/hrms/leave/pending');
        return response.data;
    },

    approveLeave: async (id, approverId) => {
        const response = await api.put(`/hrms/leave/${id}/approve`, null, {
            params: { approverId }
        });
        return response.data;
    },

    rejectLeave: async (id, approverId) => {
        const response = await api.put(`/hrms/leave/${id}/reject`, null, {
            params: { approverId }
        });
        return response.data;
    },

    // Compliance (PF & ESI)
    getReports: async (year, month) => {
        const response = await api.get('/hrms/compliance/reports', {
            params: { year, month }
        });
        return response.data;
    },

    generateComplianceReport: async (branchId, year, month) => {
        const response = await api.post('/hrms/compliance/generate', null, {
            params: { branchId, year, month }
        });
        return response.data;
    },

    submitChallan: async (id, challanUrl) => {
        const response = await api.put(`/hrms/compliance/${id}/challan`, null, {
            params: { challanUrl }
        });
        return response.data;
    },

    // Biometric Attendance
    getAttendanceLogs: async (date) => {
        const response = await api.get('/hrms/attendance/logs', {
            params: { date }
        });
        return response.data;
    },

    syncAttendance: async (staffId, date, checkIn, checkOut) => {
        const response = await api.post('/hrms/attendance/sync', null, {
            params: { staffId, date, checkIn, checkOut }
        });
        return response.data;
    },

    // Performance Review
    getActiveCycles: async () => {
        const response = await api.get('/hrms/performance/cycles/active');
        return response.data;
    },

    getReviewsForCycle: async (cycleId) => {
        const response = await api.get(`/hrms/performance/cycles/${cycleId}/reviews`);
        return response.data;
    },

    initiateReview: async (cycleId, staffId, reviewerId) => {
        const response = await api.post('/hrms/performance/reviews/initiate', null, {
            params: { cycleId, staffId, reviewerId }
        });
        return response.data;
    },

    submitManagerReview: async (reviewId, managerReview, finalScore, incrementPercentage, promotionRecommendation) => {
        const response = await api.put(`/hrms/performance/reviews/${reviewId}/manager`, null, {
            params: { reviewText: managerReview, score: finalScore, increment: incrementPercentage, promote: promotionRecommendation }
        });
        return response.data;
    }
};
