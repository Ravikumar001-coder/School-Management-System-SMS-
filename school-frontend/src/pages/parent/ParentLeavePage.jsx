import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarHeart, Plus, Clock, CheckCircle2, XCircle, FileText } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ParentLeavePage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { children, activeChildId } = useAuth();
  const [loading, setLoading] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState([]);

  useEffect(() => {
    if (!activeChildId) return;
    const fetchLeave = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/parents/app/leave/${activeChildId}`);
        setLeaveRequests(res.data?.data || []);
      } catch (err) {
        toast.error('Failed to load leave history.');
      } finally {
        setLoading(false);
      }
    };
    fetchLeave();
  }, [activeChildId, toast]);

  if (loading && leaveRequests.length === 0) return <div className="p-10 flex justify-center"><LoadingSpinner /></div>;

  return (
    <div className="px-6 py-8 pb-32 animate-fade-in relative">
       <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Leave History</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Application Tracking</p>
          </div>
          <button className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 active:scale-90 transition-all">
            <Plus size={24} />
          </button>
       </div>

       <div className="space-y-6">
          {leaveRequests.length === 0 ? (
             <div className="text-center p-12 bg-white rounded-[2.5rem] shadow-sm border border-slate-50">
               <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mx-auto mb-4">
                 <CalendarHeart size={32} />
               </div>
               <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No leave applications</p>
             </div>
          ) : (
             leaveRequests.map(req => {
                const isApproved = req.status === 'APPROVED';
                const isPending = req.status === 'PENDING';
                const isRejected = req.status === 'REJECTED';
                
                let statusStyles = 'bg-slate-100 text-slate-600 border-slate-200';
                if (isApproved) statusStyles = 'bg-emerald-100 text-emerald-700 border-emerald-200';
                else if (isPending) statusStyles = 'bg-amber-100 text-amber-700 border-amber-200';
                else if (isRejected) statusStyles = 'bg-rose-100 text-rose-700 border-rose-200';

                const sDate = new Date(req.startDate);
                const eDate = new Date(req.endDate);
                const dateStr = sDate.getTime() === eDate.getTime() 
                  ? sDate.toLocaleDateString()
                  : `${sDate.toLocaleDateString()} - ${eDate.toLocaleDateString()}`;

                return (
                  <div key={req.id} className="bg-white rounded-[2rem] border border-slate-50 shadow-sm p-6 relative overflow-hidden group">
                     <div className="flex justify-between items-start mb-4">
                        <div>
                           <span className={`px-2.5 py-0.5 ${statusStyles} border rounded-full text-[9px] font-black uppercase tracking-widest`}>
                              {req.status}
                           </span>
                           <h3 className="text-lg font-black text-slate-900 mt-2 tracking-tight">{dateStr}</h3>
                        </div>
                        <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center">
                           <Clock size={18} />
                        </div>
                     </div>
                     
                     <p className="text-sm text-slate-500 font-medium leading-relaxed mb-4 line-clamp-3">
                       {req.reason}
                     </p>

                     {req.attachmentUrl && (
                        <a href={req.attachmentUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-colors">
                           <FileText size={14} /> View Attachment
                        </a>
                     )}

                     {req.teacherRemarks && (
                       <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mt-4">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Teacher Remarks</p>
                          <p className="text-xs text-slate-600 font-medium leading-relaxed">{req.teacherRemarks}</p>
                       </div>
                     )}
                  </div>
                );
             })
          )}
       </div>
    </div>
  );
};

export default ParentLeavePage;
