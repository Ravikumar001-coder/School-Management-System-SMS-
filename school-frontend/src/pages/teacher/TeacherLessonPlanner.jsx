import React, { useState, useEffect } from 'react';
import { 
  FiTrendingUp, FiTrendingDown, FiBook, FiCheckCircle, 
  FiMoreVertical, FiEdit3, FiShare2, FiPlus,
  FiCalendar, FiArrowRight, FiActivity
} from 'react-icons/fi';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';

const MOCK_TREND = [
  { day: 'Mon', val: 50 }, { day: 'Tue', val: 65 }, { day: 'Wed', val: 120 }, 
  { day: 'Thu', val: 90 }, { day: 'Fri', val: 60 }, { day: 'Sat', val: 85 },
  { day: 'Sun', val: 110 }
];

const MOCK_TODOS = [
  { id: 1, title: 'Create Chapter 4 quiz', priorityColor: 'bg-rose-500' },
  { id: 2, title: 'Review Statistics Ch 1', priorityColor: 'bg-orange-500' },
  { id: 3, title: 'Review Chapter C in Task', priorityColor: 'bg-emerald-500' },
];

const TeacherLessonPlanner = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState([]);
  const [creating, setCreating] = useState(false);

  const fetchPlans = async () => {
    try {
      const res = await api.get('/teacher/content/lesson-plans');
      setPlans(res.data?.data || []);
    } catch (err) {
      toast.error("Failed to load lesson plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleCreatePlan = async () => {
     // For now, auto-create a draft plan as a demonstration of the button working
     try {
        setCreating(true);
        await api.post('/teacher/content/lesson-plans', {
           title: "New Lesson Plan Draft",
           description: "Starting syllabus for next month",
           status: "DRAFT",
           startDate: new Date().toISOString().split('T')[0],
           endDate: new Date(Date.now() + 7*24*60*60*1000).toISOString().split('T')[0]
        });
        toast.success("Draft plan created");
        fetchPlans();
     } catch (err) {
        toast.error("Failed to create plan");
     } finally {
        setCreating(false);
     }
  };

  if (loading) return <div className="p-20"><LoadingSpinner /></div>;

  return (
    <div className="p-4 lg:p-8 w-full mx-auto space-y-6 lg:space-y-8 animate-fade-in pb-24 lg:pb-8">
      
      {/* ── HEADER ── */}
      <div className="flex justify-between items-center lg:items-end">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">My Lesson Plans</h1>
        </div>
        <div className="hidden lg:flex gap-3">
          <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors">
            <FiCalendar />
          </button>
          <button 
            onClick={handleCreatePlan}
            disabled={creating}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            {creating ? <LoadingSpinner size="sm" /> : <FiPlus />} Create New Plan
          </button>
        </div>
      </div>

      {/* ── MOBILE GREETING BANNER ── */}
      <div className="lg:hidden bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-3xl p-6 text-white relative overflow-hidden shadow-lg shadow-indigo-200">
        <div className="relative z-10">
          <h2 className="text-xl font-bold mb-1">Lesson Planner, {user?.firstName}</h2>
          <p className="text-indigo-100 text-xs mb-6">Active Plans: 2</p>
          
          <div className="bg-white rounded-2xl p-4 text-slate-900">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold text-slate-400">Next Lesson Plan</span>
              <span className="text-[10px] font-bold text-emerald-500">in 15 min</span>
            </div>
            <h3 className="text-sm font-bold mb-1">Geometry - Ch 3: Polygons</h3>
            <p className="text-[10px] text-slate-400 mb-4 tracking-wide">Key detail: Geometry - 3: Polygons</p>
            <button className="w-full bg-indigo-600 text-white py-2.5 rounded-xl text-[11px] font-bold">
              Submit Plan
            </button>
          </div>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        <div className="bg-white p-4 lg:p-6 rounded-2xl lg:rounded-3xl border border-slate-100 shadow-sm">
           <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                 <FiTrendingUp size={20} />
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md lg:hidden">↑</span>
           </div>
           <div className="flex justify-between items-start">
              <div>
                 <p className="text-[10px] lg:text-xs font-bold text-slate-400 mb-1 flex items-center gap-1">
                    Syllabus Completed <FiTrendingUp className="hidden lg:block text-emerald-500" />
                 </p>
                 <h4 className="text-xl lg:text-2xl font-black text-slate-900">64%</h4>
              </div>
              <div className="hidden lg:block w-16 h-8 bg-emerald-50/50 rounded-lg"></div>
           </div>
        </div>

        <div className="bg-white p-4 lg:p-6 rounded-2xl lg:rounded-3xl border border-slate-100 shadow-sm">
           <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
                 <FiTrendingDown size={20} />
              </div>
              <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md lg:hidden">↑↗</span>
           </div>
           <div className="flex justify-between items-start">
              <div>
                 <p className="text-[10px] lg:text-xs font-bold text-slate-400 mb-1 flex items-center gap-1">
                    Syllabus Lagging <span className="hidden lg:inline text-rose-500">↑↗</span>
                 </p>
                 <h4 className="text-xl lg:text-2xl font-black text-slate-900">12%</h4>
              </div>
              <div className="hidden lg:block w-16 h-8 bg-rose-50/50 rounded-lg"></div>
           </div>
        </div>

        <div className="bg-white p-4 lg:p-6 rounded-2xl lg:rounded-3xl border border-slate-100 shadow-sm">
           <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                 <FiBook size={20} />
              </div>
           </div>
           <p className="text-[10px] lg:text-xs font-bold text-slate-400 mb-1">Upcoming Submissions</p>
           <h4 className="text-sm lg:text-lg font-black text-slate-900 leading-tight">Chapter 6 Quiz</h4>
           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Oct 15, 2023</p>
        </div>

        <div className="bg-white p-4 lg:p-6 rounded-2xl lg:rounded-3xl border border-slate-100 shadow-sm">
           <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                 <FiCheckCircle size={20} />
              </div>
           </div>
           <p className="text-[10px] lg:text-xs font-bold text-slate-400 mb-1">Approved Plans</p>
           <h4 className="text-xl lg:text-2xl font-black text-slate-900">18</h4>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6 lg:space-y-8">
           
           {/* Active Lesson Plan */}
           <div className="bg-white rounded-[2rem] p-6 lg:p-8 border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-lg font-bold text-slate-900">Active Lesson Plan</h3>
              </div>

              <div className="space-y-8 relative before:absolute before:left-[39px] lg:before:left-[43px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                 
                 {/* Item 1 */}
                 <div className="relative flex items-start gap-4 lg:gap-6">
                    <div className="w-20 text-[10px] lg:text-xs font-bold text-slate-400 pt-1 text-right shrink-0">
                       08:00 AM <br/> 09:00 AM
                    </div>
                    <div className="w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow-[0_0_0_1px_#10B981] relative z-10 mt-1 shrink-0"></div>
                    <div className="flex-1">
                       <div className="flex justify-between items-start mb-1">
                          <h4 className="text-sm lg:text-base font-bold text-slate-900">10-A Algebra: Linear Equations</h4>
                          <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold">Completed</span>
                       </div>
                       <p className="text-xs text-slate-400 mb-6 font-medium">Chapter taught</p>
                       
                       <div className="bg-slate-50/50 rounded-2xl p-4 lg:p-6 border border-slate-50 space-y-6">
                          <div>
                             <div className="flex justify-between items-center mb-2">
                                <h5 className="text-sm font-bold text-slate-700">Sub-Topic 1: Graphing</h5>
                                <span className="text-[10px] font-bold text-emerald-600">Completed</span>
                             </div>
                             <ul className="text-[11px] text-slate-500 list-disc list-inside mb-4">
                                <li>Key Present: Linear Equations</li>
                             </ul>
                             <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="w-[100%] h-full bg-emerald-500 rounded-full"></div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Item 2 */}
                 <div className="relative flex items-start gap-4 lg:gap-6">
                    <div className="w-20 text-[10px] lg:text-xs font-bold text-slate-400 pt-1 text-right shrink-0">
                       09:15 AM <br/> 10:15 AM
                    </div>
                    <div className="w-4 h-4 rounded-full bg-indigo-500 border-4 border-white shadow-[0_0_0_1px_#6366F1] relative z-10 mt-1 shrink-0"></div>
                    <div className="flex-1">
                       <div className="flex justify-between items-start mb-6">
                          <h4 className="text-sm lg:text-base font-bold text-slate-900">Sub-Topic 2: Graphing</h4>
                          <button className="text-slate-400"><FiMoreVertical /></button>
                       </div>
                       
                       <div className="bg-slate-50/50 rounded-2xl p-4 lg:p-6 border border-slate-50 space-y-6">
                          <div>
                             <div className="flex justify-between items-center mb-2">
                                <h5 className="text-sm font-bold text-slate-700">Sub-Topic 2: Graphing</h5>
                                <span className="text-[10px] font-bold text-emerald-600">Completed</span>
                             </div>
                             <ul className="text-[11px] text-slate-500 list-disc list-inside mb-4">
                                <li>Key Prevent: Linear Equations</li>
                             </ul>
                             <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="w-[100%] h-full bg-emerald-500 rounded-full"></div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Item 3 */}
                 <div className="relative flex items-start gap-4 lg:gap-6">
                    <div className="w-20 text-[10px] lg:text-xs font-bold text-slate-400 pt-1 text-right shrink-0">
                       11:00 AM <br/> 12:00 PM
                    </div>
                    <div className="w-4 h-4 rounded-full bg-slate-200 border-4 border-white shadow-[0_0_0_1px_#E2E8F0] relative z-10 mt-1 shrink-0"></div>
                    <div className="flex-1">
                       <div className="flex justify-between items-start mb-6">
                          <h4 className="text-sm lg:text-base font-bold text-slate-900">Sub-Topic 3: Graphing</h4>
                          <button className="text-slate-400"><FiMoreVertical /></button>
                       </div>
                       
                       <div className="bg-slate-50/50 rounded-2xl p-4 lg:p-6 border border-slate-50 space-y-6">
                          <div>
                             <div className="flex justify-between items-center mb-2">
                                <h5 className="text-sm font-bold text-slate-700">Sub-Topic 3: Graphing</h5>
                                <span className="text-[10px] font-bold text-emerald-600">Completed</span>
                             </div>
                             <ul className="text-[11px] text-slate-500 list-disc list-inside mb-4">
                                <li>Key Prevent: Linear Graphing</li>
                                <li>Key Prevent: Linear Graphing</li>
                             </ul>
                             <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="w-[85%] h-full bg-emerald-500 rounded-full"></div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>

              </div>
           </div>

           {/* Syllabus Trend (Charts) */}
           <div className="bg-white rounded-[2rem] p-6 lg:p-8 border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Syllabus Trend</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Attendans Trend (This Month)</p>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={MOCK_TREND}>
                    <XAxis dataKey="day" hide />
                    <YAxis hide />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="val" 
                      stroke="#6366F1" 
                      strokeWidth={4} 
                      dot={{ r: 4, fill: "#6366F1", strokeWidth: 2, stroke: "#fff" }} 
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between text-[10px] font-bold text-slate-300 mt-2">
                <span>50%</span>
                <span>100%</span>
                <span>120%</span>
              </div>
           </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6 lg:space-y-8">
           
           {/* Plan Management */}
           <div className="bg-white rounded-[2rem] p-6 lg:p-8 border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Plan Management</h3>
              <div className="space-y-6">
                 {plans.map(plan => (
                    <div key={plan.id} className="pb-6 border-b border-slate-50 last:border-0 last:pb-0">
                       <div className="flex justify-between items-start mb-2">
                          <div>
                             <h4 className="text-sm lg:text-base font-bold text-slate-900">{plan.name}</h4>
                             <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{plan.class}</span>
                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-md ${plan.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>{plan.status}</span>
                             </div>
                             <p className="text-[10px] font-bold text-slate-300 mt-1 uppercase tracking-widest">Last edited {plan.date}</p>
                          </div>
                          <button className="text-slate-300"><FiMoreVertical /></button>
                       </div>
                       <div className="flex justify-end gap-3 mt-4">
                          <button className="text-indigo-600 text-xs font-bold flex items-center gap-1.5 hover:bg-indigo-50 px-2 py-1 rounded-lg transition-colors">
                             <FiEdit3 size={14} /> Edit
                          </button>
                          <button className="text-slate-400 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-50 px-2 py-1 rounded-lg transition-colors">
                             <FiShare2 size={14} />
                          </button>
                       </div>
                    </div>
                 ))}
                 {plans.length === 0 && <p className="text-xs text-slate-400 text-center py-4">No plans created yet.</p>}
              </div>
           </div>

           {/* To-Do List */}
           <div className="bg-white rounded-[2rem] p-6 lg:p-8 border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Lesson Plan To-Do List</h3>
              <div className="space-y-4">
                 {MOCK_TODOS.map(todo => (
                    <label key={todo.id} className="flex items-center gap-4 group cursor-pointer">
                       <input type="checkbox" className="w-5 h-5 rounded-md border-slate-200 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                       <span className="flex-1 text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">{todo.title}</span>
                       <div className={`w-2.5 h-2.5 rounded-full ${todo.priorityColor}`}></div>
                    </label>
                 ))}
              </div>
           </div>

        </div>

      </div>
    </div>
  );
};

export default TeacherLessonPlanner;
