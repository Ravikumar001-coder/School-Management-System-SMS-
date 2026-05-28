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
import { Search, CheckCircle2, XCircle, Clock, AlertCircle, RefreshCcw } from 'lucide-react';

const AttendancePage = () => {
  const toast = useToast();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setClassId] = useState('');
  const [selectedSubject, setSubjectId] = useState('');
  const [periodNumber, setPeriodNumber] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({}); // studentId -> status
  const [existingRecords, setExistingRecords] = useState({}); // studentId -> recordId
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [metaLoading, setMetaLoading] = useState(true);
  
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);

  // 1. Initial Load: Metadata
  useEffect(() => {
    let cancelled = false;
    setMetaLoading(true);
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

  // 2. Filter subjects for selected class
  const filteredSubjects = useMemo(() => {
    if (!selectedClass) return [];
    const cls = classes.find(c => String(c.id) === String(selectedClass));
    return subjects.filter(s => cls?.subjects?.some(sub => sub.id === s.id) || cls?.subjectIds?.includes(s.id));
  }, [selectedClass, classes, subjects]);

  // 3. Main Data Fetch: Students + Existing Attendance
  const fetchData = useCallback(async () => {
    if (!selectedClass) {
      setStudents([]);
      setAttendance({});
      return;
    }

    setLoading(true);
    try {
      // Fetch Students and existing attendance in parallel
      const [studentRes, attendanceRes] = await Promise.all([
        studentApi.byClass(selectedClass),
        attendanceApi.classReport(selectedClass, date, selectedSubject, periodNumber)
      ]);

      const studentList = studentRes.data?.data ?? studentRes.data ?? [];
      const attendanceData = attendanceRes.data?.data ?? attendanceRes.data ?? {};
      const records = attendanceData.records ?? [];

      setStudents(studentList);

      // Map existing attendance
      const currentAttendance = {};
      const recordIds = {};
      
      // Default to PRESENT for all first
      studentList.forEach(s => { currentAttendance[s.id] = 'PRESENT'; });
      
      // Override with existing records
      records.forEach(r => {
        currentAttendance[r.studentId] = r.status;
        recordIds[r.studentId] = r.id;
      });

      setAttendance(currentAttendance);
      setExistingRecords(recordIds);

      if (records.length > 0) {
        toast.info(`Loaded existing records for ${records.length} students.`);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      toast.error('Failed to load class roster or attendance history.');
    } finally {
      setLoading(false);
    }
  }, [selectedClass, date, selectedSubject, periodNumber]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Actions
  const updateStatus = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const markAll = (status) => {
    const next = { ...attendance };
    students.forEach(s => { next[s.id] = status; });
    setAttendance(next);
    toast.success(`Bulk marked all as ${status.toLowerCase()}.`);
  };

  const handleSave = async () => {
    if (!selectedClass) return toast.warning("Select a class.");
    if (students.length === 0) return toast.warning("No students found.");

    setSaving(true);
    try {
      const payload = {
        classRoomId: Number(selectedClass),
        attendance_date: date,
        subjectId: selectedSubject ? Number(selectedSubject) : null,
        periodNumber: periodNumber ? Number(periodNumber) : null,
        attendanceList: students.map(s => ({
          studentId: s.id,
          status: attendance[s.id] || 'PRESENT',
          remarks: ''
        }))
      };

      await attendanceApi.markBulk(payload);
      toast.success('Attendance records synchronized successfully!');
      fetchData(); // Refresh to get new IDs
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save attendance.');
    } finally {
      setSaving(false);
    }
  };

  // UI Computations
  const filteredStudents = students.filter(s => 
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.studentId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    present: Object.values(attendance).filter(v => v === 'PRESENT').length,
    absent: Object.values(attendance).filter(v => v === 'ABSENT').length,
    halfDay: Object.values(attendance).filter(v => v === 'HALF_DAY').length,
    late: Object.values(attendance).filter(v => v === 'LATE').length,
  };

  // Status configuration
  const STATUS_OPTIONS = [
    { id: 'PRESENT', label: 'P', color: 'bg-emerald-500', icon: <CheckCircle2 size={14} />, textColor: 'text-emerald-500' },
    { id: 'ABSENT', label: 'A', color: 'bg-rose-500', icon: <XCircle size={14} />, textColor: 'text-rose-500' },
    { id: 'LATE', label: 'L', color: 'bg-amber-500', icon: <Clock size={14} />, textColor: 'text-amber-500' },
    { id: 'HALF_DAY', label: 'HD', color: 'bg-indigo-500', icon: <AlertCircle size={14} />, textColor: 'text-indigo-500' },
  ];

  return (
    <div className="pb-64">
      <PageHeader 
        title="Attendance Center" 
        subtitle="Fast operational mode is active."
        actions={
          <Button variant="secondary" size="sm" onClick={() => fetchData()} className="gap-2">
            <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </Button>
        }
      />

      {/* 1. Configuration Shell */}
      <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5 mb-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <FormField label="Academic Class" required>
            <select value={selectedClass} onChange={e => setClassId(e.target.value)} className="select h-12 rounded-xl">
              <option value="">{metaLoading ? 'Loading...' : '-- Select Class --'}</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name} — {c.section}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Subject (Optional)">
            <select 
              value={selectedSubject} 
              onChange={e => setSubjectId(e.target.value)} 
              className="select h-12 rounded-xl"
              disabled={!selectedClass}
            >
              <option value="">Daily Attendance</option>
              {filteredSubjects.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Period (Optional)">
            <input 
              type="number" 
              placeholder="e.g. 1" 
              value={periodNumber} 
              onChange={e => setPeriodNumber(e.target.value)}
              className="input h-12 rounded-xl" 
            />
          </FormField>

          <FormField label="Marking Date" required>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="input h-12 rounded-xl" />
          </FormField>
        </div>
      </section>

      {/* 2. Roster and Search */}
      {selectedClass ? (
        <div className="space-y-4 animate-slide-up">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                placeholder="Search students..." 
                className="input pl-10 h-10 bg-white border-slate-200"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button 
                variant="secondary" 
                size="sm" 
                className="flex-1 md:flex-initial text-emerald-600 border-emerald-100 bg-emerald-50 hover:bg-emerald-100"
                onClick={() => markAll('PRESENT')}
              >
                All Present
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                className="flex-1 md:flex-initial text-rose-600 border-rose-100 bg-rose-50 hover:bg-rose-100"
                onClick={() => markAll('ABSENT')}
              >
                All Absent
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-slate-400 font-medium">Syncing class roster...</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-16 text-center">
                 <p className="text-slate-400">No students found matching your criteria.</p>
              </div>
            ) : (
              filteredStudents.map((s, index) => (
                <div 
                  key={s.id} 
                  className={`bg-white rounded-2xl p-4 border transition-all flex items-center justify-between gap-4 group hover:shadow-md
                    ${attendance[s.id] === 'ABSENT' ? 'border-rose-100 bg-rose-50/10' : 'border-slate-100'}
                  `}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-400 text-sm overflow-hidden shrink-0">
                      {s.profilePhoto ? (
                        <img src={fileApi.toPublicUrl(s.profilePhoto)} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <>{s.firstName?.[0]}{s.lastName?.[0]}</>
                      )}
                    </div>
                    <div className="truncate">
                      <p className="font-bold text-slate-800 text-sm truncate leading-tight">
                        {s.firstName} {s.lastName}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">
                        {s.studentId} • ROLL #{(index + 1).toString().padStart(2, '0')}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-1.5 shrink-0">
                    {STATUS_OPTIONS.map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => updateStatus(s.id, opt.id)}
                        className={`w-10 h-10 md:w-12 md:h-11 rounded-xl flex flex-col items-center justify-center transition-all relative overflow-hidden
                          ${attendance[s.id] === opt.id 
                            ? `${opt.color} text-white shadow-lg ring-2 ring-offset-2 ring-slate-50` 
                            : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-500'
                          }`}
                      >
                        <span className="text-[11px] md:text-xs font-black leading-none">{opt.label}</span>
                        {attendance[s.id] === opt.id && (
                          <div className="absolute bottom-1 opacity-40">{opt.icon}</div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] py-32 text-center">
           <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center text-4xl mx-auto mb-6">📅</div>
           <h3 className="text-slate-800 font-bold text-xl">Operational Speed Mode</h3>
           <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto">Select a class from the configuration above to load the student roster and finalize daily records.</p>
        </div>
      )}

      {/* 3. Sticky Action Bar */}
      {selectedClass && students.length > 0 && (
        <div className="fixed bottom-[88px] lg:bottom-10 left-6 right-6 md:left-auto md:right-12 md:w-[480px] z-50 animate-bounce-in">
          <div className="bg-slate-900 rounded-[2rem] p-5 shadow-2xl border border-slate-800 flex items-center justify-between gap-6 overflow-hidden relative">
            {/* Visual gradient backdrop */}
            <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none"></div>
            
            <div className="flex gap-4 relative z-10">
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-500 uppercase font-black tracking-[0.15em] mb-1">Present</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-emerald-400 leading-none">{stats.present}</span>
                  <span className="text-xs text-slate-600">/ {students.length}</span>
                </div>
              </div>
              <div className="w-px h-10 bg-slate-800 my-auto"></div>
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-500 uppercase font-black tracking-[0.15em] mb-1">Exceptions</span>
                <span className="text-2xl font-black text-rose-400 leading-none">
                  {stats.absent + stats.halfDay + stats.late}
                </span>
              </div>
            </div>

            <Button 
              variant="primary" 
              loading={saving} 
              onClick={handleSave}
              className="h-14 px-8 bg-indigo-600 hover:bg-indigo-500 border-none rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 group relative z-10"
            >
              Finalize Records
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;
