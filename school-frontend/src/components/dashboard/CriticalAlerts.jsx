import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, FileWarning, Clock, ServerCrash } from 'lucide-react';

const CriticalAlerts = ({ alerts = [], loading, onAlertClick }) => {
  const navigate = useNavigate();

  const getAlertStyle = (type, severity) => {
    if (type === 'PAYROLL') return { icon: FileWarning, bg: 'bg-rose-50', color: 'text-rose-500' };
    if (type === 'TRANSPORT') return { icon: ServerCrash, bg: 'bg-amber-50', color: 'text-amber-500' };
    if (type === 'FINANCE') return { icon: AlertCircle, bg: 'bg-orange-50', color: 'text-orange-500' };
    if (severity === 'HIGH') return { icon: AlertCircle, bg: 'bg-rose-50', color: 'text-rose-500' };
    return { icon: Clock, bg: 'bg-blue-50', color: 'text-blue-500' };
  };

  const displayAlerts = alerts?.length ? alerts.map(a => {
    const style = getAlertStyle(a.type, a.severity);
    return {
      id: a.id,
      icon: style.icon,
      bg: style.bg,
      color: style.color,
      title: a.title,
      desc: a.message,
      time: new Date(a.createdAt).toLocaleDateString() // Or a relative time function
    };
  }) : [
    { id: 1, icon: FileWarning, bg: 'bg-rose-50', color: 'text-rose-500', title: 'Payroll not processed', desc: 'April 2024 payroll is pending approval', time: '2h ago' },
    { id: 2, icon: AlertCircle, bg: 'bg-amber-50', color: 'text-amber-500', title: '3 Buses Offline', desc: 'Bus 03, 08, 12 GPS not responding', time: '1h ago' },
    { id: 3, icon: AlertCircle, bg: 'bg-orange-50', color: 'text-orange-500', title: 'Fee Dues Exceed ₹18L', desc: 'Total outstanding fees is high', time: '30m ago' },
    { id: 4, icon: Clock, bg: 'bg-rose-50', color: 'text-rose-500', title: 'PF Filing Due', desc: 'PF return filing due in 2 days', time: '1h ago' }
  ];

  return (
    <div className="bg-white rounded-[16px] border border-[#f1f5f9] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-black text-slate-800">Critical Alerts</h3>
        <button 
          onClick={() => navigate('/admin/audit-logs')}
          className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
        >
          View All
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="h-12 bg-slate-50 animate-pulse rounded-xl" />
          <div className="h-12 bg-slate-50 animate-pulse rounded-xl" />
          <div className="h-12 bg-slate-50 animate-pulse rounded-xl" />
          <div className="h-12 bg-slate-50 animate-pulse rounded-xl" />
        </div>
      ) : (
        <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
          {displayAlerts.map(alert => (
            <div key={alert.id} className="flex gap-3 group cursor-pointer" onClick={() => onAlertClick && onAlertClick({ id: alert.id, title: alert.title, message: alert.desc })}>
              <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${alert.bg}`}>
                 <alert.icon size={18} className={alert.color} />
              </div>
              <div className="flex-1 min-w-0">
                 <h4 className="text-xs font-black text-slate-800 truncate group-hover:text-blue-600 transition-colors">{alert.title}</h4>
                 <p className="text-[10px] text-slate-500 font-bold truncate mt-0.5">{alert.desc}</p>
              </div>
              <div className="text-[9px] font-bold tracking-tight text-slate-400 flex-shrink-0 text-right w-12">
                 {alert.time}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(CriticalAlerts);