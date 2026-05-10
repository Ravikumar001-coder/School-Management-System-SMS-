import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Calendar, CreditCard, BookOpen, Bell, ChevronRight, 
  CalendarHeart, MessageSquare, Clock, FileBadge, 
  DownloadCloud, FileSignature 
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ChildAvatar = ({ student, isActive, size = "md" }) => {
  const dimensions = size === "lg" ? "w-20 h-20" : "w-14 h-14";
  const initials = `${student.firstName?.[0] || ""}${student.lastName?.[0] || ""}`;
  
  return (
    <div className={`${dimensions} rounded-2xl flex items-center justify-center font-black text-lg overflow-hidden transition-all duration-500
      ${isActive ? 'bg-white text-indigo-600 scale-105 shadow-inner' : 'bg-indigo-50 text-indigo-400 group-hover:bg-indigo-100'}`}>
      {student.photoUrl ? (
        <img 
          src={student.photoUrl} 
          alt="" 
          className="w-full h-full object-cover" 
          onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${initials}&background=6366f1&color=fff&bold=true`; }}
        />
      ) : (
        <span className={size === "lg" ? "text-2xl" : "text-lg"}>{initials}</span>
      )}
    </div>
  );
};

const ChildSelectorItem = ({ student, isActive, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex-shrink-0 flex flex-col items-center gap-3 transition-all duration-300 group
      ${isActive ? 'scale-100 opacity-100' : 'scale-90 opacity-40 hover:opacity-70'}`}
  >
    <ChildAvatar student={student} isActive={isActive} />
    <span className={`text-[10px] font-black uppercase tracking-[0.15em] transition-colors
      ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
      {student.firstName}
    </span>
  </button>
);

const SummaryTile = ({ icon: Icon, title, value, color }) => (
  <div className="bg-white/60 backdrop-blur-md rounded-3xl p-5 border border-white shadow-sm hover:shadow-md transition-all group active:scale-95">
    <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3 shadow-lg shadow-current/10`}>
      <Icon size={20} className="text-white" />
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{title}</p>
    <h4 className="text-xl font-black text-slate-900 tracking-tight">{value}</h4>
  </div>
);

const ParentDashboard = () => {
  const navigate = useNavigate();
  const { children, activeChildId, setActiveChildId } = useAuth();
  const [loading, setLoading] = useState(false);

  const activeChild = children.find(c => c.studentId === activeChildId) || children[0] || {};

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50"><LoadingSpinner /></div>;

  return (
    <div className="pb-32 animate-fade-in">
      {/* ── CHILD SELECTION REEL ── */}
      <div className="px-6 py-8 overflow-x-auto flex items-center gap-8 no-scrollbar">
        {children.map(child => (
          <ChildSelectorItem 
            key={child.studentId} 
            student={child} 
            isActive={activeChildId === child.studentId} 
            onClick={() => setActiveChildId(child.studentId)} 
          />
        ))}
        {children.length === 0 && (
           <div className="text-slate-400 text-[10px] font-black py-6 px-10 border-2 border-dashed border-slate-200 rounded-[2rem] w-full text-center uppercase tracking-widest opacity-60">
             Linking New Student...
           </div>
        )}
      </div>

      <div className="px-6 space-y-10">
        {/* ── HERO STATUS SECTION ── */}
        <header className="relative">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-400/10 blur-[80px] rounded-full"></div>
          <div className="absolute top-0 -right-10 w-40 h-40 bg-rose-400/10 blur-[80px] rounded-full"></div>
          
          <div className="relative flex items-center gap-6 mb-2">
             <div className="p-1 bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-500/10 border border-slate-50">
               <ChildAvatar student={activeChild} isActive={true} size="lg" />
             </div>
             <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight">
                  Hi, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">{activeChild.firstName}</span>
                </h1>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px] flex items-center gap-2 mt-1">
                  <BookOpen size={12} className="text-indigo-400" />
                  Grade {activeChild.className} • Section {activeChild.sectionName || 'A'}
                </p>
             </div>
          </div>
        </header>

        {/* ── COMPACT SUMMARY GRID ── */}
        <div className="grid grid-cols-2 gap-4">
          <SummaryTile 
            icon={Calendar} 
            title="Attendance" 
            value={activeChild.attendance || '94%'} 
            color="bg-emerald-500" 
          />
          <SummaryTile 
            icon={CreditCard} 
            title="Fees Due" 
            value={activeChild.feeDue || '₹0'} 
            color={(!activeChild.feeDue || activeChild.feeDue === '₹0') ? 'bg-slate-300' : 'bg-rose-500'} 
          />
          <SummaryTile 
            icon={BookOpen} 
            title="Next Exam" 
            value={activeChild.nextExam || 'May 15'} 
            color="bg-indigo-500" 
          />
          <SummaryTile 
            icon={Bell} 
            title="Alerts" 
            value="3 New" 
            color="bg-amber-500" 
          />
        </div>

        {/* ── PREMIUM OPERATION GRID ── */}
        <section className="bg-white/40 backdrop-blur-sm rounded-[3rem] p-8 border border-white/60 shadow-xl shadow-slate-200/50">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-10 text-center opacity-80">School Super App</h3>
          <div className="grid grid-cols-4 gap-y-10 gap-x-4">
            {[
              { icon: Calendar, label: 'Attendance', path: '/parent/attendance', color: 'from-emerald-400 to-teal-500' },
              { icon: CreditCard, label: 'Fees', path: '/parent/fees', color: 'from-rose-400 to-pink-500' },
              { icon: BookOpen, label: 'Homework', path: '/parent/homework', color: 'from-indigo-400 to-violet-500' },
              { icon: Bell, label: 'Circulars', path: '/parent/circulars', color: 'from-amber-400 to-orange-500' },
              { icon: CalendarHeart, label: 'Leave', path: '/parent/leave', color: 'from-teal-400 to-emerald-500' },
              { icon: MessageSquare, label: 'Complaints', path: '/parent/complaints', color: 'from-pink-400 to-rose-500' },
              { icon: Clock, label: 'PTM', path: '/parent/ptm', color: 'from-purple-400 to-indigo-500' },
              { icon: FileBadge, label: 'Results', path: '/parent/results', color: 'from-blue-400 to-cyan-500' },
              { icon: DownloadCloud, label: 'Downloads', path: '/parent/downloads', color: 'from-cyan-400 to-blue-500' },
              { icon: FileSignature, label: 'Consent', path: '/parent/consent', color: 'from-orange-400 to-amber-500' }
            ].map((app, i) => (
              <button 
                key={i} 
                onClick={() => navigate(app.path)}
                className="flex flex-col items-center gap-3 group active:scale-90 transition-transform"
              >
                <div className={`w-14 h-14 rounded-[1.5rem] bg-gradient-to-br ${app.color} flex items-center justify-center transition-all duration-300 group-hover:rounded-2xl group-hover:-translate-y-1 shadow-lg shadow-current/20`}>
                  <app.icon size={26} className="text-white" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 text-center leading-tight whitespace-nowrap">{app.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ── TIMELINE SECTION ── */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-50">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Timeline</h3>
              <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest px-3 py-1 bg-indigo-50 rounded-lg">History</button>
           </div>
           <div className="space-y-6">
              {[
                { type: 'Attendance', msg: 'Marked Present today', time: '2h ago', icon: Calendar, color: 'text-emerald-500 bg-emerald-50' },
                { type: 'Homework', msg: 'New Science task assigned', time: '4h ago', icon: BookOpen, color: 'text-indigo-500 bg-indigo-50' },
                { type: 'Fee', msg: 'Invoice #FE-2024-098 ready', time: '1d ago', icon: CreditCard, color: 'text-rose-500 bg-rose-50' },
              ].map((act, i) => (
                <div key={i} className="flex gap-5 group items-center">
                  <div className={`w-12 h-12 rounded-2xl ${act.color} flex items-center justify-center shrink-0`}>
                    <act.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline">
                      <p className="text-sm font-black text-slate-800">{act.type}</p>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">{act.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">{act.msg}</p>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-400 transition-colors" />
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
