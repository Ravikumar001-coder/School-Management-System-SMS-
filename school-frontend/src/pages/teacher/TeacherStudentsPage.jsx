import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiUsers, FiAward, FiAlertCircle, FiMessageSquare, 
  FiTrendingUp, FiCheckCircle, FiMoreVertical, FiEye, 
  FiFlag, FiMail, FiFilter, FiChevronRight 
} from 'react-icons/fi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import StudentProfileDetails from '../../components/teachers/StudentProfileDetails';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { examApi } from '../../api/examApi';
import { attendanceApi } from '../../api/attendanceApi';
import { fileApi } from '../../api/fileApi';
import { getTeacherScopeData, getTodayAttendanceSummary } from '../../utils/teacherData';

const TeacherStudentsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [scope, setScope] = useState({ students: [], exams: [], assignedClasses: [] });
  const [classFilter, setClassFilter] = useState('ALL');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [flaggedIds, setFlaggedIds] = useState([]);
  const [studentScoreByCode, setStudentScoreByCode] = useState({});
  const [attendanceStatusByCode, setAttendanceStatusByCode] = useState({});

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getTeacherScopeData(user);
        setScope(data);

        // Fetch exam scores
        const marksMap = {};
        const marksArrays = await Promise.all(
          (data.exams || []).map(async (exam) => {
            try {
              const res = await examApi.getMarks(exam.id);
              return Array.isArray(res?.data?.data) ? res.data.data : [];
            } catch { return []; }
          })
        );

        marksArrays.flat().forEach((mark) => {
          const key = mark.studentCode;
          if (!key || typeof mark.marksObtained !== 'number' || !mark.totalMarks) return;
          if (!marksMap[key]) marksMap[key] = { sumPct: 0, count: 0 };
          marksMap[key].sumPct += (mark.marksObtained / mark.totalMarks) * 100;
          marksMap[key].count += 1;
        });

        const avgMap = Object.fromEntries(
          Object.entries(marksMap).map(([key, item]) => [key, Math.round(item.sumPct / item.count)])
        );
        setStudentScoreByCode(avgMap);

        // Fetch attendance status
        const todaySummary = await getTodayAttendanceSummary(data.assignedClasses || []);
        const statusMap = {};
        await Promise.all(
          (data.assignedClasses || []).map(async (classRoom) => {
            try {
              const attendanceRes = await attendanceApi.classReport(classRoom.id, todaySummary.date);
              const records = attendanceRes?.data?.data?.records || [];
              records.forEach((r) => { if (r.studentId) statusMap[r.studentId] = (r.status || 'UNMARKED').toUpperCase(); });
            } catch {}
          })
        );
        setAttendanceStatusByCode(statusMap);
      } catch (err) {
        toast.error('Failed to load students data.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const classOptions = useMemo(() => {
    return Array.from(new Set((scope.students || []).map((s) => s.className).filter(Boolean)));
  }, [scope.students]);

  const filteredStudents = useMemo(() => {
    return (scope.students || []).filter((s) => classFilter === 'ALL' || s.className === classFilter);
  }, [classFilter, scope.students]);

  const topPerformers = useMemo(() => {
    return filteredStudents.filter((s) => (studentScoreByCode[s.studentId] || 0) >= 75);
  }, [filteredStudents, studentScoreByCode]);

  const lowAttendanceStudents = useMemo(() => {
    return filteredStudents.filter((s) => {
      const status = attendanceStatusByCode[s.studentId] || 'UNMARKED';
      return status === 'ABSENT' || status === 'LATE';
    });
  }, [attendanceStatusByCode, filteredStudents]);

  const sendMessage = (student) => {
    if (!student.parentEmail) {
      toast.error('Parent email is not available.');
      return;
    }
    window.location.href = `mailto:${student.parentEmail}`;
  };

  const sendMessageToAll = () => {
    const emails = filteredStudents.map(s => s.parentEmail).filter(Boolean);
    if (!emails.length) return toast.error('No parent emails available.');
    window.location.href = `mailto:?bcc=${encodeURIComponent(emails.join(','))}`;
  };

  if (loading) return <div className="p-10 flex justify-center"><LoadingSpinner /></div>;

  return (
    <div className="p-4 lg:p-8 space-y-6 lg:space-y-10 animate-fade-in pb-24 lg:pb-8">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Home &gt; Dashboard &gt; My Students</p>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">My Students</h1>
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <button 
            onClick={() => navigate('/teacher/exams')}
            className="flex-1 lg:flex-none h-14 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            View Detailed Performance
          </button>
          <button 
            onClick={sendMessageToAll}
            className="flex-1 lg:flex-none h-14 px-8 bg-slate-50 hover:bg-slate-100 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] border border-slate-100 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            Send Message To All
          </button>
        </div>
      </div>

      {/* ── SUMMARY CARDS ── */}
      <div className="grid grid-cols-3 lg:grid-cols-3 gap-2 lg:gap-6">
        {[
          { title: 'Students', value: filteredStudents.length, label: 'Assigned', icon: <FiUsers />, color: 'bg-blue-50 text-blue-600' },
          { title: 'Top Performers', value: topPerformers.length, label: 'Perf.', icon: <FiAward />, color: 'bg-indigo-50 text-indigo-600' },
          { title: 'Alerts', value: lowAttendanceStudents.length, label: 'Low Att.', icon: <FiAlertCircle />, color: 'bg-emerald-50 text-emerald-600' },
        ].map((card) => (
          <div key={card.title} className="bg-white rounded-2xl lg:rounded-[2rem] border border-slate-100 p-3 lg:p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start text-center lg:text-left gap-1 lg:gap-0">
               <div className="order-2 lg:order-1">
                  <p className="text-[7px] lg:text-xs font-black text-slate-500 uppercase tracking-tighter lg:tracking-widest mb-0 lg:mb-2">{card.title}</p>
                  <p className="text-sm lg:text-5xl font-black text-slate-900 leading-none">{card.value}</p>
               </div>
               <div className={`w-6 h-6 lg:w-14 lg:h-14 rounded-lg lg:rounded-2xl ${card.color} flex items-center justify-center text-[10px] lg:text-3xl order-1 lg:order-2`}>
                  {card.icon}
               </div>
            </div>
            <div className="hidden lg:block mt-4 pt-4 border-t border-slate-50 text-xs font-black text-slate-500 uppercase tracking-widest">{card.label}</div>
          </div>
        ))}
      </div>

      {/* ── STUDENT DATA ── */}
      <div className="bg-white rounded-3xl lg:rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 lg:p-10 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <h3 className="text-xl lg:text-3xl font-black text-slate-900 tracking-tight">My Students</h3>
          <div className="flex items-center gap-3">
             <div className="relative group">
                <select 
                   value={classFilter} 
                   onChange={(e) => setClassFilter(e.target.value)}
                   className="h-10 lg:h-14 px-6 pr-12 bg-slate-50 hover:bg-slate-100 rounded-xl font-black text-[10px] lg:text-sm outline-none border border-slate-200 focus:border-indigo-500 transition-all appearance-none cursor-pointer text-slate-700"
                >
                   <option value="ALL">All Classes</option>
                   {classOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <FiFilter className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
             </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-10 py-6">ID</th>
                <th className="px-6 py-6">Student Name</th>
                <th className="px-6 py-6">Class</th>
                <th className="px-6 py-6">Roll No.</th>
                <th className="px-6 py-6">Subject</th>
                <th className="px-6 py-6">Last Test</th>
                <th className="px-6 py-6 text-center">Attendance</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((student, index) => {
                const score = studentScoreByCode[student.studentId];
                const status = attendanceStatusByCode[student.studentId] || 'UNMARKED';
                const relatedExam = (scope.exams || []).find((e) => e.className === student.className);
                const isFlagged = flaggedIds.includes(student.id);

                return (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-10 py-6 text-sm font-black text-slate-400">{index + 1}</td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs shadow-inner border border-indigo-100">
                          {student.profilePhoto
                            ? <img src={fileApi.toPublicUrl(student.profilePhoto)} alt="Avatar" className="w-full h-full object-cover rounded-xl" />
                            : `${student.firstName?.[0]}${student.lastName?.[0]}`}
                        </div>
                        <span className="font-black text-slate-900 text-base">{student.firstName} {student.lastName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-sm font-black text-slate-600">{student.className}</td>
                    <td className="px-6 py-6 text-sm font-black text-slate-600">{String(student.studentId).slice(-4)}</td>
                    <td className="px-6 py-6 text-sm font-black text-slate-600">{relatedExam?.subjectName || 'N/A'}</td>
                    <td className="px-6 py-6">
                       <span className="px-4 py-2 bg-slate-100 text-slate-900 rounded-lg font-black text-sm border border-slate-200">
                          {score !== undefined ? `${score}` : '--'}
                       </span>
                    </td>
                    <td className="px-6 py-6 text-center">
                       <span className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest border shadow-sm
                          ${status === 'PRESENT' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                            status === 'ABSENT' ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                          {status}
                       </span>
                    </td>
                    <td className="px-10 py-5 text-right">
                       <div className="flex items-center justify-end gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setSelectedStudent(student)} className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 rounded-xl shadow-sm transition-all"><FiEye size={16} /></button>
                          <button onClick={() => sendMessage(student)} className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 rounded-xl shadow-sm transition-all"><FiMail size={16} /></button>
                          <button onClick={() => setFlaggedIds(prev => prev.includes(student.id) ? prev.filter(id => id !== student.id) : [...prev, student.id])} 
                                  className={`p-2.5 bg-white border border-slate-100 rounded-xl shadow-sm transition-all ${isFlagged ? 'text-rose-600' : 'text-slate-400 hover:text-rose-600'}`}><FiFlag size={16} /></button>
                       </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden p-6 space-y-6 bg-slate-50/30">
          {filteredStudents.map((student) => {
            const status = attendanceStatusByCode[student.studentId] || 'UNMARKED';
            const score = studentScoreByCode[student.studentId];
            const isFlagged = flaggedIds.includes(student.id);

            return (
              <div key={student.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                <div className="flex justify-between items-start">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                         {student.firstName?.[0]}{student.lastName?.[0]}
                      </div>
                      <div>
                         <h4 className="font-black text-slate-900 text-lg leading-tight">{student.firstName} {student.lastName}</h4>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Roll {String(student.studentId).slice(-4)}</p>
                      </div>
                   </div>
                   <div className="px-3 py-1.5 bg-slate-100 rounded-lg font-black text-[9px] text-slate-500 uppercase tracking-widest">
                      {student.className}
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50">
                   <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Last Test Score</p>
                      <p className="font-black text-slate-800">{score !== undefined ? score : '--'}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Attendance</p>
                      <p className={`font-black uppercase text-[10px] ${status === 'PRESENT' ? 'text-emerald-500' : 'text-rose-500'}`}>{status}</p>
                   </div>
                </div>

                <div className="flex gap-2">
                   <button onClick={() => setSelectedStudent(student)} className="flex-1 h-12 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-indigo-100">Detailed Performance</button>
                   <button onClick={() => sendMessage(student)} className="w-12 h-12 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center"><FiMail size={18} /></button>
                   <button onClick={() => setFlaggedIds(prev => prev.includes(student.id) ? prev.filter(id => id !== student.id) : [...prev, student.id])} 
                           className={`w-12 h-12 rounded-xl flex items-center justify-center border ${isFlagged ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-slate-50 border-transparent text-slate-400'}`}><FiFlag size={18} /></button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Modal
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        title="Student Insights & Profile"
        size="xl"
      >
        {selectedStudent && (
          <StudentProfileDetails 
            student={selectedStudent} 
            score={studentScoreByCode[selectedStudent.studentId]}
            attendanceStatus={attendanceStatusByCode[selectedStudent.studentId]}
          />
        )}
      </Modal>
    </div>
  );
};

export default TeacherStudentsPage;
