// src/components/layout/Sidebar.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { menuConfig, getFilteredMenu } from '../../config/menuConfig';
import { LogOut, ChevronRight, X, School } from 'lucide-react';

const Sidebar = ({ isOpen, onClose, isCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, can } = useAuth();
  const [openMenus, setOpenMenus] = useState({});

  const filteredMenu = getFilteredMenu(user?.roles || [], can);

  const toggleSubmenu = (id, currentlyOpen) => {
    setOpenMenus(prev => ({ ...prev, [id]: !currentlyOpen }));
  };

  const isActive = (path) => location.pathname === path;
  const isParentActive = (item) => {
    if (item.path && isActive(item.path)) return true;
    if (item.children) return item.children.some(child => isActive(child.path));
    return false;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full bg-slate-900 text-slate-300 z-[101] flex flex-col transition-all duration-300 ease-in-out border-r border-slate-800
                   ${isCollapsed ? 'w-20' : 'w-64'}
                   ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand */}
        <div className="h-16 flex items-center px-6 gap-3 border-b border-slate-800 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
            <School size={20} className="text-white" />
          </div>
          {!isCollapsed && (
            <span className="font-bold text-lg text-white tracking-tight uppercase">SchoolOS</span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          {filteredMenu.map((item) => {
            const hasChildren = !!item.filteredChildren;
            const active = isParentActive(item);
            const open = openMenus[item.id] !== undefined ? openMenus[item.id] : active;

            return (
              <div key={item.id} className="space-y-1">
                <button
                  onClick={() => hasChildren ? toggleSubmenu(item.id, open) : (item.path && navigate(item.path))}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all group
                             ${active ? 'bg-blue-600/10 text-blue-400' : 'hover:bg-slate-800 hover:text-white'}
                             ${isCollapsed ? 'justify-center' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={20} className={active ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'} />
                    {!isCollapsed && <span>{item.title}</span>}
                  </div>
                  {!isCollapsed && hasChildren && (
                    <ChevronRight 
                      size={16} 
                      className={`transition-transform duration-200 ${open ? 'rotate-90' : ''}`} 
                    />
                  )}
                </button>

                {!isCollapsed && hasChildren && open && (
                  <div className="ml-9 space-y-1 border-l border-slate-800 pl-2">
                    {item.filteredChildren.map(child => (
                      <Link
                        key={child.id}
                        to={child.path}
                        className={`block px-3 py-1.5 rounded-md text-xs font-medium transition-all
                                   ${isActive(child.path) ? 'text-white bg-slate-800' : 'text-slate-500 hover:text-white hover:bg-slate-800/50'}`}
                      >
                        {child.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Profile / Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          {!isCollapsed ? (
             <div className="flex flex-col gap-3">
               <div className="flex items-center gap-3 px-2">
                 <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs text-white">
                   {user?.username?.[0]?.toUpperCase()}
                 </div>
                 <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">{user?.username}</p>
                    <p className="text-[10px] text-slate-500 truncate">{user?.roles?.[0]}</p>
                 </div>
               </div>
               <button
                 onClick={logout}
                 className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
               >
                 <LogOut size={18} />
                 <span>Sign Out</span>
               </button>
             </div>
          ) : (
            <button onClick={logout} className="w-full flex justify-center py-2 text-red-400 hover:text-red-300">
               <LogOut size={20} />
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
