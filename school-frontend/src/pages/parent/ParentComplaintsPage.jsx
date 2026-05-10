import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { MessageSquare, Plus, RefreshCw, X, AlertCircle } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ParentComplaintsPage = () => {
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ category: 'ACADEMIC', description: '' });
    const { activeChildId } = useAuth();
    const toast = useToast();
    const [complaintsList, setComplaintsList] = useState([]);

    useEffect(() => {
        if (activeChildId) fetchComplaints();
    }, [activeChildId]);

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/parents/app/${activeChildId}/complaints`);
            setComplaintsList(response.data.data || []);
        } catch (error) {
            console.error('Failed to fetch complaints:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/parents/app/${activeChildId}/complaints`, formData);
            toast.success('Complaint submitted successfully');
            setShowForm(false);
            setFormData({ category: 'ACADEMIC', description: '' });
            fetchComplaints();
        } catch (error) {
            toast.error('Failed to submit complaint');
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'OPEN': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'RESOLVED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'CLOSED': return 'bg-slate-100 text-slate-600 border-slate-200';
            default: return 'bg-indigo-100 text-indigo-700 border-indigo-200';
        }
    };

    if (loading && complaintsList.length === 0) return <div className="p-10 flex justify-center"><LoadingSpinner /></div>;

    return (
        <div className="px-6 py-8 pb-32">
            <div className="flex justify-between items-center mb-10">
                <div>
                   <h1 className="text-2xl font-black text-slate-900 tracking-tight">Active Reports</h1>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Track your issues</p>
                </div>
                <button 
                  onClick={() => setShowForm(!showForm)} 
                  className={`w-12 h-12 rounded-2xl shadow-lg flex items-center justify-center transition-all active:scale-90 ${showForm ? 'bg-slate-900 text-white' : 'bg-indigo-600 text-white shadow-indigo-500/30'}`}
                >
                    {showForm ? <X size={24} /> : <Plus size={24} />}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-50 mb-10 animate-fade-in">
                    <h3 className="text-lg font-black text-slate-900 mb-6">New Complaint</h3>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Category</label>
                            <select 
                                value={formData.category} 
                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                                className="w-full h-14 bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 focus:bg-white focus:border-indigo-600 outline-none transition-all font-bold text-slate-800"
                            >
                                <option value="ACADEMIC">Academic</option>
                                <option value="TEACHER_BEHAVIOR">Teacher Behavior</option>
                                <option value="TRANSPORT">Transport</option>
                                <option value="FEES">Fees</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Detailed Description</label>
                            <textarea 
                                required
                                rows="5"
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-5 focus:bg-white focus:border-indigo-600 outline-none transition-all font-medium text-slate-600 leading-relaxed"
                                placeholder="Describe the issue clearly..."
                            />
                        </div>
                        <button type="submit" className="w-full h-14 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-indigo-500/30 active:scale-95 transition-all">
                            Submit Report
                        </button>
                    </div>
                </form>
            )}

            {complaintsList.length === 0 && !showForm ? (
                <div className="text-center p-12 bg-white rounded-[2.5rem] shadow-sm border border-slate-50">
                    <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mx-auto mb-4">
                      <MessageSquare size={32} />
                    </div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No active complaints</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {complaintsList.map(c => (
                        <div key={c.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50 group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                       <span className={`text-[9px] px-2 py-0.5 rounded-full font-black tracking-widest border uppercase ${getStatusStyles(c.status)}`}>
                                          {c.status}
                                       </span>
                                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {c.ticketId}</span>
                                    </div>
                                    <h3 className="font-black text-slate-900 text-base leading-tight uppercase tracking-tight">{c.category.replace('_', ' ')}</h3>
                                </div>
                                <span className="text-[9px] font-bold text-slate-300 uppercase shrink-0">{new Date(c.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-4">{c.description}</p>
                            
                            {c.resolutionRemarks && (
                                <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 flex gap-3">
                                    <AlertCircle size={16} className="text-indigo-500 shrink-0 mt-0.5" />
                                    <div>
                                       <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">School Response</p>
                                       <p className="text-xs text-slate-600 font-medium leading-relaxed">{c.resolutionRemarks}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ParentComplaintsPage;
