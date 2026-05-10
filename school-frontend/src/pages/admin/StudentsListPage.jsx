// src/pages/admin/StudentsListPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Download, ChevronLeft, ChevronRight, Trash2, CheckSquare } from 'lucide-react';
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
    ACTIVE:    'bg-emerald-50 text-emerald-700 border-emerald-200',
    INACTIVE:  'bg-rose-50    text-rose-700    border-rose-200',
    GRADUATED: 'bg-blue-50    text-blue-700    border-blue-200',
    SUSPENDED: 'bg-amber-50   text-amber-700   border-amber-200',
  };
  return (
    <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${styles[status] || styles.ACTIVE}`}>
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

  // ── Export CSV ─────────────────────────────────────────────────────────────
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
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-colors"
          >
            <Plus size={16} /> Register Student
          </button>
        }
      />

      {/* ── Bulk action bar ── */}
      {someSelected && (
        <div className="bg-blue-600 text-white rounded-xl px-5 py-3 mb-4 flex items-center justify-between animate-fade-in">
          <span className="font-medium text-sm">
            <CheckSquare size={16} className="inline mr-2" />
            {selected.size} student{selected.size > 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-3">
            <button onClick={handleExport}
              className="bg-white text-blue-600 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-50">
              Export Selected
            </button>
            <button onClick={() => setConfirmBulk(true)} disabled={bulkDeleting}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 disabled:opacity-50">
              <Trash2 size={14} />
              {bulkDeleting ? 'Deleting...' : `Delete ${selected.size}`}
            </button>
            <button onClick={() => setSelected(new Set())}
              className="text-blue-100 hover:text-white text-sm underline">
              Clear
            </button>
          </div>
        </div>
      )}

      {/* ── Toolbar ── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-5 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setPage(0); }}
            placeholder="Search by ID, Name or Status..."
            className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={selectedClass}
          onChange={e => { setSelectedClass(e.target.value); setPage(0); }}
          className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[160px]"
        >
          <option value="">
            {classesLoading ? 'Loading...' : classes.length === 0 ? 'No Classes' : 'All Classes'}
          </option>
          {classes.map(c => (
            <option key={c.id} value={c.id}>{c.name} — {c.section}</option>
          ))}
        </select>
        <button onClick={fetchStudents}
          className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50">
          ↻ Refresh
        </button>
        <button onClick={handleExport}
          className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50">
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* ── Desktop Table ── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hidden sm:block">
        {loading ? (
          <div className="py-20"><LoadingSpinner /></div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-4 w-10">
                  <input type="checkbox" checked={allSelected} onChange={toggleAll}
                    className="rounded border-gray-300 cursor-pointer" />
                </th>
                {['ID','Student Name','Contact','Class','Section','Gender','Parent','Status','Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-4 text-gray-500 font-semibold text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id}
                  className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${selected.has(s.id) ? 'bg-blue-50' : ''}`}>
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selected.has(s.id)} onChange={() => toggleOne(s.id)}
                      className="rounded border-gray-300 cursor-pointer" />
                  </td>
                  <td className="px-4 py-3 font-mono text-blue-600 text-xs font-bold">{s.studentId}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm overflow-hidden flex-shrink-0">
                        {s.profilePhoto
                          ? <img src={fileApi.toPublicUrl(s.profilePhoto)} alt="" className="w-full h-full object-cover" />
                          : <>{s.firstName?.[0]}{s.lastName?.[0]}</>}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{s.firstName} {s.lastName}</p>
                        <p className="text-xs text-gray-400">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{s.phone || '—'}</td>
                  <td className="px-4 py-3 font-medium text-gray-700">{s.className || '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{s.sectionName || '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{s.gender || '—'}</td>
                  <td className="px-4 py-3">
                    <p className="text-gray-700 font-medium text-xs">{s.parentName || '—'}</p>
                    <p className="text-gray-400 text-xs">{s.parentPhone || ''}</p>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => navigate(`/admin/students/${s.id}`)}
                        className="text-blue-600 hover:underline text-xs">View</button>
                      <button onClick={() => navigate(`/admin/students/${s.id}/edit`)}
                        className="text-green-600 hover:underline text-xs">Edit</button>
                      <button onClick={() => setDeleteId(s.id)}
                        className="text-red-500 hover:underline text-xs">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && students.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">🎓</div>
            <p className="text-gray-500 font-medium">No students found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting search or filter</p>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span>Per page:</span>
            <select value={size} onChange={e => { setSize(Number(e.target.value)); setPage(0); }}
              className="border border-gray-200 rounded-lg px-2 py-1 text-sm">
              {[10,20,50].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <span>{totalElements === 0 ? '0 records' : `${startRow}–${endRow} of ${totalElements}`}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
              className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
              className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Card View ── */}
      <div className="sm:hidden space-y-3">
        {loading && <div className="py-10"><LoadingSpinner /></div>}
        {!loading && students.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-2">🎓</div>No students found
          </div>
        )}
        {!loading && students.map(s => (
          <div key={s.id}
            className={`bg-white rounded-xl border shadow-sm p-4 ${selected.has(s.id) ? 'border-blue-300 bg-blue-50' : 'border-gray-100'}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 flex-1">
                <input type="checkbox" checked={selected.has(s.id)} onChange={() => toggleOne(s.id)}
                  className="rounded border-gray-300 mt-1" />
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold flex-shrink-0">
                  {s.firstName?.[0]}{s.lastName?.[0]}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{s.firstName} {s.lastName}</p>
                  <p className="text-xs text-blue-600 font-mono">{s.studentId}</p>
                </div>
              </div>
              <StatusBadge status={s.status} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
              <span>📚 {s.className} — {s.sectionName || '?'}</span>
              <span>👤 {s.gender || '—'}</span>
              <span>📞 {s.phone || '—'}</span>
              <span>👨‍👩‍👦 {s.parentName || '—'}</span>
            </div>
            <div className="mt-3 flex gap-3 border-t border-gray-100 pt-3">
              <button onClick={() => navigate(`/admin/students/${s.id}`)}
                className="flex-1 text-center text-blue-600 text-sm font-medium py-1">View</button>
              <button onClick={() => navigate(`/admin/students/${s.id}/edit`)}
                className="flex-1 text-center text-green-600 text-sm font-medium py-1">Edit</button>
              <button onClick={() => setDeleteId(s.id)}
                className="flex-1 text-center text-red-500 text-sm font-medium py-1">Delete</button>
            </div>
          </div>
        ))}
        {/* Mobile pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-between items-center py-2">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
              className="px-4 py-2 rounded-lg border text-sm disabled:opacity-40">← Prev</button>
            <span className="text-sm text-gray-500">Page {page + 1} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
              className="px-4 py-2 rounded-lg border text-sm disabled:opacity-40">Next →</button>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <ConfirmDialog isOpen={!!deleteId}
        message="Remove this student from the system?"
        onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      <ConfirmDialog isOpen={confirmBulk}
        message={`Permanently delete ${selected.size} selected student(s)? This cannot be undone.`}
        onConfirm={handleBulkDelete} onCancel={() => setConfirmBulk(false)} />
    </>
  );
};

export default StudentsListPage;
