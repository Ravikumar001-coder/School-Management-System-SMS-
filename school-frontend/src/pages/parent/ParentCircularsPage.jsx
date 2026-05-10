import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { RefreshCw, Bell, Calendar, ChevronRight, FileText } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ParentCircularsPage = () => {
    const [circulars, setCirculars] = useState([]);
    const [loading, setLoading] = useState(false);
    const { activeChildId } = useAuth();

    useEffect(() => {
        if (activeChildId) fetchCirculars();
    }, [activeChildId]);

    const fetchCirculars = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/parents/app/${activeChildId}/circulars`);
            setCirculars(response.data.data || []);
        } catch (error) {
            console.error('Failed to fetch circulars:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-10 flex justify-center"><LoadingSpinner /></div>;

    return (
        <div className="px-6 py-8 pb-32">
            {circulars.length === 0 ? (
                <div className="text-center p-12 bg-white rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
                      <Bell size={32} />
                    </div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No New Circulars</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {circulars.map(circular => (
                        <div key={circular.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50 relative group active:scale-[0.98] transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div className="pr-4">
                                    <h3 className="font-black text-slate-900 text-lg leading-tight mb-1">{circular.title}</h3>
                                    <div className="flex items-center gap-2">
                                       {!circular.isRead && <span className="bg-rose-500 text-white text-[9px] px-2 py-0.5 rounded-full font-black tracking-widest uppercase">New</span>}
                                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{new Date(circular.date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                                   <FileText size={20} />
                                </div>
                            </div>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">{circular.content}</p>
                            
                            {circular.attachmentUrl && (
                                <a href={circular.attachmentUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center w-full py-3 bg-slate-50 text-indigo-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-50 transition-colors">
                                    View Document <ChevronRight size={14} className="ml-1" />
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ParentCircularsPage;
