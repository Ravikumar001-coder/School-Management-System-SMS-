import React from 'react';
import { FiSettings, FiBell, FiShield, FiMoon } from 'react-icons/fi';

const TeacherSettings = () => {
  return (
    <div className="p-8 space-y-10 animate-fade-in">
      <div>
         <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Settings</h1>
         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Configure Your Workspace</p>
      </div>

      <div className="max-w-4xl space-y-6">
         {[
           { label: 'Notifications', desc: 'Manage email and push alerts', icon: <FiBell />, color: 'text-amber-500' },
           { label: 'Privacy & Security', desc: 'Update password and login methods', icon: <FiShield />, color: 'text-indigo-500' },
           { label: 'Appearance', desc: 'Toggle dark mode and theme colors', icon: <FiMoon />, color: 'text-purple-500' },
         ].map((s, i) => (
           <div key={i} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-xl transition-all cursor-pointer">
              <div className="flex items-center gap-6">
                 <div className={`w-14 h-14 bg-slate-50 ${s.color} rounded-2xl flex items-center justify-center text-2xl group-hover:bg-white transition-all shadow-inner border border-transparent group-hover:border-slate-50`}>
                    {s.icon}
                 </div>
                 <div>
                    <h4 className="font-black text-slate-800 text-lg tracking-tight">{s.label}</h4>
                    <p className="text-xs font-bold text-slate-400 tracking-wide">{s.desc}</p>
                 </div>
              </div>
              <div className="w-10 h-10 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                 <FiSettings size={18} />
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};

export default TeacherSettings;
