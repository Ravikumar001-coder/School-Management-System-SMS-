import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, ChevronDown, ChevronRight, X } from 'lucide-react';
import { menuConfig } from '../../utils/menuConfig';

const roleThemes = {
  ADMIN: {
    sidebarBg: '#0f172a', // Slate 900
    logoBg: '#3b82f6',    // Blue 500
    border: '#1e293b',   // Slate 800
    activeBg: '#1e293b',
    hoverText: 'text-slate-400',
    hoverBg: 'hover:bg-slate-800/50',
    submenuBg: '#020617', // Slate 950
    submenuText: 'text-slate-400',
  },
  TEACHER: {
    sidebarBg: '#064e3b', // Emerald 900
    logoBg: '#10b981',    // Emerald 500
    border: '#065f46',
    activeBg: '#065f46',
    hoverText: 'text-emerald-300',
    hoverBg: 'hover:bg-emerald-800/40',
    submenuBg: '#022c22',
    submenuText: 'text-emerald-300',
  },
  STUDENT: {
    sidebarBg: '#1e3a8a', // Blue 900
    logoBg: '#3b82f6',
    border: '#1e40af',
    activeBg: '#1e40af',
    hoverText: 'text-blue-200',
    hoverBg: 'hover:bg-blue-800/40',
    submenuBg: '#172554',
    submenuText: 'text-blue-200',
  },
  SUPERADMIN: {
    sidebarBg: '#4c1d95', // Violet 900
    logoBg: '#8b5cf6',
    border: '#5b21b6',
    activeBg: '#5b21b6',
    hoverText: 'text-violet-200',
    hoverBg: 'hover:bg-violet-800/40',
    submenuBg: '#2e1065',
    submenuText: 'text-violet-200',
  },
};

const Sidebar = ({ isOpen = false, onClose = () => {}, isDesktopCollapsed = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, can, isAdmin, isTeacher, isSuperAdmin } = useAuth();
  const [openMenus, setOpenMenus] = useState({});
  
  const roleKey = isSuperAdmin() ? 'SUPERADMIN' : 
                 isAdmin() ? 'ADMIN' : 
                 isTeacher() ? 'TEACHER' : 'STUDENT';

  const theme = roleThemes[roleKey] || roleThemes.STUDENT;
  const labelVisibilityClass = isDesktopCollapsed ? 'md:hidden' : 'md:inline';

  const menuItems = (menuConfig[roleKey] || []).filter(item => {
    if (item.permission && !can(item.permission)) return false;
    if (item.children) {
      item.filteredChildren = item.children.filter(child => !child.permission || can(child.permission));
      return item.filteredChildren.length > 0;
    }
    return true;
  });

  const toggleMenu = (title) => {
    setOpenMenus(prev => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <>
      {isOpen && (
        <button
          onClick={onClose}
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
          aria-label="Close sidebar overlay"
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-64 ${isDesktopCollapsed ? 'md:w-20' : 'md:w-64'} flex flex-col z-40
                    transform transition-all duration-300 ease-in-out border-r
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                    md:translate-x-0 shadow-2xl`}
        style={{ backgroundColor: theme.sidebarBg, borderColor: theme.border }}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 md:hidden"
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>

        <div className={`flex items-center px-6 py-6 border-b mb-2 ${isDesktopCollapsed ? 'md:justify-center' : 'gap-3'}`}
             style={{ borderColor: theme.border }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
               style={{ backgroundColor: theme.logoBg }}>
            <span className="text-white text-xl">🏫</span>
          </div>
          <div className={`flex flex-col ${labelVisibilityClass}`}>
            <span className="text-white font-bold text-lg leading-tight">SchoolOS</span>
            <span className="text-[10px] uppercase tracking-widest opacity-50 text-white font-semibold">{roleKey}</span>
          </div>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto custom-scrollbar px-3">
          {menuItems.map((item) => {
            const hasChildren = item.filteredChildren && item.filteredChildren.length > 0;
            const isOpen = openMenus[item.title];
            const isActive = location.pathname === item.path || 
                            (hasChildren && item.filteredChildren.some(c => location.pathname === c.path));

            return (
              <div key={item.title} className="mb-1">
                <button
                  onClick={() => {
                    if (hasChildren && !isDesktopCollapsed) {
                      toggleMenu(item.title);
                    } else if (item.path) {
                      navigate(item.path);
                      onClose();
                    }
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                            ${isDesktopCollapsed ? 'md:px-0 md:justify-center' : ''}
                            ${isActive && !hasChildren ? 'text-white' : `text-slate-400 ${theme.hoverBg} hover:text-white`}`}
                  style={isActive && !hasChildren ? { backgroundColor: theme.activeBg } : {}}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={20} className={isActive && !hasChildren ? 'text-white' : 'opacity-70'} />
                    <span className={labelVisibilityClass}>{item.title}</span>
                  </div>
                  {hasChildren && !isDesktopCollapsed && (
                    <span className="transition-transform duration-200" style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0)' }}>
                      <ChevronRight size={14} />
                    </span>
                  )}
                </button>

                {hasChildren && !isDesktopCollapsed && isOpen && (
                  <div className="mt-1 ml-4 pl-4 border-l border-white/10 space-y-1">
                    {item.filteredChildren.map((child) => (
                      <button
                        key={child.path}
                        onClick={() => {
                          navigate(child.path);
                          onClose();
                        }}
                        className={`w-full text-left px-4 py-2 text-xs rounded-md transition-all
                                   ${location.pathname === child.path ? 'bg-white/10 text-white font-semibold' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                      >
                        {child.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {user && (
          <div className="p-4 mt-auto">
            <div className={`mb-4 p-3 rounded-xl bg-black/20 border border-white/5 ${isDesktopCollapsed ? 'hidden' : 'block'}`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white text-xs">
                  {user.username?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{user.username}</p>
                  <p className="text-[10px] text-slate-500 truncate">{user.email || 'System User'}</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/login');
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-all
                         ${isDesktopCollapsed ? 'md:justify-center md:px-0' : ''}`}
            >
              <LogOut size={20} />
              <span className={labelVisibilityClass}>Logout</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
