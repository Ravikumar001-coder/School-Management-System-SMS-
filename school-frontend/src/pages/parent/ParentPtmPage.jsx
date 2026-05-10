import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Users, Clock, Calendar as CalendarIcon } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ParentPtmPage = () => {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const { activeChildId } = useAuth();
    const toast = useToast();

    useEffect(() => {
        if (activeChildId) fetchSlots();
    }, [activeChildId]);

    const fetchSlots = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/parents/app/${activeChildId}/ptm?teacherId=1`);
            setSlots(response.data.data || []);
        } catch (error) {
            console.error('Failed to fetch PTM slots:', error);
        } finally {
            setLoading(false);
        }
    };

    const bookSlot = async (slotId) => {
        try {
            await api.post(`/parents/app/${activeChildId}/ptm/book/${slotId}`);
            toast.success('PTM slot booked successfully');
            fetchSlots();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to book slot');
        }
    };

    if (loading && slots.length === 0) return <div className="p-10 flex justify-center"><LoadingSpinner /></div>;

    return (
        <div className="px-6 py-8 pb-32">
            <div className="mb-10">
               <h1 className="text-2xl font-black text-slate-900 tracking-tight">PTM Scheduler</h1>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Parent Teacher Meet</p>
            </div>

            {slots.length === 0 ? (
                <div className="text-center p-12 bg-white rounded-[2.5rem] shadow-sm border border-slate-50">
                    <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mx-auto mb-4">
                      <Users size={32} />
                    </div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No slots available</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {slots.map(slot => {
                        const isBookedByMe = slot.bookingStatus === 'BOOKED';
                        const isTaken = slot.isBooked && !isBookedByMe;
                        
                        let statusStyles = 'bg-emerald-100 text-emerald-700 border-emerald-200';
                        if (isBookedByMe) statusStyles = 'bg-indigo-100 text-indigo-700 border-indigo-200';
                        else if (isTaken) statusStyles = 'bg-slate-100 text-slate-400 border-slate-200';

                        return (
                            <div key={slot.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50 relative group overflow-hidden">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-400 text-xs">
                                           {slot.teacherName?.[0]}
                                        </div>
                                        <div>
                                            <h3 className="font-black text-slate-900 text-base tracking-tight leading-tight">{slot.teacherName}</h3>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{slot.subjectName}</p>
                                        </div>
                                    </div>
                                    <span className={`text-[9px] px-2.5 py-1 rounded-full font-black tracking-widest border uppercase ${statusStyles}`}>
                                        {isBookedByMe ? 'My Slot' : isTaken ? 'Filled' : 'Available'}
                                    </span>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 mb-6 bg-slate-50/50 p-4 rounded-2xl border border-slate-50">
                                    <div className="flex items-center gap-3">
                                        <CalendarIcon size={16} className="text-slate-400" />
                                        <span className="text-xs font-bold text-slate-700">{new Date(slot.slotDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Clock size={16} className="text-slate-400" />
                                        <span className="text-xs font-bold text-slate-700">{slot.startTime} - {slot.endTime}</span>
                                    </div>
                                </div>

                                {!slot.isBooked && (
                                    <button 
                                        onClick={() => bookSlot(slot.id)}
                                        className="w-full h-14 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
                                    >
                                        Book This Slot
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ParentPtmPage;
