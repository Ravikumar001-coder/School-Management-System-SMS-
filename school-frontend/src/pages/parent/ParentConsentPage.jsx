import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { FileSignature, CheckCircle, XCircle, Calendar } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ParentConsentPage = () => {
    const [consents, setConsents] = useState([]);
    const [loading, setLoading] = useState(false);
    const { activeChildId } = useAuth();
    const toast = useToast();

    useEffect(() => {
        if (activeChildId) fetchConsents();
    }, [activeChildId]);

    const fetchConsents = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/parents/app/${activeChildId}/consents`);
            setConsents(response.data.data || []);
        } catch (error) {
            console.error('Failed to fetch consents:', error);
        } finally {
            setLoading(false);
        }
    };

    const submitResponse = async (formId, status) => {
        try {
            await api.post(`/parents/app/${activeChildId}/consents/${formId}`, { status });
            toast.success(`Consent ${status.toLowerCase()} successfully`);
            fetchConsents();
        } catch (error) {
            toast.error('Failed to submit response');
        }
    };

    if (loading && consents.length === 0) return <div className="p-10 flex justify-center"><LoadingSpinner /></div>;

    return (
        <div className="px-6 py-8 pb-32">
            <div className="mb-10">
               <h1 className="text-2xl font-black text-slate-900 tracking-tight">Consent Forms</h1>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Authorization Center</p>
            </div>

            {consents.length === 0 ? (
                <div className="text-center p-12 bg-white rounded-[2.5rem] shadow-sm border border-slate-50">
                    <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mx-auto mb-4">
                      <FileSignature size={32} />
                    </div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No pending forms</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {consents.map(consent => (
                        <div key={consent.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-50 group">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="font-black text-slate-900 text-lg tracking-tight leading-tight pr-4">{consent.title}</h3>
                                {consent.responseStatus === 'APPROVED' ? (
                                    <span className="bg-emerald-100 text-emerald-700 text-[9px] px-2.5 py-1 rounded-full font-black tracking-widest uppercase flex items-center gap-1.5 shrink-0">
                                        <CheckCircle size={12} /> Approved
                                    </span>
                                ) : consent.responseStatus === 'REJECTED' ? (
                                    <span className="bg-rose-100 text-rose-700 text-[9px] px-2.5 py-1 rounded-full font-black tracking-widest uppercase flex items-center gap-1.5 shrink-0">
                                        <XCircle size={12} /> Rejected
                                    </span>
                                ) : (
                                    <span className="bg-amber-100 text-amber-700 text-[9px] px-2.5 py-1 rounded-full font-black tracking-widest uppercase shrink-0">
                                        Pending
                                    </span>
                                )}
                            </div>
                            
                            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">{consent.description}</p>
                            
                            <div className="flex items-center gap-2 text-[10px] font-black text-rose-500 uppercase tracking-widest mb-6">
                                <Calendar size={14} /> Due by {new Date(consent.dueDate).toLocaleDateString()}
                            </div>

                            {!consent.responseStatus && (
                                <div className="grid grid-cols-2 gap-4">
                                    <button 
                                        onClick={() => submitResponse(consent.id, 'APPROVED')}
                                        className="h-14 bg-emerald-50 text-emerald-700 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center hover:bg-emerald-100 active:scale-95 transition-all"
                                    >
                                        Approve
                                    </button>
                                    <button 
                                        onClick={() => submitResponse(consent.id, 'REJECTED')}
                                        className="h-14 bg-rose-50 text-rose-700 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center hover:bg-rose-100 active:scale-95 transition-all"
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ParentConsentPage;
