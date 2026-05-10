// src/pages/admin/AttendancePage.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useToast } from '../../context/ToastContext';
import { classApi } from '../../api/classApi';
import { subjectApi } from '../../api/subjectApi';
import { studentApi } from '../../api/studentApi';
import { attendanceApi } from '../../api/attendanceApi';
import { fileApi } from '../../api/fileApi';
import PageHeader from '../../components/common/PageHeader';
import FormField from '../../components/common/FormField';
import Button from '../../components/common/Button';
import SmartTable from '../../components/common/SmartTable';

const AttendancePage = () => {
  const toast = useToast();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setClassId] = useState('');
  const [selectedSubject, setSubjectId] = useState('');
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [saving, setSaving] = useState(false);

  // Metadata
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [metaLoading, setMetaLoading] = useState(true);

  // Load classes and subjects
  useEffect(() => {
    let cancelled = false;
    Promise.all([classApi.getAll(), subjectApi.getAll()])
      .then(([classRes, subjectRes]) => {
        if (cancelled) return;
        setClasses(classRes?.data?.data ?? classRes?.data ?? []);
        setSubjects(subjectRes?.data?.data ?? subjectRes?.data ?? []);
      })
      .catch(() => {
        if (!cancelled) toast.error('Failed to load system metadata.');
      })
      .finally(() => {
        if (!cancelled) setMetaLoading(false);
      });
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Filtered subjects based on class
  const filteredSubjects = useMemo(() => {
    if (!selectedClass) return [];
    const cls = classes.find(c => String(c.id) === String(selectedClass));
    // Support both ID arrays and nested objects
    return subjects.filter(s => cls?.subjectIds?.includes(s.id) || cls?.subjects?.some(sub => sub.id === s.id));
  }, [selectedClass, classes, subjects]);

  // Load students when class changes
  const fetchStudents = useCallback(async () => {
    if (!selectedClass) { setStudents([]); return; }
    try {
      const res = await studentApi.byClass(selectedClass);
      const list = res.data?.data ?? res.data ?? [];
      setStudents(list);
      // Default everyone to PRESENT for operational speed
      const init = {};
      list.forEach(s => { init[s.id] = 'PRESENT'; });
      setAttendance(init);
    } catch {
      toast.error('Failed to load class roster.');
    }
  }, [selectedClass]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const updateStatus = (id, status) => {
    setAttendance(prev => ({ ...prev, [id]: status }));
  };

  const markAll = (status) => {
    const next = {};
    students.forEach(s => { next[s.id] = status; });
    setAttendance(next);
    toast.info(`Marked all as ${status.toLowerCase()}.`);
  };

  const handleSubmit = async () => {
    if (!selectedClass) return toast.warning("Please select a class first.");
    if (students.length === 0) return toast.warning("No students to mark.");
    
    setSaving(true);
    try {
      const payload = {
        classRoomId: Number(selectedClass),
        attendance_date: date,
        subjectId: selectedSubject ? Number(selectedSubject) : null,
        attendanceList: students.map(s => ({
          studentId: s.id,
          status: attendance[s.id] || 'PRESENT',
          remarks: ''
        }))
      };
      await attendanceApi.markBulk(payload);
      toast.success(`Attendance saved for ${students.length} students.`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save attendance.");
    } finally {
      setSaving(false);
    }
  };

  const presentCount = Object.values(attendance).filter(v => v === 'PRESENT').length;

  const columns = [
    {
      title: 'Student Name',
      key: 'name',
      render: (_, s) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-xs overflow-hidden">
            {s.profilePhoto ? (
              <img src={fileApi.toPublicUrl(s.profilePhoto)} alt="" className="w-full h-full object-cover" />
            ) : (
              <>{s.firstName?.[0]}{s.lastName?.[0]}</>
            )}
          </div>
          <div>
            <p className="font-bold text-slate-800">{s.firstName} {s.lastName}</p>
            <p className="text-[10px] text-slate-400">{s.studentId}</p>
          </div>
        </div>
      )
    },
    {
      title: 'Status',
      key: 'id',
      render: (id) => (
        <div className="flex gap-1">
          {['PRESENT', 'ABSENT', 'LATE'].map((opt) => (
            <button
              key={opt}
              onClick={(e) => { e.stopPropagation(); updateStatus(id, opt); }}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all
                ${attendance[id] === opt 
                  ? (opt === 'PRESENT' ? 'bg-emerald-600 text-white shadow-md' : 
                     opt === 'ABSENT' ? 'bg-red-600 text-white shadow-md' : 
                     'bg-amber-500 text-white shadow-md')
                  : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600'
                }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )
    }
  ];

  return (
    <>
      <PageHeader 
        title="Attendance Management" 
        subtitle="Operational speed mode enabled."
        actions={
          <div className="flex gap-2">
             <Button variant="secondary" size="sm" onClick={() => markAll('PRESENT')}>All Present</Button>
             <Button variant="secondary" size="sm" onClick={() => markAll('ABSENT')}>All Absent</Button>
          </div>
        }
      />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField label="Academic Class" required>
            <select value={selectedClass} onChange={e => setClassId(e.target.value)} className="select h-11">
              <option value="">{metaLoading ? 'Loading...' : '-- Select Class --'}</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name} - {c.section}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Subject (Optional)">
            <select 
              value={selectedSubject} 
              onChange={e => setSubjectId(e.target.value)} 
              className="select h-11"
              disabled={!selectedClass}
            >
              <option value="">All Subjects / Homeroom</option>
              {filteredSubjects.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Attendance Date" required>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="input h-11" />
          </FormField>
        </div>
      </div>

      {selectedClass ? (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <SmartTable 
              columns={columns}
              data={students}
              loading={false}
              emptyMessage="No students found for this class."
              pinnedColumnIndex={0}
            />
          </div>
          
          <div className="bg-slate-900 rounded-2xl text-white flex flex-col md:flex-row items-center justify-between gap-6 p-6 shadow-xl border border-slate-800">
             <div className="flex gap-8">
               <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Present</span>
                  <span className="text-2xl font-black text-emerald-400 leading-none">{presentCount}</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Absent/Late</span>
                  <span className="text-2xl font-black text-rose-400 leading-none">{students.length - presentCount}</span>
               </div>
             </div>
             <Button 
               variant="primary" 
               loading={saving} 
               onClick={handleSubmit}
               className="w-full md:w-auto px-12 bg-indigo-600 hover:bg-indigo-500 border-none h-12 text-sm font-bold shadow-lg shadow-indigo-500/20 rounded-xl"
             >
               Finalize & Save Records
             </Button>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-2xl text-center py-24 px-6">
           <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-3xl mx-auto mb-4">📝</div>
           <h3 className="text-slate-800 font-bold text-lg">Class Roster Not Loaded</h3>
           <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto">Select a class from the dropdown above to start marking daily attendance for the active session.</p>
        </div>
      )}
    </>
  );
};

export default AttendancePage;
