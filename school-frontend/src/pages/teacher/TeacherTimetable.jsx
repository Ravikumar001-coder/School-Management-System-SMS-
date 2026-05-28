import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiClock, FiChevronRight, FiCheckCircle
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import axios from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const FULL_DAYS_MAP = {
  'MONDAY': 'Mon', 'TUESDAY': 'Tue', 'WEDNESDAY': 'Wed', 
  'THURSDAY': 'Thu', 'FRIDAY': 'Fri', 'SATURDAY': 'Sat'
};

const COLORS = [
  'bg-indigo-50 border-indigo-100 text-indigo-700',
  'bg-orange-50 border-orange-100 text-orange-700',
  'bg-emerald-50 border-emerald-100 text-emerald-700',
  'bg-rose-50 border-rose-100 text-rose-700',
  'bg-blue-50 border-blue-100 text-blue-700',
  'bg-purple-50 border-purple-100 text-purple-700',
  'bg-yellow-50 border-yellow-100 text-yellow-700'
];

const TeacherTimetable = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(DAYS[new Date().getDay() - 1] || 'Mon');
  const [timetableData, setTimetableData] = useState({});
  const [stats, setStats] = useState({ totalStudents: 0, classesToday: 0 });

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const res = await axios.get('/teacher/timetables/my');
        const rawData = res.data?.data || [];
        
        // Transform data
        const transformed = {};
        let todayClasses = 0;
        const currentDayStr = DAYS[new Date().getDay() - 1];

        rawData.forEach((item, index) => {
          const day = FULL_DAYS_MAP[item.dayOfWeek];
          if (!transformed[day]) transformed[day] = [];
          
          if (day === currentDayStr) todayClasses++;

          transformed[day].push({
            time: item.startTime.substring(0, 5),
            endTime: item.endTime.substring(0, 5),
            class: `${item.classRoom?.name}-${item.classRoom?.section}`,
            subject: item.subject?.name,
            room: item.roomNumber || 'TBD',
            color: COLORS[index % COLORS.length],
            classRoomId: item.classRoom?.id,
            subjectId: item.subject?.id,
            period: item.periodNumber
          });
        });

        setTimetableData(transformed);
        setStats({ totalStudents: 0, classesToday: todayClasses }); // Student count would need another API
      } catch (err) {
        console.error('Failed to fetch teacher timetable:', err);
        // toast.showToast('Failed to load your personal schedule', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, []);

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><LoadingSpinner /></div>;

  return (
    <div className="p-4 lg:p-8 w-full mx-auto space-y-6 lg:space-y-8 animate-fade-in pb-24 lg:pb-8">
      
      {/* ── HEADER ── */}
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl lg:text-4xl font-black text-slate-900 tracking-tight">Academic Schedule</h1>
           <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Personal Teaching Itinerary</p>
        </div>
        <button className="px-5 py-2.5 rounded-2xl bg-indigo-50 text-indigo-600 text-xs font-black hover:bg-indigo-100 transition-all">
           Export PDF
        </button>
      </div>

      {/* ── DAY SELECTOR ── */}
      <div className="flex gap-2 lg:gap-4 overflow-x-auto no-scrollbar pb-2">
        {DAYS.map(day => (
          <button 
            key={day}
            onClick={() => setActiveDay(day)}
            className={`shrink-0 px-6 lg:px-10 py-3 rounded-2xl text-xs font-black transition-all
              ${activeDay === day ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white text-slate-400 border border-slate-100 hover:border-indigo-100'}`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* ── MOBILE GREETING CARD ── */}
      <div className="lg:hidden bg-indigo-600 rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl shadow-indigo-100">
         <div className="relative z-10 text-white">
            <h2 className="text-lg font-bold opacity-80 mb-1">Welcome back,</h2>
            <h2 className="text-2xl font-black mb-4">{user?.firstName} {user?.lastName}</h2>
            <div className="flex gap-4">
               <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl">
                  <span className="text-[10px] font-bold block opacity-60 uppercase">Today</span>
                  <span className="text-sm font-black">{stats.classesToday} Classes</span>
               </div>
               <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl">
                  <span className="text-[10px] font-bold block opacity-60 uppercase">Next Up</span>
                  <span className="text-sm font-black">10:00 AM</span>
               </div>
            </div>
         </div>
         <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-10 -mt-10 blur-3xl"></div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         
         {/* DESKTOP SIDEBAR STATS */}
         <div className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                     <FiCheckCircle size={20} />
                  </div>
                  <h3 className="font-black text-slate-800 tracking-tight text-lg">Daily Summary</h3>
               </div>
               <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                     <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Classes Today</span>
                     <span className="text-xl font-black text-slate-800">{stats.classesToday}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                     <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Next Lesson</span>
                     <span className="text-xs font-black text-indigo-600">10:00 AM</span>
                  </div>
               </div>
            </div>
         </div>

         {/* TIMETABLE VIEW */}
         <div className="lg:col-span-9 space-y-6">
            {Object.keys(timetableData).length === 0 ? (
               <div className="bg-white border-2 border-dashed border-slate-100 rounded-[3rem] py-32 text-center">
                  <FiClock size={48} className="mx-auto text-slate-200 mb-6" />
                  <h3 className="text-slate-800 font-black text-xl tracking-tight">No Schedule Found</h3>
                  <p className="text-slate-400 mt-2 font-medium">You don't have any classes assigned yet.</p>
               </div>
            ) : (
               <div className="grid grid-cols-1 gap-4">
                  {(timetableData[activeDay] || []).length === 0 ? (
                     <div className="bg-slate-50/50 border border-slate-100 rounded-[2.5rem] py-20 text-center italic text-slate-400 font-bold">
                        No sessions scheduled for {activeDay}. Enjoy your break!
                     </div>
                  ) : (
                     timetableData[activeDay].sort((a,b) => a.time.localeCompare(b.time)).map((cls, idx) => (
                        <div key={idx} className={`p-6 lg:p-8 rounded-[2.5rem] border shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col md:flex-row md:items-center gap-6 ${cls.color}`}>
                           <div className="md:w-32">
                              <span className="text-[10px] font-black opacity-60 uppercase tracking-widest block mb-1">Timing</span>
                              <div className="flex items-center gap-2 text-lg font-black tracking-tight">
                                 <FiClock className="opacity-40" /> {cls.time}
                              </div>
                           </div>
                           
                           <div className="flex-1">
                              <span className="text-[10px] font-black opacity-60 uppercase tracking-widest block mb-1">{cls.class}</span>
                              <h3 className="text-xl lg:text-2xl font-black tracking-tight">{cls.subject}</h3>
                           </div>

                           <div className="md:text-right">
                              <span className="text-[10px] font-black opacity-60 uppercase tracking-widest block mb-1">Venue</span>
                              <span className="text-sm font-black bg-white/40 px-3 py-1.5 rounded-xl border border-white/20">Room {cls.room}</span>
                           </div>

                           <div className="md:pl-6 border-t md:border-t-0 md:border-l border-white/20 pt-4 md:pt-0 flex flex-col gap-2">
                               <button
                                  onClick={() => {
                                    const today = new Date().toISOString().split('T')[0];
                                    navigate(`/teacher/quick-attendance?classRoomId=${cls.classRoomId}&subjectId=${cls.subjectId}&period=${cls.period}&date=${today}`);
                                  }}
                                  className="px-6 py-3 bg-white/60 hover:bg-white transition-all rounded-2xl text-xs font-black flex items-center gap-2 whitespace-nowrap shadow-sm"
                               >
                                  Mark Attendance <FiChevronRight />
                               </button>
                               <button
                                  onClick={() => {
                                    const today = new Date().toISOString().split('T')[0];
                                    navigate(`/teacher/diary?classRoomId=${cls.classRoomId}&subjectId=${cls.subjectId}&date=${today}`);
                                  }}
                                  className="px-6 py-3 bg-white/40 hover:bg-white/70 transition-all rounded-2xl text-xs font-black flex items-center gap-2 whitespace-nowrap"
                               >
                                  Write Diary <FiChevronRight />
                               </button>
                            </div>
                        </div>
                     ))
                  )}
               </div>
            ) }
         </div>
      </div>

      <div className="flex justify-center pt-8">
         <button className="text-slate-400 text-xs font-bold flex items-center gap-2 hover:text-indigo-600 transition-colors">
            Master Academic Calendar <FiChevronRight />
         </button>
      </div>

    </div>
  );
};

export default TeacherTimetable;
