// src/components/common/TopBar.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AiOutlineMenu, AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';

const getTitle = (path) => {
  const map = {
    '/admin/dashboard':    '📊 Dashboard',
    '/admin/students':     '👥 Students',
    '/admin/teachers':     '👨‍🏫 Teachers',
    '/admin/classes':      '🏛️ Classes',
    '/admin/subjects':     '📚 Subjects',
    '/admin/attendance':   '📅 Attendance',
    '/admin/exams':        '📝 Exams',
    '/admin/fees':         '💰 Fee Management',
    '/admin/fees/collect': '💳 Collect Fee',
    '/admin/backups':      '🗄️ Backups',
    '/admin/roles':        '🔐 Roles & Permissions',
    '/teacher/dashboard':  '📊 Dashboard',
    '/teacher/students':   '👥 My Students',
    '/teacher/attendance': '📅 Attendance',
    '/teacher/exams':      '📝 Exams',
    '/teacher/profile':    '👤 My Profile',
    '/student/dashboard':  '📊 Dashboard',
    '/student/attendance': '📅 My Attendance',
    '/student/exams':      '📝 My Exams',
    '/student/report-card':'📋 Report Card',
    '/student/fees':       '💰 My Fees',
    '/student/profile':    '👤 My Profile',
    '/change-password':    '🔑 Change Password',
  };
  // Partial match for detail pages
  for (const [key, val] of Object.entries(map)) {
    if (path.startsWith(key)) return val;
  }
  return '🏫 SMS';
};

const TopBar = ({
  contentOffsetClass = 'md:ml-56',
  isDesktopSidebarCollapsed = false,
  onMobileMenuClick = () => {},
  onDesktopMenuToggle = () => {},
}) => {
  const { user, isAdmin, isTeacher } = useAuth();
  const location   = useLocation();
  const today      = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric',
    month: 'long', year: 'numeric'
  });

  const avatarBg = isAdmin() ? 'bg-red-500' : isTeacher() ? 'bg-green-500' : 'bg-blue-500';

  return (
    <div
      className={`fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-30
                  flex items-center justify-between px-3 sm:px-6 shadow-sm ${contentOffsetClass}`}
    >
      {/* Left: Page Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          className="inline-flex md:hidden w-9 h-9 rounded-lg items-center justify-center
                     bg-gray-100 hover:bg-gray-200 text-gray-700"
          onClick={onMobileMenuClick}
          aria-label="Open sidebar menu"
        >
          <AiOutlineMenu size={18} />
        </button>

        <button
          className="hidden md:inline-flex w-9 h-9 rounded-lg items-center justify-center
                     bg-gray-100 hover:bg-gray-200 text-gray-700"
          onClick={onDesktopMenuToggle}
          aria-label="Toggle sidebar"
        >
          {isDesktopSidebarCollapsed ? <AiOutlineRight size={16} /> : <AiOutlineLeft size={16} />}
        </button>

        <div className="min-w-0">
        <h2 className="text-lg font-bold text-gray-800">
          {getTitle(location.pathname)}
        </h2>
          <p className="text-xs text-gray-400 truncate">{today}</p>
        </div>
      </div>

      {/* Right: User Info */}
      <div className="flex items-center gap-2 sm:gap-4">

        {/* Notification Bell */}
        <button className="relative w-9 h-9 bg-gray-100 
                           rounded-full flex items-center 
                           justify-center hover:bg-gray-200 
                           transition-colors">
          <span>🔔</span>
          <span className="absolute top-1 right-1 w-2 h-2 
                           bg-red-500 rounded-full"></span>
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2">
          <div className={`w-9 h-9 rounded-full flex items-center 
                          justify-center font-bold text-sm text-white
                          ${avatarBg}`}>
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-gray-700 
                          leading-tight">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;