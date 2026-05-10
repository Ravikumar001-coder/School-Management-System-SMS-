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

  return (
    <>
      <PageHeader 
        title={`Hello, ${user?.firstName || 'Student'}!`}
        subtitle="Here's a snapshot of your academic performance and school activities."
        actions={
          <div className="flex gap-2">
            <Button variant="primary" size="sm" onClick={() => navigate('/student/exams')}>
              My Schedule
            </Button>
            <Button variant="secondary" size="sm" onClick={() => navigate('/student/report-card')}>
              Report Card
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Academic Standing" 
          value={`GPA: ${overallGpa}`} 
          subtitle="Current Term"
          variant="blue" 
          loading={loading}
          icon={() => <span>📊</span>}
          onClick={() => navigate('/student/report-card')}
        />
        <StatCard 
          title="Attendance Rate" 
          value={`${attendancePercent}%`} 
          subtitle="Active Academic Year"
          variant="green" 
          loading={loading}
          icon={() => <span>📅</span>}
          onClick={() => navigate('/student/attendance')}
        />
        <StatCard 
          title="Fee Status" 
          value={pendingFeesCount > 0 ? "Pending" : "Cleared"} 
          subtitle={pendingFeesCount > 0 ? `${pendingFeesCount} Dues Found` : `Paid: ₹${totalPaidFees.toLocaleString()}`}
          variant={pendingFeesCount > 0 ? "red" : "green"} 
          loading={loading}
          icon={() => <span>💰</span>}
          onClick={() => navigate('/student/fees')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in">
        <div className="card lg:col-span-1">
          <h3 className="card-title mb-4">Upcoming Schedule</h3>
          <div className="space-y-4">
            {upcomingExams.map((exam, i) => (
              <div key={i} className="p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-blue-50 transition-colors">
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{exam.examDate}</p>
                <p className="text-sm font-bold text-gray-800 mt-1">{exam.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{exam.subjectName}</p>
              </div>
            ))}
            {!upcomingExams.length && <p className="text-center py-8 text-gray-400 italic text-sm">No upcoming exams.</p>}
          </div>
        </div>

        <div className="card lg:col-span-2">
          <h3 className="card-title mb-4">Recent Exam Results</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-widest font-black">
                <tr>
                  <th className="px-4 py-3 text-left">Exam / Subject</th>
                  <th className="px-4 py-3 text-center">Score</th>
                  <th className="px-4 py-3 text-right">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentMarks.map((m, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-4">
                      <p className="font-bold text-gray-800">{m.examName}</p>
                      <p className="text-xs text-gray-400">{m.subjectName}</p>
                    </td>
                    <td className="px-4 py-4 text-center font-medium text-gray-600">
                      {m.marksObtained} / {m.totalMarks}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <StatusBadge status={m.grade} variant={gradePoint(m.grade) >= 3 ? 'green' : 'red'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!recentMarks.length && <p className="text-center py-12 text-gray-400 italic text-sm">No results available yet.</p>}
          </div>
        </div>

        <div className="card lg:col-span-1">
          <h3 className="card-title mb-4">Financial Status</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Total Paid</p>
              <p className="text-2xl font-black text-indigo-700 mt-1">₹{Number(totalPaidFees || 0).toLocaleString()}</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Recent Ledger</p>
              {payments.map((p, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-white">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-800 truncate">{p.month}</p>
                    <p className="text-[10px] text-gray-400">{p.dueDate}</p>
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

            <Button 
              variant="outline" 
              className="w-full !rounded-xl !text-xs !uppercase !tracking-widest !font-bold"
              onClick={() => navigate('/student/fees')}
            >
              View Ledger
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;
