// src/pages/admin/AuditLogListPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Clock, User, Box, Shield, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axios';

const ActionBadge = ({ action }) => {
  const styles = {
    CREATE:  'bg-emerald-50  text-emerald-700 border-emerald-200',
    UPDATE:  'bg-amber-50    text-amber-700   border-amber-200',
    DELETE:  'bg-rose-50     text-rose-700    border-rose-200',
    RESTORE: 'bg-indigo-50   text-indigo-700  border-indigo-200',
  };
  return (
    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border uppercase tracking-wider ${styles[action] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
      {action}
    </span>
  );
};

const AuditLogListPage = () => {
  const toast = useToast();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Filters
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [entityType, setEntityType] = useState('');
  const [actor, setActor] = useState('');

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      let url = '/audit-logs';
      if (entityType) url = `/audit-logs/type/${entityType}`;
      else if (actor) url = `/audit-logs/actor/${actor}`;

      const res = await api.get(url, {
        params: { page, size, sort: 'changedAt,desc' }
      });
      
      const payload = res?.data?.data ?? res?.data ?? {};
      setLogs(payload.content ?? []);
      setTotalElements(payload.totalElements ?? 0);
      setTotalPages(payload.totalPages ?? 0);
    } catch {
      toast.error('Failed to load audit logs.');
    } finally {
      setLoading(false);
    }
  }, [page, size, entityType, actor]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const handleExport = () => {
    if (!logs.length) { toast.warning('No data to export.'); return; }
    const headers = ['Time', 'Actor', 'Action', 'Entity', 'Entity ID', 'IP Address', 'New Value'];
    const rows = logs.map(l => [
      new Date(l.changedAt).toLocaleString(),
      l.actorUsername,
      l.action,
      l.entityType,
      l.entityId,
      l.ipAddress,
      l.newValue || 'N/A'
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v ?? ''}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'audit_logs.csv'; a.click();
    URL.revokeObjectURL(url);
    toast.success('Audit logs exported.');
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Audit Logs"
        subtitle="Operational traceability and system forensics"
        actions={
          <button onClick={handleExport} className="flex items-center gap-2 bg-[#1E40AF] hover:bg-[#1E3A8A] text-white px-6 py-3 rounded-[16px] text-sm font-bold shadow-md min-h-[44px] transition-all">
            <Download size={16} /> Export Logs
          </button>
        }
      />

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="relative group">
          <Box size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <select 
            value={entityType}
            onChange={e => { setEntityType(e.target.value); setActor(''); setPage(0); }}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer"
          >
            <option value="">All Entities</option>
            <option value="STUDENT">Students</option>
            <option value="TEACHER">Faculty</option>
            <option value="FEE_PAYMENT">Fee Payments</option>
            <option value="ATTENDANCE">Attendance</option>
            <option value="EXAM">Exams</option>
          </select>
        </div>

        <div className="relative group">
          <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input 
            value={actor}
            onChange={e => { setActor(e.target.value); setEntityType(''); setPage(0); }}
            placeholder="Search by Actor..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9] overflow-hidden">
        {loading ? (
          <div className="py-20"><LoadingSpinner /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-semibold text-slate-600">Timestamp</th>
                  <th className="px-6 py-4 font-semibold text-slate-600">Actor</th>
                  <th className="px-6 py-4 font-semibold text-slate-600">Action</th>
                  <th className="px-6 py-4 font-semibold text-slate-600">Resource</th>
                  <th className="px-6 py-4 font-semibold text-slate-600">IP Address</th>
                  <th className="px-6 py-4 font-semibold text-slate-600">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Clock size={14} />
                        {new Date(log.changedAt).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                          {log.actorUsername?.[0]?.toUpperCase() || 'S'}
                        </div>
                        <span className="font-medium text-slate-700">{log.actorUsername}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4"><ActionBadge action={log.action} /></td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-700">{log.entityType}</span>
                        <span className="text-[10px] text-slate-400 font-mono">ID: {log.entityId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Shield size={14} className="text-slate-300" />
                        <span className="font-mono text-xs">{log.ipAddress || 'Internal'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-[200px] truncate text-xs text-slate-500 italic bg-slate-50 px-2 py-1 rounded" title={log.newValue}>
                        {log.newValue || log.oldValue || 'No metadata'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && logs.length === 0 && (
          <div className="py-20 text-center">
            <div className="text-4xl mb-4 text-slate-200">🔍</div>
            <p className="text-slate-400 font-medium">No audit logs found</p>
          </div>
        )}

        {/* Pagination */}
        <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Showing {page * size + 1} to {Math.min((page + 1) * size, totalElements)} of {totalElements} logs
          </p>
          <div className="flex gap-2">
            <button 
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-white disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-white disabled:opacity-30 transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLogListPage;
