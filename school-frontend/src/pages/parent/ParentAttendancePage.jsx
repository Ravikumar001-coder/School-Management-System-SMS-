// src/pages/parent/ParentAttendancePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar as CalendarIcon, CheckCircle2, XCircle, AlertCircle, Clock } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ParentAttendancePage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState([]);
  const [activeChildId, setActiveChildId] = useState(null);
  const [attendanceData, setAttendanceData] = useState({ presentDays: 0, absentDays: 0, records: [] });

  useEffect(() => {
    const fetchFamily = async () => {
      try {
        const res = await api.get('/parents/my-children');
        const data = res.data?.data || [];
        setChildren(data);
        if (data.length > 0) setActiveChildId(data[0].studentId);
      } catch (err) {
        toast.error('Failed to load children.');
      } finally {
        setLoading(false);
      }
    };
    fetchFamily();
  }, [toast]);

  useEffect(() => {
    if (!activeChildId) return;
    const fetchAttendance = async () => {
      try {
        const res = await api.get(`/parents/app/attendance/${activeChildId}`);
        setAttendanceData(res.data?.data || { presentDays: 0, absentDays: 0, records: [] });
      } catch (err) {
        toast.error('Failed to load attendance.');
      }
    };
    fetchAttendance();
  }, [activeChildId, toast]);

  const activeChild = children.find(c => c.studentId === activeChildId) || {};

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50"><LoadingSpinner /></div>;

  return (
    <div className="pb-20 animate-fade-in">
      {/* Child Switcher Pill */}
      <div className="px-6 py-6 overflow-x-auto flex gap-3 no-scrollbar">
        {children.map(child => (
          <button 
            key={child.studentId}
            onClick={() => setActiveChildId(child.studentId)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap border
              ${activeChildId === child.studentId 
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20' 
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
          >
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
               {child.firstName?.[0]}{child.lastName?.[0]}
            </div>
            {child.firstName}
          </button>
        ))}
      </div>

      <div className="px-6 space-y-6">
         {/* Summary Cards */}
         <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Present Days</p>
                <h4 className="text-3xl font-black text-slate-900">{attendanceData.presentDays}</h4>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
                <XCircle size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Absent Days</p>
                <h4 className="text-3xl font-black text-slate-900">{attendanceData.absentDays}</h4>
              </div>
            </div>
         </div>

         {/* Calendar View Placeholder */}
         <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm text-center">
            <CalendarIcon size={48} className="mx-auto text-indigo-200 mb-4" />
            <h3 className="text-lg font-black text-slate-800">May 2026</h3>
            <p className="text-sm font-medium text-slate-400 mt-1 mb-6">Attendance records are synced daily at 10 AM.</p>
            
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 mb-4">
              {['S','M','T','W','T','F','S'].map((d, i) => <div key={i}>{d}</div>)}
            </div>
            
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 31 }).map((_, i) => {
                const day = i + 1;
                // Basic mock layout for the month, overridden by real data if exists
                const isWeekend = (day + 4) % 7 === 0 || (day + 5) % 7 === 0;
                let bg = 'bg-slate-50 text-slate-800 hover:border-slate-200 border-2 border-transparent';
                
                if (isWeekend) bg = 'bg-slate-100 text-slate-400 opacity-50';
                else if (day <= new Date().getDate()) bg = 'bg-emerald-50 text-emerald-700 font-black'; 
                
                // Overlay real data
                const record = attendanceData.records?.find(r => new Date(r.date).getDate() === day);
                if (record) {
                    if (record.status === 'ABSENT') bg = 'bg-rose-100 text-rose-700 font-black border-2 border-rose-200';
                    if (record.status === 'EXCUSED') bg = 'bg-blue-100 text-blue-700 font-black border-2 border-blue-200';
                    if (record.status === 'LATE') bg = 'bg-amber-100 text-amber-700 font-black border-2 border-amber-200';
                    if (record.status === 'PRESENT') bg = 'bg-emerald-50 text-emerald-700 font-black border-2 border-emerald-200';
                }
                
                return (
                  <div key={day} className={`aspect-square rounded-xl flex items-center justify-center text-sm ${bg} transition-all cursor-pointer`} title={record?.remarks || ''}>
                    {day}
                  </div>
                );
              })}
            </div>
         </div>

         {/* Legend */}
         <div className="flex justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-emerald-400"></div><span className="text-[10px] font-bold text-slate-500 uppercase">Present</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-rose-400"></div><span className="text-[10px] font-bold text-slate-500 uppercase">Absent</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-blue-400"></div><span className="text-[10px] font-bold text-slate-500 uppercase">Leave</span></div>
         </div>
      </div>
    </div>
  );
};

export default ParentAttendancePage;
