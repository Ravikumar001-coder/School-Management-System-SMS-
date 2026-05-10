/**
 * exportUtils.js — Central engine for CSV and PDF generation.
 */

/**
 * Generates and downloads a CSV file from an array of objects.
 */
export const exportToCSV = (data, columns, filename = 'export.csv') => {
  if (!data || !data.length) return;

  const headers = columns.map(col => col.title).join(',');
  const rows = data.map(row => 
    columns.map(col => {
      const val = col.render ? col.render(row[col.key], row) : row[col.key];
      // Escape quotes and commas
      const escaped = ('' + (val ?? '')).replace(/"/g, '""');
      return `"${escaped}"`;
    }).join(',')
  );

  const csvContent = [headers, ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Universal PDF export logic (Branded)
 * Uses window.print() as a lightweight fallback or triggers jsPDF if implemented.
 * Here we provide a structured data prepare function.
 */
export const printReport = ({ title, subtitle, columns, data, schoolInfo = {} }) => {
  const printWindow = window.open('', '_blank');
  
  const htmlColumns = columns.map(col => `<th style="text-align:left; padding:8px; border-bottom:2px solid #eee;">${col.title}</th>`).join('');
  const htmlRows = data.map(row => {
    return `<tr>${columns.map(col => {
      const val = col.render ? col.render(row[col.key], row) : row[col.key];
      return `<td style="padding:8px; border-bottom:1px solid #f9f9f9;">${val ?? '-'}</td>`;
    }).join('')}</tr>`;
  }).join('');

  printWindow.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: 'Inter', sans-serif; color: #333; padding: 40px; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 4px solid #3b82f6; padding-bottom: 20px; }
          .school-name { font-size: 24px; font-weight: 800; color: #1e293b; }
          .report-title { font-size: 18px; font-weight: 600; color: #3b82f6; margin-top: 5px; }
          .meta { font-size: 10px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
          .footer { margin-top: 50px; font-size: 10px; color: #94a3b8; text-align: center; border-top: 1px solid #eee; padding-top: 20px; }
          @media print { .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="school-name">${schoolInfo.name || 'School Management System'}</div>
            <div class="report-title">${title}</div>
            <div class="meta">${subtitle || ''}</div>
          </div>
          <div style="text-align:right">
             <div class="meta">Generated On</div>
             <div style="font-weight:bold">${new Date().toLocaleString()}</div>
          </div>
        </div>
        
        <table>
          <thead><tr>${htmlColumns}</tr></thead>
          <tbody>${htmlRows}</tbody>
        </table>

        <div class="footer">
          This is a computer-generated report from SchoolOS Enterprise. Confidential & Proprietary.
        </div>

        <script>
          window.onload = function() { window.print(); window.close(); }
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};
