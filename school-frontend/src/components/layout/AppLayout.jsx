// src/components/layout/AppLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import GlobalSearchModal from '../dashboard/GlobalSearchModal';
import { ChevronRight, Home } from 'lucide-react';

/**
 * AppLayout — The Enterprise ERP Operating Shell.
 * Orchestrates Sidebar, TopBar, Breadcrumbs, and Responsive behavior.
 */
const AppLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Keyboard shortcut Ctrl + K for global search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const contentMarginClass = isCollapsed ? 'lg:ml-20' : 'lg:ml-64';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-700">
      
      {/* Global Search Modal */}
      <GlobalSearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />

      {/* 1. Global Navigation Shell */}
      <Sidebar 
        isOpen={isMobileOpen} 
        onClose={() => setIsMobileOpen(false)}
        isCollapsed={isCollapsed}
      />

      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${contentMarginClass}`}>
         
        {/* 2. Unified Header */}
        <TopBar 
          onMobileMenuClick={() => setIsMobileOpen(true)}
          onDesktopMenuToggle={() => setIsCollapsed(!isCollapsed)}
          onSearchClick={() => setIsSearchOpen(true)}
        />

        {/* 3. Main Operational Content */}
        <main className="flex-1 mt-16 px-4 py-6 sm:px-8 sm:py-8 flex flex-col min-h-[calc(100vh-4rem)]">
          
          {/* A. Dynamic Breadcrumbs */}
          <Breadcrumbs />

          {/* B. Page Content (Sub-routes) */}
          <div className="flex-1 animate-fade-in">
            <Outlet />
          </div>

          {/* C. System Footer */}
          <footer className="mt-auto pt-10 pb-6 border-t border-slate-200/60 flex flex-col sm:flex-row justify-between items-center gap-4">
             <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
               System Online: v2.4.0-Enterprise
             </div>
             <p className="text-[10px] text-slate-300 uppercase tracking-widest font-bold">
               School Management System © 2024 | Secure Operational Interface
             </p>
          </footer>
        </main>
      </div>
    </div>
  );
};

/**
 * Breadcrumbs — Auto-generated from path
 */
const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-6 overflow-x-auto no-scrollbar whitespace-nowrap">
      <Link to="/" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
        <Home size={12} />
        Root
      </Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        
        // Clean up ID routes
        const displayName = isNaN(name) ? name.replace(/-/g, ' ') : `Record #${name}`;

        return (
          <React.Fragment key={routeTo}>
            <ChevronRight size={10} className="text-slate-300" />
            {isLast ? (
              <span className="text-slate-900">{displayName}</span>
            ) : (
              <Link to={routeTo} className="hover:text-blue-600 transition-colors">
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default AppLayout;
