// src/pages/parent/ParentFeesPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Receipt, Clock, Download, ChevronRight, ShieldCheck } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';

const ParentFeesPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { children, activeChildId, setActiveChildId } = useAuth();
  const [loading, setLoading] = useState(false);
  const [feeData, setFeeData] = useState({ totalPending: 0, pendingInvoices: [], recentReceipts: [] });

  useEffect(() => {
    if (!activeChildId) return;
    const fetchFees = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/parents/app/fees/${activeChildId}`);
        setFeeData(res.data?.data || { totalPending: 0, pendingInvoices: [], recentReceipts: [] });
      } catch (err) {
        toast.error('Failed to load fee details.');
      } finally {
        setLoading(false);
      }
    };
    fetchFees();
  }, [activeChildId, toast]);

  const activeChild = children.find(c => c.studentId === activeChildId) || {};

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50"><LoadingSpinner /></div>;

  return (
    <div className="pb-24 animate-fade-in">
      {/* Child Switcher Pill */}
      <div className="px-6 py-6 overflow-x-auto flex gap-3 no-scrollbar">
        {children.map(child => (
          <button 
            key={child.studentId}
            onClick={() => setActiveChildId(child.studentId)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap border
              ${activeChildId === child.studentId 
                ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-500/20' 
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
          >
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
               {child.firstName?.[0]}{child.lastName?.[0]}
            </div>
            {child.firstName}
          </button>
        ))}
      </div>

      <div className="px-6 space-y-6">
         {/* Due Card */}
         <div className="bg-rose-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-rose-500/30 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <p className="text-sm font-bold text-rose-200 uppercase tracking-widest mb-1 flex items-center gap-2">
              Total Pending Dues <Clock size={14} />
            </p>
            <h1 className="text-5xl font-black mb-6 tracking-tight">₹{feeData.totalPending?.toLocaleString()}</h1>
            
            <div className="flex items-center justify-between border-t border-rose-500/50 pt-6">
               <div>
                  <p className="text-xs text-rose-200 font-medium">Next Due Date</p>
                  <p className="font-bold">{feeData.nextDueDate ? new Date(feeData.nextDueDate).toLocaleDateString() : 'No Dues'}</p>
               </div>
               {feeData.totalPending > 0 && (
                 <Button className="bg-white text-rose-600 hover:bg-rose-50 px-8 h-12 text-sm rounded-xl font-black shadow-lg">
                    Pay Now
                 </Button>
               )}
            </div>
         </div>

         {/* Fee Breakdown */}
         <h3 className="text-lg font-black text-slate-900 pt-2">Pending Invoice Details</h3>
         <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            {feeData.pendingInvoices?.length === 0 ? (
              <div className="p-8 text-center text-slate-400 font-bold">No pending invoices.</div>
            ) : (
              feeData.pendingInvoices?.map(inv => (
                <div key={inv.id} className="p-5 flex items-center justify-between border-b border-slate-50 group hover:bg-slate-50 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{inv.title}</p>
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{inv.invoiceNumber}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-slate-900">₹{inv.amount}</p>
                    <ChevronRight size={16} className="text-slate-300 inline-block mt-1" />
                  </div>
                </div>
              ))
            )}
         </div>

         {/* Payment History */}
         <div className="flex items-center justify-between pt-4">
            <h3 className="text-lg font-black text-slate-900">Recent Receipts</h3>
            <button className="text-xs font-bold text-indigo-600 hover:underline">View All</button>
         </div>
         <div className="space-y-3">
           {feeData.recentReceipts?.length === 0 ? (
              <p className="text-slate-400 text-sm">No recent payments.</p>
           ) : (
              feeData.recentReceipts?.slice(0,3).map(rec => (
                <div key={rec.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{rec.title} Paid</p>
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                         {new Date(rec.paymentDate).toLocaleDateString()} • {rec.paymentMethod}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                     <Download size={18} />
                  </button>
                </div>
              ))
           )}
         </div>

         {/* Security Badge */}
         <div className="flex items-center justify-center gap-2 mt-8 text-slate-400">
            <ShieldCheck size={16} />
            <span className="text-[10px] uppercase font-bold tracking-widest">Secured by Razorpay</span>
         </div>
      </div>
    </div>
  );
};

// Simple helper icon
const CheckCircle2 = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

export default ParentFeesPage;
