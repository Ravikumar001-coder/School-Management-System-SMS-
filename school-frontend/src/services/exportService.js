// src/services/exportService.js
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

/**
 * Enterprise Export Service
 * Handles CSV and branded PDF generation.
 */
export const exportService = {
  
  /**
   * Export to CSV
   */
  csv: (data, columns, filename = 'export.csv') => {
    const headers = columns.map(col => col.title).join(',');
    const rows = data.map(row => 
      columns.map(col => {
        const val = col.render ? col.render(row[col.key], row) : row[col.key];
        return `"${String(val || '').replace(/"/g, '""')}"`;
      }).join(',')
    );
    
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    link.click();
  },

  /**
   * Branded PDF Print Report
   */
  pdf: ({ title, subtitle, columns, data, filename = 'report.pdf' }) => {
    const doc = new jsPDF();
    
    // School Branding Header
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('SCHOOL MANAGEMENT SYSTEM', 20, 18);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('OFFICIAL SYSTEM GENERATED REPORT', 20, 26);
    doc.text(`DATE: ${new Date().toLocaleString()}`, 190, 26, { align: 'right' });

    // Page Content
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(16);
    doc.text(title.toUpperCase(), 20, 55);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(subtitle || '', 20, 62);

    // Table
    const tableHeaders = [columns.map(col => col.title)];
    const tableData = data.map(row => 
      columns.map(col => {
        const val = col.render ? col.render(row[col.key], row) : row[col.key];
        // Strip HTML if any (simple regex)
        return String(val || '').replace(/<[^>]*>?/gm, '');
      })
    );

    doc.autoTable({
      startY: 70,
      head: tableHeaders,
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [37, 99, 235], fontSize: 9, fontStyle: 'bold' },
      bodyStyles: { fontSize: 8, textColor: [51, 65, 85] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      margin: { left: 20, right: 20 }
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
      doc.text('AUTHENTICITY VERIFIED | SMS CORE INFRASTRUCTURE', 20, 285);
    }

    doc.save(filename);
  }
};
