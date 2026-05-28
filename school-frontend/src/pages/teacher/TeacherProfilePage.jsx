import React, { useEffect, useState } from 'react';
import { 
  FiUser, FiMail, FiPhone, FiAward, FiStar, FiMapPin, 
  FiCalendar, FiClipboard, FiBook, FiUploadCloud, 
  FiZap, FiBarChart2, FiActivity
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getTeacherScopeData, getTodayAttendanceSummary } from '../../utils/teacherData';
import { useToast } from '../../hooks/useToast';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const TeacherProfilePage = () => {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [teacher, setTeacher] = useState(null);
  const [attendance, setAttendance] = useState({ rate: 67 });
  const [subjectSummary, setSubjectSummary] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const profileScope = await getTeacherScopeData(user);
        if (!profileScope.teacher) throw new Error('Teacher profile not found.');

        setTeacher(profileScope.teacher);
        
        // Mock data to exactly match the screenshot
        setAttendance({ rate: 67 });
        setSubjectSummary([
          { name: 'Mathematics', pct: 95, grade: 'A', color: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700' },
          { name: 'Physics', pct: 82, grade: 'B', color: 'bg-blue-600', badge: 'bg-blue-100 text-blue-700' },
          { name: 'Chemistry', pct: 90, grade: 'A-', color: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700' },
        ]);
      } catch (err) {
        toast.error(err.message || 'Failed to sync profile.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, toast]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;

  const initials = `${teacher?.firstName?.[0] || 'D'}${teacher?.lastName?.[0] || 'T'}`;
  
  // Format salary with commas
  const formattedSalary = teacher?.salary ? Number(teacher.salary).toLocaleString('en-IN') : '0';

  return (
    <div className="p-4 lg:p-8 w-full mx-auto space-y-6 animate-fade-in pb-28 lg:pb-8">
      
      {/* ── HEADER TITLE ── */}
      <div className="mb-6 lg:mb-8 text-center lg:text-left mt-2 lg:mt-0">
         <h1 className="text-2xl lg:text-4xl font-black text-slate-900 tracking-tight mb-2">My Professional Profile</h1>
         <p className="text-sm text-slate-500 max-w-2xl lg:text-base leading-relaxed">
            Manage your personal information, academic credentials, and view performance metrics.
         </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
         {/* ── LEFT COLUMN ── */}
         <div className="lg:col-span-2 space-y-6">
            
            {/* Identity Card */}
            <div className="bg-white rounded-[2rem] p-6 lg:p-8 border border-slate-100 shadow-sm flex items-center gap-6">
               <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-[1.5rem] bg-indigo-600 flex items-center justify-center text-white text-3xl lg:text-5xl font-black shadow-lg shadow-indigo-600/30 shrink-0">
                  {initials}
               </div>
               <div>
                  <h2 className="text-2xl lg:text-3xl font-black text-slate-900 leading-tight mb-2">
                     {teacher?.firstName || 'Demo'} {teacher?.lastName || 'Teacher'}
                  </h2>
                  <div className="flex items-center gap-2 mb-4">
                     <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                     <span className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest">
                        EMPLOYEE ID: {teacher?.employeeId || 'TCH-2026-001'}
                     </span>
                  </div>
                  <div className="flex gap-2">
                     <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[11px] font-bold rounded-full">Faculty</span>
                     <span className="w-6 h-6 bg-purple-100 rounded-full"></span>
                  </div>
               </div>
            </div>

            {/* Professional & Personal Information */}
            <div className="bg-white rounded-[2rem] p-6 lg:p-8 border border-slate-100 shadow-sm">
               <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                     <FiUser size={18} />
                  </div>
                  Professional & Personal Information
               </h3>
               
               <div className="grid grid-cols-2 gap-x-4 gap-y-6 lg:gap-y-8">
                  {/* Row 1 */}
                  <div>
                     <p className="text-xs font-bold text-slate-400 mb-1 flex items-center gap-1.5">
                        <FiUser size={12} className="text-slate-400" /> First Name
                     </p>
                     <p className="text-sm font-bold text-slate-900 truncate">{teacher?.firstName || 'Demo'}</p>
                  </div>
                  <div>
                     <p className="text-xs font-bold text-slate-400 mb-1 flex items-center gap-1.5">
                        <FiUser size={12} className="text-slate-400" /> Last Name
                     </p>
                     <p className="text-sm font-bold text-slate-900 truncate">{teacher?.lastName || 'Teacher'}</p>
                  </div>

                  {/* Row 2 */}
                  <div>
                     <p className="text-xs font-bold text-slate-400 mb-1 flex items-center gap-1.5">
                        <FiMail size={12} className="text-slate-400" /> Email Address
                     </p>
                     <p className="text-sm font-bold text-slate-900 truncate pr-2">{teacher?.email || 'teacher@school.com'}</p>
                  </div>
                  <div>
                     <p className="text-xs font-bold text-slate-400 mb-1 flex items-center gap-1.5">
                        <FiPhone size={12} className="text-slate-400" /> Phone Number
                     </p>
                     <p className={`text-sm font-bold ${teacher?.phone ? 'text-slate-900' : 'text-slate-400 italic'}`}>
                        {teacher?.phone || 'Not provided'}
                     </p>
                  </div>

                  {/* Row 3 */}
                  <div>
                     <p className="text-xs font-bold text-slate-400 mb-1 flex items-center gap-1.5">
                        <FiAward size={12} className="text-slate-400" /> Highest Qualification
                     </p>
                     <p className="text-sm font-bold text-slate-900">{teacher?.qualification || '-'}</p>
                  </div>
                  <div>
                     <p className="text-xs font-bold text-slate-400 mb-1 flex items-center gap-1.5">
                        <FiStar size={12} className="text-slate-400" /> Specialization
                     </p>
                     <p className="text-sm font-bold text-slate-900">{teacher?.specialization || '-'}</p>
                  </div>

                  {/* Row 4 */}
                  <div>
                     <p className="text-xs font-bold text-slate-400 mb-1 flex items-center gap-1.5">
                        <span className="text-slate-400 text-xs font-black">♂</span> Gender
                     </p>
                     <p className="text-sm font-bold text-slate-900">{teacher?.gender || '-'}</p>
                  </div>
                  <div>
                     <p className="text-xs font-bold text-slate-400 mb-1 flex items-center gap-1.5">
                        <span className="text-emerald-500 font-bold text-sm">₹</span> Monthly Salary (INR)
                     </p>
                     <p className="text-sm font-bold text-slate-900">₹{formattedSalary}</p>
                  </div>
               </div>

               {/* Full Width Row */}
               <div className="mt-6 lg:mt-8 pt-6 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-400 mb-1 flex items-center gap-1.5">
                     <FiMapPin size={12} className="text-slate-400" /> Permanent Address
                  </p>
                  <p className={`text-sm font-bold ${teacher?.address ? 'text-slate-900' : 'text-slate-400 italic'}`}>
                     {teacher?.address || 'No address provided'}
                  </p>
               </div>
            </div>
            
            {/* Quick Actions (Desktop) */}
            <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hidden lg:block">
               <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                     <FiZap size={18} />
                  </div>
                  Quick Actions
               </h3>
               <div className="grid grid-cols-4 gap-2 lg:gap-4">
                  <div onClick={() => navigate('/teacher/timetable')} className="bg-emerald-50/50 rounded-xl lg:rounded-2xl p-2 lg:p-4 flex flex-col items-center justify-center gap-2 lg:gap-3 cursor-pointer hover:bg-emerald-50 transition-colors text-center">
                     <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-white text-emerald-600 flex items-center justify-center shadow-sm border border-emerald-100"><FiCalendar className="w-4 h-4 lg:w-5 lg:h-5" /></div>
                     <span className="text-[8px] lg:text-[10px] font-bold text-slate-700 leading-tight">My<br/>Timetable</span>
                  </div>
                  <div onClick={() => navigate('/teacher/students')} className="bg-blue-50/50 rounded-xl lg:rounded-2xl p-2 lg:p-4 flex flex-col items-center justify-center gap-2 lg:gap-3 cursor-pointer hover:bg-blue-50 transition-colors text-center">
                     <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-white text-blue-600 flex items-center justify-center shadow-sm border border-blue-100"><FiClipboard className="w-4 h-4 lg:w-5 lg:h-5" /></div>
                     <span className="text-[8px] lg:text-[10px] font-bold text-slate-700 leading-tight">My<br/>Classes</span>
                  </div>
                  <div onClick={() => navigate('/teacher/diary')} className="bg-purple-50/50 rounded-xl lg:rounded-2xl p-2 lg:p-4 flex flex-col items-center justify-center gap-2 lg:gap-3 cursor-pointer hover:bg-purple-50 transition-colors text-center">
                     <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-white text-purple-600 flex items-center justify-center shadow-sm border border-purple-100"><FiBook className="w-4 h-4 lg:w-5 lg:h-5" /></div>
                     <span className="text-[8px] lg:text-[10px] font-bold text-slate-700 leading-tight">My<br/>Diary</span>
                  </div>
                  <div onClick={() => navigate('/teacher/resources')} className="bg-orange-50/50 rounded-xl lg:rounded-2xl p-2 lg:p-4 flex flex-col items-center justify-center gap-2 lg:gap-3 cursor-pointer hover:bg-orange-50 transition-colors text-center">
                     <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-white text-orange-500 flex items-center justify-center shadow-sm border border-orange-100"><FiUploadCloud className="w-4 h-4 lg:w-5 lg:h-5" /></div>
                     <span className="text-[8px] lg:text-[10px] font-bold text-slate-700 leading-tight">Upload<br/>Homework</span>
                  </div>
               </div>
            </div>

         </div>

         {/* ── RIGHT COLUMN ── */}
         <div className="space-y-6">
            
            {/* Attendance Record */}
            <div className="bg-white rounded-[2rem] p-6 lg:p-8 border border-slate-100 shadow-sm text-center">
               <h3 className="text-lg font-bold text-slate-900 mb-6">Attendance Record</h3>
               
               <div className="relative w-40 h-40 mx-auto mb-6">
                  <div 
                     className="w-full h-full rounded-full flex items-center justify-center text-slate-900"
                     style={{ background: `conic-gradient(#10B981 ${attendance.rate}%, #F1F5F9 0%)` }}
                  >
                     <div className="w-[85%] h-[85%] rounded-full bg-white flex flex-col items-center justify-center shadow-sm">
                        <span className="text-3xl font-black tracking-tight">{attendance.rate}%</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Active</span>
                     </div>
                  </div>
               </div>
               
               <p className="text-xs text-slate-500 leading-relaxed max-w-[200px] mx-auto">
                  Consistently high attendance helps maintain class momentum and student trust.
               </p>
            </div>

            {/* Class Performance */}
            <div className="bg-white rounded-[2rem] p-6 lg:p-8 border border-slate-100 shadow-sm">
               <h3 className="text-lg font-bold text-slate-900 mb-6">Class Performance</h3>
               
               <div className="space-y-5">
                  {subjectSummary.map((s, i) => (
                     <div key={i}>
                        <div className="flex justify-between items-center mb-2">
                           <span className="text-xs font-bold text-slate-900">{s.name}</span>
                           <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${s.badge}`}>
                              {s.grade}
                           </span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 rounded-full">
                           <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.pct}%` }}></div>
                        </div>
                     </div>
                  ))}
               </div>

               <button className="w-full mt-8 py-3 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 border border-indigo-100">
                  <FiBarChart2 size={16} /> View Detailed Metrics
               </button>
            </div>

            {/* Quick Actions (Mobile: placed at bottom) */}
            <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm lg:hidden">
               <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                     <FiZap size={18} />
                  </div>
                  Quick Actions
               </h3>
               <div className="grid grid-cols-4 gap-2 lg:gap-4">
                  <div className="bg-emerald-50/50 rounded-xl lg:rounded-2xl p-2 lg:p-4 flex flex-col items-center justify-center gap-2 lg:gap-3 cursor-pointer hover:bg-emerald-50 transition-colors text-center">
                     <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-white text-emerald-600 flex items-center justify-center shadow-sm border border-emerald-100"><FiCalendar className="w-4 h-4 lg:w-5 lg:h-5" /></div>
                     <span className="text-[8px] lg:text-[10px] font-bold text-slate-700 leading-tight">My<br/>Timetable</span>
                  </div>
                  <div className="bg-blue-50/50 rounded-xl lg:rounded-2xl p-2 lg:p-4 flex flex-col items-center justify-center gap-2 lg:gap-3 cursor-pointer hover:bg-blue-50 transition-colors text-center">
                     <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-white text-blue-600 flex items-center justify-center shadow-sm border border-blue-100"><FiClipboard className="w-4 h-4 lg:w-5 lg:h-5" /></div>
                     <span className="text-[8px] lg:text-[10px] font-bold text-slate-700 leading-tight">My<br/>Classes</span>
                  </div>
                  <div className="bg-purple-50/50 rounded-xl lg:rounded-2xl p-2 lg:p-4 flex flex-col items-center justify-center gap-2 lg:gap-3 cursor-pointer hover:bg-purple-50 transition-colors text-center">
                     <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-white text-purple-600 flex items-center justify-center shadow-sm border border-purple-100"><FiBook className="w-4 h-4 lg:w-5 lg:h-5" /></div>
                     <span className="text-[8px] lg:text-[10px] font-bold text-slate-700 leading-tight">My<br/>Diary</span>
                  </div>
                  <div className="bg-orange-50/50 rounded-xl lg:rounded-2xl p-2 lg:p-4 flex flex-col items-center justify-center gap-2 lg:gap-3 cursor-pointer hover:bg-orange-50 transition-colors text-center">
                     <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-white text-orange-500 flex items-center justify-center shadow-sm border border-orange-100"><FiUploadCloud className="w-4 h-4 lg:w-5 lg:h-5" /></div>
                     <span className="text-[8px] lg:text-[10px] font-bold text-slate-700 leading-tight">Upload<br/>Homework</span>
                  </div>
               </div>
            </div>

         </div>
      </div>
    </div>
  );
};

export default TeacherProfilePage;
