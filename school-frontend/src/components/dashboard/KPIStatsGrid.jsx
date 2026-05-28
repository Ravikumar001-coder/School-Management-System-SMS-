import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, Calendar, UserCheck, IndianRupee, AlertCircle, Bus, Home, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const dummyTrendData = (up) => Array.from({length: 6}).map((_, i) => ({ value: up ? i * 10 + Math.random() * 20 : 100 - (i * 10 + Math.random() * 20) }));

const StatCard = ({ title, value, subtitle, icon: Icon, iconBg, iconColor, trend, trendUp, loading, onClick }) => (
  <div 
    onClick={onClick} 
    className={`bg-white p-3 lg:p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between transition-all flex-shrink-0 w-[200px] lg:w-auto h-[130px] ${onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : ''}`}
  >
    <div className="flex items-start justify-between w-full">
      <div className="flex items-center gap-2">
         <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg} flex-shrink-0`}>
           <Icon className={`${iconColor} w-4 h-4`} />
         </div>
         <p className="text-[10px] lg:text-[11px] font-black text-slate-500 tracking-tight leading-tight w-20">{title}</p>
      </div>
      {!loading && trend && (
         <div className="text-right">
           <span className={`text-[9px] font-black tracking-tight ${trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
             {trendUp ? '+' : '-'}{trend}
           </span>
         </div>
      )}
    </div>
    
    <div className="mt-3">
       <h3 className="text-xl lg:text-2xl font-black text-slate-800 leading-none">
         {loading ? <span className="animate-pulse text-slate-200">•••</span> : (value ?? '0')}
       </h3>
    </div>

    <div className="flex items-end justify-between mt-auto">
      <p className="text-[9px] text-slate-400 font-bold truncate pr-2 max-w[60%]">{subtitle}</p>
      
      {!loading && (
        <div className="w-12 h-6 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dummyTrendData(trendUp)}>
              <Line type="monotone" dataKey="value" stroke={trendUp ? '#10b981' : '#f43f5e'} strokeWidth={1.5} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  </div>
);

const KPIStatsGrid = ({ stats, loading, onCardClick }) => {
  const summary = stats?.summary || {};
  const studentStats = stats?.students || {};
  const hrStats = stats?.hr || {};
  const financeStats = stats?.finance || {};
  const opsStats = stats?.operations || {};

  const kpiData = [
    { title: "Total Students", value: (summary.totalActiveStudents || 0).toLocaleString(), subtitle: "Active", icon: Users, iconBg: "bg-blue-50", iconColor: "text-blue-600", trend: "4.2%", trendUp: true, actionType: "STUDENTS" },
    { title: "New Admissions", value: (studentStats.newAdmissions || 0).toLocaleString(), subtitle: "This year", icon: UserPlus, iconBg: "bg-emerald-50", iconColor: "text-emerald-600", trend: "12.5%", trendUp: true, actionType: "STUDENTS" },
    { title: "Attendance Today", value: `${(studentStats.todayAttendancePercentage || 0).toFixed(1)}%`, subtitle: "vs yesterday", icon: Calendar, iconBg: "bg-indigo-50", iconColor: "text-indigo-600", trend: "1.2%", trendUp: false, actionType: "ATTENDANCE" },
    { title: "Total Staff", value: ((hrStats.totalTeachingStaff || 0) + (hrStats.totalNonTeachingStaff || 0)).toLocaleString(), subtitle: "Active", icon: UserCheck, iconBg: "bg-purple-50", iconColor: "text-purple-600", trend: "3.1%", trendUp: true, actionType: "HR" },
    { title: "Revenue (This Month)", value: `₹ ${(financeStats.revenueThisMonth || 0).toLocaleString()}`, subtitle: "vs last month", icon: IndianRupee, iconBg: "bg-emerald-50", iconColor: "text-emerald-600", trend: "18.6%", trendUp: true, actionType: "FINANCE" },
    { title: "Outstanding Fees", value: `₹ ${(financeStats.outstandingFees || 0).toLocaleString()}`, subtitle: "vs last month", icon: AlertCircle, iconBg: "bg-rose-50", iconColor: "text-rose-600", trend: "6.8%", trendUp: false, actionType: "FINANCE" },
    { title: "Active Vehicles", value: `${opsStats.activeVehicles || 0} / ${(opsStats.activeVehicles || 0) + (opsStats.vehiclesUnderMaintenance || 0)}`, subtitle: `${opsStats.vehiclesUnderMaintenance || 0} under maintenance`, icon: Bus, iconBg: "bg-emerald-50", iconColor: "text-emerald-600", trend: "0.0%", trendUp: true, actionType: "TRANSPORT" },
    { title: "Hostel Occupancy", value: `${(opsStats.hostelOccupancy || 0).toFixed(1)}%`, subtitle: "Occupied", icon: Home, iconBg: "bg-blue-50", iconColor: "text-blue-600", trend: "1.0%", trendUp: true, actionType: "HOSTEL" },
  ];

  return (
    <div className="flex overflow-x-auto gap-4 mb-6 pb-2 lg:pb-0 lg:grid lg:grid-cols-4 2xl:grid-cols-8 lg:overflow-visible hide-scrollbar" role="region" aria-label="Executive KPI Strip">
      {kpiData.map((kpi, idx) => (
        <StatCard key={idx} {...kpi} loading={loading} onClick={() => onCardClick && onCardClick(kpi.actionType)} />
      ))}
    </div>
  );
};

export default React.memo(KPIStatsGrid);
