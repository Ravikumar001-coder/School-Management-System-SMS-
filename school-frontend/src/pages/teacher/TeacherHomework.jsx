import React, { useState, useEffect, useCallback } from 'react';
import {
  FiPlus, FiBook, FiCalendar, FiPaperclip, FiTrash2,
  FiEdit2, FiCheck, FiX, FiSearch, FiUpload, FiLink
} from 'react-icons/fi';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const STATUS_COLORS = {
  PUBLISHED: 'bg-emerald-100 text-emerald-700',
  DRAFT:     'bg-amber-100 text-amber-700',
  SCHEDULED: 'bg-blue-100 text-blue-700',
};

const TeacherHomework = () => {
  const toast = useToast();
  const [homework, setHomework] = useState([]);
  const [scope, setScope] = useState({ assignedClasses: [], subjects: [] });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    classRoomId: '', subjectId: '', title: '',
    description: '', dueDate: '', status: 'PUBLISHED',
    attachmentUrl: '', resourceLinks: ''
  });

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const [hwRes, scopeRes] = await Promise.all([
        api.get('/teacher/homework'),
        api.get('/teacher/scope'),
      ]);
      setHomework(hwRes.data.data || []);
      setScope(scopeRes.data.data || { assignedClasses: [], subjects: [] });
      if (scopeRes.data.data?.assignedClasses?.[0]) {
        setForm(f => ({ ...f, classRoomId: scopeRes.data.data.assignedClasses[0].id }));
      }
    } catch {
      toast.error('Failed to load homework');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const resetForm = () => {
    setForm({
      classRoomId: scope.assignedClasses?.[0]?.id || '',
      subjectId: '', title: '', description: '',
      dueDate: '', status: 'PUBLISHED', attachmentUrl: '', resourceLinks: ''
    });
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (hw) => {
    setForm({
      classRoomId: hw.classRoomId,
      subjectId: hw.subjectId,
      title: hw.title,
      description: hw.description || '',
      dueDate: hw.dueDate,
      status: hw.status || 'PUBLISHED',
      attachmentUrl: hw.attachmentUrl || '',
      resourceLinks: hw.resourceLinks || ''
    });
    setEditId(hw.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.classRoomId || !form.subjectId || !form.title || !form.dueDate) {
      toast.error('Please fill all required fields');
      return;
    }
    try {
      setSaving(true);
      if (editId) {
        await api.put(`/teacher/homework/${editId}`, form);
        toast.success('Homework updated!');
      } else {
        await api.post('/teacher/homework', form);
        toast.success('Homework created!');
      }
      resetForm();
      fetchAll();
    } catch {
      toast.error('Failed to save homework');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this homework?')) return;
    try {
      await api.delete(`/teacher/homework/${id}`);
      toast.success('Homework deleted');
      fetchAll();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploading(true);
      const fd = new FormData();
      fd.append('file', file);
      const res = await api.post('/files/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setForm(f => ({ ...f, attachmentUrl: res.data }));
      toast.success('File uploaded!');
    } catch {
      toast.error('File upload failed');
    } finally {
      setUploading(false);
    }
  };

  const filtered = homework.filter(h =>
    h.title?.toLowerCase().includes(search.toLowerCase()) ||
    h.className?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex justify-center p-10"><LoadingSpinner /></div>;

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Homework</h1>
          <p className="text-xs text-slate-400 font-semibold mt-0.5 uppercase tracking-widest">
            {homework.length} assigned
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 active:scale-90 transition-all"
        >
          <FiPlus size={22} />
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search homework..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full h-12 pl-11 pr-4 bg-white rounded-2xl border border-slate-100 text-sm font-semibold focus:border-indigo-400 outline-none"
        />
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-t-[2.5rem] p-6 pb-10 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-black text-slate-900">{editId ? 'Edit' : 'New'} Homework</h2>
              <button onClick={resetForm} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                <FiX />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <select
                value={form.classRoomId}
                onChange={e => setForm(f => ({ ...f, classRoomId: e.target.value }))}
                className="w-full h-12 px-4 rounded-2xl border border-slate-200 text-sm font-semibold bg-white"
              >
                <option value="">Select Class *</option>
                {scope.assignedClasses?.map(c => (
                  <option key={c.id} value={c.id}>Class {c.name}</option>
                ))}
              </select>
              <select
                value={form.subjectId}
                onChange={e => setForm(f => ({ ...f, subjectId: e.target.value }))}
                className="w-full h-12 px-4 rounded-2xl border border-slate-200 text-sm font-semibold bg-white"
              >
                <option value="">Select Subject *</option>
                {scope.subjects?.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Homework title *"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full h-12 px-4 rounded-2xl border border-slate-200 text-sm font-semibold"
              />
              <textarea
                placeholder="Description / instructions"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={3}
                className="w-full p-4 rounded-2xl border border-slate-200 text-sm font-semibold resize-none"
              />
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">Due Date *</label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                  className="w-full h-12 px-4 rounded-2xl border border-slate-200 text-sm font-semibold"
                />
              </div>
              <select
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                className="w-full h-12 px-4 rounded-2xl border border-slate-200 text-sm font-semibold bg-white"
              >
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
                <option value="SCHEDULED">Scheduled</option>
              </select>
              {/* File upload */}
              <label className="flex items-center gap-3 h-12 px-4 rounded-2xl border border-dashed border-indigo-300 bg-indigo-50 cursor-pointer text-sm font-semibold text-indigo-600">
                <FiUpload />
                {uploading ? 'Uploading...' : (form.attachmentUrl ? 'File attached ✓' : 'Attach file (PDF / DOC / Image)')}
                <input type="file" className="hidden" accept="image/*,.pdf,.doc,.docx" onChange={handleFileUpload} disabled={uploading} />
              </label>
              <input
                type="text"
                placeholder="Resource link (optional YouTube / Drive URL)"
                value={form.resourceLinks}
                onChange={e => setForm(f => ({ ...f, resourceLinks: e.target.value }))}
                className="w-full h-12 px-4 rounded-2xl border border-slate-200 text-sm font-semibold"
              />
              <button
                type="submit"
                disabled={saving}
                className="w-full h-14 bg-indigo-600 text-white rounded-2xl font-black tracking-widest uppercase text-xs shadow-lg shadow-indigo-200 active:scale-95 transition-all disabled:opacity-50"
              >
                {saving ? <LoadingSpinner size="sm" /> : (editId ? 'Update Homework' : 'Create Homework')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Homework List */}
      <div className="space-y-3 pb-24">
        {filtered.map(hw => (
          <div key={hw.id} className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-50">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${STATUS_COLORS[hw.status] || 'bg-slate-100 text-slate-500'}`}>
                    {hw.status}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">{hw.subjectName}</span>
                </div>
                <h3 className="font-black text-slate-900 text-sm truncate">{hw.title}</h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">{hw.className}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                    <FiCalendar size={11} /> Due: {hw.dueDate}
                  </span>
                  {hw.attachmentUrl && (
                    <a href={hw.attachmentUrl} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1 text-[10px] font-bold text-indigo-500">
                      <FiPaperclip size={11} /> File
                    </a>
                  )}
                  {hw.resourceLinks && (
                    <a href={hw.resourceLinks} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1 text-[10px] font-bold text-emerald-500">
                      <FiLink size={11} /> Link
                    </a>
                  )}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => handleEdit(hw)}
                  className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center active:scale-90 transition-all">
                  <FiEdit2 size={15} />
                </button>
                <button onClick={() => handleDelete(hw.id)}
                  className="w-9 h-9 rounded-xl bg-rose-50 text-rose-400 flex items-center justify-center active:scale-90 transition-all">
                  <FiTrash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <FiBook size={40} className="mx-auto text-slate-200 mb-3" />
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No homework found</p>
            <button onClick={() => setShowForm(true)}
              className="mt-4 px-5 py-2.5 bg-indigo-600 text-white rounded-2xl text-xs font-black">
              Create First Homework
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherHomework;
