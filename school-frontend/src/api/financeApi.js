import api from './axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1';

export const financeApi = {
    // Dashboard
    getDashboardStats: async (branchId) => {
        const response = await api.get(`${API_BASE_URL}/finance/dashboard/stats/${branchId}`);
        return response.data;
    },

    // Chart of Accounts
    getAllAccounts: async (branchId) => {
        const response = await api.get(`${API_BASE_URL}/finance/coa/branch/${branchId}`);
        return response.data;
    },
    createAccount: async (accountData) => {
        const response = await api.post(`${API_BASE_URL}/finance/coa`, accountData);
        return response.data;
    },

    // Journal Entries
    getJournalEntries: async (branchId) => {
        const response = await api.get(`${API_BASE_URL}/finance/journal/branch/${branchId}`);
        return response.data;
    },
    createJournalEntry: async (entryData) => {
        const response = await api.post(`${API_BASE_URL}/finance/journal`, entryData);
        return response.data;
    },

    // Trial Balance
    getTrialBalance: async (branchId, fromDate, toDate) => {
        const response = await api.get(`${API_BASE_URL}/finance/trial-balance/branch/${branchId}`, {
            params: { fromDate, toDate }
        });
        return response.data;
    },

    // Expenses
    getExpenses: async (branchId) => {
        const response = await api.get(`${API_BASE_URL}/finance/expenses/branch/${branchId}`);
        return response.data;
    },
    createExpense: async (expenseData) => {
        const response = await api.post(`${API_BASE_URL}/finance/expenses`, expenseData);
        return response.data;
    },
    approveExpense: async (expenseId) => {
        const response = await api.put(`${API_BASE_URL}/finance/expenses/${expenseId}/approve`);
        return response.data;
    },

    // Vendors
    getVendors: async (branchId) => {
        const response = await api.get(`${API_BASE_URL}/finance/vendors/branch/${branchId}`);
        return response.data;
    },
    createVendor: async (vendorData) => {
        const response = await api.post(`${API_BASE_URL}/finance/vendors`, vendorData);
        return response.data;
    },

    // Vendor Payments
    getVendorPayments: async (branchId) => {
        const response = await api.get(`${API_BASE_URL}/finance/vendor-payments/branch/${branchId}`);
        return response.data;
    },
    createVendorPayment: async (paymentData) => {
        const response = await api.post(`${API_BASE_URL}/finance/vendor-payments`, paymentData);
        return response.data;
    },

    // Salary Payouts
    getSalaryPayouts: async (branchId, month, year) => {
        const response = await api.get(`${API_BASE_URL}/finance/salary-payouts/branch/${branchId}`, {
            params: { month, year }
        });
        return response.data;
    },
    processSalaryPayout: async (payoutData) => {
        const response = await api.post(`${API_BASE_URL}/finance/salary-payouts`, payoutData);
        return response.data;
    },

    // Financial Reports
    getBalanceSheet: async (branchId, asOfDate) => {
        const response = await api.get(`${API_BASE_URL}/finance/reports/balance-sheet/${branchId}`, {
            params: { asOfDate }
        });
        return response.data;
    },
    getProfitAndLoss: async (branchId, fromDate, toDate) => {
        const response = await api.get(`${API_BASE_URL}/finance/reports/profit-loss/${branchId}`, {
            params: { fromDate, toDate }
        });
        return response.data;
    },
    getCashFlow: async (branchId, fromDate, toDate) => {
        const response = await api.get(`${API_BASE_URL}/finance/reports/cash-flow/${branchId}`, {
            params: { fromDate, toDate }
        });
        return response.data;
    },

    // Tally Export
    exportTally: async (branchId, fromDate, toDate) => {
        const response = await api.get(`${API_BASE_URL}/finance/tally/export/${branchId}`, {
            params: { fromDate, toDate }
        });
        return response.data;
    },

    // Settings / Period Management
    getFinancialPeriods: async (branchId) => {
        const response = await api.get(`${API_BASE_URL}/finance/settings/periods/${branchId}`);
        return response.data;
    },
    createFinancialPeriod: async (periodData) => {
        const response = await api.post(`${API_BASE_URL}/finance/settings/periods`, periodData);
        return response.data;
    },
};
