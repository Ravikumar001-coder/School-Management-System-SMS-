import React, { useState, useEffect } from 'react';
import { 
  FiLock, FiFileText, FiUploadCloud, FiShield, FiSearch, 
  FiChevronDown, FiPlus, FiEdit3, FiCopy, FiEye, FiTrash2,
  FiTrendingUp, FiActivity, FiBookOpen
 } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';

const TeacherExamPapers = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [papers, setPapers] = useState([]);
  const [scope, setScope] = useState({ assignedClasses: [], subjects: [] });
  const [filters, setFilters] = useState({ grade: '', subject: '', term: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [scopeRes, papersRes] = await Promise.all([
        api.get('/teacher/scope'),
        api.get('/teacher/content/exam-papers')
      ]);
      setScope(scopeRes.data.data);
      setPapers(papersRes.data.data || []);
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreatePaper = async () => {
     try {
        setCreating(true);
        await api.post('/teacher/content/exam-papers', {
           title: "New Exam Paper Draft",
           fileUrl: "placeholder.pdf",
           status: "DRAFT",
           examDate: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]
        });
        toast.success("Draft paper created");
        fetchData();
     } catch (err) {
        toast.error("Failed to create paper");
     } finally {
        setCreating(false);
     }
  };

  if (loading) return <div className="p-10 flex justify-center"><LoadingSpinner /></div>;

  return (
    <div className="p-4 lg:p-8 w-full mx-auto space-y-6 lg:space-y-10 animate-fade-in pb-24 lg:pb-8">
      
      {/* ── HEADER ── */}
      <div>
         <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">My Exam Papers</h1>
         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Controlled Secure Storage</p>
      </div>

      {/* ── TOP SECURITY BANNER ── */}
      <div className="bg-[#1e293b] rounded-[2.5rem] p-6 lg:p-8 shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
         <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5 text-center lg:text-left flex-col lg:flex-row">
               <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-rose-400 border border-white/10 shadow-inner">
                  <FiShield size={32} />
               </div>
               <div>
                  <h3 className="font-black text-white text-xl tracking-tight">Paper Security</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Locked Until Exam Start</p>
               </div>
            </div>
            
            <button className="w-full lg:w-auto px-10 h-16 bg-white hover:bg-slate-50 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3">
               <FiUploadCloud size={18} /> Upload Question Paper
            </button>
         </div>
      </div>

      {/* ── FILTERS ROW ── */}
      <div className="flex flex-col lg:flex-row gap-4 items-center">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 w-full">
            <div className="relative group">
               <select 
                  className="w-full h-14 bg-white rounded-2xl border border-slate-100 px-6 font-bold text-xs outline-none focus:border-indigo-500 shadow-sm appearance-none"
                  value={filters.grade}
                  onChange={(e) => setFilters({...filters, grade: e.target.value})}
               >
                  <option value="">All Grades</option>
                  {scope.assignedClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
               </select>
               <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
            <div className="relative group">
               <select 
                  className="w-full h-14 bg-white rounded-2xl border border-slate-100 px-6 font-bold text-xs outline-none focus:border-indigo-500 shadow-sm appearance-none"
                  value={filters.subject}
                  onChange={(e) => setFilters({...filters, subject: e.target.value})}
               >
                  <option value="">All Subjects</option>
                  {scope.subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
               </select>
               <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
            <div className="relative group">
               <select 
                  className="w-full h-14 bg-white rounded-2xl border border-slate-100 px-6 font-bold text-xs outline-none focus:border-indigo-500 shadow-sm appearance-none"
                  value={filters.term}
                  onChange={(e) => setFilters({...filters, term: e.target.value})}
               >
                  <option value="">Final Term</option>
                  <option value="MID">Mid Term</option>
                  <option value="UNIT">Unit Test</option>
               </select>
               <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
         </div>
         
         <div className="relative w-full lg:w-72">
            <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
               type="text"
               placeholder="Search..."
               className="w-full h-14 bg-white rounded-2xl border border-slate-100 pl-14 pr-6 font-bold text-xs outline-none focus:border-indigo-500 shadow-sm"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>

         <button 
            onClick={handleCreatePaper}
            disabled={creating}
            className="w-full lg:w-auto px-8 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 active:scale-95"
         >
            {creating ? <LoadingSpinner size="sm" /> : <FiPlus size={18} />} Create New Paper
         </button>
      </div>

      {/* ── PAPERS LIST ── */}
      <div className="space-y-4">
         
         {/* Desktop Header */}
         <div className="hidden lg:grid grid-cols-12 px-10 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
            <div className="col-span-4">Exam Name</div>
            <div className="col-span-3">Grade / Class</div>
            <div className="col-span-2">Exam Date</div>
            <div className="col-span-1 text-center">Status</div>
            <div className="col-span-2 text-right">Actions</div>
         </div>

         {papers.map((paper) => (
            <div key={paper.id} className="bg-white rounded-[2rem] p-6 lg:px-10 lg:py-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
               {/* Mobile/Desktop Card Layout */}
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  
                  {/* Name & Icon */}
                  <div className="col-span-1 lg:col-span-4 flex items-center gap-5">
                     <div className={`w-14 h-14 rounded-2xl ${paper.status === 'LOCKED' ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'} flex items-center justify-center text-2xl shadow-inner`}>
                        <FiFileText />
                     </div>
                     <div>
                        <h4 className="font-black text-slate-800 text-base lg:text-lg tracking-tight group-hover:text-indigo-600 transition-colors">{paper.title}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{paper.subtitle}</p>
                     </div>
                  </div>

                  {/* Grade/Class (Desktop) */}
                  <div className="hidden lg:block col-span-3">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Grade / Class</p>
                     <p className="text-sm font-bold text-slate-700">{paper.grade}</p>
                  </div>

                  {/* Exam Date (Desktop) */}
                  <div className="hidden lg:block col-span-2">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Exam Date</p>
                     <p className="text-sm font-bold text-slate-700">{paper.date}</p>
                  </div>

                  {/* Mobile Details Group */}
                  <div className="lg:hidden space-y-2 py-2 border-y border-slate-50">
                     <p className="text-xs font-bold text-slate-600">Grade: {paper.grade}</p>
                     <p className="text-xs font-bold text-slate-600">Exam Date: {paper.date}, Status: <span className="text-rose-500 font-black">{paper.status}</span></p>
                  </div>

                  {/* Status (Desktop) */}
                  <div className="col-span-1 flex justify-center">
                     <div className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border flex items-center gap-2
                        ${paper.status === 'LOCKED' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                          paper.status === 'DRAFT' ? 'bg-slate-50 text-slate-500 border-slate-100' : 
                          'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                        {paper.status === 'LOCKED' && <FiLock size={10} />}
                        {paper.status}
                     </div>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex justify-end items-center gap-2">
                     <button className="w-10 h-10 bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl flex items-center justify-center transition-all lg:opacity-0 lg:group-hover:opacity-100">
                        <FiEdit3 size={16} />
                     </button>
                     <button className="w-10 h-10 bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl flex items-center justify-center transition-all lg:opacity-0 lg:group-hover:opacity-100">
                        <FiCopy size={16} />
                     </button>
                     <button className="w-10 h-10 bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl flex items-center justify-center transition-all lg:opacity-0 lg:group-hover:opacity-100">
                        <FiEye size={16} />
                     </button>
                     <button className="w-10 h-10 bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-xl flex items-center justify-center transition-all lg:opacity-0 lg:group-hover:opacity-100">
                        <FiTrash2 size={16} />
                     </button>
                     
                     {/* Mobile Specific Actions */}
                     <div className="lg:hidden flex gap-2 w-full">
                        <button className="flex-1 bg-indigo-600 text-white h-12 rounded-xl font-bold text-xs">Edit</button>
                        <button className="flex-1 bg-slate-100 text-slate-600 h-12 rounded-xl font-bold text-xs">Duplicate</button>
                        <button className="flex-1 bg-slate-100 text-slate-600 h-12 rounded-xl font-bold text-xs">Preview</button>
                     </div>
                  </div>
               </div>
            </div>
         ))}
         {papers.length === 0 && (
           <div className="py-20 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
             <p className="text-sm font-bold text-slate-400">No exam papers created yet.</p>
           </div>
         )}
      </div>

    </div>
  );
};

export default TeacherExamPapers;
