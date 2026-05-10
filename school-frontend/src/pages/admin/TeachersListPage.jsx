// src/pages/admin/TeachersListPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Download, ChevronLeft, ChevronRight, UserSquare2, Trash2, CheckSquare } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { teacherApi } from '../../api/teacherApi';
import { fileApi } from '../../api/fileApi';

const StatusBadge = ({ status }) => {
  const styles = {
    ACTIVE:   'bg-emerald-50 text-emerald-700 border-emerald-200',
    INACTIVE: 'bg-rose-50    text-rose-700    border-rose-200',
    ON_LEAVE: 'bg-amber-50   text-amber-700   border-amber-200',
  };
  return (
    <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${styles[status] || styles.ACTIVE}`}>
      {status || 'ACTIVE'}
    </span>
  );
};

const TeachersListPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages]       = useState(0);
  const [deleteId, setDeleteId]           = useState(null);

  // Bulk select
  const [selected, setSelected] = useState(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [confirmBulk, setConfirmBulk] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [page, setPage]     = useState(0);
  const [size, setSize]     = useState(10);

  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    setSelected(new Set());
    try {
      const res = await teacherApi.getAll(page, size);
      const data = res?.data?.data ?? {};
      setTeachers(data.content ?? []);
      setTotalElements(data.totalElements ?? 0);
      setTotalPages(data.totalPages ?? 0);
    } catch { 
      toast.error('Failed to load faculty directory.'); 
    } finally { 
      setLoading(false); 
    }
  }, [page, size, toast]);

  useEffect(() => { fetchTeachers(); }, [fetchTeachers]);

  const handleSearch = async () => {
    if (!search.trim()) { fetchTeachers(); return; }
    setLoading(true);
    try {
      const res = await teacherApi.search(search);
      const data = res?.data?.data ?? [];
      setTeachers(Array.isArray(data) ? data : []);
      setTotalElements(Array.isArray(data) ? data.length : 0);
      setTotalPages(1);
    } catch { 
      toast.error('Search failed.'); 
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await teacherApi.delete(deleteId);
      setDeleteId(null);
      toast.success('Teacher record deactivated.');
      fetchTeachers();
    } catch { 
      toast.error('Failed to deactivate teacher.'); 
    }
  };

  const handleBulkDelete = async () => {
    setBulkDeleting(true);
    setConfirmBulk(false);
    let success = 0, failed = 0;
    for (const id of selected) {
      try {
        await teacherApi.delete(id);
        success++;
      } catch {
        failed++;
      }
    }
    setBulkDeleting(false);
    setSelected(new Set());
    if (success > 0) toast.success(`${success} teacher(s) removed.`);
    if (failed > 0) toast.error(`${failed} deletion(s) failed.`);
    fetchTeachers();
  };

  const handleExport = () => {
    const source = selected.size > 0 ? teachers.filter(t => selected.has(t.id)) : teachers;
    if (!source.length) { toast.warning('No data to export.'); return; }
    const headers = ['ID','Employee ID','First Name','Last Name','Email','Phone','Specialization','Salary','Status'];
    const rows = source.map(t => [
      t.id, t.employeeId, t.firstName, t.lastName, t.email, t.phone, t.specialization, t.salary, t.status
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v ?? ''}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'faculty.csv'; a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${source.length} records.`);
  };

  const toggleAll = () => {
    if (teachers.length > 0 && teachers.every(t => selected.has(t.id))) {
      setSelected(new Set());
    } else {
      setSelected(new Set(teachers.map(t => t.id)));
    }
  };

  const toggleOne = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <>
      <PageHeader
        title="Faculty Directory"
        subtitle={`${totalElements} teaching staff members`}
        actions={
          <button onClick={() => navigate('/admin/teachers/new')}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm">
            <Plus size={16} /> Hire Teacher
          </button>
        }
      />

      {/* Bulk Action Bar */}
      {selected.size > 0 && (
        <div className="bg-indigo-600 text-white rounded-xl px-5 py-3 mb-4 flex items-center justify-between animate-fade-in shadow-lg">
          <span className="font-medium text-sm flex items-center gap-2">
            <CheckSquare size={16} />
            {selected.size} teacher{selected.size > 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-3">
            <button onClick={handleExport} className="bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-all">
              Export Selected
            </button>
            <button onClick={() => setConfirmBulk(true)} disabled={bulkDeleting}
              className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 disabled:opacity-50 transition-all">
              <Trash2 size={14} /> {bulkDeleting ? 'Removing...' : 'Deactivate'}
            </button>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-5 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] group">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Search by name, email or ID..."
            className="w-full border border-slate-200 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
          />
        </div>
        <button onClick={handleSearch} className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all">Search</button>
        <button onClick={() => { setSearch(''); fetchTeachers(); }} className="bg-slate-100 text-slate-600 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-200 transition-all">Clear</button>
        <button onClick={handleExport} className="flex items-center gap-2 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-all">
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Desktop Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hidden sm:block">
        {loading ? (
          <div className="py-20 text-center"><LoadingSpinner /></div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-4 py-4 w-10">
                  <input type="checkbox" 
                    checked={teachers.length > 0 && teachers.every(t => selected.has(t.id))}
                    onChange={toggleAll}
                    className="rounded border-slate-300 text-indigo-600 cursor-pointer" 
                  />
                </th>
                <th className="text-left px-4 py-4 text-slate-500 font-semibold text-xs uppercase tracking-wider">Emp ID</th>
                <th className="text-left px-4 py-4 text-slate-500 font-semibold text-xs uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-4 text-slate-500 font-semibold text-xs uppercase tracking-wider">Specialization</th>
                <th className="text-left px-4 py-4 text-slate-500 font-semibold text-xs uppercase tracking-wider">Phone</th>
                <th className="text-left px-4 py-4 text-slate-500 font-semibold text-xs uppercase tracking-wider">Salary</th>
                <th className="text-left px-4 py-4 text-slate-500 font-semibold text-xs uppercase tracking-wider">Status</th>
                <th className="text-right px-6 py-4 text-slate-500 font-semibold text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {teachers.map(t => (
                <tr key={t.id} className={`hover:bg-slate-50/50 transition-colors ${selected.has(t.id) ? 'bg-indigo-50/30' : ''}`}>
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selected.has(t.id)} onChange={() => toggleOne(t.id)} className="rounded border-slate-300 text-indigo-600 cursor-pointer" />
                  </td>
                  <td className="px-4 py-3 font-mono text-indigo-600 text-[11px] font-bold">{t.employeeId}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm overflow-hidden flex-shrink-0">
                        {t.profilePhoto ? (
                          <img src={fileApi.toPublicUrl(t.profilePhoto)} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <>{t.firstName?.[0]}{t.lastName?.[0]}</>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 truncate">{t.firstName} {t.lastName}</p>
                        <p className="text-xs text-slate-400 truncate">{t.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 font-medium">{t.specialization || 'General'}</td>
                  <td className="px-4 py-3 text-slate-500">{t.phone || '—'}</td>
                  <td className="px-4 py-3 text-slate-700 font-medium">₹{t.salary?.toLocaleString() || '0'}</td>
                  <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => navigate(`/admin/teachers/${t.id}`)} className="text-indigo-600 hover:text-indigo-900 text-xs font-semibold">View</button>
                      <button onClick={() => navigate(`/admin/teachers/${t.id}/edit`)} className="text-emerald-600 hover:text-emerald-900 text-xs font-semibold">Edit</button>
                      <button onClick={() => setDeleteId(t.id)} className="text-rose-500 hover:text-rose-700 text-xs font-semibold">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && teachers.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">👩‍🏫</div>
            <p className="text-slate-400 font-medium">No faculty members found</p>
          </div>
        )}

        {/* Pagination */}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>Rows:</span>
            <select value={size} onChange={e => { setSize(Number(e.target.value)); setPage(0); }} className="bg-transparent border-none outline-none font-bold text-slate-700 cursor-pointer">
              {[10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <span>{totalElements === 0 ? '0' : `${page * size + 1}–${Math.min((page + 1) * size, totalElements)}`} of {totalElements}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-white disabled:opacity-30 transition-all shadow-sm">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-white disabled:opacity-30 transition-all shadow-sm">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-3">
        {loading && <div className="py-10 text-center"><LoadingSpinner /></div>}
        {!loading && teachers.map(t => (
          <div key={t.id} className={`bg-white rounded-2xl border p-4 shadow-sm transition-all ${selected.has(t.id) ? 'border-indigo-400 bg-indigo-50/30' : 'border-slate-100'}`}>
            <div className="flex items-start justify-between">
              <div className="flex gap-3 min-w-0">
                <input type="checkbox" checked={selected.has(t.id)} onChange={() => toggleOne(t.id)} className="rounded border-slate-300 mt-1" />
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold flex-shrink-0">
                  {t.firstName?.[0]}{t.lastName?.[0]}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 truncate">{t.firstName} {t.lastName}</p>
                  <p className="text-[10px] text-indigo-600 font-bold font-mono">{t.employeeId}</p>
                </div>
              </div>
              <StatusBadge status={t.status} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500 italic">
              <span>🎓 {t.specialization || 'General'}</span>
              <span>📞 {t.phone || 'N/A'}</span>
              <span>📧 {t.email}</span>
              <span>💰 ₹{t.salary?.toLocaleString()}</span>
            </div>
            <div className="mt-4 flex gap-2 pt-3 border-t border-slate-50">
              <button onClick={() => navigate(`/admin/teachers/${t.id}`)} className="flex-1 text-center py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-lg">View</button>
              <button onClick={() => navigate(`/admin/teachers/${t.id}/edit`)} className="flex-1 text-center py-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 rounded-lg">Edit</button>
              <button onClick={() => setDeleteId(t.id)} className="flex-1 text-center py-1.5 text-xs font-bold text-rose-600 bg-rose-50 rounded-lg">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Dialogs */}
      <ConfirmDialog isOpen={!!deleteId} message="Deactivate this teacher record? User will no longer be able to log in." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      <ConfirmDialog isOpen={confirmBulk} message={`Deactivate ${selected.size} selected faculty records? This action is tracked in system audit logs.`} onConfirm={handleBulkDelete} onCancel={() => setConfirmBulk(false)} />
    </>
  );
};

export default TeachersListPage;
