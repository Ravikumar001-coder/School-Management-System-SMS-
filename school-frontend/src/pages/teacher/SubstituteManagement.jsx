import React, { useState, useEffect, useCallback } from 'react';
import {
  FiPlus, FiUsers, FiCalendar, FiRefreshCw, FiCheck,
  FiX, FiSearch, FiClock, FiAlertCircle
} from 'react-icons/fi';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const STATUS = {
  ASSIGNED:  'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-slate-100 text-slate-500',
};

const today = () => new Date().toISOString().split('T')[0];

const SubstituteManagement = () => {
  const toast = useToast();
  const [tab, setTab] = useState('my'); // my | raised | assign
  const [date, setDate] = useState(today());
  const [subs, setSubs] = useState([]);
  const [scope, setScope] = useState({ assignedClasses: [], subjects: [], teachers: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    substituteTeacherId: '', classRoomId: '', subjectId: '',
    periodNumber: 1, assignmentDate: today(), notes: ''
  });

  const fetchSubs = useCallback(async () => {
    try {
      setLoading(true);
      const endpoint = tab === 'my'     ? `/teacher/substitutes/my?date=${date}`
                     : tab === 'raised' ? `/teacher/substitutes/raised?date=${date}`
                     :                   null;
      if (!endpoint) { setSubs([]); return; }
      const res = await api.get(endpoint);
      setSubs(res.data.data || []);
    } catch {
      toast.error('Failed to load substitutions');
    } finally {
      setLoading(false);
    }
  }, [tab, date]);

  const fetchScope = useCallback(async () => {
    try {
      const [scopeRes, teachersRes] = await Promise.all([
        api.get('/teacher/scope'),
        api.get('/teachers') // or /admin/teachers depending on backend
      ]);
      setScope({
        ...scopeRes.data.data,
        teachers: teachersRes.data.data || teachersRes.data || []
      });
    } catch {
      // teachers may not load for TEACHER role; that's OK
    }
  }, []);

  useEffect(() => { fetchScope(); }, [fetchScope]);
  useEffect(() => { if (tab !== 'assign') fetchSubs(); else setLoading(false); }, [fetchSubs, tab]);

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!form.substituteTeacherId || !form.classRoomId || !form.subjectId) {
      toast.error('Fill all required fields');
      return;
    }
    try {
      setSaving(true);
      await api.post('/teacher/substitutes', form);
      toast.success('Substitute assigned!');
      setTab('raised');
      setDate(form.assignmentDate);
    } catch {
      toast.error('Failed to assign substitute');
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/teacher/substitutes/${id}/status`, { status });
      toast.success(`Marked ${status.toLowerCase()}`);
      fetchSubs();
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">Substitutes</h1>
        <p className="text-xs text-slate-400 font-semibold mt-0.5 uppercase tracking-widest">Manage class coverage</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 bg-slate-100 p-1 rounded-2xl">
        {[
          { key: 'my',     label: 'Assigned to Me' },
          { key: 'raised', label: 'I Raised'        },
          { key: 'assign', label: '+ New'           },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
              tab === t.key ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Date picker for list tabs */}
      {tab !== 'assign' && (
        <div className="flex items-center gap-3 mb-4">
          <FiCalendar className="text-slate-400 shrink-0" />
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="flex-1 h-11 px-4 rounded-2xl border border-slate-200 text-sm font-semibold"
          />
          <button onClick={fetchSubs} className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
            <FiRefreshCw size={17} />
          </button>
        </div>
      )}

      {/* Assign Form */}
      {tab === 'assign' && (
        <form onSubmit={handleAssign} className="space-y-3 bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-50">
          <h2 className="font-black text-slate-900 text-sm mb-1">Assign a Substitute</h2>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Date *</label>
            <input type="date" value={form.assignmentDate}
              onChange={e => setForm(f => ({ ...f, assignmentDate: e.target.value }))}
              className="w-full h-12 px-4 rounded-2xl border border-slate-200 text-sm font-semibold" />
          </div>
          <select value={form.classRoomId}
            onChange={e => setForm(f => ({ ...f, classRoomId: e.target.value }))}
            className="w-full h-12 px-4 rounded-2xl border border-slate-200 text-sm font-semibold bg-white">
            <option value="">Select Class *</option>
            {scope.assignedClasses?.map(c => (
              <option key={c.id} value={c.id}>Class {c.name}</option>
            ))}
          </select>
          <select value={form.subjectId}
            onChange={e => setForm(f => ({ ...f, subjectId: e.target.value }))}
            className="w-full h-12 px-4 rounded-2xl border border-slate-200 text-sm font-semibold bg-white">
            <option value="">Select Subject *</option>
            {scope.subjects?.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Period Number *</label>
            <input type="number" min={1} max={10} value={form.periodNumber}
              onChange={e => setForm(f => ({ ...f, periodNumber: Number(e.target.value) }))}
              className="w-full h-12 px-4 rounded-2xl border border-slate-200 text-sm font-semibold" />
          </div>
          <select value={form.substituteTeacherId}
            onChange={e => setForm(f => ({ ...f, substituteTeacherId: e.target.value }))}
            className="w-full h-12 px-4 rounded-2xl border border-slate-200 text-sm font-semibold bg-white">
            <option value="">Select Substitute Teacher *</option>
            {(scope.teachers || []).map(t => (
              <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>
            ))}
          </select>
          <textarea value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            placeholder="Notes (optional)" rows={2}
            className="w-full p-4 rounded-2xl border border-slate-200 text-sm font-semibold resize-none" />
          <button type="submit" disabled={saving}
            className="w-full h-14 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-200 active:scale-95 transition-all disabled:opacity-50">
            {saving ? <LoadingSpinner size="sm" /> : 'Assign Substitute'}
          </button>
        </form>
      )}

      {/* List */}
      {tab !== 'assign' && (
        <div className="space-y-3 pb-24">
          {loading ? (
            <div className="flex justify-center py-10"><LoadingSpinner /></div>
          ) : subs.length === 0 ? (
            <div className="text-center py-16">
              <FiUsers size={36} className="mx-auto text-slate-200 mb-3" />
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No substitutions on this date</p>
            </div>
          ) : subs.map(s => (
            <div key={s.id} className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-50">
              <div className="flex items-start justify-between">
                <div>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${STATUS[s.status] || 'bg-slate-100 text-slate-400'}`}>
                    {s.status}
                  </span>
                  <h3 className="font-black text-slate-900 text-sm mt-1">{s.className} • Period {s.periodNumber}</h3>
                  <p className="text-xs text-slate-400 font-semibold">{s.subjectName}</p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Sub: <span className="font-bold text-slate-700">{s.substituteTeacherName}</span>
                  </p>
                  {s.notes && <p className="text-[10px] text-slate-400 mt-0.5 italic">"{s.notes}"</p>}
                </div>
                {s.status === 'ASSIGNED' && (
                  <div className="flex gap-2">
                    <button onClick={() => updateStatus(s.id, 'COMPLETED')}
                      className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                      <FiCheck size={15} />
                    </button>
                    <button onClick={() => updateStatus(s.id, 'CANCELLED')}
                      className="w-9 h-9 rounded-xl bg-rose-50 text-rose-400 flex items-center justify-center">
                      <FiX size={15} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubstituteManagement;
