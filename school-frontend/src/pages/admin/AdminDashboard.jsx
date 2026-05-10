import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  Users, Shield, Landmark, Network, ArrowUpRight, 
  RefreshCw, MessageSquare, Heart, CheckCircle2 
} from 'lucide-react';
import { dashboardApi } from '../../api/dashboardApi';
import useFetch from '../../hooks/useFetch';

const trendData = [
  { month: 'Jan', revenue: 50, attendance: 50 },
  { month: 'Feb', revenue: 240, attendance: 200 },
  { month: 'Mar', revenue: 330, attendance: 240 },
  { month: 'Apr', revenue: 500, attendance: 450 },
  { month: 'May', revenue: 540, attendance: 500 },
  { month: 'Jun', revenue: 730, attendance: 350 },
];

const pieData = [
  { name: 'Basic', value: 30, color: '#2563eb' },
  { name: 'Studsity', value: 20, color: '#312e81' },
  { name: 'Enrollment', value: 15, color: '#8b5cf6' },
  { name: 'Enroroments', value: 10, color: '#a78bfa' },
  { name: 'Department', value: 15, color: '#14b8a6' },
  { name: 'Nocilling', value: 5, color: '#64748b' },
  { name: 'Others', value: 5, color: '#cbd5e1' },
];

const StatCard = ({ title, value, subtitle, icon: Icon, iconBg, iconColor, trend, extra, onClick, loading }) => (
  <div onClick={onClick} className={`bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between transition-all ${onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : ''}`}>
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}>
        <Icon size={24} className={iconColor} />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-500 mb-0.5">{title}</p>
        <div className="flex items-center gap-2">
           <h3 className="text-2xl font-bold text-slate-900">
             {loading ? <span className="animate-pulse text-slate-200">•••</span> : (value ?? '0')}
           </h3>
           {!loading && trend && (
             <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
               <ArrowUpRight size={10}/>{trend}
             </span>
           )}
        </div>
        <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold mt-1">{subtitle}</p>
      </div>
    </div>
    {extra && !loading && <div className="hidden xl:block">{extra}</div>}
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();

  const { data: stats, loading } = useFetch(dashboardApi.admin, {
    initialData: {},
    errorMessage: "Unable to refresh dashboard stats."
  });

  const totalStudents = stats?.totalStudents?.toLocaleString();
  const totalTeachers = stats?.totalTeachers?.toLocaleString();
  const totalClasses = stats?.totalClasses?.toLocaleString();
  const totalDepartments = stats?.totalDepartments?.toString();

  const dynamicTrends = stats?.trends?.length > 0 ? stats.trends : trendData;
  
  const dynamicPie = stats?.enrollmentByDepartment && Object.keys(stats.enrollmentByDepartment).length > 0
    ? Object.entries(stats.enrollmentByDepartment).map(([name, value], i) => ({
        name, value, color: pieData[i % pieData.length].color
      }))
    : pieData;

  const dynamicDeadlines = stats?.upcomingDeadlines?.length > 0 ? stats.upcomingDeadlines : [
    { title: 'Term 1 Fee Submission', lastDate: '30 Aug 2024', deadlineText: 'End of Month' },
    { title: 'Half-Yearly Exams', lastDate: '15 Sep 2024', deadlineText: 'Next Term' }
  ];

  const dynamicActivity = stats?.recentActivity?.length > 0 ? stats.recentActivity : [
    {
      user: "System", avatar: "S", message: "Annual academic calendar updated successfully.",
      timestamp: "1 hour ago", isSystem: true
    },
    {
      user: "ADMIN-001", avatar: "A", message: "Approved outstanding fee waivers.",
      timestamp: "2 hours ago", isSystem: false
    }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-100 shadow-xl rounded-xl text-xs font-bold">
          <p className="text-slate-500 mb-2">{label}</p>
          <p className="text-blue-600">Revenue: ₹{payload[0].value}K</p>
          <p className="text-emerald-500">Attendance: {payload[1].value}K</p>
        </div>
      );
    }
    return null;
  };

  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <ul className="space-y-2">
        {payload.map((entry, index) => (
          <li key={`item-${index}`} className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
            {entry.value}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="animate-fade-in -mt-2">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Root Admin Overview</h1>
      </div>

      {/* 1. KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Students"
          value={totalStudents}
          subtitle="Enrolled Learners"
          icon={Users}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
          trend="+3%"
          loading={loading}
          onClick={() => navigate('/admin/students')}
          extra={
            <svg width="60" height="30" viewBox="0 0 60 30" fill="none">
              <path d="M0 25C10 25 15 10 25 15C35 20 40 5 60 5" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round"/>
              <path d="M0 25C10 25 15 10 25 15C35 20 40 5 60 5L60 30H0V25Z" fill="url(#paint0_linear)"/>
              <defs>
                <linearGradient id="paint0_linear" x1="30" y1="5" x2="30" y2="30" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#4f46e5" stopOpacity="0.2"/>
                  <stop offset="1" stopColor="#4f46e5" stopOpacity="0"/>
                </linearGradient>
              </defs>
            </svg>
          }
        />
        <StatCard
          title="Total Teachers"
          value={totalTeachers}
          subtitle="Active Faculty"
          icon={Shield}
          iconBg="bg-rose-50"
          iconColor="text-rose-500"
          loading={loading}
          onClick={() => navigate('/admin/teachers')}
        />
        <StatCard
          title="Total Classes"
          value={totalClasses}
          subtitle="Academic Units"
          icon={Landmark}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          loading={loading}
          onClick={() => navigate('/admin/classes')}
        />
        <StatCard
          title="Total Departments"
          value={totalDepartments}
          subtitle="Resource Units"
          icon={Network}
          iconBg="bg-blue-50"
          iconColor="text-blue-500"
          loading={loading}
          onClick={() => navigate('/admin/departments')}
        />
      </div>

      {/* 2. Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-slate-800">Attendance & Revenue Trends (6 Months)</h3>
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] uppercase tracking-widest font-bold px-4 py-2 rounded-lg transition-colors shadow-sm">
              Generate Report
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dynamicTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} tickFormatter={(val) => `₹${val}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" activeDot={{ r: 6 }} />
                <Area type="monotone" dataKey="attendance" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorAttendance)" activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-bold text-slate-800">Student Enrollment by Department</h3>
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-lg transition-colors shadow-sm">
              Generate Report
            </button>
          </div>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dynamicPie}
                  cx="40%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {dynamicPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend content={renderLegend} layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ right: 0 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. Bottom Row Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Deadlines */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Upcoming Deadlines</h3>
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-widest font-black text-slate-500">
              <tr>
                <th className="py-3 px-3 rounded-l-xl">Event</th>
                <th className="py-3 px-3">Last Date</th>
                <th className="py-3 px-3 rounded-r-xl">Deadline</th>
              </tr>
            </thead>
            <tbody className="text-xs font-semibold text-slate-700">
              {dynamicDeadlines.map((evt, idx) => (
                <tr key={idx} className="border-b border-slate-50 last:border-0">
                  <td className="py-4 px-3">{evt.title}</td>
                  <td className="py-4 px-3">{evt.lastDate}</td>
                  <td className="py-4 px-3">{evt.deadlineText}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* System Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-800">System Activity</h3>
            <a href="#" className="text-[10px] text-blue-600 font-bold hover:underline">View all</a>
          </div>
          <div className="space-y-5">
            {dynamicActivity.map((act, idx) => (
              <div key={idx} className="flex gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold ${act.user === 'System' ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                  {act.user === 'System' ? <Network size={18} className="text-white" /> : act.avatar}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">{act.message}</p>
                  <p className="text-[10px] text-slate-500 font-medium mt-1">{act.timestamp || 'Just now'}</p>
                  {act.user === 'System' && (
                    <div className="flex gap-3 mt-2 text-slate-400">
                      <RefreshCw size={14} className="hover:text-blue-500 cursor-pointer" />
                      <MessageSquare size={14} className="hover:text-blue-500 cursor-pointer" />
                      <Heart size={14} className="hover:text-rose-500 cursor-pointer" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Admit New Student', icon: Users, route: '/admin/students/new' },
              { label: 'Assign Teacher', icon: Shield, route: '/admin/teachers/new' },
              { label: 'Mark Attendance', icon: Users, route: '/admin/attendance' },
              { label: 'Create Exam', icon: Shield, route: '/admin/exams/new' },
              { label: 'Collect Fee Dues', icon: CheckCircle2, route: '/admin/fees/collect' }
            ].map((action, i) => (
              <button key={i} onClick={() => navigate(action.route)} className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 transition-colors p-3 rounded-xl border border-slate-100 text-left">
                <action.icon size={16} className="text-slate-500 flex-shrink-0" />
                <span className="text-[11px] font-bold text-slate-700 leading-tight">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;