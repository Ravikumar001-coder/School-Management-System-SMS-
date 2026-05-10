import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Award, FileText } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ParentResultsPage = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const { activeChildId } = useAuth();

    useEffect(() => {
        if (activeChildId) fetchResults();
    }, [activeChildId]);

    const fetchResults = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/parents/app/${activeChildId}/results`);
            setResults(response.data.data || []);
        } catch (error) {
            console.error('Failed to fetch results:', error);
        } finally {
            setLoading(false);
        }
    };

    const getGradeStyles = (grade) => {
        if (['A+', 'A', 'O'].includes(grade)) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
        if (['B+', 'B'].includes(grade)) return 'text-indigo-600 bg-indigo-50 border-indigo-100';
        if (['C+', 'C'].includes(grade)) return 'text-amber-600 bg-amber-50 border-amber-100';
        return 'text-rose-600 bg-rose-50 border-rose-100';
    };

    if (loading && results.length === 0) return <div className="p-10 flex justify-center"><LoadingSpinner /></div>;

    return (
        <div className="px-6 py-8 pb-32">
            <div className="mb-10">
               <h1 className="text-2xl font-black text-slate-900 tracking-tight">Academic Results</h1>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Performance Analytics</p>
            </div>

            {results.length === 0 ? (
                <div className="text-center p-12 bg-white rounded-[2.5rem] shadow-sm border border-slate-50">
                    <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mx-auto mb-4">
                      <Award size={32} />
                    </div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No results published</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {results.map(result => (
                        <div key={result.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50 group">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="font-black text-slate-900 text-lg tracking-tight leading-tight">{result.examName}</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{result.term}</p>
                                </div>
                                <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center font-black text-2xl shadow-sm ${getGradeStyles(result.grade)}`}>
                                    {result.grade || '-'}
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-6 bg-slate-50/50 p-5 rounded-2xl border border-slate-50">
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Score Obtained</p>
                                    <p className="text-xl font-black text-slate-900 tracking-tight">{result.obtainedMarks} <span className="text-xs font-bold text-slate-300">/ {result.totalMarks}</span></p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Remarks</p>
                                    <p className="text-xs font-bold text-slate-600 truncate">{result.remarks || 'Excellent'}</p>
                                </div>
                            </div>

                            {result.reportCardUrl && (
                                <button className="w-full mt-6 flex items-center justify-center bg-slate-900 text-white h-14 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-slate-950/20 active:scale-95 transition-all">
                                    <FileText size={18} className="mr-2" />
                                    Download Full Report
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ParentResultsPage;
