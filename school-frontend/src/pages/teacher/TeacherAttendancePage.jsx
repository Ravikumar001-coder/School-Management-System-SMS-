import React, { useEffect, useMemo, useState } from 'react';
import { FiCheckCircle, FiXCircle, FiClock, FiCalendar, FiBook, FiUsers, FiSearch, FiRefreshCw, FiSave } from 'react-icons/fi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { attendanceApi } from '../../api/attendanceApi';
import { subjectApi } from '../../api/subjectApi';
import { fileApi } from '../../api/fileApi';
import { getTeacherScopeData } from '../../utils/teacherData';

const TeacherAttendancePage = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [assignedClasses, setAssignedClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState({});
  const [markAllPresent, setMarkAllPresent] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [scope, subjectRes] = await Promise.all([
          getTeacherScopeData(user),
          subjectApi.getAll(),
        ]);

        setAssignedClasses(scope.assignedClasses || []);
        setStudents(scope.students || []);
        setSubjects(subjectRes?.data?.data || []);

        if (scope.assignedClasses.length) {
          setSelectedClass(String(scope.assignedClasses[0].id));
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load attendance workspace.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const selectedClassObj = useMemo(
    () => assignedClasses.find((c) => String(c.id) === String(selectedClass)),
    [assignedClasses, selectedClass]
  );

  const classSubjects = useMemo(() => {
    const ids = selectedClassObj?.subjectIds || [];
    return subjects.filter((s) => ids.includes(s.id));
  }, [selectedClassObj, subjects]);

  const classStudents = useMemo(
    () => students.filter((s) => String(s._classId || s.classRoomId) === String(selectedClass)),
    [students, selectedClass]
  );

  const filteredStudents = useMemo(() => {
    return classStudents.filter(s => 
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(s.studentId).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [classStudents, searchTerm]);

  useEffect(() => {
    if (!selectedClass || !classStudents.length) {
      setAttendance({});
      return;
    }
    const init = {};
    classStudents.forEach(s => init[s.id] = 'PRESENT');
    setAttendance(init);
    setMarkAllPresent(true);

    // Try to load existing for date
    const loadExisting = async () => {
       try {
         const res = await attendanceApi.classReport(selectedClass, date);
         const records = res?.data?.data?.records || [];
         if (records.length) {
            const next = {};
            records.forEach((record) => {
              if (record.studentDbId) {
                next[record.studentDbId] = (record.status || 'PRESENT').toUpperCase();
              }
            });
            setAttendance(prev => ({...prev, ...next}));
         }
       } catch (e) {}
    };
    loadExisting();
  }, [selectedClass, date, classStudents]);

  const stats = useMemo(() => {
    const total = classStudents.length;
    const present = Object.values(attendance).filter(v => v === 'PRESENT').length;
    const absent = Object.values(attendance).filter(v => v === 'ABSENT').length;
    const late = Object.values(attendance).filter(v => v === 'LATE').length;
    return { total, present, absent, late };
  }, [attendance, classStudents]);

  const setStatus = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const toggleAllPresent = () => {
    const next = !markAllPresent;
    setMarkAllPresent(next);
    if (next) {
      const bulk = {};
      classStudents.forEach(s => bulk[s.id] = 'PRESENT');
      setAttendance(bulk);
    }
  };

  const saveAttendance = async () => {
    setSaving(true);
    try {
      await attendanceApi.markBulk({
        classRoomId: Number(selectedClass),
        attendance_date: date,
        subjectId: selectedSubject ? Number(selectedSubject) : null,
        attendanceList: classStudents.map(s => ({
          studentId: s.id,
          status: attendance[s.id] || 'PRESENT',
          remarks: ''
        }))
      });
      toast.success(`Attendance saved successfully for ${classStudents.length} students.`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save attendance.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <><LoadingSpinner /></>;

  return (
    <>

      <div className="animate-fadeIn space-y-6">
        
        {/* Premium Header & Filters */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-700 to-purple-800 p-1 shadow-xl">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative bg-white/5 backdrop-blur-xl rounded-[1.4rem] p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                   <FiCheckCircle className="text-green-400" /> Attendance Register
                </h1>
                <p className="text-indigo-100/70 text-sm mt-1 font-medium">Manage daily student presence and engagement records.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-1 flex items-center gap-2">
                   <select 
                     value={selectedClass} 
                     onChange={e => setSelectedClass(e.target.value)}
                     className="bg-transparent text-white text-xs font-bold px-3 py-2 outline-none cursor-pointer"
                   >
                     {assignedClasses.map(c => <option key={c.id} value={c.id} className="text-gray-900">{c.name}-{c.section}</option>)}
                   </select>
                   <div className="h-6 w-px bg-white/20"></div>
                   <input 
                     type="date" 
                     value={date} 
                     onChange={e => setDate(e.target.value)}
                     className="bg-transparent text-white text-xs font-bold px-3 py-2 outline-none cursor-pointer filter invert grayscale brightness-200"
                   />
                </div>
                <button 
                  onClick={saveAttendance}
                  disabled={saving}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg transition-all active:scale-95 flex items-center gap-2"
                >
                  {saving ? <FiRefreshCw className="animate-spin" /> : <FiSave />} {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Summary Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {[
             { label: 'Total Strength', val: stats.total, icon: <FiUsers />, col: 'text-indigo-600', bg: 'bg-indigo-50' },
             { label: 'Present Today', val: stats.present, icon: <FiCheckCircle />, col: 'text-green-600', bg: 'bg-green-50' },
             { label: 'Absent', val: stats.absent, icon: <FiXCircle />, col: 'text-red-600', bg: 'bg-red-50' },
             { label: 'Late', val: stats.late, icon: <FiClock />, col: 'text-amber-600', bg: 'bg-amber-50' },
           ].map((s, i) => (
             <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-4">
                <div className={`${s.bg} ${s.col} p-3 rounded-xl text-xl`}>{s.icon}</div>
                <div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.label}</p>
                   <p className="text-xl font-black text-gray-800">{s.val}</p>
                </div>
             </div>
           ))}
        </div>

        {/* Student List with Advanced Controls */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row items-center justify-between gap-4">
             <div className="relative w-full md:w-96">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search students by name or ID..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                />
             </div>
             <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer group">
                   <div 
                     onClick={toggleAllPresent}
                     className={`w-12 h-6 rounded-full transition-all relative ${markAllPresent ? 'bg-indigo-600' : 'bg-gray-200'}`}
                   >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${markAllPresent ? 'left-7' : 'left-1'}`} />
                   </div>
                   <span className="text-xs font-bold text-gray-500 group-hover:text-indigo-600 transition-colors uppercase tracking-widest">Mark All Present</span>
                </label>
             </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Student Information</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Roll No.</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status Selection</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredStudents.length ? filteredStudents.map((student, idx) => {
                  const status = attendance[student.id] || 'PRESENT';
                  return (
                    <tr key={student.id} className="hover:bg-indigo-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden border border-gray-200 flex items-center justify-center text-indigo-500 font-black text-xs shadow-sm">
                            {student.profilePhoto 
                              ? <img src={fileApi.toPublicUrl(student.profilePhoto)} className="w-full h-full object-cover" />
                              : `${student.firstName[0]}${student.lastName[0]}`}
                          </div>
                          <div>
                            <p className="text-sm font-black text-gray-800">{student.firstName} {student.lastName}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{student.studentId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">
                           #{idx + 1}
                         </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                           {[
                             { id: 'PRESENT', label: 'Present', color: 'bg-green-500', active: 'bg-green-50 text-green-600 border-green-200' },
                             { id: 'ABSENT', label: 'Absent', color: 'bg-red-500', active: 'bg-red-50 text-red-600 border-red-200' },
                             { id: 'LATE', label: 'Late', color: 'bg-amber-500', active: 'bg-amber-50 text-amber-600 border-amber-200' },
                           ].map(opt => (
                             <button
                               key={opt.id}
                               onClick={() => setStatus(student.id, opt.id)}
                               className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${status === opt.id ? opt.active : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'}`}
                             >
                               {opt.label}
                             </button>
                           ))}
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-gray-400 text-sm font-medium">
                       No students matching your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </>
  );
};

export default TeacherAttendancePage;
