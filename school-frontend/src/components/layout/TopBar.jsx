// src/components/layout/TopBar.jsx
import React from 'react';
import { Menu, Bell, Search, Settings, ChevronDown, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const TopBar = ({ onMobileMenuClick, onDesktopMenuToggle }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 fixed top-0 right-0 left-0 bg-white/80 backdrop-blur-md border-b border-slate-100 z-50 transition-all duration-300">
      <div className="h-full px-4 flex items-center justify-between gap-4">
        
        {/* Left: Mobile Toggle & Search */}
        <div className="flex items-center gap-4 flex-1">
          <button 
            onClick={onMobileMenuClick}
            className="p-2 hover:bg-slate-50 rounded-xl text-slate-500 lg:hidden"
            aria-label="Toggle Mobile Menu"
          >
            <Menu size={20} />
          </button>
          
          <button
            onClick={onDesktopMenuToggle}
            className="p-2 hover:bg-slate-50 rounded-xl text-slate-500 hidden lg:block"
            aria-label="Toggle Sidebar"
          >
            <Menu size={20} />
          </button>

          <div className="relative hidden md:flex items-center max-w-sm w-full">
            <Search className="absolute left-3 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Global Search (Ctrl+K)..."
              className="w-full bg-slate-50 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
            />
          </div>
        </div>

        {/* Right: Notifications & Profile */}
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-500 relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <div className="h-8 w-px bg-slate-100 mx-2 hidden sm:block"></div>

          <div className="flex items-center gap-3 pl-2 group cursor-pointer">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-bold text-slate-700">{user?.username}</span>
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-tight">{user?.roles?.[0]}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:border-blue-500 group-hover:text-blue-500 transition-all">
              <User size={20} />
            </div>
            <ChevronDown size={14} className="text-slate-300 group-hover:text-slate-500 transition-all" />
          </div>
        </div>

      </div>
    </header>
  );
};

export default TopBar;
