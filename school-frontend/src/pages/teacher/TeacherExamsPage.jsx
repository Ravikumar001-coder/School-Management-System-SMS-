import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiClock, FiBook, FiAward, FiEye, FiEdit3, FiTrash2, FiSearch, FiFilter, FiPlus, FiChevronRight, FiCheckCircle } from 'react-icons/fi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { examApi } from '../../api/examApi';
import { getTeacherScopeData } from '../../utils/teacherData';

const TeacherExamsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState([]);
  const [classFilter, setClassFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [marksCountByExamId, setMarksCountByExamId] = useState({});

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const scope = await getTeacherScopeData(user);
        setExams(scope.exams || []);

        const marksEntries = await Promise.all(
          (scope.exams || []).map(async (exam) => {
            try {
              const res = await examApi.getMarks(exam.id);
              return [exam.id, (res?.data?.data || []).length];
            } catch {
              return [exam.id, 0];
            }
          })
        );
        setMarksCountByExamId(Object.fromEntries(marksEntries));
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load assigned exams.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const classOptions = useMemo(() => {
    return Array.from(new Set(exams.map((exam) => exam.className).filter(Boolean)));
  }, [exams]);

  const getExamStatus = (exam) => {
    if ((exam.status || '').toUpperCase() === 'COMPLETED') return 'COMPLETED';
    if (!exam.examDate) return 'SCHEDULED';
    const examDate = new Date(exam.examDate);
    const today = new Date();
    today.setHours(0,0,0,0);
    if (examDate < today) return 'OVERDUE';
    return 'SCHEDULED';
  };

  const filteredExams = useMemo(() => {
    return exams.filter((exam) => {
      const examStatus = getExamStatus(exam);
      const classMatch = classFilter === 'ALL' || exam.className === classFilter;
      const statusMatch = statusFilter === 'ALL' || examStatus === statusFilter;
      const searchMatch = exam.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          exam.subjectName.toLowerCase().includes(searchTerm.toLowerCase());
      return classMatch && statusMatch && searchMatch;
    });
  }, [classFilter, exams, statusFilter, searchTerm]);

  const stats = useMemo(() => {
    const total = filteredExams.length;
    const upcoming = filteredExams.filter(e => getExamStatus(e) === 'SCHEDULED').length;
    const completed = filteredExams.filter(e => getExamStatus(e) === 'COMPLETED').length;
    return { total, upcoming, completed };
  }, [filteredExams]);

  if (loading) return <><LoadingSpinner /></>;

  return (
    <>

      <div className="animate-fadeIn space-y-6">
        
        {/* Premium Header */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 p-1 shadow-xl">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative bg-white/5 backdrop-blur-xl rounded-[1.4rem] p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                   <FiAward className="text-yellow-400" /> Exam Management
                </h1>
                <p className="text-blue-100/70 text-sm mt-1 font-medium">Track assigned exams, schedule assessments, and post student results.</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => navigate('/admin/exams/new')} // Assuming admin route for now, or teacher create
                  className="bg-white text-indigo-700 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-indigo-50 transition-all active:scale-95 flex items-center gap-2"
                >
                  <FiPlus /> Create New Exam
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Assigned Exams', val: stats.total, icon: <FiBook />, col: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Upcoming / Scheduled', val: stats.upcoming, icon: <FiCalendar />, col: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Evaluations Completed', val: stats.completed, icon: <FiCheckCircle />, col: 'text-green-600', bg: 'bg-green-50' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-5">
               <div className={`${s.bg} ${s.col} p-4 rounded-2xl text-2xl`}>{s.icon}</div>
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.label}</p>
                  <p className="text-3xl font-black text-gray-800">{s.val}</p>
               </div>
            </div>
          ))}
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col lg:flex-row items-center gap-4">
           <div className="relative flex-1 w-full">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search exams by name or subject..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none font-medium"
              />
           </div>
           <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
                 <FiFilter className="text-gray-400" />
                 <select 
                   value={classFilter} 
                   onChange={e => setClassFilter(e.target.value)}
                   className="bg-transparent text-xs font-bold text-gray-600 outline-none"
                 >
                   <option value="ALL">All Classes</option>
                   {classOptions.map(c => <option key={c} value={c}>{c}</option>)}
                 </select>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
                 <select 
                   value={statusFilter} 
                   onChange={e => setStatusFilter(e.target.value)}
                   className="bg-transparent text-xs font-bold text-gray-600 outline-none"
                 >
                   <option value="ALL">All Status</option>
                   <option value="SCHEDULED">Scheduled</option>
                   <option value="COMPLETED">Completed</option>
                   <option value="OVERDUE">Overdue</option>
                 </select>
              </div>
           </div>
        </div>

        {/* Exam Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
           {filteredExams.length ? filteredExams.map(exam => {
             const status = getExamStatus(exam);
             const marksCount = marksCountByExamId[exam.id] || 0;
             return (
               <div key={exam.id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 group overflow-hidden flex flex-col">
                  <div className={`h-2 ${status === 'COMPLETED' ? 'bg-green-500' : status === 'OVERDUE' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                  <div className="p-8 flex-1">
                     <div className="flex justify-between items-start mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl shadow-inner border border-indigo-100 group-hover:scale-110 transition-transform">
                           <FiBook />
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${status === 'COMPLETED' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                           {status}
                        </span>
                     </div>
                     
                     <h3 className="text-xl font-black text-gray-800 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">{exam.name}</h3>
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                        {exam.subjectName} • {exam.className}
                     </p>

                     <div className="space-y-3 pt-6 border-t border-gray-50">
                        <div className="flex items-center justify-between text-xs font-bold">
                           <span className="text-gray-400 flex items-center gap-2"><FiCalendar /> Date</span>
                           <span className="text-gray-700">{exam.examDate || 'TBA'}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-bold">
                           <span className="text-gray-400 flex items-center gap-2"><FiClock /> Time</span>
                           <span className="text-gray-700">{exam.startTime || '09:00'} - {exam.endTime || '12:00'}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-bold">
                           <span className="text-gray-400 flex items-center gap-2"><FiAward /> Max Marks</span>
                           <span className="text-gray-700">{exam.maxMarks || 100}</span>
                        </div>
                     </div>
                  </div>

                  <div className="p-4 bg-gray-50 flex items-center gap-2">
                     <button 
                       onClick={() => navigate(`/admin/exams/${exam.id}/marks`)}
                       className="flex-1 bg-white hover:bg-indigo-600 hover:text-white text-gray-800 border border-gray-200 hover:border-indigo-600 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                     >
                       <FiEdit3 /> {marksCount > 0 ? 'Edit Marks' : 'Enter Marks'}
                     </button>
                     <button 
                       onClick={() => toast.success(`Viewing details for ${exam.name}`)}
                       className="w-12 h-12 bg-white hover:bg-gray-100 text-gray-400 border border-gray-200 rounded-xl flex items-center justify-center transition-all"
                     >
                       <FiEye />
                     </button>
                  </div>
               </div>
             );
           }) : (
             <div className="col-span-full py-20 text-center bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
                <FiBook size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">No exams found for the current selection</p>
                <button onClick={() => {setClassFilter('ALL'); setStatusFilter('ALL'); setSearchTerm('');}} className="mt-4 text-indigo-600 font-black text-xs uppercase tracking-widest hover:underline">Clear all filters</button>
             </div>
           )}
        </div>
      </div>
    </>
  );
};

export default TeacherExamsPage;
