import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  FiHome, FiCheckSquare, FiCalendar, FiBook, FiUser, 
  FiMenu, FiBell, FiSearch, FiPlus, FiX, FiLogOut,
  FiFileText, FiActivity, FiSettings, FiGrid, FiUsers,
  FiEdit3, FiFolder, FiBarChart2, FiLayout, FiBookOpen, FiRepeat
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import AddTodoModal from '../teachers/AddTodoModal';

const TeacherLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
  const [todoInput, setTodoInput] = useState({ title: '', priority: 'MEDIUM' });

  const handleGlobalAddTodo = async () => {
    try {
      await api.post('/teacher/todos', todoInput);
      setIsTodoModalOpen(false);
      setTodoInput({ title: '', priority: 'MEDIUM' });
      // If we are on dashboard, it might not refresh automatically unless we use a global state or event
      if (location.pathname === '/teacher/dashboard') {
        window.location.reload(); // Simple way for now to ensure data consistency
      } else {
        navigate('/teacher/dashboard');
      }
    } catch (err) {
      console.error("Failed to add global todo", err);
    }
  };
  
  const navItems = [
    { icon: FiLayout, label: 'Dashboard', path: '/teacher/dashboard' },
    { icon: FiCheckSquare, label: 'Attendance', path: '/teacher/quick-attendance' },
    { icon: FiCalendar, label: 'Timetable', path: '/teacher/timetable' },
    { icon: FiBook, label: 'Diary', path: '/teacher/diary' },
    { 
      icon: FiFileText, 
      label: 'Exams', 
      path: '/teacher/exams',
      children: [
        { label: 'Exam Management', path: '/teacher/exams' },
        { label: 'Asset Vault', path: '/teacher/exam-papers' }
      ]
    },
    { icon: FiUsers, label: 'Students', path: '/teacher/students' },
    { icon: FiEdit3, label: 'Lesson Planner', path: '/teacher/lesson-plans' },
    { icon: FiBookOpen, label: 'Homework', path: '/teacher/homework' },
    { icon: FiRepeat, label: 'Substitutes', path: '/teacher/substitutes' },
    { icon: FiFolder, label: 'Resources', path: '/teacher/resources' },
    { icon: FiBarChart2, label: 'Reports', path: '/teacher/reports' },
    { icon: FiSettings, label: 'Settings', path: '/teacher/settings' }
  ];

  // For bottom nav (mobile only)
  const bottomNavItems = [
    { icon: FiHome, label: 'Home', path: '/teacher/dashboard' },
    { icon: FiCheckSquare, label: 'Attendance', path: '/teacher/quick-attendance' },
    { icon: FiCalendar, label: 'Timetable', path: '/teacher/timetable' },
    { icon: FiBook, label: 'Diary', path: '/teacher/diary' },
    { icon: FiUser, label: 'Profile', path: '/teacher/profile' }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex text-slate-900">
      
      {/* ── DESKTOP SIDEBAR (≥1024px) ── */}
      <aside className="hidden lg:flex flex-col w-[260px] fixed inset-y-0 left-0 bg-[#0F172A] z-40 text-slate-300">
        <div className="h-20 flex items-center px-8 text-white">
           <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-indigo-600/30">
              <FiGrid className="text-white" size={18} />
           </div>
           <span className="text-xl font-bold tracking-tight">SchoolOS</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item, idx) => {
            const hasChildren = item.children && item.children.length > 0;
            const isSubMenuOpen = openSubMenu === item.label;
            const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/teacher/dashboard');
            
            return (
              <div key={idx} className="space-y-1">
                <button 
                  onClick={() => {
                    if (hasChildren) {
                      setOpenSubMenu(isSubMenuOpen ? null : item.label);
                    } else {
                      navigate(item.path);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium text-sm
                    ${isActive 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                      : 'hover:bg-white/5 hover:text-white'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} className={isActive ? "text-white" : "text-slate-400"} />
                    {item.label}
                  </div>
                  {hasChildren && (
                    <FiPlus size={14} className={`transition-transform duration-300 ${isSubMenuOpen ? 'rotate-45' : ''}`} />
                  )}
                </button>

                {/* Submenu rendering */}
                {hasChildren && isSubMenuOpen && (
                  <div className="pl-11 space-y-1 animate-fade-in">
                    {item.children.map((child, cIdx) => {
                      const isChildActive = location.pathname === child.path;
                      return (
                        <button
                          key={cIdx}
                          onClick={() => navigate(child.path)}
                          className={`w-full text-left px-4 py-2 rounded-lg text-xs transition-all font-medium
                            ${isChildActive ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}
                          `}
                        >
                          {child.label}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        <div className="p-6 mt-auto">
           <div 
             onClick={() => navigate('/teacher/profile')}
             className="bg-white/5 rounded-2xl p-4 flex items-center justify-between mb-4 cursor-pointer hover:bg-white/10 transition-all border border-transparent hover:border-white/5"
           >
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                    {user?.firstName?.[0] || 'D'}{user?.lastName?.[0] || 'T'}
                 </div>
                 <div className="text-left overflow-hidden">
                    <p className="text-sm font-bold text-white truncate">{user?.firstName || 'Demo Teacher'}</p>
                    <p className="text-[10px] text-slate-400 truncate tracking-wider uppercase">TCH-2026</p>
                 </div>
              </div>
           </div>
           <button 
             onClick={logout}
             className="flex items-center gap-2 text-rose-400 hover:text-rose-300 transition-colors text-sm font-bold w-full px-2"
           >
             <FiLogOut size={16} /> Sign Out
           </button>
        </div>
      </aside>

      {/* ── MOBILE SLIDE-OUT DRAWER ── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="w-[280px] bg-[#0F172A] h-full relative z-10 flex flex-col animate-slide-in-left shadow-2xl">
            <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
               <span className="text-lg font-bold text-white">SchoolOS Menu</span>
               <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-white p-2">
                 <FiX size={24} />
               </button>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              {navItems.map((item, idx) => {
                const hasChildren = item.children && item.children.length > 0;
                const isSubMenuOpen = openSubMenu === item.label;
                const isActive = location.pathname === item.path;

                return (
                  <div key={idx} className="space-y-1">
                    <button 
                      onClick={() => {
                        if (hasChildren) {
                          setOpenSubMenu(isSubMenuOpen ? null : item.label);
                        } else {
                          navigate(item.path);
                          setIsMobileMenuOpen(false);
                        }
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all font-medium
                        ${isActive ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'}
                      `}
                    >
                      <div className="flex items-center gap-4">
                        <item.icon size={20} className={isActive ? "text-white" : "text-slate-500"} />
                        {item.label}
                      </div>
                      {hasChildren && (
                        <FiPlus size={16} className={`transition-transform duration-300 ${isSubMenuOpen ? 'rotate-45' : ''}`} />
                      )}
                    </button>

                    {hasChildren && isSubMenuOpen && (
                      <div className="pl-14 space-y-2 animate-fade-in">
                        {item.children.map((child, cIdx) => {
                          const isChildActive = location.pathname === child.path;
                          return (
                            <button
                              key={cIdx}
                              onClick={() => { navigate(child.path); setIsMobileMenuOpen(false); }}
                              className={`w-full text-left py-2 text-sm transition-all font-medium
                                ${isChildActive ? 'text-indigo-400 underline underline-offset-4' : 'text-slate-400'}
                              `}
                            >
                              {child.label}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>
            <div className="p-6 border-t border-white/10">
               <button onClick={logout} className="flex items-center gap-3 text-rose-400 font-bold w-full">
                 <FiLogOut size={20} /> Sign Out
               </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT AREA ── */}
      <div className="flex-1 flex flex-col lg:pl-[260px] min-w-0 transition-all duration-300 pb-20 lg:pb-0">
        
        {/* MOBILE TOP BAR (Sticky) */}
        <header className="lg:hidden h-16 bg-white flex items-center justify-between px-4 sticky top-0 z-30 shadow-sm border-b border-slate-100">
           <div className="flex items-center gap-3">
              <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 text-slate-600 active:scale-95 rounded-lg hover:bg-slate-50">
                 <FiMenu size={24} />
              </button>
              <span className="font-black text-slate-900 text-lg tracking-tight">SchoolOS</span>
           </div>
           <div className="flex items-center gap-3">
              <button className="relative p-2 text-slate-500">
                 <FiBell size={22} />
                 <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
              </button>
              <div 
                onClick={() => navigate('/teacher/profile')}
                className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm cursor-pointer active:scale-95 transition-all"
              >
                 {user?.firstName?.[0] || 'D'}{user?.lastName?.[0] || 'T'}
              </div>
           </div>
        </header>

      {/* DESKTOP TOP BAR */}
        <header className="hidden lg:flex h-20 bg-[#F8FAFC] items-center justify-between px-8 z-30 pt-4 relative">
           {/* Search Bar */}
           <div className="relative w-96 group">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchOpen(true)}
                onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
                placeholder="Search students, classes, exams..." 
                className="w-full h-12 bg-white rounded-2xl pl-11 pr-16 text-sm outline-none border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                 <kbd className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-400 border border-slate-200">Ctrl</kbd>
                 <kbd className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-400 border border-slate-200">K</kbd>
              </div>

              {/* Search Results Dropdown (Simplified) */}
              {isSearchOpen && searchTerm && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-slide-up-fade z-50">
                  <div className="p-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">Results for "{searchTerm}"</div>
                  <div className="max-h-[300px] overflow-y-auto">
                    <button className="w-full px-5 py-3 text-left hover:bg-slate-50 flex items-center gap-3 group">
                       <FiUsers className="text-slate-400 group-hover:text-indigo-600" />
                       <div>
                          <p className="text-sm font-bold text-slate-700">Search Students</p>
                          <p className="text-[10px] text-slate-400">Find student profiles matching "{searchTerm}"</p>
                       </div>
                    </button>
                    <button className="w-full px-5 py-3 text-left hover:bg-slate-50 flex items-center gap-3 group">
                       <FiFileText className="text-slate-400 group-hover:text-indigo-600" />
                       <div>
                          <p className="text-sm font-bold text-slate-700">Search Exam Papers</p>
                          <p className="text-[10px] text-slate-400">Find question papers matching "{searchTerm}"</p>
                       </div>
                    </button>
                  </div>
                </div>
              )}
           </div>

           <div className="flex items-center gap-4">
              <button className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all relative shadow-sm hover:shadow active:scale-95">
                 <FiBell size={20} />
                 <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
              </button>
              <button 
                onClick={() => navigate('/teacher/timetable')}
                className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all shadow-sm hover:shadow active:scale-95"
              >
                 <FiCalendar size={20} />
              </button>
              
              <div className="relative">
                <button 
                  onClick={() => setIsQuickAddOpen(!isQuickAddOpen)}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white transition-all shadow-md active:scale-95
                    ${isQuickAddOpen ? 'bg-slate-900 rotate-45' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'}
                  `}
                >
                   <FiPlus size={22} />
                </button>

                {/* Quick Add Dropdown */}
                {isQuickAddOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsQuickAddOpen(false)}></div>
                    <div className="absolute top-full right-0 mt-3 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 p-2 z-50 animate-slide-up-fade">
                      <div className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-50 mb-1">
                        Quick Actions
                      </div>
                      <button 
                        onClick={() => { navigate('/teacher/lesson-plans'); setIsQuickAddOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-indigo-50 rounded-2xl transition-all group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-white">
                          <FiEdit3 size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold text-slate-700">New Lesson Plan</p>
                          <p className="text-[10px] text-slate-400 font-medium">Plan your next class</p>
                        </div>
                      </button>
                      <button 
                        onClick={() => { navigate('/teacher/exam-papers'); setIsQuickAddOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-rose-50 rounded-2xl transition-all group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-white">
                          <FiFileText size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold text-slate-700">Create Exam Paper</p>
                          <p className="text-[10px] text-slate-400 font-medium">Draft a new test</p>
                        </div>
                      </button>
                      <button 
                        onClick={() => { setIsTodoModalOpen(true); setIsQuickAddOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-emerald-50 rounded-2xl transition-all group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-white">
                          <FiCheckSquare size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold text-slate-700">Add To-Do</p>
                          <p className="text-[10px] text-slate-400 font-medium">Set a reminder</p>
                        </div>
                      </button>
                      <button 
                        onClick={() => { navigate('/teacher/diary'); setIsQuickAddOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-amber-50 rounded-2xl transition-all group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-white">
                          <FiBook size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold text-slate-700">New Diary Entry</p>
                          <p className="text-[10px] text-slate-400 font-medium">Log class activity</p>
                        </div>
                      </button>
                      <button 
                        onClick={() => { navigate('/teacher/homework'); setIsQuickAddOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-purple-50 rounded-2xl transition-all group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-white">
                          <FiBookOpen size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold text-slate-700">Assign Homework</p>
                          <p className="text-[10px] text-slate-400 font-medium">Create new assignment</p>
                        </div>
                      </button>
                    </div>
                  </>
                )}
              </div>
              
              <div className="h-8 w-px bg-slate-200 mx-2"></div>
              
              <div 
                onClick={() => navigate('/teacher/profile')}
                className="flex items-center gap-3 cursor-pointer p-1.5 pr-3 rounded-2xl hover:bg-white transition-all border border-transparent hover:border-slate-200 group"
              >
                 <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-sm group-hover:shadow-md transition-all">
                    {user?.firstName?.[0] || 'D'}{user?.lastName?.[0] || 'T'}
                 </div>
                 <div className="text-left hidden xl:block">
                    <p className="text-sm font-bold text-slate-900 leading-tight">{user?.firstName || 'Demo Teacher'}</p>
                    <p className="text-[11px] font-medium text-slate-500 uppercase tracking-tighter">Teacher Account</p>
                 </div>
              </div>
           </div>
        </header>

        {/* MAIN PAGE CONTENT */}
        <main className="flex-1 overflow-x-hidden animate-fade-in relative z-10">
          <Outlet />
        </main>
      </div>

      {/* ── MOBILE BOTTOM NAV (Fixed) ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-white rounded-t-[2rem] z-40 px-6 flex justify-between items-center shadow-[0_-10px_40px_rgba(0,0,0,0.05)] pb-safe border-t border-slate-100">
         {bottomNavItems.map((item, idx) => {
            const isActive = location.pathname === item.path || (item.path !== '/teacher/dashboard' && location.pathname.startsWith(item.path));
            return (
               <button 
                  key={idx}
                  onClick={() => navigate(item.path)}
                  className={`flex flex-col items-center justify-center relative transition-all duration-300 w-16
                     ${isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}
                  `}
               >
                  <div className={`flex items-center justify-center w-12 h-8 rounded-full mb-1 transition-colors duration-300 ${isActive ? 'bg-indigo-50' : 'bg-transparent'}`}>
                     <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className={`text-[10px] font-bold ${isActive ? 'opacity-100' : 'opacity-100'}`}>
                     {item.label}
                  </span>
               </button>
            )
         })}
      </nav>

      {/* ── ADD TODO MODAL (Global) ── */}
      <AddTodoModal 
        isOpen={isTodoModalOpen} 
        onClose={() => setIsTodoModalOpen(false)} 
        onSave={handleGlobalAddTodo} 
      />
    </div>
  );
};

export default TeacherLayout;
