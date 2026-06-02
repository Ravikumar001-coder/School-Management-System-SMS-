import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  User, Mail, Phone, MapPin, Briefcase, GraduationCap, 
  Calendar, CreditCard, ShieldCheck, Clock, ArrowLeft, 
  Edit3, MessageSquare, BadgeCheck, HeartPulse, Landmark,
  Activity, ShieldAlert, CheckCircle2, ChevronRight, Receipt,
  Fingerprint, School, BookOpen, FileText
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { teacherApi } from '../../api/teacherApi';
import { fileApi } from '../../api/fileApi';
import { useToast } from '../../context/ToastContext';

const SectionCard = ({ title, icon: Icon, children, colorCls = "text-indigo-600" }) => (
  <div className="bg-white rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9] p-6 h-full transition-all hover:shadow-lg">
    <div className="flex items-center gap-2 mb-6">
      <div className={`p-2 rounded-xl bg-slate-50 ${colorCls}`}>
        <Icon size={18} />
      </div>
      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">{title}</h3>
    </div>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

const DetailItem = ({ label, value, icon: Icon }) => (
  <div className="flex flex-col gap-1 group">
    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
      {Icon && <Icon size={10} />} {label}
    </span>
    <span className="text-sm font-bold text-slate-700 leading-tight">
      {value || <span className="text-slate-300 font-normal italic">Not specified</span>}
    </span>
  </div>
);

const TeacherDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    teacherApi.getById(id)
      .then(res => setTeacher(res.data?.data || res.data))
      .catch(err => {
        toast.showToast(err.response?.data?.message || 'Failed to load staff profile.', 'error');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><LoadingSpinner /></div>;
  if (!teacher) return <div className="p-20 text-center text-slate-400 font-medium">Staff record not found.</div>;

  return (
    <div className="max-w-[1600px] mx-auto pb-20 animate-fade-in">
      
      {/* ── Top Navigation & Actions ─────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/teachers')}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">
              <span>HRMS Directory</span> <ChevronRight size={10} /> <span>Staff Profile</span>
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              {teacher.firstName} {teacher.lastName}
              <span className={`text-[10px] px-2 py-1 rounded-md uppercase ${teacher.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                {teacher.status}
              </span>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(`/admin/teachers/${id}/edit`)}
            className="px-6 py-3 min-h-[44px] rounded-[16px] bg-white border border-[#f1f5f9] text-slate-600 font-bold text-sm hover:border-indigo-200 hover:text-indigo-600 transition-all shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] flex items-center gap-2"
          >
            <Edit3 size={16} /> Edit Profile
          </button>
          <button className="bg-[#1E40AF] hover:bg-[#1E3A8A] text-white px-6 py-3 rounded-[16px] min-h-[44px] font-bold text-sm shadow-md transition-all flex items-center gap-2">
            <Fingerprint size={16} /> Biometric Sync
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ── Sidebar: Persona ───────────────────────────────────────── */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9] p-8 text-center flex flex-col items-center">
            <div className="relative mb-6 group">
              <div className="w-32 h-32 rounded-[2.5rem] bg-indigo-50 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center ring-1 ring-slate-100">
                {teacher.profilePhoto ? (
                  <img src={fileApi.toPublicUrl(teacher.profilePhoto)} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-black text-indigo-200">{teacher.firstName?.[0]}{teacher.lastName?.[0]}</span>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-xl shadow-lg border-2 border-white">
                <BadgeCheck size={14} />
              </div>
            </div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">{teacher.firstName} {teacher.lastName}</h2>
            <p className="text-indigo-600 font-bold text-sm mb-6">{teacher.employeeId}</p>
            
            <div className="w-full space-y-3 pt-6 border-t border-slate-50">
               <div className="flex justify-between items-center px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payroll</span>
                  <span className="text-sm font-black text-emerald-600">{teacher.payrollStatus || 'ACTIVE'}</span>
               </div>
               <div className="flex justify-between items-center px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</span>
                  <span className="text-sm font-black text-slate-700">{teacher.employmentType?.replace('_', ' ') || 'FULL TIME'}</span>
               </div>
            </div>
          </div>

          <SectionCard title="Verification Status" icon={ShieldCheck} colorCls="text-emerald-600">
            <div className="space-y-4">
               <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Background</span>
                  <span className="text-[10px] font-black text-indigo-600">{teacher.backgroundCheckStatus || 'PENDING'}</span>
               </div>
               <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Documents</span>
                  <span className="text-[10px] font-black text-emerald-600">{teacher.documentVerificationStatus || 'VERIFIED'}</span>
               </div>
               <DetailItem label="Biometric ID" value={teacher.biometricId} icon={Fingerprint} />
            </div>
          </SectionCard>
        </div>

        {/* ── Main Content Area ───────────────────────────────────────── */}
        <div className="lg:col-span-9 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SectionCard title="Professional Identity" icon={Briefcase}>
              <DetailItem label="Designation" value={teacher.designation} icon={Award} />
              <DetailItem label="Department" value={teacher.departmentName} icon={School} />
              <DetailItem label="Qualification" value={teacher.qualification} icon={GraduationCap} />
              <DetailItem label="Specialization" value={teacher.specialization} icon={BookOpen} />
            </SectionCard>

            <SectionCard title="Payroll & Compliance" icon={Landmark} colorCls="text-emerald-600">
              <DetailItem label="Monthly Salary" value={teacher.salary ? `₹${teacher.salary.toLocaleString()}` : '—'} icon={Receipt} />
              <DetailItem label="Bank Account" value={teacher.bankAccountNo ? `XXXX${teacher.bankAccountNo.slice(-4)}` : '—'} icon={Landmark} />
              <DetailItem label="PAN Card" value={teacher.panCard} icon={CreditCard} />
              <DetailItem label="Aadhar Card" value={teacher.aadharCard} icon={ShieldCheck} />
            </SectionCard>

            <SectionCard title="Health & Contact" icon={Activity} colorCls="text-rose-500">
              <DetailItem label="Mobile Number" value={teacher.phone} icon={Phone} />
              <DetailItem label="Official Email" value={teacher.email} icon={Mail} />
              <DetailItem label="Blood Group" value={teacher.bloodGroup} icon={HeartPulse} />
              <DetailItem label="Emergency Contact" value={teacher.emergencyContact} icon={Activity} />
            </SectionCard>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <SectionCard title="Staff Lifecycle" icon={Clock} colorCls="text-amber-500">
                <div className="grid grid-cols-2 gap-6">
                   <DetailItem label="Joining Date" value={teacher.joiningDate} icon={Calendar} />
                   <DetailItem label="Work Shift" value={teacher.workShift} icon={Clock} />
                   <DetailItem label="Probation End" value={teacher.probationEndDate} icon={ShieldAlert} />
                   <DetailItem label="Contract End" value={teacher.contractEndDate} icon={FileText} />
                </div>
             </SectionCard>

             <div className="bg-white rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9] p-8 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-4">
                   <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <GraduationCap size={24} />
                   </div>
                   <div>
                      <h4 className="text-lg font-black text-slate-800">Experience Profile</h4>
                      <p className="text-slate-500 text-xs font-medium">Professional history in academic sector</p>
                   </div>
                </div>
                <div className="flex items-end gap-2">
                   <span className="text-4xl font-black text-slate-800">{teacher.experienceYears || '0'}</span>
                   <span className="text-sm font-bold text-slate-400 pb-1.5 uppercase tracking-widest">Years of Experience</span>
                </div>
             </div>
          </div>

          <div className="bg-white rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9] p-8">
            <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-wider">
              <MapPin size={16} className="text-indigo-600" /> Residential Address
            </h3>
            <p className="text-slate-600 font-semibold leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100">
               {teacher.address || "Permanent residential address not updated in records."}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

// Internal icon mapping if missing from imports
const Award = (props) => <BadgeCheck {...props} />;

export default TeacherDetailPage;
