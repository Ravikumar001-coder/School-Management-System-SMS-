// src/pages/admin/StudentsListPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Search, Download, ChevronLeft, ChevronRight, Trash2, CheckSquare,
  GraduationCap, ShieldCheck, BookOpen, Heart, RefreshCw, Mail, Phone
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import axios from '../../api/axios';
import { classApi } from '../../api/classApi';
import { studentApi } from '../../api/studentApi';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { fileApi } from '../../api/fileApi';

const StatusBadge = ({ status }) => {
  const styles = {
    ACTIVE:    'bg-[#15803D]/10 text-[#166534] border-[#15803D]/20',
    INACTIVE:  'bg-[#B91C1C]/10 text-[#991B1B] border-[#B91C1C]/20',
    GRADUATED: 'bg-[#0369A1]/10 text-[#075985] border-[#0369A1]/20',
    SUSPENDED: 'bg-[#B45309]/10 text-[#92400E] border-[#B45309]/20',
  };
  return (
    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border uppercase tracking-wider ${styles[status] || styles.ACTIVE}`}>
      {status || 'ACTIVE'}
    </span>
  );
};

const StudentsListPage = () => {
  const navigate = useNavigate();
  const toast    = useToast();

  // ── Core state ─────────────────────────────────────────────────────────────
  const [students,       setStudents]       = useState([]);
  const [classes,        setClasses]        = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [classesLoading, setClassesLoading] = useState(true);
  const [totalElements,  setTotalElements]  = useState(0);
  const [totalPages,     setTotalPages]     = useState(0);
  const [deleteId,       setDeleteId]       = useState(null);

  // ── Bulk select state ──────────────────────────────────────────────────────
  const [selected,       setSelected]       = useState(new Set());
  const [bulkDeleting,   setBulkDeleting]   = useState(false);
  const [confirmBulk,    setConfirmBulk]    = useState(false);

  // ── Filters & pagination ───────────────────────────────────────────────────
  const [searchTerm,    setSearchTerm]    = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [page,          setPage]          = useState(0);
  const [size,          setSize]          = useState(10);
  const [sortBy]                          = useState('id');

  // ── Load classes once ──────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    classApi.getAll()
      .then(res => {
        if (!cancelled) {
          const data = res?.data?.data ?? res?.data ?? [];
          setClasses(Array.isArray(data) ? data : []);
        }
      })
      .catch(() => { if (!cancelled) toast.error('Failed to load classes.'); })
      .finally(() => { if (!cancelled) setClassesLoading(false); });
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Fetch students ─────────────────────────────────────────────────────────
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setSelected(new Set()); // clear selection on refetch
    try {
      const res = await axios.get('/students', {
        params: { keyword: searchTerm.trim() || null, classId: selectedClass || null, page, size, sortBy },
      });
      const payload = res?.data?.data ?? res?.data ?? {};
      setStudents(payload.content      ?? []);
      setTotalElements(payload.totalElements ?? 0);
      setTotalPages(payload.totalPages   ?? 0);
    } catch {
      toast.error('Failed to load students.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedClass, page, size, sortBy]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  // ── Single delete ──────────────────────────────────────────────────────────
  const handleDelete = async () => {
    try {
      await studentApi.delete(deleteId);
      setDeleteId(null);
      toast.success('Student removed successfully.');
      fetchStudents();
    } catch {
      toast.error('Failed to delete student.');
    }
  };

  // ── Bulk select helpers ────────────────────────────────────────────────────
  const allSelected   = students.length > 0 && students.every(s => selected.has(s.id));
  const someSelected  = selected.size > 0;

  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(students.map(s => s.id)));
    }
  };

  const toggleOne = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // ── Bulk delete ────────────────────────────────────────────────────────────
  const handleBulkDelete = async () => {
    setBulkDeleting(true);
    setConfirmBulk(false);
    let success = 0, failed = 0;
    for (const id of selected) {
      try {
        await studentApi.delete(id);
        success++;
      } catch {
        failed++;
      }
    }
    setBulkDeleting(false);
    setSelected(new Set());
    if (success > 0) toast.success(`${success} student(s) removed.`);
    if (failed  > 0) toast.error(`${failed} deletion(s) failed.`);
    fetchStudents();
  };

  // ── Export Excel ──────────────────────────────────────────────────────────
  const handleExportExcel = async () => {
    try {
      toast.info('Generating Excel report...');
      const response = await studentApi.exportExcel();
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'students_list.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Excel exported successfully.');
    } catch {
      toast.error('Failed to export Excel.');
    }
  };

  const handleExport = () => {
    const source = someSelected ? students.filter(s => selected.has(s.id)) : students;
    if (!source.length) { toast.warning('No data to export.'); return; }
    const headers = ['ID','Student ID','First Name','Last Name','Email','Phone','Class','Section','Status','Parent Name','Parent Phone'];
    const rows = source.map(s => [
      s.id, s.studentId, s.firstName, s.lastName, s.email, s.phone,
      s.className, s.sectionName, s.status, s.parentName, s.parentPhone,
    ]);
    const csv  = [headers, ...rows].map(r => r.map(v => `"${v ?? ''}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url; a.download = 'students.csv'; a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${source.length} records.`);
  };

  const startRow = page * size + 1;
  const endRow   = Math.min(page * size + students.length, totalElements);

  return (
    <>
      <PageHeader
        title="Students Directory"
        subtitle={`${totalElements} students enrolled`}
        actions={
          <button
            onClick={() => navigate('/admin/students/new')}
            className="flex items-center gap-2 bg-[#1E40AF] hover:bg-[#1E3A8A] text-white px-6 py-3 rounded-[16px] font-bold text-sm transition-all shadow-md min-h-[44px]"
          >
            <Plus size={16} /> Register Student
          </button>
        }
      />

      {/* ── KPI Dashboard Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <div className="bg-white rounded-[16px] border border-[#f1f5f9] p-5 shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Students</p>
              <h3 className="text-2xl font-black text-slate-800 mt-2">{totalElements}</h3>
            </div>
            <div className="p-2.5 rounded-[12px] bg-[#DBEAFE] text-[#1E40AF]">
              <GraduationCap size={20} />
            </div>
          </div>
          <p className="text-[10px] font-bold text-[#1E40AF] mt-2">Active academic directory</p>
        </div>

        <div className="bg-white rounded-[16px] border border-[#f1f5f9] p-5 shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Status</p>
              <h3 className="text-2xl font-black text-slate-800 mt-2">
                {students.filter(s => s.status === 'ACTIVE').length || 0}
              </h3>
            </div>
            <div className="p-2.5 rounded-[12px] bg-emerald-50 text-[#15803D]">
              <ShieldCheck size={20} />
            </div>
          </div>
          <p className="text-[10px] font-bold text-[#15803D] mt-2">Currently attending classes</p>
        </div>

        <div className="bg-white rounded-[16px] border border-[#f1f5f9] p-5 shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Grade Rooms</p>
              <h3 className="text-2xl font-black text-slate-800 mt-2">{classes.length}</h3>
            </div>
            <div className="p-2.5 rounded-[12px] bg-purple-50 text-purple-700">
              <BookOpen size={20} />
            </div>
          </div>
          <p className="text-[10px] font-bold text-purple-700 mt-2">Active grade rooms</p>
        </div>

        <div className="bg-white rounded-[16px] border border-[#f1f5f9] p-5 shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Linked Families</p>
              <h3 className="text-2xl font-black text-slate-800 mt-2">
                {students.filter(s => s.parentName).length || 0}
              </h3>
            </div>
            <div className="p-2.5 rounded-[12px] bg-[#DBEAFE] text-[#1E40AF]">
              <Heart size={20} />
            </div>
          </div>
          <p className="text-[10px] font-bold text-[#1E40AF] mt-2">Active primary guardians</p>
        </div>
      </div>

      {/* ── Bulk action bar ── */}
      {someSelected && (
        <div className="bg-indigo-600 text-white rounded-2xl px-5 py-3.5 mb-5 flex items-center justify-between animate-fade-in shadow-lg shadow-indigo-100">
          <span className="font-bold text-xs uppercase tracking-wider flex items-center gap-2">
            <CheckSquare size={16} />
            {selected.size} Student{selected.size > 1 ? 's' : ''} Selected
          </span>
          <div className="flex gap-3">
            <button onClick={handleExport}
              className="bg-white text-indigo-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all">
              Export Selected
            </button>
            <button onClick={() => setConfirmBulk(true)} disabled={bulkDeleting}
              className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 disabled:opacity-50 transition-all shadow-md shadow-rose-100">
              <Trash2 size={14} />
              {bulkDeleting ? 'Deleting...' : `Delete Selected (${selected.size})`}
            </button>
            <button onClick={() => setSelected(new Set())}
              className="text-indigo-100 hover:text-white text-xs font-bold underline px-2 py-1">
              Clear
            </button>
          </div>
        </div>
      )}

      {/* ── Toolbar ── */}
      <div className="bg-white rounded-[16px] border border-[#f1f5f9] p-4 mb-6 flex flex-wrap gap-4 items-center justify-between shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)]">
        <div className="flex-1 flex gap-4 min-w-[320px]">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setPage(0); }}
              placeholder="Search by student name, ID or status..."
              className="w-full border border-slate-200 bg-slate-50/50 rounded-xl pl-10 pr-4 py-3 text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner"
            />
          </div>
          <select
            value={selectedClass}
            onChange={e => { setSelectedClass(e.target.value); setPage(0); }}
            className="border border-slate-200 bg-slate-50/50 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all min-w-[180px] shadow-sm"
          >
            <option value="">
              {classesLoading ? 'Loading...' : classes.length === 0 ? 'No Classes' : 'All Classes'}
            </option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name} — {c.section}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          <button onClick={fetchStudents}
            className="flex items-center gap-1.5 border border-slate-200 rounded-xl px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <RefreshCw size={14} /> Refresh
          </button>
          <button onClick={handleExportExcel}
            className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 transition-all shadow-sm">
            <Download size={14} /> Export Excel
          </button>
        </div>
      </div>

      {/* ── Desktop Table ── */}
      <div className="bg-white rounded-[16px] border border-[#f1f5f9] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] overflow-hidden hidden sm:block">
        {loading ? (
          <div className="py-24"><LoadingSpinner /></div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50/75 border-b border-slate-100">
              <tr>
                <th className="px-5 py-4 w-10">
                  <input type="checkbox" checked={allSelected} onChange={toggleAll}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                </th>
                <th className="text-left px-5 py-4 text-slate-400 font-bold text-[10px] uppercase tracking-widest">Student</th>
                <th className="text-left px-5 py-4 text-slate-400 font-bold text-[10px] uppercase tracking-widest">Class & Section</th>
                <th className="text-left px-5 py-4 text-slate-400 font-bold text-[10px] uppercase tracking-widest">Roll Number</th>
                <th className="text-left px-5 py-4 text-slate-400 font-bold text-[10px] uppercase tracking-widest">Guardian Details</th>
                <th className="text-left px-5 py-4 text-slate-400 font-bold text-[10px] uppercase tracking-widest">Status</th>
                <th className="text-right px-6 py-4 text-slate-400 font-bold text-[10px] uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id}
                  className={`border-b border-slate-50 hover:bg-indigo-50/10 transition-colors ${selected.has(s.id) ? 'bg-indigo-50/30' : ''}`}>
                  <td className="px-5 py-4">
                    <input type="checkbox" checked={selected.has(s.id)} onChange={() => toggleOne(s.id)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm overflow-hidden flex-shrink-0">
                        {s.profilePhoto
                          ? <img src={fileApi.toPublicUrl(s.profilePhoto)} alt="" className="w-full h-full object-cover" />
                          : <>{s.firstName?.[0]}{s.lastName?.[0]}</>}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm hover:text-indigo-600 cursor-pointer" onClick={() => navigate(`/admin/students/${s.id}`)}>
                          {s.firstName} {s.lastName}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-[10px] text-indigo-600 font-black tracking-wider uppercase">{s.studentId}</span>
                          <span className="text-[10px] text-slate-300">•</span>
                          <span className="text-xs text-slate-400 font-medium">{s.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-700">{s.className || '—'}</div>
                    <div className="text-xs text-slate-400 font-medium mt-0.5">{s.sectionName ? `Section ${s.sectionName}` : (s.section ? `Section ${s.section}` : '—')}</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100/80 border border-slate-200/50 px-2.5 py-1 rounded-lg">
                      {s.rollNumber || '—'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-bold text-slate-700 text-sm">{s.parentName || '—'}</p>
                      <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                        <span className="text-[9px] uppercase font-black text-indigo-500/80 px-1 bg-indigo-50 border border-indigo-100/30 rounded">{s.parentRelationship || 'GUARDIAN'}</span>
                        <span>{s.parentPhone || ''}</span>
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-4"><StatusBadge status={s.status} /></td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => navigate(`/admin/students/${s.id}`)}
                        className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 font-bold text-xs transition-all border border-slate-100 hover:border-indigo-100">
                        View
                      </button>
                      <button onClick={() => navigate(`/admin/students/${s.id}/edit`)}
                        className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-600 text-slate-600 font-bold text-xs transition-all border border-slate-100 hover:border-emerald-100">
                        Edit
                      </button>
                      <button onClick={() => setDeleteId(s.id)}
                        className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-rose-50 hover:text-rose-600 text-slate-500 hover:text-rose-600 font-bold text-xs transition-all border border-slate-100 hover:border-rose-100">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && students.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🎓</div>
            <p className="text-slate-500 font-bold text-lg">No students found</p>
            <p className="text-slate-400 text-sm mt-1">Try adjusting search query or filters</p>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span className="font-bold text-xs uppercase tracking-wider text-slate-400">Per page:</span>
            <select value={size} onChange={e => { setSize(Number(e.target.value)); setPage(0); }}
              className="border border-slate-200 bg-slate-50 rounded-xl px-2.5 py-1 text-sm font-semibold text-slate-600 focus:outline-none">
              {[10,20,50].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <span className="text-slate-400 font-semibold text-xs ml-2">{totalElements === 0 ? '0 records' : `${startRow}–${endRow} of ${totalElements}`}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-all shadow-sm">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-all shadow-sm">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Card View ── */}
      <div className="sm:hidden space-y-4">
        {loading && <div className="py-12"><LoadingSpinner /></div>}
        {!loading && students.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <div className="text-4xl mb-2">🎓</div>No students found
          </div>
        )}
        {!loading && students.map(s => (
          <div key={s.id}
            className={`bg-white rounded-[16px] border p-5 transition-all shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] ${selected.has(s.id) ? 'border-[#1E40AF] bg-[#DBEAFE]/30' : 'border-[#f1f5f9] hover:border-[#DBEAFE]'}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 flex-1">
                <input type="checkbox" checked={selected.has(s.id)} onChange={() => toggleOne(s.id)}
                  className="rounded border-slate-300 text-indigo-600 mt-1" />
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold flex-shrink-0 overflow-hidden flex items-center justify-center">
                  {s.profilePhoto
                    ? <img src={fileApi.toPublicUrl(s.profilePhoto)} alt="" className="w-full h-full object-cover" />
                    : <>{s.firstName?.[0]}{s.lastName?.[0]}</>}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-800 truncate">{s.firstName} {s.lastName}</p>
                  <p className="text-[10px] text-indigo-600 font-bold tracking-wider uppercase font-mono">{s.studentId}</p>
                </div>
              </div>
              <StatusBadge status={s.status} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs border-t border-b border-slate-50 py-3">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Class</span>
                <span className="font-bold text-slate-700">{s.className || '—'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Roll Number</span>
                <span className="font-mono font-bold text-slate-600">{s.rollNumber || '—'}</span>
              </div>
              <div className="flex flex-col col-span-2">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Guardian</span>
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  {s.parentName || '—'} 
                  {s.parentPhone && <span className="text-[10px] font-medium text-slate-400">({s.parentPhone})</span>}
                </span>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <button onClick={() => navigate(`/admin/students/${s.id}`)}
                className="flex-1 text-center bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 rounded-xl text-indigo-600 text-xs font-bold py-2.5 transition-all">
                View
              </button>
              <button onClick={() => navigate(`/admin/students/${s.id}/edit`)}
                className="flex-1 text-center bg-slate-50 hover:bg-emerald-50 border border-slate-100 hover:border-emerald-100 rounded-xl text-emerald-600 text-xs font-bold py-2.5 transition-all">
                Edit
              </button>
              <button onClick={() => setDeleteId(s.id)}
                className="flex-1 text-center bg-slate-50 hover:bg-rose-50 border border-slate-100 hover:border-rose-100 rounded-xl text-rose-500 text-xs font-bold py-2.5 transition-all">
                Delete
              </button>
            </div>
          </div>
        ))}
        {/* Mobile pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-between items-center py-2 px-1">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-white disabled:opacity-40 transition-all">← Prev</button>
            <span className="text-xs font-bold text-slate-500">Page {page + 1} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-white disabled:opacity-40 transition-all">Next →</button>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <ConfirmDialog isOpen={!!deleteId}
        message="Deactivate and archive this student from the system?"
        onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      <ConfirmDialog isOpen={confirmBulk}
        message={`Permanently delete ${selected.size} selected student(s)? This cannot be undone.`}
        onConfirm={handleBulkDelete} onCancel={() => setConfirmBulk(false)} />
    </>
  );
};

export default StudentsListPage;
