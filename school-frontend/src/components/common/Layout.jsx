// src/components/common/Layout.jsx
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const Layout = ({ children }) => {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false);

  const contentOffsetClass = isDesktopSidebarCollapsed ? 'md:ml-20' : 'md:ml-56';

  return (
    <div className="flex min-h-screen bg-gray-100 overflow-x-hidden">

      {/* Fixed Sidebar */}
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        isDesktopCollapsed={isDesktopSidebarCollapsed}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${contentOffsetClass}`}
      >

        {/* Fixed TopBar */}
        <TopBar
          contentOffsetClass={contentOffsetClass}
          isDesktopSidebarCollapsed={isDesktopSidebarCollapsed}
          onMobileMenuClick={() => setMobileSidebarOpen(true)}
          onDesktopMenuToggle={() => setDesktopSidebarCollapsed((prev) => !prev)}
        />

        {/* Page Content - mt-16 to clear fixed topbar */}
        <main className="flex-1 px-3 py-4 sm:p-6 mt-16 min-h-screen 
                         overflow-x-hidden
                         animate-fade-in">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 
                           py-3 px-4 sm:px-6 ml-0">
          <p className="text-xs text-gray-400 text-center">
            School Management System © 2024 | 
            All Rights Reserved
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;