import React, { useState, useEffect } from 'react';
import { FiBarChart2, FiTrendingUp, FiActivity, FiPieChart, FiArrowRight } from 'react-icons/fi';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#3B82F6', '#EF4444', '#8B5CF6'];

const TeacherReports = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ attendanceTrend: [], gradeDistribution: {} });

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/teacher/analytics/summary');
        setData(res.data?.data || {});
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div className="p-20"><LoadingSpinner /></div>;

  const pieData = Object.entries(data.gradeDistribution || {}).map(([name, value]) => ({ name, value }));

  return (
    <div className="p-4 lg:p-8 space-y-8 lg:space-y-12 animate-fade-in pb-24 lg:pb-8">
      <div>
         <h1 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tight">Performance Analytics</h1>
         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Data-Driven Classroom Insight Engine</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Classes Analyzed', val: '08', icon: <FiActivity />, col: 'text-emerald-600', bg: 'bg-emerald-50' },
           { label: 'Total Assessments', val: '24', icon: <FiTrendingUp />, col: 'text-blue-600', bg: 'bg-blue-50' },
           { label: 'Class Average', val: '72%', icon: <FiBarChart2 />, col: 'text-indigo-600', bg: 'bg-indigo-50' },
           { label: 'Risk Students', val: '04', icon: <FiPieChart />, col: 'text-rose-600', bg: 'bg-rose-50' },
         ].map((s, i) => (
           <div key={i} className="bg-white rounded-[2rem] p-6 lg:p-8 border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
              <div className={`${s.bg} ${s.col} w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner`}>{s.icon}</div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                 <p className="text-2xl font-black text-slate-900 leading-none">{s.val}</p>
              </div>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Attendance Trend */}
         <div className="bg-white rounded-[2.5rem] p-8 lg:p-10 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-10">
               <h3 className="text-xl font-black text-slate-900">30-Day Attendance Trend</h3>
               <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">Detail <FiArrowRight /></button>
            </div>
            <div className="h-72">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.attendanceTrend}>
                    <defs>
                      <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 700}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 700}} />
                    <Tooltip 
                      contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 900}}
                    />
                    <Area type="monotone" dataKey="val" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Grade Distribution */}
         <div className="bg-white rounded-[2.5rem] p-8 lg:p-10 border border-slate-100 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 mb-10">Grade Distribution</h3>
            <div className="h-72 flex items-center">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend iconType="circle" wrapperStyle={{paddingTop: '20px', fontWeight: 700}} />
                  </PieChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>

      {/* Subject Performance */}
      <div className="bg-white rounded-[2.5rem] p-8 lg:p-10 border border-slate-100 shadow-sm">
         <h3 className="text-xl font-black text-slate-900 mb-10">Class Performance Benchmark</h3>
         <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={data.attendanceTrend?.slice(-5)}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 700}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 700}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} />
                  <Bar dataKey="val" fill="#4F46E5" radius={[6, 6, 0, 0]} barSize={40} />
               </BarChart>
            </ResponsiveContainer>
         </div>
      </div>
    </div>
  );
};

export default TeacherReports;
