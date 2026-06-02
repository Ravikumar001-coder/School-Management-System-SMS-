import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { studentApi } from '../../api/studentApi';
import { useToast } from '../../context/ToastContext';
import { downloadBlob } from '../../utils/fileDownloader';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-100 shadow-xl rounded-xl text-xs font-bold" role="tooltip">
        <p className="text-slate-500 mb-2">{label}</p>
        <p className="text-blue-600">Revenue: ₹{payload[0].value?.toLocaleString()}</p>
        <p className="text-emerald-500">Attendance: {payload[1].value?.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full text-slate-400">
    <p className="text-sm font-bold">No trending data available</p>
    <p className="text-xs">Data will populate after system usage.</p>
  </div>
);

const TrendsChart = ({ trends = [], loading }) => {
  const toast = useToast();

  const handleExport = async () => {
    try {
      toast.info('Generating Enrollment Report...');
      const res = await studentApi.exportExcel();
      downloadBlob(res.data, 'enrollment_report.xlsx');
      toast.success('Report downloaded successfully.');
    } catch (error) {
      toast.error('Failed to generate report.');
      console.error(error);
    }
  };

  return (
    <div className="lg:col-span-2 bg-white rounded-[16px] border border-[#f1f5f9] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-black text-slate-800">Attendance & Revenue Trends (6 Months)</h3>
        <button 
          onClick={handleExport}
          className="bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 text-white text-xs lg:text-sm uppercase tracking-widest font-black px-6 py-3 rounded-xl transition-all shadow-md active:scale-95"
          aria-label="Export Enrollment Report"
        >
          Export Enrollment
        </button>
      </div>
      <div className="h-64 relative">
        {loading ? (
          <div className="absolute inset-0 bg-slate-100 animate-pulse rounded-xl" aria-busy="true" />
        ) : trends.length === 0 ? (
          <EmptyState />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} tickFormatter={(val) => `₹${val > 999 ? (val/1000).toFixed(0) + 'K' : val}`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" activeDot={{ r: 6 }} />
              <Area type="monotone" dataKey="attendance" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorAttendance)" activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default React.memo(TrendsChart);
