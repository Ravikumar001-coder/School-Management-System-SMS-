import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiCheckCircle, FiBook, FiUsers, FiActivity, FiArrowRight, 
  FiClock, FiTrendingUp, FiTrendingDown, FiBell, FiMoreVertical,
  FiFileText, FiPlus, FiX
} from 'react-icons/fi';
import { LineChart, Line, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AddTodoModal from '../../components/teachers/AddTodoModal';
import { FiEdit2 } from 'react-icons/fi';

// --- MOCK DATA FOR MISSING APIs ---
const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'exam', title: 'Exam schedule published', desc: 'Unit Test 1 - Grade 10', time: '10m ago' },
  { id: 2, type: 'homework', title: 'Homework pending review', desc: '10-A • Algebra', time: '1h ago' },
  { id: 3, type: 'fee', title: 'Fee reminder sent', desc: 'for 12 students', time: '2h ago' }
];

const MOCK_TODOS = [
  { id: 1, title: 'Enter marks for Unit Test 1', priority: 'high', completed: false },
  { id: 2, title: 'Review 5 leave applications', priority: 'medium', completed: false },
  { id: 3, title: 'Publish diary entries', priority: 'low', completed: true }
];

const MOCK_PERFORMANCE_TREND = [
  { day: 'Mon', val: 82 }, { day: 'Tue', val: 95 }, { day: 'Wed', val: 88 }, 
  { day: 'Thu', val: 92 }, { day: 'Fri', val: 85 }, { day: 'Sat', val: 97 }
];

const MOCK_TOP_CLASSES = [
  { name: '10-A', val: 95 }, { name: '10-B', val: 89 }, { name: '9-A', val: 82 }
];

// Reusable Sparkline
const Sparkline = ({ data, color }) => (
  <div className="h-10 w-full mt-2">
    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={40} debounce={50}>
      <LineChart data={data}>
        <Line type="monotone" dataKey="val" stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  
  // Real Data State
  const [stats, setStats] = useState({
    totalStudents: 0,
    attendanceRate: 0,
    pendingExams: 0,
    trend: '0%',
    nextClass: { subject: 'Loading...', class: '-', time: '-', room: '-', timeLeft: '-' }
  });
  
  const [timetable, setTimetable] = useState([]);
  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch stats
      const statsRes = await api.get('/teacher/dashboard-stats');
      if (statsRes.data?.data) {
        setStats(prev => ({ ...prev, ...statsRes.data.data }));
      }
      
      // Fetch today's timetable
      const today = new Date().toLocaleString('en-us', {  weekday: 'long' }).toUpperCase();
      const timeRes = await api.get(`/teacher/timetable?day=${today}`);
      if (timeRes.data?.data) {
        setTimetable(timeRes.data.data);
      }
    } catch (error) {
      console.error("Failed to load dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTodo = async (todoId) => {
    try {
      await api.patch(`/teacher/todos/${todoId}/toggle`);
      setStats(prev => ({
        ...prev,
        todos: prev.todos.map(t => t.id === todoId ? { ...t, completed: !t.completed } : t)
      }));
    } catch (err) {
      console.error("Failed to toggle todo", err);
    }
  };

  const handleMarkNotifRead = async (id) => {
    try {
      await api.get(`/teacher/notifications/${id}/read`);
      setStats(prev => ({
        ...prev,
        notifications: prev.notifications.map(n => n.id === id ? { ...n, isRead: true } : n)
      }));
    } catch (err) {
      console.error("Failed to mark read", err);
    }
  };

  const handleAddTodo = async (todoData) => {
    try {
      if (editingTodo) {
        await api.put(`/teacher/todos/${editingTodo.id}`, todoData);
      } else {
        await api.post('/teacher/todos', todoData);
      }
      setIsTodoModalOpen(false);
      setEditingTodo(null);
      fetchDashboardData(); 
    } catch (err) {
      console.error("Failed to save todo", err);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      if (!window.confirm("Delete this task?")) return;
      await api.delete(`/teacher/todos/${id}`);
      setStats(prev => ({
        ...prev,
        todos: prev.todos.filter(t => t.id !== id)
      }));
    } catch (err) {
      console.error("Failed to delete todo", err);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;

  const nextClass = stats?.nextClass || { subject: 'None', class: '-', time: '-', room: '-', timeLeft: '-' };

  // Generate sparkline variations for the cards
  const slData1 = MOCK_PERFORMANCE_TREND.map(d => ({ val: d.val * (0.8 + Math.random()*0.4) }));
  const slData2 = MOCK_PERFORMANCE_TREND.map(d => ({ val: d.val * (0.8 + Math.random()*0.4) }));
  const slData3 = MOCK_PERFORMANCE_TREND.map(d => ({ val: d.val * (0.8 + Math.random()*0.4) }));
  const slData4 = MOCK_PERFORMANCE_TREND.map(d => ({ val: d.val * (0.8 + Math.random()*0.4) }));

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="p-4 lg:p-8 w-full mx-auto space-y-6 lg:space-y-8 animate-fade-in">
      
      {/* ── GREETING CARD (Desktop: Horizontal, Mobile: Vertical Stack) ── */}
      <div className="bg-gradient-to-br from-[#4F46E5] to-[#6366F1] rounded-3xl p-6 lg:p-8 text-white flex flex-col lg:flex-row justify-between lg:items-center shadow-lg shadow-indigo-500/20 relative overflow-hidden">
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-900/20 rounded-full blur-2xl -ml-10 -mb-10"></div>
        
        <div className="relative z-10 mb-6 lg:mb-0">
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mb-2">
            {getGreeting()}, {user?.firstName} <span className="inline-block animate-wave">👋</span>
          </h1>
          <p className="text-indigo-100 text-sm mb-6 lg:mb-8">Here is what's happening at your school today.</p>
          
          <div className="flex flex-wrap gap-3">
             <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2 border border-white/10">
                <FiClock className="text-indigo-200" /> {timetable.length} Classes Today
             </div>
             <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2 border border-white/10">
                <FiUsers className="text-indigo-200" /> {stats.totalStudents} Students
             </div>
          </div>
        </div>

        {/* Next Class Inner Card */}
        <div className="relative z-10 bg-white text-slate-900 rounded-2xl p-5 lg:w-[320px] shadow-xl">
           <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-slate-500">Next Class</span>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">{nextClass.timeLeft}</span>
           </div>
           <h2 className="text-lg font-bold tracking-tight mb-1">{nextClass.class} • {nextClass.subject}</h2>
           <p className="text-sm text-slate-500 mb-5">Room {nextClass.room}</p>
           
           <div className="flex gap-2">
              <button 
                onClick={() => navigate('/teacher/quick-attendance')}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors"
              >
                 Start Attendance &rarr;
              </button>
              <button 
                 onClick={() => navigate('/teacher/diary')}
                 className="px-4 bg-slate-50 hover:bg-slate-100 text-indigo-600 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              >
                 Diary
              </button>
           </div>
        </div>
      </div>

      {/* ── STAT CARDS (Mobile: 4-col grid, Desktop: 4-col grid) ── */}
      <div className="grid grid-cols-4 gap-2 lg:gap-4 pb-0">
        
        {/* Card 1: Students */}
        <div 
          onClick={() => navigate('/teacher/students')}
          className="bg-white p-2 lg:p-5 rounded-2xl lg:rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center lg:items-start text-center lg:text-left cursor-pointer hover:shadow-md transition-all active:scale-95 group"
        >
           <div className="flex flex-col lg:flex-row lg:gap-3 items-center mb-1 lg:mb-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-1 lg:mb-0 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                 <FiUsers className="w-4 h-4 lg:w-5 lg:h-5" />
              </div>
              <div className="text-[9px] lg:text-xs font-bold text-slate-400 leading-tight">Students</div>
           </div>
           <div className="text-sm lg:text-2xl font-bold text-slate-900 lg:mb-1">{stats.totalStudents}</div>
           <div className="hidden lg:flex text-xs font-medium text-purple-600 items-center gap-1 mt-1">
              <FiTrendingUp /> ↑ 4 this month
           </div>
           <div className="hidden lg:block w-full">
              <Sparkline data={stats.attendanceTrend || []} color="#9333EA" />
           </div>
        </div>

        {/* Card 2: Attendance */}
        <div 
          onClick={() => navigate('/teacher/quick-attendance')}
          className="bg-white p-2 lg:p-5 rounded-2xl lg:rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center lg:items-start text-center lg:text-left cursor-pointer hover:shadow-md transition-all active:scale-95 group"
        >
           <div className="flex flex-col lg:flex-row lg:gap-3 items-center mb-1 lg:mb-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1 lg:mb-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                 <FiActivity className="w-4 h-4 lg:w-5 lg:h-5" />
              </div>
              <div className="text-[9px] lg:text-xs font-bold text-slate-400 leading-tight">Avg Attend</div>
           </div>
           <div className="text-sm lg:text-2xl font-bold text-slate-900 lg:mb-1">{stats.attendanceRate}%</div>
           <div className="hidden lg:flex text-xs font-medium text-emerald-600 items-center gap-1 mt-1">
              <FiTrendingUp /> ↑ {stats.trend} this month
           </div>
           <div className="hidden lg:block w-full">
              <Sparkline data={stats.attendanceTrend || []} color="#10B981" />
           </div>
        </div>

        {/* Card 3: Pending Exams */}
        <div 
          onClick={() => navigate('/teacher/exam-papers')}
          className="bg-white p-2 lg:p-5 rounded-2xl lg:rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center lg:items-start text-center lg:text-left cursor-pointer hover:shadow-md transition-all active:scale-95 group"
        >
           <div className="flex flex-col lg:flex-row lg:gap-3 items-center mb-1 lg:mb-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center mb-1 lg:mb-0 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                 <FiFileText className="w-4 h-4 lg:w-5 lg:h-5" />
              </div>
              <div className="text-[9px] lg:text-xs font-bold text-slate-400 leading-tight">Exams</div>
           </div>
           <div className="text-sm lg:text-2xl font-bold text-slate-900 lg:mb-1">{stats.pendingExams}</div>
           <div className="hidden lg:flex text-xs font-medium text-orange-500 items-center gap-1 mt-1">
              <FiTrendingUp /> ↑ 2 this week
           </div>
           <div className="hidden lg:block w-full">
              <Sparkline data={stats.attendanceTrend || []} color="#F59E0B" />
           </div>
        </div>

        {/* Card 4: Diary */}
        <div 
          onClick={() => navigate('/teacher/diary')}
          className="bg-white p-2 lg:p-5 rounded-2xl lg:rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center lg:items-start text-center lg:text-left cursor-pointer hover:shadow-md transition-all active:scale-95 group"
        >
           <div className="flex flex-col lg:flex-row lg:gap-3 items-center mb-1 lg:mb-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center mb-1 lg:mb-0 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                 <FiBook className="w-4 h-4 lg:w-5 lg:h-5" />
              </div>
              <div className="text-[9px] lg:text-xs font-bold text-slate-400 leading-tight">Diary</div>
           </div>
           <div className="text-sm lg:text-2xl font-bold text-slate-900 lg:mb-1">18</div>
           <div className="hidden lg:flex text-xs font-medium text-blue-500 items-center gap-1 mt-1">
              <FiTrendingUp /> ↑ 6 this week
           </div>
           <div className="hidden lg:block w-full">
              <Sparkline data={stats.attendanceTrend || []} color="#3B82F6" />
           </div>
        </div>
      </div>

      {/* ── LOWER SECTION GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
         
         {/* LEFT/MAIN COLUMN (Schedule, Actions, Charts) */}
         <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
               {/* Today's Schedule */}
               <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-6">Today's Schedule</h3>
                  <div className="space-y-0 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                     {timetable.length > 0 ? timetable.map((cls, idx) => (
                        <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active py-4 pl-12 md:pl-0">
                           <div className="md:w-1/2 flex justify-end md:pr-8 text-xs font-bold text-slate-500">
                              {cls.startTime.substring(0,5)} - {cls.endTime.substring(0,5)}
                           </div>
                           <div className="absolute left-0 md:left-1/2 -translate-x-1/2 flex items-center justify-center w-3 h-3 rounded-full bg-slate-200 group-hover:bg-indigo-500 group-hover:scale-150 transition-all shadow-[0_0_0_4px_#fff]"></div>
                           <div className="md:w-1/2 md:pl-8 flex justify-between items-center w-full">
                              <div>
                                 <h4 className="text-sm font-bold text-slate-900">{cls.className} • {cls.subject}</h4>
                                 <p className="text-xs text-slate-500">Room {cls.room}</p>
                              </div>
                              {idx === 0 && <span className="text-[10px] bg-emerald-50 text-emerald-600 font-bold px-2 py-1 rounded-md">Next</span>}
                           </div>
                        </div>
                     )) : (
                        <p className="text-sm text-slate-500 text-center py-4">No classes scheduled for today.</p>
                     )}
                  </div>
                  <button onClick={() => navigate('/teacher/timetable')} className="w-full mt-6 py-3 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors flex items-center justify-between border-t border-slate-50">
                     View Full Timetable <FiArrowRight />
                  </button>
               </div>

               {/* Quick Actions */}
               <div className="bg-transparent lg:bg-white lg:rounded-3xl lg:p-6 lg:border lg:border-slate-100 lg:shadow-sm">
                  <h3 className="hidden lg:block text-lg font-bold text-slate-900 mb-6">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-3 lg:gap-4">
                     <button onClick={() => navigate('/teacher/quick-attendance')} className="bg-emerald-50 hover:bg-emerald-100 transition-colors rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-emerald-600">
                        <FiCheckCircle size={28} />
                        <span className="text-xs font-bold">Mark Attendance</span>
                     </button>
                     <button onClick={() => navigate('/teacher/diary')} className="bg-purple-50 hover:bg-purple-100 transition-colors rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-purple-600">
                        <FiBook size={28} />
                        <span className="text-xs font-bold">Write Diary</span>
                     </button>
                     <button onClick={() => navigate('/teacher/exam-papers')} className="bg-orange-50 hover:bg-orange-100 transition-colors rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-orange-500">
                        <FiFileText size={28} />
                        <span className="text-xs font-bold">Enter Marks</span>
                     </button>
                     <button onClick={() => navigate('/teacher/students')} className="bg-blue-50 hover:bg-blue-100 transition-colors rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-blue-600">
                        <FiUsers size={28} />
                        <span className="text-xs font-bold">My Students</span>
                     </button>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hidden md:block">
               <h3 className="text-lg font-bold text-slate-900 mb-6">Performance Overview</h3>
               <div className="grid grid-cols-2 gap-8">
                  <div>
                     <h4 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">Attendance Trend (Last 7 Days)</h4>
                     <div className="h-40">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={160} debounce={50}>
                           <LineChart data={stats.attendanceTrend || []}>
                              <Line type="monotone" dataKey="val" stroke="#4F46E5" strokeWidth={3} dot={{r:4, fill:"#4F46E5", strokeWidth:2, stroke:"#fff"}} />
                           </LineChart>
                        </ResponsiveContainer>
                     </div>
                  </div>
                  <div>
                     <h4 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">Top Performing Classes</h4>
                     <div className="space-y-4 mt-6">
                        {(stats.topClasses || []).map((cls, i) => (
                           <div key={i}>
                              <div className="flex justify-between text-xs font-bold mb-1">
                                 <span className="text-slate-700">{cls.name}</span>
                                 <span className="text-slate-900">{cls.val}%</span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-2">
                                 <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${cls.val}%` }}></div>
                              </div>
                           </div>
                        ))}
                        {(!stats.topClasses || stats.topClasses.length === 0) && (
                           <p className="text-xs text-slate-400 text-center py-4">No exam data yet.</p>
                        )}
                     </div>
                  </div>
               </div>
            </div>

         </div>

         {/* RIGHT COLUMN (Notifications & ToDos) */}
         <div className="space-y-6 lg:space-y-8">
            
            {/* Notifications */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-slate-900">Recent Notifications</h3>
                  <button className="text-slate-400 hover:text-indigo-600"><FiMoreVertical /></button>
               </div>
               <div className="space-y-5">
                  {(stats.notifications || []).map(notif => (
                     <div key={notif.id} 
                        onClick={() => !notif.isRead && handleMarkNotifRead(notif.id)}
                        className={`flex gap-4 cursor-pointer transition-opacity ${notif.isRead ? 'opacity-50' : 'opacity-100'}`}
                     >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                           notif.type === 'exam' ? 'bg-orange-50 text-orange-500' :
                           notif.type === 'homework' ? 'bg-purple-50 text-purple-500' :
                           'bg-slate-100 text-slate-500'
                        }`}>
                           <FiBell size={18} />
                        </div>
                        <div className="flex-1">
                           <h4 className="text-sm font-bold text-slate-900 leading-tight">{notif.title}</h4>
                           <p className="text-xs text-slate-500 mt-0.5">{notif.desc}</p>
                        </div>
                        <div className="text-[10px] font-bold text-slate-400">{notif.time}</div>
                     </div>
                  ))}
                  {(!stats.notifications || stats.notifications.length === 0) && (
                     <p className="text-xs text-slate-400 text-center py-4">No new notifications</p>
                  )}
               </div>
               <button className="w-full mt-6 py-3 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors flex items-center justify-between border-t border-slate-50">
                  View All Notifications <FiArrowRight />
               </button>
            </div>

            {/* To Do List */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col h-full">
               <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">To Do List</h3>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">Quick Task Manager</p>
                  </div>
                  <button 
                    onClick={() => {
                      setEditingTodo(null);
                      setIsTodoModalOpen(true);
                    }}
                    className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                  >
                    <FiPlus size={16} />
                  </button>
               </div>
               
               <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[300px]">
                  {(stats.todos || []).map(todo => (
                     <div key={todo.id} className="group flex items-center gap-3 p-3 bg-slate-50 hover:bg-white hover:shadow-md hover:shadow-slate-100 rounded-2xl cursor-pointer transition-all border border-transparent hover:border-slate-100">
                        <label className="flex items-center gap-3 flex-1 cursor-pointer">
                           <input 
                              type="checkbox" 
                              checked={todo.completed}
                              onChange={() => handleToggleTodo(todo.id)}
                              className="w-5 h-5 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-600 transition-all cursor-pointer"
                           />
                           <div className="flex-1">
                              <span className={`text-sm font-bold block transition-all ${todo.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                 {todo.title}
                              </span>
                              <div className="flex items-center gap-2 mt-0.5">
                                 <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                                    todo.priority === 'high' ? 'bg-rose-100 text-rose-600' :
                                    todo.priority === 'medium' ? 'bg-orange-100 text-orange-600' : 
                                    'bg-emerald-100 text-emerald-600'
                                 }`}>
                                    {todo.priority}
                                 </span>
                              </div>
                           </div>
                        </label>
                        
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setEditingTodo(todo);
                            setIsTodoModalOpen(true);
                          }}
                          className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 p-2 text-slate-400 lg:text-slate-300 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all"
                        >
                           <FiEdit2 size={14} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDeleteTodo(todo.id); }}
                          className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 p-2 text-slate-400 lg:text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                        >
                           <FiX size={14} />
                        </button>
                     </div>
                  ))}
                  {(!stats.todos || stats.todos.length === 0) && (
                     <div className="text-center py-8">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-300">
                           <FiCheckCircle size={24} />
                        </div>
                        <p className="text-xs font-bold text-slate-400">All caught up!</p>
                     </div>
                  )}
               </div>
            </div>

         </div>
      </div>

      <AddTodoModal 
        isOpen={isTodoModalOpen}
        onClose={() => {
          setIsTodoModalOpen(false);
          setEditingTodo(null);
        }}
        onSave={handleAddTodo}
        initialData={editingTodo}
      />

    </div>
  );
};

export default TeacherDashboard;
