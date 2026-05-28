import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Users, BookOpen, CreditCard, Settings, ArrowLeft, Bell, User, BookMarked } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ParentLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { children, activeChildId } = useAuth();
  const activeChild = children.find(c => c.studentId === activeChildId) || children[0] || {};
  
  const isDashboard = location.pathname === '/parent/dashboard';
  const pageTitle = location.pathname.split('/').pop()?.replace(/-/g, ' ') || 'Dashboard';
  
  // Dynamic header based on page
  const renderHeader = () => {
    if (isDashboard) {
      return (
        <div className="bg-white/80 backdrop-blur-xl px-6 py-5 flex items-center justify-between border-b border-slate-100 sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-slate-900/20 rotate-3">
              <Users size={22} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight leading-none mb-0.5">Family Hub</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Session</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="w-11 h-11 bg-slate-50 text-slate-500 rounded-2xl flex items-center justify-center hover:bg-slate-100 transition-all relative active:scale-90">
              <Bell size={22} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <button 
              onClick={() => navigate('/parent/profile')}
              className="w-11 h-11 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center hover:bg-indigo-100 transition-all active:scale-90"
            >
               <User size={22} />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white/80 backdrop-blur-xl px-6 py-5 flex items-center justify-between border-b border-slate-100 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/parent/dashboard')} className="w-10 h-10 flex items-center justify-center text-slate-400 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all active:scale-90">
            <ArrowLeft size={20} strokeWidth={2.5} />
          </button>
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight leading-none mb-0.5 capitalize">{pageTitle}</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{activeChild.firstName}'s Info</p>
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-black text-xs">
           {activeChild.firstName?.[0]}{activeChild.lastName?.[0]}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans selection:bg-indigo-100 selection:text-indigo-600">
      {renderHeader()}

      <main className="animate-fade-in">
        <Outlet />
      </main>

      {/* ── FLOATING BOTTOM NAV ── */}
      <div className="fixed bottom-6 left-6 right-6 h-20 bg-slate-900/90 backdrop-blur-2xl rounded-[2rem] border border-white/10 px-8 flex justify-between items-center z-[100] shadow-2xl shadow-slate-950/40">
         {[
          { icon: Users,      label: 'Home',  path: '/parent/dashboard' },
           { icon: BookOpen,   label: 'Study', path: '/parent/homework' },
           { icon: BookMarked, label: 'Diary', path: '/parent/diary' },
           { icon: CreditCard, label: 'Pay',   path: '/parent/fees' },
           { icon: Settings,   label: 'Config',path: '/parent/profile' }
         ].map((item, i) => {
           const isActive = location.pathname === item.path;
           return (
             <button 
               key={i} 
               onClick={() => navigate(item.path)}
               className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${isActive ? 'text-indigo-400 scale-110' : 'text-slate-500 hover:text-slate-300 active:scale-90'}`}
             >
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
                {isActive && <div className="w-1 h-1 bg-indigo-400 rounded-full mt-0.5"></div>}
             </button>
           );
         })}
      </div>
    </div>
  );
};

export default ParentLayout;
