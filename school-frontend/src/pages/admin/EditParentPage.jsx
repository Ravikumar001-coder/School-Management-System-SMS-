// src/pages/admin/EditParentPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserPlus, Search, X, Check, Users, ShieldCheck, Heart, ArrowLeft, Loader2 } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import FormField from '../../components/common/FormField';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axios';
import { studentApi } from '../../api/studentApi';

import usePersistedForm from '../../hooks/usePersistedForm';

const EditParentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  // ── Form State with Persistence ───────────────────────────────────────────
  const { 
    formData: form, 
    handleChange: handlePersistedChange, 
    setFormData: setForm,
    clearDraft,
    isRestored
  } = usePersistedForm(`edit_parent_form_${id}`, {});

  const setFormField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  // Student Search
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const fetchParent = async () => {
      try {
        const res = await api.get(`/parents/${id}`);
        const data = res.data?.data;
        if (data) {
          const dbForm = {
            fullName: data.fullName || '',
            mobileNumber: data.mobileNumber || '',
            email: data.email || '',
            alternateMobile: data.alternateMobile || '',
            gender: data.gender || '',
            relationshipDefault: data.relationshipDefault || 'FATHER',
            occupation: data.occupation || '',
            address: data.address || '',
            city: data.city || '',
            state: data.state || '',
            pincode: data.pincode || '',
            studentLinks: (data.children || []).map(c => ({
              studentId: c.studentId,
              name: `${c.firstName} ${c.lastName}`,
              studentCode: c.studentCode,
              relationshipType: c.relationshipType,
              isPrimaryContact: c.isPrimaryContact,
              pickupAuthorized: true, 
              feeResponsible: false    
            }))
          };
          // Merge: Draft overrides DB data
          setForm(prev => ({ ...dbForm, ...prev }));
        }
      } catch {
        toast.error('Failed to load parent data.');
        navigate('/admin/parents');
      } finally {
        setFetching(false);
      }
    };
    fetchParent();
  }, [id, navigate, toast]);

  const handleSearch = async () => {
    if (search.length < 3) return;
    setSearching(true);
    try {
      const res = await studentApi.search(search);
      setSearchResults(res.data?.data || []);
    } catch {
      toast.error('Student search failed.');
    } finally {
      setSearching(false);
    }
  };

  const addStudentLink = (student) => {
    if (form.studentLinks.some(l => l.studentId === student.id)) {
      toast.warning('Student already added.');
      return;
    }
    const newLink = {
      studentId: student.id,
      name: `${student.firstName} ${student.lastName}`,
      studentCode: student.studentId,
      relationshipType: form.relationshipDefault,
      isPrimaryContact: true,
      pickupAuthorized: true,
      feeResponsible: false
    };
    setForm(prev => ({ ...prev, studentLinks: [...prev.studentLinks, newLink] }));
    setSearch('');
    setSearchResults([]);
  };

  const removeLink = (sid) => {
    setForm(prev => ({ ...prev, studentLinks: prev.studentLinks.filter(l => l.studentId !== sid) }));
  };

  const updateLink = (sid, field, value) => {
    setForm(prev => ({
      ...prev,
      studentLinks: prev.studentLinks.map(l => l.studentId === sid ? { ...l, [field]: value } : l)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.studentLinks.length === 0) {
      toast.warning('Please link at least one student.');
      return;
    }
    setLoading(true);
    try {
      await api.put(`/parents/${id}`, form);
      toast.success('Parent profile updated successfully!');
      clearDraft();
      setTimeout(() => navigate('/admin/parents'), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update parent.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="h-[60vh] flex items-center justify-center"><LoadingSpinner /></div>;

  return (
    <div className="animate-fade-in pb-20">
      <PageHeader
        title="Edit Parent Profile"
        subtitle={`Updating ${form.fullName}`}
        actions={<Button variant="secondary" onClick={() => navigate('/admin/parents')}><ArrowLeft size={16} className="mr-2" /> Back</Button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
        <div className="lg:col-span-2 space-y-6">
          <form id="parent-form" onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 space-y-8">
            <section>
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <ShieldCheck className="text-indigo-500" size={20} /> Identity & Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Full Name" required>
                  <input required value={form.fullName} onChange={e => setFormField('fullName', e.target.value)} className="input" placeholder="e.g. Rajesh Kumar" />
                </FormField>
                <FormField label="Primary Mobile" required helpText="10-digit number used for login">
                  <input required pattern="[0-9]{10}" value={form.mobileNumber} onChange={e => setFormField('mobileNumber', e.target.value)} className="input" placeholder="9876543210" />
                </FormField>
                <FormField label="Email Address">
                  <input type="email" value={form.email} onChange={e => setFormField('email', e.target.value)} className="input" placeholder="parent@example.com" />
                </FormField>
                <FormField label="Default Relationship">
                  <select value={form.relationshipDefault} onChange={e => setFormField('relationshipDefault', e.target.value)} className="select">
                    <option value="FATHER">Father</option>
                    <option value="MOTHER">Mother</option>
                    <option value="GUARDIAN">Guardian</option>
                  </select>
                </FormField>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Users className="text-emerald-500" size={20} /> Manage Linked Children
              </h3>
              
              <div className="relative mb-6">
                <div className="relative group">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input 
                    value={search}
                    onChange={e => { setSearch(e.target.value); if(e.target.value.length >= 3) handleSearch(); }}
                    placeholder="Search more children to link..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium"
                  />
                </div>

                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 w-full bg-white border border-slate-100 shadow-2xl rounded-2xl mt-2 z-50 overflow-hidden animate-slide-up">
                    {searchResults.map(s => (
                      <div key={s.id} onClick={() => addStudentLink(s)} className="p-4 hover:bg-slate-50 cursor-pointer flex items-center justify-between border-b border-slate-50 last:border-0 group">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                            {s.firstName?.[0]}{s.lastName?.[0]}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{s.firstName} {s.lastName}</p>
                            <p className="text-xs text-slate-400">Class {s.className} • {s.studentId}</p>
                          </div>
                        </div>
                        <Plus size={20} className="text-slate-300 group-hover:text-indigo-500" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {form.studentLinks.map(link => (
                  <div key={link.studentId} className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-5 group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                          <Heart size={20} className="text-rose-500" fill="currentColor" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{link.name}</p>
                          <p className="text-[10px] text-indigo-600 font-bold font-mono tracking-wider">{link.studentCode}</p>
                        </div>
                      </div>
                      <button type="button" onClick={() => removeLink(link.studentId)} className="p-2 hover:bg-rose-100 text-slate-400 hover:text-rose-600 rounded-lg transition-all">
                        <X size={18} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Role</span>
                        <select value={link.relationshipType} onChange={e => updateLink(link.studentId, 'relationshipType', e.target.value)} className="bg-white border-0 text-xs font-bold rounded-lg px-2 py-1 shadow-sm focus:ring-2 focus:ring-indigo-500/20">
                          <option value="FATHER">Father</option>
                          <option value="MOTHER">Mother</option>
                          <option value="GUARDIAN">Guardian</option>
                          <option value="EMERGENCY">Emergency</option>
                        </select>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer group/check">
                        <input type="checkbox" checked={link.isPrimaryContact} onChange={e => updateLink(link.studentId, 'isPrimaryContact', e.target.checked)} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20" />
                        <span className="text-[10px] uppercase font-bold text-slate-500 group-hover/check:text-indigo-600">Primary</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer group/check">
                        <input type="checkbox" checked={link.feeResponsible} onChange={e => updateLink(link.studentId, 'feeResponsible', e.target.checked)} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20" />
                        <span className="text-[10px] uppercase font-bold text-slate-500 group-hover/check:text-indigo-600">Fee Payer</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer group/check">
                        <input type="checkbox" checked={link.pickupAuthorized} onChange={e => updateLink(link.studentId, 'pickupAuthorized', e.target.checked)} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20" />
                        <span className="text-[10px] uppercase font-bold text-slate-500 group-hover/check:text-indigo-600">Pickup OK</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
              <Button type="submit" loading={loading} className="px-12 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 rounded-2xl h-14 text-base font-bold">
                Update Profile
              </Button>
              <button 
                type="button" 
                onClick={() => clearDraft(true)}
                className="text-slate-400 hover:text-rose-500 text-xs font-bold uppercase tracking-widest px-4 transition-colors"
              >
                🗑️ Clear Draft
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Helper for the icon in search
const Plus = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export default EditParentPage;
