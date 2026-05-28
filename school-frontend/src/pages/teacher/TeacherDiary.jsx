import React, { useState, useEffect } from 'react';
import { 
  FiClock, FiBook, FiCheckCircle, FiInfo, FiPlus
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const TeacherDiary = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [scope, setScope] = useState({ assignedClasses: [], subjects: [] });
  const [currentPeriod, setCurrentPeriod] = useState(null);
  
  const [formData, setFormData] = useState({
    classRoomId: '',
    subjectId: '',
    topicsCovered: '',
    homeworkAssigned: '',
    behaviorNote: '', // Using this for detailed entry as per design
    announcements: '',
    periodNumber: ''
  });

  // ── INITIAL LOAD ──
  useEffect(() => {
    const fetchData = async () => {
      try {
        setInitialLoading(true);
        const day = new Date().toLocaleString('en-us', { weekday: 'LONG' }).toUpperCase();
        const [scopeRes, timetableRes] = await Promise.all([
          api.get('/teacher/scope'),
          api.get(`/teacher/timetable?day=${day}`)
        ]);

        setScope(scopeRes.data.data);
        const timetable = timetableRes.data.data || [];
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();

        const detected = timetable.find(t => {
          const [hS, mS] = t.startTime.split(':').map(Number);
          const [hE, mE] = t.endTime.split(':').map(Number);
          const start = hS * 60 + mS;
          const end = hE * 60 + mE;
          return currentTime >= start && currentTime <= end;
        }) || (timetable.length > 0 ? timetable[0] : null);

        if (detected) {
          setCurrentPeriod(detected);
          const matchedClass = scopeRes.data.data.assignedClasses.find(c => c.name === detected.className);
          const matchedSubject = scopeRes.data.data.subjects.find(s => s.name === detected.subject);
          
          setFormData(prev => ({
            ...prev,
            classRoomId: matchedClass?.id || '',
            subjectId: matchedSubject?.id || '',
            periodNumber: detected.period
          }));
        }
      } catch (error) {
        console.error("Sync failed", error);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!formData.classRoomId || !formData.subjectId || !formData.topicsCovered) {
      toast.warning("Please fill taught topics before publishing");
      return;
    }

    try {
      setLoading(true);
      await api.post('/teacher/diary', {
        ...formData,
        entryDate: new Date().toISOString().split('T')[0]
      });
      toast.success("Diary published to parents");
      setFormData(prev => ({
        ...prev,
        topicsCovered: '',
        homeworkAssigned: '',
        behaviorNote: ''
      }));
    } catch (error) {
      toast.error("Failed to publish diary");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;

  return (
    <div className="p-4 lg:p-8 w-full mx-auto space-y-6 lg:space-y-8 animate-fade-in pb-28 lg:pb-8">
      
      {/* ── TOP LIVE SESSION BANNER ── */}
      <div className="bg-white border border-slate-200 rounded-[2rem] p-6 flex items-center gap-6 shadow-sm">
         <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
            <FiClock size={32} strokeWidth={1} />
         </div>
         <div>
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Live Session</p>
            <h2 className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight">
               {currentPeriod ? `Period ${currentPeriod.period}: ${currentPeriod.className}` : 'No Active Session'}
            </h2>
         </div>
      </div>

      {/* ── SELECTORS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
         <select 
            className="w-full h-14 bg-white rounded-2xl border border-slate-200 px-6 font-bold text-sm outline-none focus:border-indigo-500 shadow-sm transition-all"
            value={formData.classRoomId}
            onChange={(e) => setFormData({...formData, classRoomId: e.target.value})}
         >
            <option value="">Select Class</option>
            {scope.assignedClasses.map(c => (
               <option key={c.id} value={c.id}>{c.name} {c.section}</option>
            ))}
         </select>
         <select 
            className="w-full h-14 bg-white rounded-2xl border border-slate-200 px-6 font-bold text-sm outline-none focus:border-indigo-500 shadow-sm transition-all"
            value={formData.subjectId}
            onChange={(e) => setFormData({...formData, subjectId: e.target.value})}
         >
            <option value="">Subject</option>
            {scope.subjects
               .filter(s => !formData.classRoomId || s.classId === Number(formData.classRoomId))
               .map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
               ))}
         </select>
      </div>

      {/* ── DAILY CLASS RECORD SECTION ── */}
      <div className="bg-white rounded-[2.5rem] p-6 lg:p-10 border border-slate-100 shadow-sm space-y-8">
         <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900">Daily Class Record</h3>
            <button className="text-indigo-600 text-[11px] font-bold flex items-center gap-2 hover:bg-indigo-50 px-3 py-1.5 rounded-xl transition-colors">
               <FiBook size={14} /> +Add Lesson Plan
            </button>
         </div>

         <div className="space-y-6">
            <div className="space-y-3">
               <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest px-1">Class Topic:</label>
               <input 
                  type="text"
                  className="w-full h-16 px-6 bg-slate-50/50 rounded-2xl border border-slate-100 font-bold text-sm outline-none focus:bg-white focus:border-indigo-500 transition-all placeholder:text-slate-300"
                  placeholder="What was covered today?"
                  value={formData.topicsCovered}
                  onChange={(e) => setFormData({...formData, topicsCovered: e.target.value})}
               />
            </div>

            <div className="space-y-3">
               <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest px-1">Homework & Tasks:</label>
               <div className="relative">
                  <input 
                     type="text"
                     className="w-full h-16 pl-6 pr-14 bg-slate-50/50 rounded-2xl border border-slate-100 font-bold text-sm outline-none focus:bg-white focus:border-indigo-500 transition-all placeholder:text-slate-300"
                     placeholder="Any homework to assign?"
                     value={formData.homeworkAssigned}
                     onChange={(e) => setFormData({...formData, homeworkAssigned: e.target.value})}
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-sm">
                     <FiCheckCircle size={14} />
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* ── DETAILED DIARY ENTRY SECTION ── */}
      <div className="bg-white rounded-[2.5rem] p-6 lg:p-10 border border-slate-100 shadow-sm space-y-6">
         <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900">Detailed Diary Entry</h3>
            <span className="text-[10px] font-bold text-slate-400">Diary will be public to students after publishing.</span>
         </div>
         <textarea 
            className="w-full h-40 p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100 font-bold text-sm outline-none focus:bg-white focus:border-indigo-500 transition-all placeholder:text-slate-300 resize-none"
            placeholder="Compose your detailed diary entry for publishing..."
            value={formData.behaviorNote}
            onChange={(e) => setFormData({...formData, behaviorNote: e.target.value})}
         />
      </div>

      {/* ── PUBLISH BUTTON ── */}
      <div className="flex flex-col items-center gap-4 py-4">
         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Diary will be public to students after publishing.</p>
         <button 
            onClick={handleSubmit}
            disabled={loading}
            className="w-full lg:max-w-xl h-16 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
         >
            {loading ? <LoadingSpinner size="sm" /> : <><FiCheckCircle size={20} strokeWidth={2.5} /> Publish to Parents</>}
         </button>
      </div>

    </div>
  );
};

export default TeacherDiary;
