// src/pages/parent/ParentDiaryPage.jsx
import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, ChevronLeft, ChevronRight, BookMarked, MessageSquare } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const fmt = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const ParentDiaryPage = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState([]);
  const [activeChildId, setActiveChildId] = useState(null);
  const [diary, setDiary] = useState([]);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 14);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/parents/my-children');
        const kids = res.data?.data || [];
        setChildren(kids);
        if (kids.length > 0) setActiveChildId(kids[0].studentId);
      } catch {
        toast.error('Failed to load children');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    if (!activeChildId) return;
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await api.get(
          `/parents/app/diary/${activeChildId}?startDate=${startDate}&endDate=${endDate}`
        );
        setDiary(res.data?.data || []);
      } catch {
        toast.error('Failed to load class diary');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [activeChildId, startDate, endDate]);

  if (loading && children.length === 0) {
    return <div className="h-screen flex items-center justify-center bg-slate-50"><LoadingSpinner /></div>;
  }

  return (
    <div className="pb-24 animate-fade-in">
      {/* Child Switcher */}
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

      <div className="px-6 space-y-4">
        {/* Date range picker */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">From</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
              className="w-full h-11 px-4 rounded-2xl border border-slate-200 text-sm font-semibold bg-white" />
          </div>
          <div className="flex-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">To</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
              className="w-full h-11 px-4 rounded-2xl border border-slate-200 text-sm font-semibold bg-white" />
          </div>
        </div>

        {/* Diary count */}
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-indigo-500" />
          <span className="text-xs font-black text-slate-600 uppercase tracking-widest">
            {diary.length} diary {diary.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>

        {/* Loading state */}
        {loading && <div className="flex justify-center py-8"><LoadingSpinner /></div>}

        {/* Diary Entries */}
        {!loading && diary.map(entry => (
          <div key={entry.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            {/* Entry header */}
            <button
              className="w-full text-left px-5 py-4 flex items-center justify-between active:bg-slate-50 transition-colors"
              onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
            >
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                    {entry.subject}
                  </span>
                </div>
                <h3 className="font-black text-slate-900 text-sm">{fmt(entry.entryDate)}</h3>
                <p className="text-[10px] font-semibold text-slate-400 mt-0.5">by {entry.teacherName}</p>
              </div>
              <ChevronRight
                size={16}
                className={`text-slate-400 transition-transform ${expanded === entry.id ? 'rotate-90' : ''}`}
              />
            </button>

            {/* Expanded content */}
            {expanded === entry.id && (
              <div className="px-5 pb-5 border-t border-slate-50 space-y-3">
                {entry.topicsCovered && (
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1">
                      <BookMarked size={10} /> Topics Covered
                    </p>
                    <p className="text-sm font-medium text-slate-700 leading-relaxed">{entry.topicsCovered}</p>
                  </div>
                )}
                {entry.homeworkAssigned && (
                  <div className="bg-amber-50 rounded-2xl p-3">
                    <p className="text-[9px] font-black uppercase tracking-widest text-amber-600 mb-1">📚 Homework Assigned</p>
                    <p className="text-sm font-medium text-slate-700 leading-relaxed">{entry.homeworkAssigned}</p>
                  </div>
                )}
                {entry.announcements && (
                  <div className="bg-blue-50 rounded-2xl p-3">
                    <p className="text-[9px] font-black uppercase tracking-widest text-blue-600 mb-1">📢 Announcements</p>
                    <p className="text-sm font-medium text-slate-700">{entry.announcements}</p>
                  </div>
                )}
                {entry.behaviorNote && (
                  <div className="bg-rose-50 rounded-2xl p-3">
                    <p className="text-[9px] font-black uppercase tracking-widest text-rose-600 mb-1 flex items-center gap-1">
                      <MessageSquare size={10} /> Teacher's Note
                    </p>
                    <p className="text-sm font-medium text-slate-700 italic">"{entry.behaviorNote}"</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Empty state */}
        {!loading && diary.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
            <BookOpen size={48} className="mx-auto text-slate-200 mb-4" />
            <h3 className="font-black text-slate-700 text-base mb-1">No Diary Entries</h3>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
              No class diary entries for this period
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentDiaryPage;
