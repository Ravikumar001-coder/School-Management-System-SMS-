// src/pages/admin/ParentDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, Phone, Mail, MapPin, Briefcase, 
  Users, Heart, ArrowLeft, Edit, Trash2, Calendar
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axios';

const ParentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [parent, setParent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParent = async () => {
      try {
        const res = await api.get(`/parents/${id}`);
        setParent(res.data?.data);
      } catch {
        toast.error('Failed to load parent details.');
        navigate('/admin/parents');
      } finally {
        setLoading(false);
      }
    };
    fetchParent();
  }, [id, navigate, toast]);

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><LoadingSpinner /></div>;
  if (!parent) return null;

  return (
    <div className="animate-fade-in pb-20">
      <PageHeader
        title={parent.fullName}
        subtitle={`${parent.relationshipDefault} • Registered Guardian`}
        actions={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => navigate('/admin/parents')}>
              <ArrowLeft size={16} className="mr-2" /> Back
            </Button>
            <Button onClick={() => navigate(`/admin/parents/${id}/edit`)}>
              <Edit size={16} className="mr-2" /> Edit Profile
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9] p-8 text-center">
            <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 text-3xl font-black">
              {parent.fullName?.[0]}
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-1">{parent.fullName}</h3>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">{parent.relationshipDefault}</p>
            
            <div className="flex justify-center gap-2">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border
                ${parent.active ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                {parent.active ? 'Account Active' : 'Account Inactive'}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9] p-8 space-y-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">Contact Details</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Mobile</p>
                  <p className="font-bold text-slate-700">{parent.mobileNumber}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Email</p>
                  <p className="font-bold text-slate-700">{parent.email || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Address</p>
                  <p className="font-bold text-slate-700 leading-tight text-sm">{parent.address || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Children & Activity */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9] p-8">
            <h3 className="text-lg font-bold text-slate-800 mb-8 flex items-center gap-2">
              <Users className="text-indigo-500" size={20} /> Linked Children (Family Hub)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(parent.children || []).map((child, i) => (
                <div key={i} className="bg-slate-50 border border-slate-100 rounded-2xl p-6 group hover:border-indigo-200 transition-all">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center overflow-hidden border border-slate-100">
                       {child.photoUrl ? (
                         <img src={child.photoUrl} alt="" className="w-full h-full object-cover" />
                       ) : (
                         <div className="text-xl font-black text-indigo-400">{child.firstName?.[0]}{child.lastName?.[0]}</div>
                       )}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800">{child.firstName} {child.lastName}</h4>
                      <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{child.studentCode} • Class {child.className}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className={`p-2 rounded-xl text-center border ${child.isPrimaryContact ? 'bg-indigo-50 border-indigo-100' : 'bg-white border-slate-100 opacity-40'}`}>
                      <p className="text-[8px] font-black uppercase text-slate-400 mb-1">Primary</p>
                      <ShieldCheck size={14} className={`mx-auto ${child.isPrimaryContact ? 'text-indigo-600' : 'text-slate-300'}`} />
                    </div>
                    <div className={`p-2 rounded-xl text-center border ${child.feeResponsible ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-slate-100 opacity-40'}`}>
                      <p className="text-[8px] font-black uppercase text-slate-400 mb-1">Fee Payer</p>
                      <Heart size={14} className={`mx-auto ${child.feeResponsible ? 'text-emerald-600' : 'text-slate-300'}`} />
                    </div>
                    <div className={`p-2 rounded-xl text-center border ${child.pickupAuthorized ? 'bg-amber-50 border-amber-100' : 'bg-white border-slate-100 opacity-40'}`}>
                      <p className="text-[8px] font-black uppercase text-slate-400 mb-1">Pickup</p>
                      <Calendar size={14} className={`mx-auto ${child.pickupAuthorized ? 'text-amber-600' : 'text-slate-300'}`} />
                    </div>
                  </div>
                </div>
              ))}
              
              {(parent.children || []).length === 0 && (
                <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                   <p className="text-slate-400 font-medium italic">No children linked to this parent profile.</p>
                </div>
              )}
            </div>
          </section>

          <section className="bg-slate-900 rounded-[16px] p-8 text-white shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-slate-800">
            <h3 className="text-sm uppercase tracking-widest font-black text-slate-500 mb-8">Security & Logins</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest mb-2">Login Identifier</p>
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-indigo-400" />
                  <span className="font-bold text-lg">+91 {parent.mobileNumber}</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-4 italic">Uses OTP-based secure authentication.</p>
              </div>
              <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest mb-2">Account Status</p>
                <div className="flex items-center gap-3 text-emerald-400">
                  <ShieldCheck size={18} />
                  <span className="font-bold text-lg">Verified Account</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-4 italic">Registration managed by School Admin.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ParentDetailPage;
