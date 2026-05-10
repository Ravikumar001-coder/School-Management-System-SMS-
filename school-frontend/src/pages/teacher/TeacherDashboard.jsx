// src/pages/teacher/TeacherDashboard.jsx
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiBook, FiCalendar, FiActivity, FiArrowRight, FiCheckCircle, FiClock, FiMessageSquare } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/common/StatCard';
import Button from '../../components/common/Button';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import useFetch from '../../hooks/useFetch';
import { dashboardApi } from '../../api/dashboardApi';

/**
 * Enterprise Teacher Dashboard - Unified Backend Integration
 */
const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const teacherId = user?.teacherId;

  const { data: dashboardData, loading } = useFetch(
    () => teacherId ? dashboardApi.teacher(teacherId) : Promise.reject("No teacher record linked."),
    { 
      initialData: { 
        totalStudents: 0, 
        assignedClassesCount: 0, 
        attendanceRate: 0, 
        upcomingExamsCount: 0,
        exams: [],
        assignedClasses: []
      },
      errorMessage: "Failed to sync teacher dashboard."
    }
  );

  const stats = dashboardData?.data || dashboardData;
  const {
    totalStudents,
    assignedClassesCount,
    attendanceRate,
    upcomingExamsCount,
    exams = [],
    assignedClasses = []
  } = stats;

  const mockPerformanceData = [
    { name: 'Mon', score: 65 },
    { name: 'Tue', score: 72 },
    { name: 'Wed', score: 68 },
    { name: 'Thu', score: 85 },
    { name: 'Fri', score: 78 },
  ];

  return (
    <>
      <div className="animate-fade-in space-y-8">
        
        <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-indigo-700 via-purple-700 to-indigo-900 p-1 shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative bg-white/5 backdrop-blur-xl rounded-[1.9rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner border border-white/20">
                🎓
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                  Welcome, <span className="text-indigo-200">{user?.firstName || 'Teacher'}</span>
                </h1>
                <p className="text-indigo-100/80 mt-1 font-medium flex items-center gap-2">
                  <FiCalendar /> {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="white"
                onClick={() => navigate('/teacher/attendance')}
                className="!text-indigo-700 !rounded-2xl !px-8 !py-4 shadow-xl"
                icon={FiCheckCircle}
              >
                Mark Attendance
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard 
            title="My Students" 
            value={totalStudents} 
            variant="blue" 
            loading={loading}
            icon={FiUsers}
            onClick={() => navigate('/teacher/students')}
          />
          <StatCard 
            title="Classes" 
            value={assignedClassesCount} 
            variant="purple" 
            loading={loading}
            icon={FiBook}
            onClick={() => navigate('/teacher/attendance')}
          />
          <StatCard 
            title="Today's Attendance" 
            value={`${attendanceRate}%`} 
            variant="green" 
            loading={loading}
            icon={FiActivity}
          />
          <StatCard 
            title="Exams Scheduled" 
            value={upcomingExamsCount} 
            variant="yellow" 
            loading={loading}
            icon={FiCalendar}
            onClick={() => navigate('/teacher/exams')}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            <div className="card">
              <h3 className="card-title mb-6">Class Engagement Trend</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockPerformanceData}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={10} />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                      cursor={{ stroke: '#6366f1', strokeWidth: 2 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#6366f1" 
                      strokeWidth={4} 
                      dot={{ r: 6, fill: '#6366f1', strokeWidth: 3, stroke: '#fff' }} 
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card">
              <h3 className="card-title !flex items-center gap-2 mb-6">
                <FiClock className="text-indigo-500" /> Upcoming Class Sessions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {exams.map(exam => (
                  <div key={exam.id} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-indigo-50 transition-all cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex flex-col items-center justify-center font-bold text-indigo-600">
                         <span className="text-[10px] uppercase opacity-40">Date</span>
                         <span className="text-[9px]">{exam.examDate.split('-').slice(1).join('/')}</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">{exam.subjectName}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{exam.className}</p>
                      </div>
                    </div>
                    <FiArrowRight className="text-gray-300 group-hover:text-indigo-500 transition-colors" />
                  </div>
                ))}
                {!exams.length && <p className="text-sm text-gray-400 py-4 italic text-center col-span-2">No exams scheduled.</p>}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="card">
               <h3 className="card-title mb-6">Quick Actions</h3>
               <div className="space-y-3">
                 <Button variant="outline" className="w-full !justify-start !gap-3 !rounded-2xl" onClick={() => navigate('/teacher/attendance')}>
                   <FiCheckCircle className="text-green-500" /> Mark Attendance
                 </Button>
                 <Button variant="outline" className="w-full !justify-start !gap-3 !rounded-2xl" onClick={() => navigate('/teacher/exams')}>
                   <FiBook className="text-blue-500" /> Manage Results
                 </Button>
                 <Button variant="outline" className="w-full !justify-start !gap-3 !rounded-2xl" onClick={() => navigate('/teacher/students')}>
                   <FiUsers className="text-purple-500" /> Student Directory
                 </Button>
               </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group">
               <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
               <h3 className="text-white font-black text-xl mb-3 relative z-10">Academic Support</h3>
               <p className="text-gray-400 text-xs mb-6 relative z-10 leading-relaxed">Access teaching resources, curriculum maps, and faculty guidelines.</p>
               <Button 
                 variant="white"
                 className="w-full !rounded-2xl !py-4 !font-black !text-xs !uppercase !tracking-widest shadow-lg relative z-10 hover:!scale-105"
               >
                  Resource Hub
               </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeacherDashboard;
