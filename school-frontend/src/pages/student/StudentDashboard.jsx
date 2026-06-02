// src/pages/student/StudentDashboard.jsx
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { dashboardApi } from '../../api/dashboardApi';
import useFetch from '../../hooks/useFetch';
import StatusBadge from '../../components/common/StatusBadge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { BookOpen, Calendar, CreditCard, Award, FileText, Activity } from 'lucide-react';

const gradePoint = (grade) => {
  const map = { 'A+': 4.0, A: 3.8, 'B+': 3.4, B: 3.0, 'C+': 2.6, C: 2.2, D: 1.5, F: 0 };
  return map[(grade || '').toUpperCase()] ?? 0;
};

/**
 * Enterprise Student Dashboard - Unified Backend Integration
 */
const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const studentId = user?.studentId;

  const { data: dashboardData, loading } = useFetch(
    () => studentId ? dashboardApi.student(studentId) : Promise.reject("No student linked"),
    { 
      initialData: { 
        recentMarks: [], 
        upcomingExams: [], 
        payments: [], 
        attendancePercent: 0,
        pendingFeesCount: 0,
        totalPaidFees: 0
      },
      errorMessage: "Unable to load student data."
    }
  );

  const stats = dashboardData?.data || dashboardData;
  const { 
    attendancePercent, 
    recentMarks = [], 
    upcomingExams = [], 
    payments = [], 
    totalPaidFees = 0,
    pendingFeesCount = 0
  } = stats;

  const overallGpa = useMemo(() => {
    if (!recentMarks.length) return 0;
    const total = recentMarks.reduce((sum, m) => sum + gradePoint(m.grade), 0);
    return Math.round((total / recentMarks.length) * 10) / 10;
  }, [recentMarks]);

  // Transform recent marks for the chart
  const chartData = useMemo(() => {
    return recentMarks.map(m => ({
      name: m.subjectName,
      score: Math.round((m.marksObtained / m.totalMarks) * 100),
      grade: m.grade
    })).slice(0, 6); // limit to 6 subjects for display
  }, [recentMarks]);

  const quickActions = [
    { label: 'My Exams', icon: Calendar, path: '/student/exams', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Report Card', icon: Award, path: '/student/report-card', color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Pay Fees', icon: CreditCard, path: '/student/fees', color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Attendance', icon: Activity, path: '/student/attendance', color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <>
      <PageHeader 
        title={`Hello, ${user?.firstName || 'Student'}!`}
        subtitle="Here's a snapshot of your academic performance and school activities."
      />

      {/* Quick Actions Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 animate-fade-in">
        {quickActions.map((action, idx) => (
          <button
            key={idx}
            onClick={() => navigate(action.path)}
            className={`flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all ${action.bg} bg-opacity-50 hover:bg-opacity-100 text-left`}
          >
            <div className={`p-2 rounded-lg bg-white shadow-sm ${action.color}`}>
              <action.icon size={20} />
            </div>
            <div>
              <p className="font-bold text-gray-800 text-sm">{action.label}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">View & Manage</p>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard 
          title="Academic Standing" 
          value={`GPA: ${overallGpa}`} 
          subtitle="Current Term"
          variant="blue" 
          loading={loading}
          icon={() => <Award size={24} className="text-blue-500" />}
          onClick={() => navigate('/student/report-card')}
        />
        <StatCard 
          title="Attendance Rate" 
          value={`${attendancePercent}%`} 
          subtitle="Active Academic Year"
          variant="green" 
          loading={loading}
          icon={() => <Activity size={24} className="text-green-500" />}
          onClick={() => navigate('/student/attendance')}
        />
        <StatCard 
          title="Fee Status" 
          value={pendingFeesCount > 0 ? "Pending" : "Cleared"} 
          subtitle={pendingFeesCount > 0 ? `${pendingFeesCount} Dues Found` : `Paid: ₹${totalPaidFees.toLocaleString()}`}
          variant={pendingFeesCount > 0 ? "red" : "green"} 
          loading={loading}
          icon={() => <CreditCard size={24} className={pendingFeesCount > 0 ? "text-red-500" : "text-green-500"} />}
          onClick={() => navigate('/student/fees')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
        {/* Performance Chart */}
        <div className="card lg:col-span-2 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="card-title mb-0">Recent Performance Overview</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/student/report-card')}>
              View Details
            </Button>
          </div>
          
          <div className="h-[250px] w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="score" name="Score (%)" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center border-2 border-dashed border-gray-100 rounded-xl">
                <p className="text-gray-400 italic text-sm">No performance data available yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6 lg:col-span-1">
          {/* Upcoming Schedule */}
          <div className="card shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={18} className="text-gray-400" />
              <h3 className="card-title mb-0">Upcoming Schedule</h3>
            </div>
            <div className="space-y-3">
              {upcomingExams.slice(0, 3).map((exam, i) => {
                const dateObj = new Date(exam.examDate);
                const month = isNaN(dateObj) ? '---' : dateObj.toLocaleDateString('en-US', { month: 'short' });
                const date = isNaN(dateObj) ? '-' : dateObj.getDate();
                return (
                  <div key={i} className="flex gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="flex flex-col items-center justify-center px-3 py-1 bg-white rounded-lg shadow-sm border border-gray-50 min-w-[3.5rem]">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">{month}</span>
                      <span className="text-sm font-black text-gray-800">{date}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-800 leading-tight truncate">{exam.name}</p>
                      <p className="text-xs text-gray-500 mt-1 truncate">{exam.subjectName}</p>
                    </div>
                  </div>
                );
              })}
              {!upcomingExams.length && <p className="text-center py-4 text-gray-400 italic text-sm">No upcoming exams.</p>}
            </div>
          </div>

          {/* Recent Payments */}
          <div className="card shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={18} className="text-gray-400" />
              <h3 className="card-title mb-0">Recent Ledger</h3>
            </div>
            <div className="space-y-3">
              {payments.slice(0, 3).map((p, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-white shadow-sm hover:border-gray-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${p.status === 'PAID' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                      <CreditCard size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800">{p.month}</p>
                      <p className="text-[10px] text-gray-400">Due: {p.dueDate}</p>
                    </div>
                  </div>
                  <StatusBadge 
                    status={p.status} 
                    variant={p.status === 'PAID' ? 'green' : 'yellow'} 
                    className="!text-[9px] !px-2 !py-0.5" 
                  />
                </div>
              ))}
              {!payments.length && <p className="text-center py-4 text-gray-400 italic text-xs">No transactions.</p>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;
