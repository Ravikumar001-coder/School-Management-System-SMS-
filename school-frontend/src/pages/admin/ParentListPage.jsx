// src/pages/admin/ParentListPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Search, Download, Users, Phone, Mail, Eye, Edit, Trash2, ShieldCheck } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axios';

const ParentListPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchParents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/parents');
      setParents(res.data?.data || []);
    } catch {
      toast.error('Failed to load parent directory.');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetchParents(); }, [fetchParents]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this parent? This will not delete the children.')) return;
    try {
      await api.delete(`/parents/${id}`);
      toast.success('Parent deleted successfully.');
      fetchParents();
    } catch {
      toast.error('Failed to delete parent.');
    }
  };

  const filtered = parents.filter(p => 
    p.fullName?.toLowerCase().includes(search.toLowerCase()) || 
    p.mobileNumber?.includes(search) ||
    (p.children || []).some(c => c.firstName?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Parent Directory"
        subtitle="Manage families and guardian access"
        actions={
          <button onClick={() => navigate('/admin/parents/new')}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm">
            <UserPlus size={16} /> Register Parent
          </button>
        }
      />

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-6 flex gap-3 items-center">
        <div className="relative flex-1 group">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or mobile..."
            className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
          />
        </div>
        <button className="flex items-center gap-2 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-all">
          <Download size={16} /> Export
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="py-20"><LoadingSpinner /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-semibold text-slate-600">Parent / Guardian</th>
                  <th className="px-6 py-4 font-semibold text-slate-600">Contact</th>
                  <th className="px-6 py-4 font-semibold text-slate-600">Children</th>
                  <th className="px-6 py-4 font-semibold text-slate-600">Status</th>
                  <th className="px-6 py-4 text-center font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                          {p.fullName?.[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{p.fullName}</p>
                          <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">{p.relationshipDefault}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Phone size={12} className="text-slate-300" />
                          <span className="font-medium">+91 {p.mobileNumber}</span>
                        </div>
                        {p.email && (
                          <div className="flex items-center gap-2 text-slate-400 text-xs">
                            <Mail size={12} className="text-slate-300" />
                            {p.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        {(p.children || []).map((child, i) => (
                          <div key={i} className="flex items-center gap-3 bg-slate-50/50 p-2 rounded-xl border border-slate-100/50">
                            <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center overflow-hidden shrink-0 border border-slate-100">
                               {child.photoUrl ? (
                                 <img src={child.photoUrl} alt="" className="w-full h-full object-cover" />
                               ) : (
                                 <span className="text-[10px] font-bold text-indigo-400">{child.firstName?.[0]}{child.lastName?.[0]}</span>
                               )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-800 truncate">{child.firstName} {child.lastName}</p>
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] font-mono text-indigo-600 font-bold">{child.studentCode}</span>
                                <span className="text-[9px] font-black uppercase text-slate-400">Class {child.className}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                        {(p.children || []).length === 0 && (
                          <span className="text-xs text-slate-300 italic">No linked children</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border
                        ${p.active ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                        {p.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button 
                          onClick={() => navigate(`/admin/parents/${p.id}`)}
                          className="p-2 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-lg transition-all" title="View Profile">
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => navigate(`/admin/parents/${p.id}/edit`)}
                          className="p-2 hover:bg-amber-50 text-slate-400 hover:text-amber-600 rounded-lg transition-all" title="Edit Parent">
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(p.id)}
                          className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-all" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentListPage;
