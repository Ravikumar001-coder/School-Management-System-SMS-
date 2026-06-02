// src/pages/admin/AdmissionCRM.jsx
import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import { useToast } from '../../hooks/useToast';
import PageHeader from '../../components/common/PageHeader';
import Loading from '../../components/common/Loading';
import { FiPlus, FiPhone, FiMail, FiEdit2, FiTrash2, FiArrowRight, FiUser } from 'react-icons/fi';

const STATUSES = ['NEW', 'FOLLOW_UP', 'REGISTERED', 'ADMITTED', 'REJECTED'];

const STATUS_STYLES = {
  NEW:        { bg: 'bg-blue-50',   badge: 'bg-blue-100 text-blue-700',   border: 'border-blue-200' },
  FOLLOW_UP:  { bg: 'bg-yellow-50', badge: 'bg-yellow-100 text-yellow-700', border: 'border-yellow-200' },
  REGISTERED: { bg: 'bg-purple-50', badge: 'bg-purple-100 text-purple-700', border: 'border-purple-200' },
  ADMITTED:   { bg: 'bg-green-50',  badge: 'bg-green-100 text-green-700',  border: 'border-green-200' },
  REJECTED:   { bg: 'bg-red-50',    badge: 'bg-red-100 text-red-700',     border: 'border-red-200' },
};

const EMPTY_FORM = { studentName: '', parentName: '', phone: '', email: '', source: '' };

const AdmissionCRM = () => {
  const toast = useToast();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editLead, setEditLead] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  // ── Fetch all leads ──────────────────────────────────────────────────────
  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/crm/leads');
      setLeads(res.data?.data ?? res.data ?? []);
    } catch {
      toast.error('Failed to load CRM leads.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  // ── Advance lead to next stage ───────────────────────────────────────────
  const advanceLead = async (lead) => {
    const nextIdx = STATUSES.indexOf(lead.status) + 1;
    if (nextIdx >= STATUSES.length) return;
    const nextStatus = STATUSES[nextIdx];
    try {
      await api.patch(`/admin/crm/leads/${lead.id}/status?status=${nextStatus}`);
      toast.success(`Moved to ${nextStatus.replace('_', ' ')}`);
      fetchLeads();
    } catch {
      toast.error('Failed to update lead status.');
    }
  };

  // ── Delete lead ──────────────────────────────────────────────────────────
  const deleteLead = async (id) => {
    if (!window.confirm('Remove this lead?')) return;
    try {
      await api.delete(`/admin/crm/leads/${id}`);
      toast.success('Lead removed.');
      fetchLeads();
    } catch {
      toast.error('Failed to remove lead.');
    }
  };

  // ── Open form ────────────────────────────────────────────────────────────
  const openAdd = () => { setEditLead(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit = (lead) => {
    setEditLead(lead);
    setForm({ studentName: lead.studentName, parentName: lead.parentName, phone: lead.phone, email: lead.email || '', source: lead.source || '' });
    setModalOpen(true);
  };

  // ── Save form ────────────────────────────────────────────────────────────
  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.studentName || !form.parentName || !form.phone) {
      return toast.error('Student name, parent name and phone are required.');
    }
    setSaving(true);
    try {
      if (editLead) {
        await api.put(`/admin/crm/leads/${editLead.id}`, form);
        toast.success('Lead updated successfully.');
      } else {
        await api.post('/admin/crm/leads', form);
        toast.success('New lead added successfully.');
      }
      setModalOpen(false);
      fetchLeads();
    } catch {
      toast.error('Failed to save lead. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading fullScreen />;

  return (
    <>
      <PageHeader
        title="Admission CRM Pipeline"
        subtitle="Track enquiries from first contact to admission."
        actions={
          <button
            id="btn-add-lead"
            onClick={openAdd}
            className="bg-[#1E40AF] hover:bg-[#1E3A8A] text-white px-6 py-3 rounded-[16px] font-bold shadow-md min-h-[44px] flex items-center gap-2"
          >
            <FiPlus /> New Lead
          </button>
        }
      />

      {/* Pipeline Kanban */}
      <div className="flex gap-4 overflow-x-auto pb-6 animate-fade-in">
        {STATUSES.map(status => {
          const style = STATUS_STYLES[status];
          const stageLeads = leads.filter(l => l.status === status);
          return (
            <div key={status} className={`flex-shrink-0 w-72 rounded-[16px] border ${style.border} ${style.bg} p-4`}>
              {/* Column header */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-widest text-gray-600">
                  {status.replace('_', ' ')}
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${style.badge}`}>
                  {stageLeads.length}
                </span>
              </div>

              {/* Lead cards */}
              <div className="space-y-3">
                {stageLeads.length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-6 italic">No leads here</p>
                )}
                {stageLeads.map(lead => (
                  <div key={lead.id} className="bg-white rounded-[16px] p-4 border border-[#f1f5f9] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] group hover:-translate-y-1 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-sm font-bold text-gray-800">{lead.studentName}</h4>
                        <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                          <FiUser className="w-3 h-3" /> {lead.parentName}
                        </p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(lead)} className="p-1 text-blue-500 hover:bg-blue-50 rounded">
                          <FiEdit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => deleteLead(lead.id)} className="p-1 text-red-400 hover:bg-red-50 rounded">
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-gray-400 text-xs mb-3">
                      <span className="flex items-center gap-1"><FiPhone className="w-3 h-3" />{lead.phone}</span>
                      {lead.email && <span className="flex items-center gap-1"><FiMail className="w-3 h-3" />{lead.email}</span>}
                    </div>

                    {lead.source && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
                        {lead.source}
                      </span>
                    )}

                    {status !== 'ADMITTED' && status !== 'REJECTED' && (
                      <button
                        onClick={() => advanceLead(lead)}
                        className="mt-3 w-full flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider text-blue-600 hover:bg-blue-50 py-1.5 rounded-lg transition-colors border border-blue-100"
                      >
                        Move to {STATUSES[STATUSES.indexOf(status) + 1]?.replace('_', ' ')} <FiArrowRight />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9] w-full max-w-md mx-4 p-6 animate-fade-in">
            <h2 className="text-lg font-black text-gray-800 mb-4">
              {editLead ? 'Edit Lead' : 'Add New Lead'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="form-label">Student Name *</label>
                <input className="form-input" value={form.studentName} onChange={e => setForm({ ...form, studentName: e.target.value })} placeholder="Student full name" required />
              </div>
              <div>
                <label className="form-label">Parent Name *</label>
                <input className="form-input" value={form.parentName} onChange={e => setForm({ ...form, parentName: e.target.value })} placeholder="Parent / guardian name" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Phone *</label>
                  <input className="form-input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 XXXXXXXXXX" required />
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <input className="form-input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="parent@email.com" type="email" />
                </div>
              </div>
              <div>
                <label className="form-label">Source / Referral</label>
                <input className="form-input" value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} placeholder="e.g. Walk-in, Website, Referral" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="bg-[#1E40AF] hover:bg-[#1E3A8A] text-white px-6 py-3 rounded-[16px] font-bold shadow-md flex-1">
                  {saving ? 'Saving...' : editLead ? 'Update Lead' : 'Add Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdmissionCRM;
