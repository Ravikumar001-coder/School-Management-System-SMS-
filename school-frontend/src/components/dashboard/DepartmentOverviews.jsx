import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Landmark, Truck, ArrowUp, ArrowDown } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const OverviewCard = ({ title, icon: Icon, onViewAll, children }) => {
  return (
    <div className="bg-white rounded-[16px] border border-[#f1f5f9] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] p-5 flex flex-col h-[280px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
            <Icon size={16} className="text-slate-600" />
          </div>
          <h3 className="text-xs font-black text-slate-800">{title}</h3>
        </div>
        <button onClick={onViewAll} className="text-[10px] font-bold text-blue-600 hover:text-blue-800 transition-colors">View All</button>
      </div>
      <div className="flex-1 flex flex-col pt-2 min-h-0 border-t border-slate-50">
        {children}
      </div>
    </div>
  );
};

const StatRow = ({ label, value, trend, isGood = true }) => (
  <div className="flex justify-between items-center py-2 min-h-[36px]">
    <span className="text-[11px] font-bold text-slate-500">{label}</span>
    <div className="flex items-center gap-2">
      <span className="text-xs font-black text-slate-800">{value}</span>
      {trend && (
         <span className={`flex items-center text-[9px] font-black ${isGood ? 'text-emerald-500' : 'text-rose-500'}`}>
            {isGood ? <ArrowUp size={10} /> : <ArrowDown size={10} />}{trend}
         </span>
      )}
    </div>
  </div>
);

const DepartmentOverviews = ({ stats, loading, onActionClick }) => {
  const navigate = useNavigate();

  if (loading) {
     return <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
       {[1,2,3,4].map(i => <div key={i} className="h-[280px] bg-white rounded-[16px] border border-[#f1f5f9] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] animate-pulse" />)}
     </div>;
  }

  const studentStats = stats?.students || {};
  const hrStats = stats?.hr || {};
  const financeStats = stats?.finance || {};
  const opsStats = stats?.operations || {};
  const summary = stats?.summary || {};

  const classDist = studentStats.classWiseDistribution || {};
  const pieColors = ['#2563eb', '#f59e0b', '#10b981', '#6366f1', '#ec4899', '#8b5cf6'];
  const pieData = Object.keys(classDist).length > 0 
    ? Object.keys(classDist).map((key, i) => ({
        name: key,
        value: classDist[key],
        color: pieColors[i % pieColors.length]
      }))
    : [
        { name: 'Primary (1-5)', value: 1250, color: '#2563eb' },
        { name: 'Middle (6-8)', value: 1180, color: '#f59e0b' },
        { name: 'Secondary (9-10)', value: 1420, color: '#10b981' },
        { name: 'Higher Sec (11-12)', value: 1432, color: '#6366f1' },
      ];

  const teaching = hrStats.totalTeachingStaff || 0;
  const nonTeaching = hrStats.totalNonTeachingStaff || 0;
  const totalStaff = teaching + nonTeaching;
  const presentStaff = Math.round(totalStaff * ((hrStats.todayAttendancePercentage || 0) / 100));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
      <OverviewCard title="Academic Overview" icon={BookOpen} onViewAll={() => navigate('/admin/classes')}>
         <div className="flex-1 flex flex-col justify-between">
            <StatRow label="Total Classes" value="152" />
            <StatRow label="Exams Conducted" value="18" />
            <StatRow label="Pass Percentage" value="88.5%" isGood={true} trend="1.2%" />
            <div className="mt-3 flex items-center justify-between">
              <div className="w-16 h-16 relative">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie data={pieData} cx="50%" cy="50%" innerRadius={18} outerRadius={30} dataKey="value" stroke="none">
                         {pieData.map((e,i) => <Cell key={`cell-${i}`} fill={e.color}/>)}
                       </Pie>
                    </PieChart>
                 </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-1 pr-2 text-right">
                 <span className="text-[9px] font-black text-slate-400 uppercase">Students by Class</span>
                 <span className="text-xs font-black text-slate-800">{(summary.totalActiveStudents || 0).toLocaleString()}</span>
              </div>
            </div>
         </div>
         <div className="mt-2 flex gap-2">
            <button onClick={() => onActionClick && onActionClick('CREATE_EXAM')} className="flex-1 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-lg hover:bg-blue-100 transition-colors">Create Exam</button>
         </div>
      </OverviewCard>

      <OverviewCard title="HR Overview" icon={Users} onViewAll={() => navigate('/admin/teachers')}>
         <div className="flex flex-col h-full justify-between">
              <StatRow label="Teaching Staff" value={teaching.toLocaleString()} />
              <StatRow label="Non-Teaching Staff" value={nonTeaching.toLocaleString()} />
              <StatRow label="Present Today" value={`${presentStaff.toLocaleString()} (${hrStats.todayAttendancePercentage || 0}%)`} />
              <StatRow label="On Leave Today" value={hrStats.onLeaveToday || 0} />
              
              <div className="mt-auto pt-3 border-t border-slate-50 flex items-center justify-between bg-slate-50/50 p-2 rounded-xl mb-2">
                 <div>
                    <p className="text-[10px] font-bold text-slate-500">Upcoming Payroll</p>
                    <p className="text-[8px] font-bold text-slate-400">Expected on 30 Apr 2024</p>
                 </div>
                 <p className="text-sm font-black text-slate-800">₹ {(hrStats.upcomingPayroll || 3200000).toLocaleString()}</p>
              </div>
         </div>
         <div className="flex gap-2">
            <button onClick={() => onActionClick && onActionClick('RUN_PAYROLL')} className="flex-1 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-lg hover:bg-emerald-100 transition-colors">Run Payroll</button>
            <button onClick={() => onActionClick && onActionClick('ADD_STAFF')} className="flex-1 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-lg hover:bg-indigo-100 transition-colors">Add Staff</button>
         </div>
      </OverviewCard>

      <OverviewCard title="Finance Overview" icon={Landmark} onViewAll={() => navigate('/admin/fees')}>
         <div className="flex flex-col h-full justify-between pb-1">
              <StatRow label="Fees Collected" value={`₹ ${(financeStats.revenueThisMonth || 0).toLocaleString()}`} trend="18.6%" isGood={true} />
              <StatRow label="Outstanding Fees" value={`₹ ${(financeStats.outstandingFees || 0).toLocaleString()}`} trend="6.8%" isGood={false} />
              <StatRow label="Total Expenses" value={`₹ ${(financeStats.monthlyExpense || 0).toLocaleString()}`} />
              <StatRow label="Cash in Hand" value={`₹ ${(financeStats.revenueThisMonth ? financeStats.revenueThisMonth * 0.4 : 1275430).toLocaleString()}`} />
              <StatRow label="Net Profit / (Loss)" value={`₹ ${(financeStats.netProfit || 0).toLocaleString()}`} trend="9.5%" isGood={true} />
         </div>
         <div className="mt-2 flex gap-2">
            <button onClick={() => onActionClick && onActionClick('COLLECT_FEES')} className="flex-1 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-lg hover:bg-emerald-100 transition-colors">Collect Fees</button>
            <button onClick={() => onActionClick && onActionClick('ADD_EXPENSE')} className="flex-1 py-1.5 bg-amber-50 text-amber-600 text-[10px] font-bold rounded-lg hover:bg-amber-100 transition-colors">Add Expense</button>
         </div>
      </OverviewCard>

      <OverviewCard title="Operations Overview" icon={Truck} onViewAll={() => navigate('/admin/transport/dashboard')}>
         <div className="flex flex-col h-full justify-between pb-2">
              <StatRow label="Active Vehicles" value={`${opsStats.activeVehicles || 0} / ${(opsStats.activeVehicles || 0) + (opsStats.vehiclesUnderMaintenance || 0)}`} />
              <StatRow label="Hostel Occupancy" value={`${opsStats.hostelOccupancy || 0}%`} />
              <StatRow label="Maintenance Requests" value={opsStats.maintenanceRequests || 0} />
              <StatRow label="Inventory Alerts" value={opsStats.inventoryAlerts || 0} />
              <StatRow label="Security Incidents" value={opsStats.securityIncidents || 0} />
         </div>
         <div className="mt-2 flex gap-2">
            <button onClick={() => onActionClick && onActionClick('REGISTER_VEHICLE')} className="flex-1 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-lg hover:bg-blue-100 transition-colors">Add Vehicle</button>
            <button onClick={() => onActionClick && onActionClick('ALLOCATE_HOSTEL')} className="flex-1 py-1.5 bg-purple-50 text-purple-600 text-[10px] font-bold rounded-lg hover:bg-purple-100 transition-colors">Allocate Hostel</button>
         </div>
      </OverviewCard>
    </div>
  );
};

export default React.memo(DepartmentOverviews);