import React, { createContext, useContext, useState } from 'react';

const DashboardFilterContext = createContext();

export const useDashboardFilters = () => {
    return useContext(DashboardFilterContext);
};

export const DashboardFilterProvider = ({ children }) => {
    const [filters, setFilters] = useState({
        branchId: null,
        academicYear: '2025-2026',
        dateRange: 'this_month'
    });

    const updateFilter = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return (
        <DashboardFilterContext.Provider value={{ filters, updateFilter }}>
            {children}
        </DashboardFilterContext.Provider>
    );
};
