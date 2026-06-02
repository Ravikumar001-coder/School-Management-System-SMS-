import React, { useState } from 'react';
import { Download, CalendarDays, FileText, FileSpreadsheet, FileIcon, Search, Loader2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ComposedChart, Legend } from 'recharts';
import api from '../../api/axios';

const OperationalBottomRow = ({ recentActivity = [], loading, onScheduleReportClick, onViewAllActivityClick }) => {
  const [exporting, setExporting] = useState(null);

  if (loading) {
     return <div className="h-64 bg-white rounded-[16px] border border-[#f1f5f9] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] animate-pulse w-full mt-6" />;
  }

  const handleExport = async (format) => {
    setExporting(format);
    try {
      const response = await api.get(`/export/dashboard/${format}`, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const fileExt = format === 'excel' ? 'xls' : format === 'pdf' ? 'pdf' : 'csv';
      link.setAttribute('download', `dashboard_export_${Date.now()}.${fileExt}`);
      
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Export failed", error);
    } finally {
      setExporting(null);
    }
  };

  const dummyActivity = [
    { time: '09:42 AM', msg: 'Fee payment received from Aryan Sharma', color: 'bg-blue-500' },
    { time: '09:38 AM', msg: 'Payroll approved for April 2024', color: 'bg-emerald-500' },
    { time: '09:25 AM', msg: 'Leave approved for 5 staff members', color: 'bg-purple-500' },
    { time: '09:10 AM', msg: 'Bus 12 GPS tracker offline', color: 'bg-orange-500' },
    { time: '08:55 AM', msg: 'New admission inquiry submitted', color: 'bg-blue-500' },
  ];

  const displayActivity = recentActivity?.length ? recentActivity.map((act, i) => {
    const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-orange-500', 'bg-indigo-500'];
    return {
      time: act.timestamp || 'Just now',
      msg: act.message,
      color: act.isSystem ? 'bg-slate-500' : colors[i % colors.length]
    };
  }) : dummyActivity;

  const topClasses = [
    { name: 'Class 5-B', score: 98.2 },
    { name: 'Class 8-A', score: 96.5 },
    { name: 'Class 3-A', score: 95.6 },
    { name: 'Class 10-B', score: 94.1 },
    { name: 'Class 7-C', score: 93.7 },
  ];

  const feeData = [
    { month: 'Nov', collected: 50, outstanding: 10 },
    { month: 'Dec', collected: 45, outstanding: 25 },
    { month: 'Jan', collected: 40, outstanding: 18 },
    { month: 'Feb', collected: 30, outstanding: 12 },
    { month: 'Mar', collected: 55, outstanding: 8 },
    { month: 'Apr', collected: 60, outstanding: 5 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
       
       {/* Activity Feed */}
       <div className="bg-white rounded-[16px] border border-[#f1f5f9] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] p-5 flex flex-col h-[300px]">
          <div className="flex justify-between items-center mb-4">
             <h3 className="text-xs font-black text-slate-800">Recent Activity Feed</h3>
             <span onClick={onViewAllActivityClick} className="text-[10px] font-bold text-blue-600 cursor-pointer hover:underline">View All</span>
          </div>
          <div className="flex-1 overflow-auto custom-scrollbar space-y-3 pt-2">
             {displayActivity.map((act, i) => (
                <div key={i} className="flex gap-3 items-start group">
                   <div className={`w-2 h-2 rounded-full mt-1.5 ${act.color} flex-shrink-0 group-hover:scale-150 transition-transform`} />
                   <div className="flex-1">
                      <p className="text-[11px] font-bold text-slate-700 leading-tight">{act.msg}</p>
                      <p className="text-[9px] font-bold text-slate-400 mt-0.5">{act.time}</p>
                   </div>
                </div>
             ))}
          </div>
       </div>

       {/* Top Classes */}
       <div className="bg-white rounded-[16px] border border-[#f1f5f9] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] p-5 flex flex-col h-[300px]">
          <div className="flex justify-between items-center mb-4">
             <h3 className="text-xs font-black text-slate-800">Top Performing Classes</h3>
             <span className="text-[10px] font-bold text-slate-500">Attendance</span>
          </div>
          <div className="flex-1 flex flex-col justify-between pt-2">
             {topClasses.map((cls, i) => (
               <div key={i} className="flex items-center gap-3">
                 <span className="w-5 h-5 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-[9px] font-black flex-shrink-0">{i+1}</span>
                 <span className="text-[11px] font-bold text-slate-600 w-16 truncate">{cls.name}</span>
                 <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${cls.score}%` }} />
                 </div>
                 <span className="text-[10px] font-black text-slate-700 w-8 text-right">{cls.score}%</span>
               </div>
             ))}
          </div>
       </div>

       {/* Fee Collection Trend */}
       <div className="bg-white rounded-[16px] border border-[#f1f5f9] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] p-5 flex flex-col h-[300px]">
          <div className="flex justify-between items-center mb-2">
             <h3 className="text-xs font-black text-slate-800">Fee Collection Trend</h3>
             <span className="text-[10px] font-bold text-slate-500">in Lakhs</span>
          </div>
          <div className="flex-1 w-full min-h-0 pt-2">
             <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={feeData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                   <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 'bold' }} dy={5} />
                   <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 'bold' }} />
                   <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '11px' }} />
                   <Legend wrapperStyle={{ fontSize: '9px', fontWeight: 'bold', paddingTop: '5px' }} />
                   <Bar dataKey="collected" name="Collected (₹)" barSize={12} fill="#3b82f6" radius={[2, 2, 0, 0]} />
                   <Line type="monotone" dataKey="outstanding" name="Outstanding (₹)" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
                </ComposedChart>
             </ResponsiveContainer>
          </div>
       </div>

       {/* Smart Export Center */}
       <div className="bg-white rounded-[16px] border border-[#f1f5f9] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] p-5 flex flex-col h-[300px] bg-gradient-to-br from-white to-[#F8FAFC]">
          <div className="flex items-center gap-2 mb-1">
             <h3 className="text-xs font-black text-slate-800">Quick Export</h3>
          </div>
          <p className="text-[10px] text-slate-500 font-bold mb-5 leading-tight">Export all reports with one click directly from the DB layer.</p>
          
          <div className="flex-1 space-y-2.5">
             <button disabled={exporting !== null} onClick={() => handleExport('pdf')} className="w-full flex items-center justify-between p-2.5 rounded-xl border border-rose-100 bg-white hover:bg-rose-50 transition-colors group disabled:opacity-50">
                <div className="flex items-center gap-3">
                   <div className="bg-rose-100 text-rose-600 p-1.5 rounded-lg">
                      {exporting === 'pdf' ? <Loader2 className="animate-spin" size={14} /> : <FileIcon size={14} />}
                   </div>
                   <span className="text-[11px] font-bold text-slate-700 group-hover:text-rose-700 transition-colors">
                      {exporting === 'pdf' ? 'Compiling PDF...' : 'Export Dashboard (PDF)'}
                   </span>
                </div>
                <Download size={14} className="text-slate-300 group-hover:text-rose-500 transition-colors" />
             </button>

             <button disabled={exporting !== null} onClick={() => handleExport('excel')} className="w-full flex items-center justify-between p-2.5 rounded-xl border border-emerald-100 bg-white hover:bg-emerald-50 transition-colors group disabled:opacity-50">
                <div className="flex items-center gap-3">
                   <div className="bg-emerald-100 text-emerald-600 p-1.5 rounded-lg">
                      {exporting === 'excel' ? <Loader2 className="animate-spin" size={14} /> : <FileSpreadsheet size={14} />}
                   </div>
                   <span className="text-[11px] font-bold text-slate-700 group-hover:text-emerald-700 transition-colors">
                      {exporting === 'excel' ? 'Formatting XLS...' : 'Export Dashboard (Excel)'}
                   </span>
                </div>
                <Download size={14} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
             </button>

             <button disabled={exporting !== null} onClick={() => handleExport('csv')} className="w-full flex items-center justify-between p-2.5 rounded-xl border border-blue-100 bg-white hover:bg-blue-50 transition-colors group disabled:opacity-50">
                <div className="flex items-center gap-3">
                   <div className="bg-blue-100 text-blue-600 p-1.5 rounded-lg">
                      {exporting === 'csv' ? <Loader2 className="animate-spin" size={14} /> : <FileText size={14} />}
                   </div>
                   <span className="text-[11px] font-bold text-slate-700 group-hover:text-blue-700 transition-colors">
                      {exporting === 'csv' ? 'Streaming CSV...' : 'Export Dashboard (CSV)'}
                   </span>
                </div>
                <Download size={14} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
             </button>
          </div>
          
          <button onClick={onScheduleReportClick} className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 text-[11px] font-black text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors">
            <CalendarDays size={14} />
            Schedule Regular Report
          </button>
       </div>

    </div>
  );
};

export default React.memo(OperationalBottomRow);