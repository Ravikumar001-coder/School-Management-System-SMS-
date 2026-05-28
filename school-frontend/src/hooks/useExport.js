import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';

export const useExport = () => {
    const [isExporting, setIsExporting] = useState(false);

    const exportData = async (type, module, branchId = null) => {
        setIsExporting(true);
        const toastId = toast.loading(`Generating ${type.toUpperCase()} for ${module}...`);
        try {
            const url = `/dashboard/export/csv?type=${module}${branchId ? `&branchId=${branchId}` : ''}`;
            const response = await api.get(url, { responseType: 'blob' });
            
            const blob = new Blob([response.data], { type: 'text/csv' });
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `export_${module}_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            toast.success(`Export successful`, { id: toastId });
        } catch (error) {
            console.error('Export failed:', error);
            toast.error('Failed to export data', { id: toastId });
        } finally {
            setIsExporting(false);
        }
    };

    return { exportData, isExporting };
};
