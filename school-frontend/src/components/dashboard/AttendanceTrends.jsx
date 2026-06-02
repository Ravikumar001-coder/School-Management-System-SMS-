import React from 'react';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';

const AttendanceTrends = ({ trends, loading, onDateClick }) => {
  const chartData = React.useMemo(() => {
    if (!trends?.studentTrends?.daily) return [];
    const studentDaily = trends.studentTrends.daily;
    const staffDaily = trends.staffTrends?.daily || {};
    
    return Object.keys(studentDaily).map(dateStr => {
       const date = new Date(dateStr);
       const name = date.toLocaleDateString('en-US', { weekday: 'short' });
       return {
         name,
         fullDate: dateStr,
         students: studentDaily[dateStr],
         staff: staffDaily[dateStr] || 0
       };
    });
  }, [trends]);

  const latestStudent = chartData.length > 0 ? chartData[chartData.length - 1].students : 0;
  const latestStaff = chartData.length > 0 ? chartData[chartData.length - 1].staff : 0;

  return (
    <div className="bg-white rounded-[16px] border border-[#f1f5f9] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-black text-slate-800">Attendance Overview</h3>
        <select className="bg-slate-50 border-none text-xs font-bold text-slate-600 rounded-lg px-3 py-1.5 outline-none cursor-pointer">
           <option>This Week</option>
           <option>Last Week</option>
           <option>This Month</option>
        </select>
      </div>

      {loading ? (
        <div className="flex-1 bg-slate-50 animate-pulse rounded-xl" />
      ) : (
        <>
          <div className="flex-1 w-full h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                  data={chartData} 
                  margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                  onClick={(e) => {
                      if (e && e.activePayload && onDateClick) {
                          onDateClick(e.activePayload[0].payload.fullDate);
                      }
                  }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} tickFormatter={(val) => `${val}%`} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} cursor={{fill: '#f1f5f9'}} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '10px' }} />
                <Line type="monotone" name="Students (%)" dataKey="students" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6, onClick: (e, payload) => onDateClick && onDateClick(payload.payload.fullDate) }} />
                <Line type="monotone" name="Staff (%)" dataKey="staff" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6, onClick: (e, payload) => onDateClick && onDateClick(payload.payload.fullDate) }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-slate-50">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Student Attendance Latest</p>
              <div className="flex items-end gap-2">
                <p className="text-xl font-black text-slate-800 leading-none">{latestStudent.toFixed(1)}%</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Staff Attendance Latest</p>
              <div className="flex items-end gap-2">
                <p className="text-xl font-black text-slate-800 leading-none">{latestStaff.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default React.memo(AttendanceTrends);