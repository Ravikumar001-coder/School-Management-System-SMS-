import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import FormField from '../../components/common/FormField';
import { useToast } from '../../context/ToastContext';
import axios from '../../api/axios';
import { Trash2, Megaphone, Users, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';

const NoticesPage = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: '',
    content: '',
    audience: 'ALL',
    expiresAt: ''
  });
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const fetchNotices = async () => {
    try {
      const res = await axios.get('/announcements');
      setNotices(res.data?.data || []);
    } catch (err) {
      toast.error('Failed to load notices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        expiresAt: form.expiresAt ? `${form.expiresAt}T23:59:59` : null
      };
      await axios.post('/announcements', payload);
      toast.success('Notice published');
      setForm({ title: '', content: '', audience: 'ALL', expiresAt: '' });
      fetchNotices();
    } catch (err) {
      toast.error('Failed to publish notice');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this notice?')) return;
    try {
      await axios.delete(`/announcements/${id}`);
      toast.success('Notice deleted');
      fetchNotices();
    } catch (err) {
      toast.error('Failed to delete notice');
    }
  };

  return (
    <div className="animate-fade-in pb-20">
      <PageHeader 
        title="Bulletin Board" 
        subtitle="Publish notices and announcements to the school community"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
        {/* Publisher */}
        <div className="lg:col-span-1">
          <form onSubmit={handleAdd} className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 space-y-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
              <Megaphone size={24} className="text-indigo-500" /> Draft Notice
            </h3>
            
            <FormField label="Headline" required>
              <input 
                value={form.title} 
                onChange={e => setForm({...form, title: e.target.value})} 
                placeholder="e.g. Annual Sports Meet 2026"
                className="input"
                required
              />
            </FormField>

            <FormField label="Message Content" required>
              <textarea 
                value={form.content} 
                onChange={e => setForm({...form, content: e.target.value})} 
                placeholder="Write your announcement here..."
                className="input min-h-[120px] py-3"
                required
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Audience">
                <select 
                  value={form.audience} 
                  onChange={e => setForm({...form, audience: e.target.value})}
                  className="select"
                >
                  <option value="ALL">Everyone</option>
                  <option value="TEACHERS">Teachers Only</option>
                  <option value="STUDENTS">Students Only</option>
                  <option value="PARENTS">Parents Only</option>
                </select>
              </FormField>

              <FormField label="Expiry (Optional)">
                <input 
                  type="date"
                  value={form.expiresAt} 
                  onChange={e => setForm({...form, expiresAt: e.target.value})}
                  className="input"
                />
              </FormField>
            </div>

            <Button type="submit" loading={saving} fullWidth variant="primary" className="h-12 rounded-2xl">
              Broadcast Notice
            </Button>
          </form>
        </div>

        {/* Live Notices */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm uppercase tracking-widest font-black text-slate-400 px-4">Live Bulletins</h3>
          
          {loading ? (
            <div className="p-20 text-center">
               <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
               <p className="text-slate-400 font-medium">Fetching board...</p>
            </div>
          ) : notices.length === 0 ? (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] py-20 text-center">
               <Megaphone size={48} className="mx-auto text-slate-300 mb-4" />
               <p className="text-slate-400 font-bold">No live notices found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notices.map(notice => (
                <div key={notice.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 group hover:shadow-md transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider
                          ${notice.audience === 'ALL' ? 'bg-emerald-100 text-emerald-700' : 
                            notice.audience === 'TEACHERS' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'}
                        `}>
                          {notice.audience}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 font-bold">
                          <Calendar size={12} /> {format(new Date(notice.createdAt), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-800 mb-2">{notice.title}</h4>
                      <p className="text-slate-500 text-sm leading-relaxed">{notice.content}</p>
                    </div>
                    <button 
                      onClick={() => handleDelete(notice.id)}
                      aria-label={`Delete notice ${notice.title}`}
                      className="p-2 text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoticesPage;
