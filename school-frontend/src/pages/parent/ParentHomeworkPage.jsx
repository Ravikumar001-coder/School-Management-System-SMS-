// src/pages/parent/ParentHomeworkPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, FileText, CheckCircle2, ChevronRight, Search, Filter } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ParentHomeworkPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { children, activeChildId, setActiveChildId } = useAuth();
  const [loading, setLoading] = useState(false);
  const [homeworkData, setHomeworkData] = useState({ pendingCount: 0, tasks: [] });

  useEffect(() => {
    if (!activeChildId) return;
    const fetchHomework = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/parents/app/homework/${activeChildId}`);
        setHomeworkData(res.data?.data || { pendingCount: 0, tasks: [] });
      } catch (err) {
        toast.error('Failed to load homework.');
      } finally {
        setLoading(false);
      }
    };
    fetchHomework();
  }, [activeChildId, toast]);

  const activeChild = children.find(c => c.studentId === activeChildId) || {};

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50"><LoadingSpinner /></div>;

  return (
    <div className="pb-24 animate-fade-in">
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
         {/* Pending Counter */}
         <div className="bg-indigo-600 rounded-[2rem] p-6 text-white shadow-xl shadow-indigo-500/30 flex items-center justify-between">
            <div>
               <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-1">Pending Tasks</p>
               <h1 className="text-4xl font-black">{homeworkData.pendingCount}</h1>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
               <BookOpen size={32} className="text-white" />
            </div>
         </div>

         <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
            <button className="text-sm font-black text-indigo-600 border-b-2 border-indigo-600 pb-2 px-2">Pending</button>
            <button className="text-sm font-bold text-slate-400 pb-2 px-4 hover:text-slate-600">Submitted</button>
         </div>

         {/* Homework List */}
         <div className="space-y-4">
            {homeworkData.tasks?.length === 0 ? (
               <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center text-slate-400 font-bold">
                 No homework assigned.
               </div>
            ) : (
               homeworkData.tasks?.map(hw => {
                 const isLate = hw.status === 'LATE';
                 const colorBar = isLate ? 'bg-rose-500' : 'bg-amber-500';
                 const subjectColor = isLate ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-700';
                 const dueDateObj = new Date(hw.dueDate);
                 
                 return (
                    <div key={hw.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 relative overflow-hidden group">
                       <div className={`absolute top-0 left-0 w-1.5 h-full ${colorBar}`}></div>
                       <div className="flex justify-between items-start mb-4">
                          <div>
                             <span className={`inline-block px-2.5 py-1 ${subjectColor} text-[10px] font-black uppercase tracking-widest rounded-lg mb-2`}>{hw.subjectName}</span>
                             <h3 className="text-lg font-black text-slate-900 leading-tight">{hw.title}</h3>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-600 flex flex-col items-center justify-center shrink-0">
                             <span className="text-[10px] font-bold">{dueDateObj.toLocaleString('default', { month: 'short' }).toUpperCase()}</span>
                             <span className="text-sm font-black leading-none">{dueDateObj.getDate()}</span>
                          </div>
                       </div>
                       <p className="text-sm text-slate-500 font-medium mb-6">{hw.description}</p>
                       
                       {hw.attachmentUrl && (
                         <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-rose-500">
                               <FileText size={20} />
                            </div>
                            <div>
                               <p className="text-xs font-bold text-slate-800">Attachment</p>
                               <a href={hw.attachmentUrl} target="_blank" rel="noreferrer" className="text-[10px] font-medium text-indigo-500 hover:underline">View File</a>
                            </div>
                         </div>
                       )}
                       
                       <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                          <div className={`flex items-center gap-2 ${isLate ? 'text-rose-500' : 'text-amber-500'} text-xs font-bold`}>
                             <Clock size={14} /> {isLate ? 'Late' : 'Pending'}
                          </div>
                          <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-lg hover:bg-slate-800">
                             Submit Work
                          </button>
                       </div>
                    </div>
                 );
               })
            )}
         </div>
      </div>
    </div>
  );
};

export default ParentHomeworkPage;
