import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import FormField from '../../components/common/FormField';
import { useToast } from '../../context/ToastContext';
import axios from '../../api/axios';
import { classApi } from '../../api/classApi';
import { teacherApi } from '../../api/teacherApi';
import { subjectApi } from '../../api/subjectApi';
import { 
  Trash2, Calendar, Clock, MapPin, User, BookOpen, 
  Plus, ChevronRight, Layers, LayoutGrid, ListFilter,
  Monitor, MoreHorizontal, Sparkles
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const TimetableManagementPage = () => {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const [form, setForm] = useState({
    subjectId: '',
    teacherId: '',
    dayOfWeek: 'MONDAY',
    periodNumber: 1,
    startTime: '',
    endTime: '',
    roomNumber: ''
  });

  const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

  useEffect(() => {
    const loadMeta = async () => {
      try {
        const [cRes, tRes, sRes] = await Promise.all([
          classApi.getAll(),
          teacherApi.getAll(0, 500),
          subjectApi.getAll()
        ]);
        setClasses(cRes.data?.data || []);
        setTeachers(tRes.data?.data?.content || []);
        setSubjects(sRes.data?.data || []);
      } catch (err) {
        toast.showToast('Failed to load metadata', 'error');
      } finally {
        setLoading(false);
      }
    };
    loadMeta();
  }, []);

  const fetchTimetable = async (classId) => {
    if (!classId) return;
    try {
      const res = await axios.get(`/admin/timetables/class/${classId}`);
      setTimetable(res.data?.data || []);
    } catch (err) {
      toast.showToast('Failed to fetch timetable', 'error');
    }
  };

  useEffect(() => {
    fetchTimetable(selectedClass);
  }, [selectedClass]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!selectedClass) return toast.showToast('Select a class first', 'warning');
    if (!form.subjectId || !form.teacherId) return toast.showToast('Subject and Teacher are required', 'warning');
    
    setSaving(true);
    try {
      const payload = {
        ...form,
        classRoom: { id: parseInt(selectedClass) },
        subject: { id: parseInt(form.subjectId) },
        teacher: { id: parseInt(form.teacherId) },
        startTime: form.startTime + ":00",
        endTime: form.endTime + ":00"
      };
      await axios.post('/admin/timetables', payload);
      toast.showToast('Schedule entry successfully added', 'success');
      fetchTimetable(selectedClass);
      // Reset some fields but keep day/period for faster entry
      setForm(prev => ({
        ...prev,
        periodNumber: parseInt(prev.periodNumber) + 1,
        startTime: prev.endTime,
        endTime: ''
      }));
    } catch (err) {
      toast.showToast('Conflict detected or validation failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this period from the master schedule?')) return;
    try {
      await axios.delete(`/admin/timetables/${id}`);
      toast.showToast('Entry removed', 'success');
      fetchTimetable(selectedClass);
    } catch (err) {
      toast.showToast('Failed to delete entry', 'error');
    }
  };

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><LoadingSpinner /></div>;

  return (
    <div className="max-w-[1600px] mx-auto pb-20 animate-fade-in">
      
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-2">
            <Monitor size={12} /> Academic Operations <ChevronRight size={10} /> Schedule Architect
          </div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight flex items-center gap-4">
            Master Timetable
            <span className="bg-indigo-50 text-indigo-600 text-[10px] px-3 py-1.5 rounded-full uppercase tracking-widest font-black">
              Enterprise v2.0
            </span>
          </h1>
          <p className="text-slate-500 font-medium mt-2">Construct, optimize, and synchronize class schedules across all branches.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm">
             <ListFilter size={20} />
          </button>
          <button className="px-6 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
             <Layers size={18} /> Conflict Audit
          </button>
          <button className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-black text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center gap-2">
             <Sparkles size={18} /> Auto-Generate
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* ── Left: Controller Panel ─────────────────────────────────── */}
        <div className="xl:col-span-3 space-y-6">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 sticky top-24">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                <LayoutGrid size={20} />
              </div>
              <h3 className="text-lg font-black text-slate-800 tracking-tight">Period Builder</h3>
            </div>
            
            <form onSubmit={handleAdd} className="space-y-5">
              <FormField label="Target Class">
                <select 
                  value={selectedClass} 
                  onChange={e => setSelectedClass(e.target.value)} 
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
                >
                  <option value="">Select Classroom</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name} ({c.section})</option>)}
                </select>
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Day">
                  <select 
                    value={form.dayOfWeek} 
                    onChange={e => setForm({...form, dayOfWeek: e.target.value})} 
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
                  >
                    {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </FormField>
                <FormField label="Period #">
                  <input 
                    type="number" 
                    min="1" 
                    value={form.periodNumber} 
                    onChange={e => setForm({...form, periodNumber: e.target.value})} 
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </FormField>
              </div>

              <FormField label="Subject Assignment">
                <select 
                  value={form.subjectId} 
                  onChange={e => setForm({...form, subjectId: e.target.value})} 
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
                  required
                >
                  <option value="">Choose Subject</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </FormField>

              <FormField label="Lead Instructor">
                <select 
                  value={form.teacherId} 
                  onChange={e => setForm({...form, teacherId: e.target.value})} 
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
                  required
                >
                  <option value="">Choose Teacher</option>
                  {teachers.map(t => <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>)}
                </select>
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Start Time">
                  <input 
                    type="time" 
                    value={form.startTime} 
                    onChange={e => setForm({...form, startTime: e.target.value})} 
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 transition-all"
                    required 
                  />
                </FormField>
                <FormField label="End Time">
                  <input 
                    type="time" 
                    value={form.endTime} 
                    onChange={e => setForm({...form, endTime: e.target.value})} 
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 transition-all"
                    required 
                  />
                </FormField>
              </div>

              <FormField label="Resource Location (Room)">
                <input 
                  value={form.roomNumber} 
                  onChange={e => setForm({...form, roomNumber: e.target.value})} 
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 transition-all"
                  placeholder="e.g. Block A-101" 
                />
              </FormField>

              <button 
                type="submit" 
                disabled={saving}
                className="w-full py-4 mt-4 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving ? 'Synchronizing...' : <><Plus size={18} /> Commit to Schedule</>}
              </button>
            </form>
          </div>
        </div>

        {/* ── Right: Visualization Grid ──────────────────────────────── */}
        <div className="xl:col-span-9 min-w-0">
          {!selectedClass ? (
            <div className="bg-white border border-slate-100 rounded-[3rem] py-40 text-center shadow-sm">
              <div className="w-24 h-24 bg-indigo-50 text-indigo-200 rounded-[2rem] flex items-center justify-center mx-auto mb-8 animate-pulse">
                <Calendar size={48} />
              </div>
              <h3 className="text-slate-800 font-black text-2xl tracking-tight">Board Initializing</h3>
              <p className="text-slate-400 mt-3 font-medium max-w-xs mx-auto">Select a classroom from the builder panel to visualize the operational schedule.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {DAYS.map(day => {
                const dayItems = timetable.filter(t => t.dayOfWeek === day).sort((a,b) => a.periodNumber - b.periodNumber);
                return (
                  <div key={day} className="animate-slide-up">
                    <div className="flex items-center gap-4 mb-6">
                       <h4 className="text-xs font-black text-indigo-500 uppercase tracking-[0.3em]">{day}</h4>
                       <div className="flex-1 h-[1px] bg-slate-100"></div>
                       <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{dayItems.length} Periods</span>
                    </div>

                    {dayItems.length === 0 ? (
                      <div className="px-8 py-6 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 text-sm text-slate-400 font-bold flex items-center gap-3 italic">
                        <Monitor size={16} /> No operational entries recorded for this day.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                        {dayItems.map(item => (
                          <div key={item.id} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative">
                            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all">
                               <button 
                                 onClick={() => handleDelete(item.id)}
                                 className="p-2 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 shadow-sm transition-all"
                               >
                                 <Trash2 size={14} />
                               </button>
                            </div>
                            
                            <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 font-black text-xs flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                               P{item.periodNumber}
                            </div>

                            <div className="space-y-1 mb-6">
                               <h5 className="font-black text-slate-800 text-lg tracking-tight group-hover:text-indigo-600 transition-colors">
                                  {item.subject?.name}
                               </h5>
                               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                  <User size={12} className="text-indigo-400" /> {item.teacher?.firstName} {item.teacher?.lastName}
                               </p>
                            </div>

                            <div className="flex flex-col gap-3 pt-6 border-t border-slate-50">
                               <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                     <Clock size={12} /> Timeline
                                  </span>
                                  <span className="text-sm font-black text-slate-700">
                                     {item.startTime?.substring(0,5)} — {item.endTime?.substring(0,5)}
                                  </span>
                               </div>
                               <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                     <MapPin size={12} /> Location
                                  </span>
                                  <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                                     {item.roomNumber || 'RM TBD'}
                                  </span>
                               </div>
                            </div>
                          </div>
                        ))}
                        
                        {/* Quick Add Placeholder */}
                        <button 
                          onClick={() => {
                            setForm(prev => ({ ...prev, dayOfWeek: day, periodNumber: dayItems.length + 1 }));
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="bg-slate-50 border-2 border-dashed border-slate-100 rounded-[2rem] p-6 flex flex-col items-center justify-center gap-3 text-slate-300 hover:text-indigo-400 hover:border-indigo-100 hover:bg-white transition-all group"
                        >
                           <div className="p-3 rounded-2xl bg-white shadow-sm border border-slate-50 group-hover:shadow-md group-hover:scale-110 transition-all">
                              <Plus size={20} />
                           </div>
                           <span className="text-[10px] font-black uppercase tracking-widest">Append Period</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimetableManagementPage;
