import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FiCheck, FiX, FiClock, FiZap, FiSave, FiInfo,
  FiUsers, FiSearch, FiBookmark, FiLock, FiUnlock, FiChevronDown
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const STATUS_OPTS = [
  { id: 'PRESENT', icon: FiCheck,  color: 'emerald', key: 'p', label: 'Present' },
  { id: 'ABSENT',  icon: FiX,      color: 'rose',    key: 'a', label: 'Absent'  },
  { id: 'LATE',    icon: FiClock,  color: 'amber',   key: 'l', label: 'Late'    },
];

const AUTO_SAVE_INTERVAL_MS = 30_000; // 30 seconds

const QuickAttendance = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const toast = useToast();

  const [scope, setScope] = useState({ students: [], assignedClasses: [], subjects: [] });
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState(1);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [draftId, setDraftId] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const autoSaveRef = useRef(null);

  // URL param pre-fill (from timetable navigation)
  const urlClassRoomId = searchParams.get('classRoomId');
  const urlSubjectId   = searchParams.get('subjectId');
  const urlPeriod      = searchParams.get('period');
  const urlDate        = searchParams.get('date');

  useEffect(() => {
    if (urlDate) setDate(urlDate);
    if (urlPeriod) setSelectedPeriod(Number(urlPeriod));
  }, [urlDate, urlPeriod]);

  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/teacher/scope');
      const data = res.data.data;
      setScope(data);

      const firstClass = urlClassRoomId
        ? data.assignedClasses?.find(c => String(c.id) === String(urlClassRoomId))?.id || data.assignedClasses?.[0]?.id
        : data.assignedClasses?.[0]?.id;

      const firstSubject = urlSubjectId
        ? Number(urlSubjectId)
        : null;

      if (firstClass) {
        setSelectedClass(firstClass);
        if (firstSubject) setSelectedSubject(firstSubject);
        initAttendance(data.students, firstClass);
      }
    } catch {
      toast.error('Failed to load classroom data');
    } finally {
      setLoading(false);
    }
  }, [urlClassRoomId, urlSubjectId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchInitialData(); }, [fetchInitialData]);

  // Restore draft when class/subject/period/date changes
  useEffect(() => {
    if (!selectedClass) return;
    const restoreDraft = async () => {
      try {
        const params = new URLSearchParams({
          classRoomId: selectedClass,
          date,
          ...(selectedPeriod && { periodNumber: selectedPeriod }),
          ...(selectedSubject && { subjectId: selectedSubject }),
        });
        const res = await api.get(`/attendance/draft?${params}`);
        const draft = res.data.data;
        if (draft && draft.draftData) {
          try {
            const parsed = JSON.parse(draft.draftData);
            setAttendance(parsed);
            setDraftId(draft.id);
            setIsLocked(draft.isLocked);
            if (draft.isLocked) toast.info('This session is locked.');
            else toast.info('Draft restored from auto-save.');
          } catch { /* ignore parse errors */ }
        }
      } catch { /* no draft found is fine */ }
    };
    restoreDraft();
  }, [selectedClass, date, selectedPeriod, selectedSubject]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load templates for this class
  useEffect(() => {
    if (!selectedClass) return;
    api.get(`/attendance/templates?classRoomId=${selectedClass}`)
      .then(res => setTemplates(res.data.data || []))
      .catch(() => {});
  }, [selectedClass]);

  // Auto-save every 30 seconds
  useEffect(() => {
    clearInterval(autoSaveRef.current);
    if (isLocked) return;
    autoSaveRef.current = setInterval(() => {
      autoSaveDraft();
    }, AUTO_SAVE_INTERVAL_MS);
    return () => clearInterval(autoSaveRef.current);
  }, [attendance, selectedClass, date, selectedPeriod, selectedSubject, isLocked]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keyboard shortcuts
  useEffect(() => {
    const students = filteredStudents;
    const handleKey = (e) => {
      if (isLocked || e.target.tagName === 'INPUT') return;
      const student = students[focusedIndex];
      if (!student) return;

      if (e.key === 'p' || e.key === 'P') {
        handleStatusChange(student.id, 'PRESENT');
        setFocusedIndex(i => Math.min(i + 1, students.length - 1));
      } else if (e.key === 'a' || e.key === 'A') {
        handleStatusChange(student.id, 'ABSENT');
        setFocusedIndex(i => Math.min(i + 1, students.length - 1));
      } else if (e.key === 'l' || e.key === 'L') {
        handleStatusChange(student.id, 'LATE');
        setFocusedIndex(i => Math.min(i + 1, students.length - 1));
      } else if (e.key === 'ArrowDown') {
        setFocusedIndex(i => Math.min(i + 1, students.length - 1));
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        setFocusedIndex(i => Math.max(i - 1, 0));
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [focusedIndex, isLocked]); // eslint-disable-line react-hooks/exhaustive-deps

  const initAttendance = (allStudents, classId) => {
    const classStudents = allStudents.filter(s => s.classId === classId);
    const init = {};
    classStudents.forEach(s => { init[s.id] = 'PRESENT'; });
    setAttendance(init);
    setDraftId(null);
    setIsLocked(false);
  };

  const handleClassChange = (classId) => {
    setSelectedClass(classId);
    setSelectedSubject('');
    initAttendance(scope.students, classId);
  };

  const handleStatusChange = (studentId, status) => {
    if (isLocked) return;
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const markAll = (status) => {
    if (isLocked) return;
    const current = scope.students.filter(s => s.classId === selectedClass);
    const bulk = {};
    current.forEach(s => { bulk[s.id] = status; });
    setAttendance(bulk);
    toast.success(`All marked ${status}`);
  };

  const autoSaveDraft = useCallback(async () => {
    if (!selectedClass || Object.keys(attendance).length === 0) return;
    try {
      const payload = {
        classRoomId: selectedClass,
        date,
        periodNumber: selectedPeriod,
        subjectId: selectedSubject || null,
        draftData: JSON.stringify(attendance),
      };
      const res = await api.post('/attendance/draft', payload);
      setDraftId(res.data.data?.id);
      setLastSaved(new Date().toLocaleTimeString());
    } catch { /* silent */ }
  }, [attendance, selectedClass, date, selectedPeriod, selectedSubject]);

  const lockDraft = async () => {
    if (!draftId) {
      await autoSaveDraft();
      toast.info('Draft saved first, then locked.');
    }
    try {
      await api.patch(`/attendance/draft/${draftId}/lock`);
      setIsLocked(true);
      toast.success('Session locked!');
    } catch {
      toast.error('Failed to lock session');
    }
  };

  const saveAttendance = async () => {
    try {
      setSaving(true);
      const payload = {
        classRoomId: selectedClass,
        attendance_date: date,
        attendanceList: Object.entries(attendance).map(([studentId, status]) => ({
          studentId: Number(studentId),
          status
        }))
      };
      await api.post('/attendance/bulk', payload);
      await autoSaveDraft();
      toast.success('Attendance synced successfully!');
    } catch {
      toast.error('Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  const applyTemplate = (tpl) => {
    if (isLocked) return;
    try {
      const parsed = JSON.parse(tpl.templateData);
      setAttendance(parsed);
      toast.success(`Template "${tpl.name}" applied`);
    } catch {
      toast.error('Invalid template data');
    }
    setShowTemplates(false);
  };

  const saveTemplate = async () => {
    if (!templateName.trim()) { toast.error('Enter a template name'); return; }
    setSavingTemplate(true);
    try {
      const payload = {
        classRoomId: selectedClass,
        name: templateName,
        templateData: JSON.stringify(attendance),
      };
      await api.post('/attendance/templates', payload);
      toast.success('Template saved!');
      setTemplateName('');
      setShowTemplates(false);
      // Refresh templates
      const res = await api.get(`/attendance/templates?classRoomId=${selectedClass}`);
      setTemplates(res.data.data || []);
    } catch {
      toast.error('Failed to save template');
    } finally {
      setSavingTemplate(false);
    }
  };

  const filteredStudents = useMemo(() => {
    const classStudents = (scope.students || []).filter(s => s.classId === selectedClass);
    return classStudents.filter(s =>
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(s.studentId).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [scope.students, selectedClass, searchTerm]);

  const presentCount = Object.values(attendance).filter(v => v === 'PRESENT').length;
  const absentCount  = Object.values(attendance).filter(v => v === 'ABSENT').length;
  const lateCount    = Object.values(attendance).filter(v => v === 'LATE').length;

  if (loading) return <div className="p-10 flex justify-center"><LoadingSpinner /></div>;

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto animate-fade-in">

      {/* ── HEADER ── */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Quick Attendance</h1>
          <div className="flex items-center gap-2 mt-0.5">
            {isLocked
              ? <span className="flex items-center gap-1 text-[10px] font-black text-rose-500 uppercase tracking-widest"><FiLock size={10} /> Locked</span>
              : lastSaved
                ? <span className="text-[10px] font-bold text-slate-400">Auto-saved at {lastSaved}</span>
                : <span className="text-[10px] font-bold text-slate-300">Not saved yet</span>
            }
          </div>
        </div>
        {!isLocked && draftId && (
          <button onClick={lockDraft}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-rose-50 text-rose-500 text-[10px] font-black uppercase tracking-widest active:scale-90 transition-all">
            <FiLock size={13} /> Lock
          </button>
        )}
      </div>

      {/* ── DATE + PERIOD ── */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Date</label>
          <input type="date" value={date} onChange={e => { setDate(e.target.value); }}
            className="w-full h-11 px-4 rounded-2xl border border-slate-200 text-sm font-semibold bg-white" />
        </div>
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Period</label>
          <input type="number" min={1} max={10} value={selectedPeriod}
            onChange={e => setSelectedPeriod(Number(e.target.value))}
            className="w-full h-11 px-4 rounded-2xl border border-slate-200 text-sm font-semibold bg-white" />
        </div>
      </div>

      {/* ── CLASS SELECTOR ── */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-3 no-scrollbar">
        {scope.assignedClasses?.map(c => (
          <button key={c.id} onClick={() => handleClassChange(c.id)}
            className={`shrink-0 px-4 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all
              ${selectedClass === c.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-slate-400 border border-slate-100'}`}>
            {c.name}
          </button>
        ))}
      </div>

      {/* ── STATS BAR ── */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: 'Present', count: presentCount, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Absent',  count: absentCount,  color: 'text-rose-600 bg-rose-50'   },
          { label: 'Late',    count: lateCount,    color: 'text-amber-600 bg-amber-50' },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-2xl p-3 text-center`}>
            <div className="text-xl font-black">{s.count}</div>
            <div className="text-[9px] font-black uppercase tracking-widest opacity-70">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── SEARCH ── */}
      <div className="relative mb-3">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input type="text" placeholder="Search by name or ID..." value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full h-12 pl-11 pr-4 bg-white rounded-2xl border border-slate-100 font-semibold text-sm focus:border-indigo-400 outline-none" />
      </div>

      {/* ── ACTIONS ROW ── */}
      <div className="flex gap-2 mb-4">
        <button onClick={() => markAll('PRESENT')} disabled={isLocked}
          className="flex-1 h-11 bg-emerald-50 text-emerald-700 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-1.5 active:scale-95 transition-all disabled:opacity-40">
          <FiZap size={13} /> All Present
        </button>
        <button onClick={() => markAll('ABSENT')} disabled={isLocked}
          className="flex-1 h-11 bg-rose-50 text-rose-600 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-1.5 active:scale-95 transition-all disabled:opacity-40">
          <FiX size={13} /> All Absent
        </button>
        {/* Templates */}
        <div className="relative">
          <button onClick={() => setShowTemplates(v => !v)}
            className="h-11 px-3 bg-indigo-50 text-indigo-600 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center gap-1.5 active:scale-95 transition-all">
            <FiBookmark size={13} /> <FiChevronDown size={11} />
          </button>
          {showTemplates && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden">
              <div className="p-3 border-b border-slate-50">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Save Current as Template</p>
                <div className="flex gap-2">
                  <input type="text" placeholder="Template name" value={templateName}
                    onChange={e => setTemplateName(e.target.value)}
                    className="flex-1 h-9 px-3 rounded-xl border border-slate-200 text-xs font-semibold" />
                  <button onClick={saveTemplate} disabled={savingTemplate}
                    className="h-9 px-3 bg-indigo-600 text-white rounded-xl text-[9px] font-black">
                    {savingTemplate ? '...' : 'Save'}
                  </button>
                </div>
              </div>
              <div className="max-h-40 overflow-y-auto">
                {templates.length === 0
                  ? <p className="text-center text-xs text-slate-400 py-4">No saved templates</p>
                  : templates.map(t => (
                    <button key={t.id} onClick={() => applyTemplate(t)}
                      className="w-full text-left px-4 py-3 hover:bg-indigo-50 text-sm font-semibold text-slate-700 transition-colors">
                      {t.name}
                    </button>
                  ))
                }
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── KEYBOARD HINT ── */}
      <div className="bg-slate-50 rounded-2xl px-4 py-2.5 mb-4 flex items-center gap-3">
        <FiInfo size={14} className="text-slate-400 shrink-0" />
        <span className="text-[10px] font-bold text-slate-400">
          Keyboard: <kbd className="bg-white border border-slate-200 px-1.5 rounded">P</kbd> Present &nbsp;
          <kbd className="bg-white border border-slate-200 px-1.5 rounded">A</kbd> Absent &nbsp;
          <kbd className="bg-white border border-slate-200 px-1.5 rounded">L</kbd> Late &nbsp;
          <kbd className="bg-white border border-slate-200 px-1.5 rounded">↑↓</kbd> Navigate
        </span>
      </div>

      {/* ── STUDENT LIST ── */}
      <div className="space-y-2 pb-28">
        {filteredStudents.map((student, i) => {
          const status = attendance[student.id] || 'PRESENT';
          const isFocused = focusedIndex === i;
          return (
            <div key={student.id}
              onClick={() => setFocusedIndex(i)}
              className={`bg-white p-4 rounded-[1.75rem] shadow-sm border flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer
                ${isFocused ? 'border-indigo-300 ring-2 ring-indigo-100' : 'border-slate-50'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-xs shadow-inner
                  ${status === 'PRESENT' ? 'bg-emerald-50 text-emerald-700'
                  : status === 'ABSENT'  ? 'bg-rose-50 text-rose-600'
                  : 'bg-amber-50 text-amber-600'}`}>
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm">{student.firstName} {student.lastName}</h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{student.studentId}</p>
                </div>
              </div>
              <div className="flex gap-1.5">
                {STATUS_OPTS.map(opt => (
                  <button key={opt.id}
                    onClick={e => { e.stopPropagation(); handleStatusChange(student.id, opt.id); }}
                    disabled={isLocked}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90 disabled:opacity-40
                      ${status === opt.id
                        ? `bg-${opt.color}-500 text-white shadow-lg shadow-${opt.color}-200`
                        : `bg-slate-50 text-slate-300 hover:bg-${opt.color}-50 hover:text-${opt.color}-500`}`}>
                    <opt.icon size={17} />
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        {filteredStudents.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
            <FiUsers size={40} className="mx-auto text-slate-200 mb-3" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No students found</p>
          </div>
        )}
      </div>

      {/* ── FLOATING SAVE BUTTON ── */}
      <div className="fixed bottom-24 left-0 right-0 px-4 max-w-2xl mx-auto z-40">
        <button onClick={saveAttendance} disabled={saving || isLocked}
          className="w-full h-14 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-2xl shadow-indigo-300 active:scale-95 transition-all disabled:opacity-50">
          {saving ? <LoadingSpinner size="sm" /> : <><FiSave size={18} /> Sync Attendance Now</>}
        </button>
      </div>
    </div>
  );
};

export default QuickAttendance;
