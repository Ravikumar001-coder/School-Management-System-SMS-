import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, Calendar, UserCheck, IndianRupee, AlertCircle, Bus, Home, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const dummyTrendData = (up) => Array.from({length: 6}).map((_, i) => ({ value: up ? i * 10 + Math.random() * 20 : 100 - (i * 10 + Math.random() * 20) }));

const StatCard = ({ title, value, subtitle, icon: Icon, iconBg, iconColor, trend, trendUp, loading, onClick }) => (
  <div 
    onClick={onClick} 
    className={`bg-white p-4 lg:p-5 rounded-[16px] border border-[#f1f5f9] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] flex flex-col justify-between transition-all flex-shrink-0 w-[200px] lg:w-auto h-[130px] ${onClick ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_10px_15px_-3px_rgb(0,0,0,0.1),0_4px_6px_-4px_rgb(0,0,0,0.1)]' : ''}`}
  >
    <div className="flex items-start justify-between w-full">
      <div className="flex items-center gap-2">
         <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg} flex-shrink-0`}>
           <Icon className={`${iconColor} w-4 h-4`} />
         </div>
         <p className="text-[12px] font-semibold text-[#334155] tracking-tight leading-tight w-20">{title}</p>
      </div>
      {!loading && trend && (
         <div className="text-right">
           <span className={`text-[10px] font-bold tracking-tight ${trendUp ? 'text-[#15803D]' : 'text-[#B91C1C]'}`}>
             {trendUp ? '+' : '-'}{trend}
           </span>
         </div>
      )}
    </div>
    
    <div className="mt-3">
       <h3 className="text-2xl lg:text-[28px] font-bold text-[#1E40AF] leading-none">
         {loading ? <span className="animate-pulse text-slate-200">•••</span> : (value ?? '0')}
       </h3>
    </div>

    <div className="flex items-end justify-between mt-auto">
      <p className="text-[11px] text-[#334155] font-medium truncate pr-2 max-w[60%]">{subtitle}</p>
      
      {!loading && (
        <div className="w-12 h-6 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dummyTrendData(trendUp)}>
              <Line type="monotone" dataKey="value" stroke={trendUp ? '#15803D' : '#B91C1C'} strokeWidth={1.5} dot={false} isAnimationActive={false} />
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
    { title: "Total Students", value: (summary.totalActiveStudents || 0).toLocaleString(), subtitle: "Active", icon: Users, iconBg: "bg-[#DBEAFE]", iconColor: "text-[#1E40AF]", trend: "4.2%", trendUp: true, actionType: "STUDENTS" },
    { title: "New Admissions", value: (studentStats.newAdmissions || 0).toLocaleString(), subtitle: "This year", icon: UserPlus, iconBg: "bg-[#DBEAFE]", iconColor: "text-[#1E40AF]", trend: "12.5%", trendUp: true, actionType: "STUDENTS" },
    { title: "Attendance Today", value: `${(studentStats.todayAttendancePercentage || 0).toFixed(1)}%`, subtitle: "vs yesterday", icon: Calendar, iconBg: "bg-[#DBEAFE]", iconColor: "text-[#1E40AF]", trend: "1.2%", trendUp: false, actionType: "ATTENDANCE" },
    { title: "Total Staff", value: ((hrStats.totalTeachingStaff || 0) + (hrStats.totalNonTeachingStaff || 0)).toLocaleString(), subtitle: "Active", icon: UserCheck, iconBg: "bg-[#DBEAFE]", iconColor: "text-[#1E40AF]", trend: "3.1%", trendUp: true, actionType: "HR" },
    { title: "Revenue (This Month)", value: `₹ ${(financeStats.revenueThisMonth || 0).toLocaleString()}`, subtitle: "vs last month", icon: IndianRupee, iconBg: "bg-[#DBEAFE]", iconColor: "text-[#1E40AF]", trend: "18.6%", trendUp: true, actionType: "FINANCE" },
    { title: "Outstanding Fees", value: `₹ ${(financeStats.outstandingFees || 0).toLocaleString()}`, subtitle: "vs last month", icon: AlertCircle, iconBg: "bg-[#DBEAFE]", iconColor: "text-[#1E40AF]", trend: "6.8%", trendUp: false, actionType: "FINANCE" },
    { title: "Active Vehicles", value: `${opsStats.activeVehicles || 0} / ${(opsStats.activeVehicles || 0) + (opsStats.vehiclesUnderMaintenance || 0)}`, subtitle: `${opsStats.vehiclesUnderMaintenance || 0} under maintenance`, icon: Bus, iconBg: "bg-[#DBEAFE]", iconColor: "text-[#1E40AF]", trend: "0.0%", trendUp: true, actionType: "TRANSPORT" },
    { title: "Hostel Occupancy", value: `${(opsStats.hostelOccupancy || 0).toFixed(1)}%`, subtitle: "Occupied", icon: Home, iconBg: "bg-[#DBEAFE]", iconColor: "text-[#1E40AF]", trend: "1.0%", trendUp: true, actionType: "HOSTEL" },
  ];

  return (
    <div className="flex overflow-x-auto gap-5 mb-6 pb-2 lg:pb-0 lg:grid lg:grid-cols-4 2xl:grid-cols-8 lg:overflow-visible hide-scrollbar" role="region" aria-label="Executive KPI Strip">
      {kpiData.map((kpi, idx) => (
        <StatCard key={idx} {...kpi} loading={loading} onClick={() => onCardClick && onCardClick(kpi.actionType)} />
      ))}
    </div>
  );
};

export default React.memo(KPIStatsGrid);
