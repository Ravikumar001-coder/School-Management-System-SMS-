import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Shield, CheckCircle2, Network, RefreshCw, MessageSquare, Heart } from 'lucide-react';

const DashboardBottomPanels = ({ upcomingDeadlines = [], recentActivity = [], loading }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Deadlines */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col">
        <h3 className="text-sm font-black text-slate-800 mb-4">Upcoming Deadlines</h3>
        <div className="flex-1 relative">
          {loading ? (
             <div className="space-y-4">
               <div className="h-10 bg-slate-100 animate-pulse rounded-lg" />
               <div className="h-10 bg-slate-100 animate-pulse rounded-lg" />
               <div className="h-10 bg-slate-100 animate-pulse rounded-lg" />
             </div>
          ) : upcomingDeadlines.length === 0 ? (
             <div className="flex items-center justify-center h-full text-slate-400 font-bold text-sm">
               No upcoming deadlines
             </div>
          ) : (
            <table className="w-full text-left" aria-label="Deadlines table">
              <thead className="bg-slate-50 text-xs uppercase tracking-widest font-black text-slate-500">
                <tr>
                  <th className="py-4 px-3 rounded-l-xl">Event</th>
                  <th className="py-4 px-3">Last Date</th>
                  <th className="py-4 px-3 rounded-r-xl">Deadline</th>
                </tr>
              </thead>
              <tbody className="text-sm font-bold text-slate-700">
                {upcomingDeadlines.map((evt, idx) => (
                  <tr key={idx} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                    <td className="py-5 px-3">{evt.title}</td>
                    <td className="py-5 px-3">{evt.lastDate}</td>
                    <td className="py-5 px-3">{evt.deadlineText}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* System Activity */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-black text-slate-800">System Activity</h3>
          <button 
            className="text-xs lg:text-sm text-blue-600 font-black hover:underline tracking-tight bg-transparent p-0 m-0 border-none cursor-pointer"
            onClick={() => navigate('/admin/audit-logs')}
          >
            View all
          </button>
        </div>
        <div className="space-y-6 flex-1">
          {loading ? (
             <div className="space-y-6">
               <div className="flex gap-4"><div className="w-12 h-12 bg-slate-100 animate-pulse rounded-full" /><div className="flex-1 h-12 bg-slate-100 animate-pulse rounded-lg" /></div>
               <div className="flex gap-4"><div className="w-12 h-12 bg-slate-100 animate-pulse rounded-full" /><div className="flex-1 h-12 bg-slate-100 animate-pulse rounded-lg" /></div>
             </div>
          ) : recentActivity.length === 0 ? (
             <div className="flex items-center justify-center h-full text-slate-400 font-bold text-sm">
               No recent system activity
             </div>
          ) : (
            recentActivity.map((act, idx) => (
              <div key={idx} className="flex gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white font-black ${act.isSystem || act.user === 'System' ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                  {act.isSystem || act.user === 'System' ? <Network size={20} className="text-white" /> : (act.avatar || 'A')}
                </div>
                <div>
                  <p className="text-sm font-black text-slate-800">{act.message}</p>
                  <p className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-tight">{act.timestamp || 'Just now'}</p>
                  {(act.isSystem || act.user === 'System') && (
                    <div className="flex gap-4 mt-3 text-slate-400">
                      <button aria-label="Refresh" className="hover:text-blue-500 transition-colors p-0 m-0 bg-transparent border-none cursor-pointer"><RefreshCw size={16} /></button>
                      <button aria-label="Message" className="hover:text-blue-500 transition-colors p-0 m-0 bg-transparent border-none cursor-pointer"><MessageSquare size={16} /></button>
                      <button aria-label="Like" className="hover:text-rose-500 transition-colors p-0 m-0 bg-transparent border-none cursor-pointer"><Heart size={16} /></button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col">
        <h3 className="text-sm font-black text-slate-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4 flex-1">
          {[
            { label: 'Admit New Student', icon: Users, route: '/admin/students/new' },
            { label: 'Assign Teacher', icon: Shield, route: '/admin/teachers/new' },
            { label: 'Mark Attendance', icon: Users, route: '/admin/attendance' },
            { label: 'Create Exam', icon: Shield, route: '/admin/exams/new' },
            { label: 'Collect Fee Dues', icon: CheckCircle2, route: '/admin/fees/collect' }
          ].map((action, i) => (
            <button key={i} onClick={() => navigate(action.route)} aria-label={`Navigate to ${action.label}`} className="flex flex-col gap-2 bg-slate-50 hover:bg-slate-100 transition-colors p-4 rounded-2xl border border-slate-100 text-left cursor-pointer focus:ring-4 focus:ring-blue-100 outline-none">
              <action.icon size={20} className="text-indigo-600 flex-shrink-0" />
              <span className="text-xs lg:text-sm font-black text-slate-700 leading-tight">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default React.memo(DashboardBottomPanels);
