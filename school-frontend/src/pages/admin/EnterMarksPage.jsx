import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { examApi } from '../../api/examApi';
import { classApi } from '../../api/classApi';
import { studentApi } from '../../api/studentApi';
import { fileApi } from '../../api/fileApi';
import api from '../../api/axios';
import usePersistedForm from '../../hooks/usePersistedForm';

const EnterMarksPage = () => {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  
  const [allExams, setAllExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState(id ? Number(id) : null);
  const [selectedSubjectName, setSelectedSubjectName] = useState('');
  const [exam, setExam]         = useState(null);
  const [students, setStudents] = useState([]);
  const [classes, setClasses]   = useState([]);
  const [marks, setMarks]       = useState({});
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);

  const isTeacher = user?.role === 'TEACHER';

  // ── Persistent Marks State ────────────────────────────────────────────────
  const { 
    formData: persistedMarks, 
    setFormData: setPersistedMarks,
    clearDraft,
    isRestored
  } = usePersistedForm(selectedExamId ? `enter_marks_form_${selectedExamId}` : null, {});

  useEffect(() => {
    const preferredIdFromRoute = id ? Number(id) : null;
    
    const loadInitial = async () => {
      try {
        setLoading(true);
        let exams = [];
        let classList = [];

        if (isTeacher) {
          const scopeRes = await api.get('/teacher/scope');
          exams = scopeRes.data.data.exams || [];
          classList = scopeRes.data.data.assignedClasses || [];
        } else {
          const [examRes, classRes] = await Promise.all([examApi.getAll(), classApi.getAll()]);
          exams = examRes.data.data || [];
          classList = classRes.data.data || [];
        }

        setAllExams(exams);
        setClasses(classList);

        const preferredId = preferredIdFromRoute || (exams[0]?.id ?? null);
        setSelectedExamId(preferredId);
      } catch (err) {
        toast.showToast(err.response?.data?.message || 'Failed to load exams data.', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadInitial();
  }, [id, isTeacher]);

  useEffect(() => {
    if (!allExams.length || !selectedExamId) {
      setLoading(false);
      return;
    }

    const selected = allExams.find((x) => x.id === Number(selectedExamId));
    setExam(selected || null);
    setSelectedSubjectName(selected?.subjectName || '');

    if (!selected?.className) {
      setStudents([]);
      setMarks({});
      setLoading(false);
      return;
    }

    // Match class by name since that's what the exam object has
    const targetClass = classes.find((c) => `${c.name} - ${c.section}` === selected.className || c.name === selected.className);
    
    if (!targetClass) {
      setStudents([]);
      setMarks({});
      setLoading(false);
      return;
    }

    setLoading(true);
    studentApi.byClass(targetClass.id)
      .then((sRes) => {
        const list = sRes.data.data || [];
        setStudents(list);
        
        // Fetch existing marks for this exam to pre-populate
        return examApi.getMarks(selectedExamId).then(mRes => {
          const existingMarks = mRes.data.data || [];
          const init = {};
          
          list.forEach((s) => {
            // Priority: Persisted Draft > Existing DB Marks > Empty
            if (persistedMarks && persistedMarks[s.id]) {
              init[s.id] = persistedMarks[s.id];
            } else {
              const existing = existingMarks.find(m => m.studentCode === s.studentId);
              if (existing) {
                init[s.id] = { 
                  marksObtained: existing.marksObtained ?? '', 
                  absent: existing.absent || false 
                };
              } else {
                init[s.id] = { marksObtained: '', absent: false };
              }
            }
          });
          setMarks(init);
        });
      })
      .catch((err) => {
        toast.showToast(err.response?.data?.message || 'Failed to load students for selected exam.', 'error');
      })
      .finally(() => setLoading(false));
  }, [allExams, selectedExamId, classes]);

  // Sync back to persistence on change
  const handleChange = (studentId, field, value) => {
    const newMarks = {
      ...marks,
      [studentId]: { ...marks[studentId], [field]: value }
    };
    setMarks(newMarks);
    setPersistedMarks(newMarks);
  };

  const handleSubmit = async () => {
    if (!selectedExamId) {
      toast.showToast('Please select an exam first.', 'error');
      return;
    }

    setSaving(true);
    try {
      const marksList = students.map(s => ({
        studentId:      s.id,
        marksObtained:  marks[s.id]?.absent
                        ? null
                        : marks[s.id]?.marksObtained === '' ? null : Number(marks[s.id]?.marksObtained),
        absent:         marks[s.id]?.absent || false,
      }));
      await examApi.enterMarks({ examId: Number(selectedExamId), marks: marksList });
      toast.showToast('Marks saved successfully!', 'success');
      clearDraft();
      
      // Navigate back
      setTimeout(() => {
        navigate(isTeacher ? '/teacher/exams' : '/admin/exams');
      }, 1500);
    } catch (err) {
      toast.showToast(err.response?.data?.message || 'Failed to save marks.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 flex justify-center"><LoadingSpinner /></div>;

  return (
    <div className="px-6 py-8">
      <PageHeader 
        title={`Enter Marks ${exam?.name ? `(${exam.name})` : ''}`} 
        subtitle={isTeacher ? "Home > Teacher > Exams > Enter Marks" : "Home > Academic > Exams > Enter Marks"} 
      />

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-50 overflow-hidden mt-6">
        <div className="p-6 border-b bg-slate-50/50 flex flex-col lg:flex-row gap-6 lg:items-end lg:justify-between">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full lg:max-w-2xl">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Select Exam</label>
              <select
                value={selectedExamId || ''}
                onChange={(e) => setSelectedExamId(Number(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-indigo-500 shadow-sm transition-all"
              >
                {allExams.map((e) => (
                  <option key={e.id} value={e.id}>{e.name} ({e.className})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Subject</label>
              <input 
                type="text"
                disabled
                value={selectedSubjectName}
                className="w-full bg-slate-100 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => clearDraft(true)}
              className="text-slate-400 hover:text-rose-500 text-[10px] font-black uppercase tracking-widest px-4"
            >
              🗑️ Clear Draft
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 shadow-lg shadow-slate-200 active:scale-95 transition-all"
            >
              {saving ? 'Saving...' : 'Publish Marks'}
            </button>
            <button 
              onClick={() => navigate(isTeacher ? '/teacher/exams' : '/admin/exams')} 
              className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 px-4"
            >
              Cancel
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-100">
              <tr>
                <th className="text-left px-6 py-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Student Name</th>
                <th className="text-left px-6 py-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Student ID</th>
                <th className="text-left px-6 py-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Class</th>
                <th className="text-left px-6 py-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Marks Obtained</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {students.map((s, i) => (
                <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 overflow-hidden flex items-center justify-center text-indigo-600 text-[10px] font-black border border-indigo-100 shadow-sm">
                        {s.profilePhoto ? (
                          <img src={fileApi.toPublicUrl(s.profilePhoto)} alt={s.firstName} className="w-10 h-10 object-cover" />
                        ) : (
                          <>{s.firstName?.[0]}{s.lastName?.[0]}</>
                        )}
                      </div>
                      <span className="font-black text-slate-900">{s.firstName} {s.lastName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {s.studentId}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                      {exam?.className || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-32">
                        <input
                          type="number"
                          min="0"
                          max={exam?.totalMarks}
                          value={marks[s.id]?.marksObtained || ''}
                          onChange={e => handleChange(s.id, 'marksObtained', e.target.value)}
                          disabled={marks[s.id]?.absent}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-indigo-500 shadow-sm disabled:bg-slate-100 disabled:text-slate-300"
                          placeholder="Score"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">Pass: {exam?.passingMarks || 33}</span>
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter leading-none">Max: {exam?.totalMarks || 100}</span>
                      </div>
                      <label className="ml-4 flex items-center gap-2 cursor-pointer group">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={marks[s.id]?.absent || false}
                            onChange={e => handleChange(s.id, 'absent', e.target.checked)}
                            className="peer sr-only"
                          />
                          <div className="w-5 h-5 bg-white border-2 border-slate-200 rounded-lg peer-checked:bg-rose-500 peer-checked:border-rose-500 transition-all flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-all"></div>
                          </div>
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-rose-500 transition-colors">Absent</span>
                      </label>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EnterMarksPage;
