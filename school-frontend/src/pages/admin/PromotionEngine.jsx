// src/pages/admin/PromotionEngine.jsx
import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import { useToast } from '../../hooks/useToast';
import PageHeader from '../../components/common/PageHeader';
import Loading from '../../components/common/Loading';
import { FiArrowRight, FiAlertTriangle, FiCheckCircle, FiClock, FiList } from 'react-icons/fi';

const PromotionEngine = () => {
  const toast = useToast();

  // ── Data state ──────────────────────────────────────────────────────────
  const [classes, setClasses] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [students, setStudents] = useState([]);
  const [history, setHistory] = useState([]);

  // ── UI state ────────────────────────────────────────────────────────────
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [view, setView] = useState('wizard'); // 'wizard' | 'history'

  // ── Form state ──────────────────────────────────────────────────────────
  const [sourceClassId, setSourceClassId] = useState('');
  const [targetClassId, setTargetClassId] = useState('');
  const [sourceYearId, setSourceYearId] = useState('');
  const [targetYearId, setTargetYearId] = useState('');
  const [selectedKeys, setSelectedKeys] = useState([]); // student ids to PROMOTE

  // ── Load classes + academic years ────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const [classRes, yearRes] = await Promise.all([
          api.get('/classes'),
          api.get('/sessions'),
        ]);
        setClasses(classRes.data?.data ?? classRes.data ?? []);
        setAcademicYears(yearRes.data?.data ?? yearRes.data ?? []);
      } catch {
        toast.error('Failed to load class / year data.');
      } finally {
        setLoadingClasses(false);
      }
    };
    load();
  }, []);

  // ── Load students when source class changes ──────────────────────────────
  const fetchStudents = useCallback(async () => {
    if (!sourceClassId) return;
    setLoadingStudents(true);
    setStudents([]);
    setSelectedKeys([]);
    try {
      const res = await api.get(`/admin/promotion/students?classId=${sourceClassId}`);
      setStudents(res.data?.data ?? res.data ?? []);
    } catch {
      toast.error('Failed to load students for selected class.');
    } finally {
      setLoadingStudents(false);
    }
  }, [sourceClassId]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  // ── Toggle student selection ─────────────────────────────────────────────
  const toggleStudent = (id) => {
    setSelectedKeys(prev =>
      prev.includes(id) ? prev.filter(k => k !== id) : [...prev, id]
    );
  };

  const selectAll = () => setSelectedKeys(students.map(s => s.id));
  const selectNone = () => setSelectedKeys([]);

  // ── Execute promotion ────────────────────────────────────────────────────
  const executePromotion = async () => {
    if (!sourceClassId || !targetClassId || !sourceYearId || !targetYearId) {
      return toast.error('Please select source class, target class, and both academic years.');
    }
    if (selectedKeys.length === 0) {
      return toast.error('Select at least one student to promote.');
    }
    if (!window.confirm(`Promote ${selectedKeys.length} students? This action cannot be undone.`)) return;

    const allIds = students.map(s => s.id);
    const failedIds = allIds.filter(id => !selectedKeys.includes(id));

    setExecuting(true);
    try {
      await api.post('/admin/promotion/execute', {
        sourceClassId: Number(sourceClassId),
        targetClassId: Number(targetClassId),
        sourceYearId:  Number(sourceYearId),
        targetYearId:  Number(targetYearId),
        promotedStudentIds: selectedKeys,
        failedStudentIds: failedIds,
        adminId: 1, // current user id — replace with auth context if needed
      });
      toast.success(`✅ Promoted ${selectedKeys.length} students. ${failedIds.length} retained.`);
      // Reset
      setSelectedKeys([]);
      setStudents([]);
      setSourceClassId('');
      setTargetClassId('');
    } catch {
      toast.error('Promotion failed. Please try again.');
    } finally {
      setExecuting(false);
    }
  };

  // ── Load promotion history ───────────────────────────────────────────────
  const loadHistory = async () => {
    try {
      const res = await api.get('/admin/promotion/history');
      setHistory(res.data?.data ?? res.data ?? []);
    } catch {
      toast.error('Failed to load history.');
    }
    setView('history');
  };

  if (loadingClasses) return <Loading fullScreen />;

  return (
    <>
      <PageHeader
        title="Student Promotion Engine"
        subtitle="Bulk promote students to the next class for the new academic year."
        actions={
          <div className="flex gap-2">
            <button
              onClick={() => setView('wizard')}
              className={`btn-secondary flex items-center gap-2 ${view === 'wizard' ? 'ring-2 ring-blue-400' : ''}`}
            >
              <FiArrowRight /> Promote
            </button>
            <button
              onClick={loadHistory}
              className={`btn-secondary flex items-center gap-2 ${view === 'history' ? 'ring-2 ring-blue-400' : ''}`}
            >
              <FiList /> History
            </button>
          </div>
        }
      />

      {view === 'wizard' && (
        <div className="animate-fade-in space-y-6">
          {/* Configuration Card */}
          <div className="card p-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-4">Step 1 — Configure Promotion</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="form-label">Source Academic Year</label>
                <select className="form-input" value={sourceYearId} onChange={e => setSourceYearId(e.target.value)}>
                  <option value="">Select year</option>
                  {academicYears.map(y => <option key={y.id} value={y.id}>{y.label || y.name}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Source Class (Promoting FROM)</label>
                <select className="form-input" value={sourceClassId} onChange={e => setSourceClassId(e.target.value)}>
                  <option value="">Select class</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name}{c.section ? ` - ${c.section}` : ''}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Target Academic Year</label>
                <select className="form-input" value={targetYearId} onChange={e => setTargetYearId(e.target.value)}>
                  <option value="">Select year</option>
                  {academicYears.map(y => <option key={y.id} value={y.id}>{y.label || y.name}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Target Class (Promoting TO)</label>
                <select className="form-input" value={targetClassId} onChange={e => setTargetClassId(e.target.value)}>
                  <option value="">Select class</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name}{c.section ? ` - ${c.section}` : ''}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Alert */}
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
            <FiAlertTriangle className="mt-0.5 flex-shrink-0" />
            <p><strong>Important:</strong> Checked (✅) students will be promoted to the Target Class. Unchecked students will be <strong>retained</strong> in the Source Class (repeat/detained).</p>
          </div>

          {/* Students Table */}
          <div className="card !p-0 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-500">
                Step 2 — Select Students to Promote
                {students.length > 0 && <span className="ml-2 font-normal text-gray-400">({selectedKeys.length} / {students.length} selected)</span>}
              </h3>
              {students.length > 0 && (
                <div className="flex gap-2">
                  <button onClick={selectAll} className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase">All</button>
                  <span className="text-gray-300">|</span>
                  <button onClick={selectNone} className="text-xs font-bold text-red-500 hover:text-red-700 uppercase">None</button>
                </div>
              )}
            </div>

            {loadingStudents && (
              <div className="flex items-center justify-center py-10 text-gray-400">
                <FiClock className="animate-spin mr-2" /> Loading students...
              </div>
            )}

            {!loadingStudents && students.length === 0 && sourceClassId && (
              <p className="text-center text-gray-400 py-8 text-sm">No students in selected class.</p>
            )}
            {!loadingStudents && !sourceClassId && (
              <p className="text-center text-gray-400 py-8 text-sm">Select a source class to load students.</p>
            )}

            {students.length > 0 && !loadingStudents && (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Promote?</th>
                    <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Student ID</th>
                    <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Name</th>
                    <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Roll No</th>
                    <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {students.map(s => {
                    const checked = selectedKeys.includes(s.id);
                    return (
                      <tr
                        key={s.id}
                        onClick={() => toggleStudent(s.id)}
                        className={`cursor-pointer transition-colors ${checked ? 'bg-green-50 hover:bg-green-100' : 'hover:bg-gray-50'}`}
                      >
                        <td className="px-6 py-3">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${checked ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                            {checked && <FiCheckCircle className="text-white w-3.5 h-3.5" />}
                          </div>
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-500 font-mono">{s.studentId}</td>
                        <td className="px-6 py-3 text-sm font-semibold text-gray-800">{s.firstName} {s.lastName}</td>
                        <td className="px-6 py-3 text-sm text-gray-500">{s.rollNumber || '—'}</td>
                        <td className="px-6 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${checked ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {checked ? 'Promote' : 'Retain'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Execute Button */}
          {students.length > 0 && (
            <div className="flex justify-end">
              <button
                id="btn-execute-promotion"
                onClick={executePromotion}
                disabled={executing || selectedKeys.length === 0}
                className="btn-primary flex items-center gap-2 px-8 py-3 text-sm disabled:opacity-50"
              >
                {executing ? 'Processing...' : `🚀 Execute Promotion (${selectedKeys.length} students)`}
              </button>
            </div>
          )}
        </div>
      )}

      {view === 'history' && (
        <div className="animate-fade-in card !p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-500">Promotion History</h3>
          </div>
          {history.length === 0 ? (
            <p className="text-center text-gray-400 py-8 text-sm">No promotions have been executed yet.</p>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Date</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">From Class</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">To Class</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Total</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Promoted</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Retained</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {history.map(h => (
                  <tr key={h.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm text-gray-500">{h.executedAt ? new Date(h.executedAt).toLocaleDateString() : '—'}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">{h.sourceClass?.name} {h.sourceClass?.section}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">{h.targetClass?.name} {h.targetClass?.section}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">{h.totalStudents}</td>
                    <td className="px-6 py-3"><span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">{h.promotedCount}</span></td>
                    <td className="px-6 py-3"><span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">{h.failedCount}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </>
  );
};

export default PromotionEngine;
