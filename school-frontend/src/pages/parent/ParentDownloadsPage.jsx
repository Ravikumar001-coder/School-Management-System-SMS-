import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Download, FileText } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ParentDownloadsPage = () => {
    const [downloads, setDownloads] = useState([]);
    const [loading, setLoading] = useState(false);
    const { activeChildId } = useAuth();

    useEffect(() => {
        if (activeChildId) fetchDownloads();
    }, [activeChildId]);

    const fetchDownloads = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/parents/app/${activeChildId}/downloads`);
            setDownloads(response.data.data || []);
        } catch (error) {
            console.error('Failed to fetch downloads:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading && downloads.length === 0) return <div className="p-10 flex justify-center"><LoadingSpinner /></div>;

    return (
        <div className="px-6 py-8 pb-32">
            <div className="mb-10">
               <h1 className="text-2xl font-black text-slate-900 tracking-tight">Resource Center</h1>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Documents & Downloads</p>
            </div>

            {downloads.length === 0 ? (
                <div className="text-center p-12 bg-white rounded-[2.5rem] shadow-sm border border-slate-50">
                    <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mx-auto mb-4">
                      <Download size={32} />
                    </div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No documents available</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {downloads.map(doc => (
                        <div key={doc.id} className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-50 flex items-center justify-between group active:scale-[0.98] transition-all">
                            <div className="flex items-center gap-4 min-w-0">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                    <FileText size={22} />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-black text-slate-800 text-sm tracking-tight truncate">{doc.title}</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{doc.documentType} • {new Date(doc.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <a 
                                href={doc.fileUrl} 
                                target="_blank" 
                                rel="noreferrer"
                                className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-slate-900/20 hover:bg-indigo-600 transition-colors"
                            >
                                <Download size={18} />
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ParentDownloadsPage;
