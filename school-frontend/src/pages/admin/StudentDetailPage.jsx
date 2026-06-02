import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, MapPin, Briefcase, GraduationCap, 
  Calendar, CreditCard, ShieldCheck, Clock, Trash2, Heart,
  Globe, BookOpen, School, FileText, ArrowLeft, Activity,
  AlertCircle, CheckCircle2, ChevronRight, Database, Tag, Award
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { studentApi } from '../../api/studentApi';
import { attendanceApi } from '../../api/attendanceApi';
import { examApi } from '../../api/examApi';
import { fileApi } from '../../api/fileApi';

const InfoCard = ({ title, icon: Icon, children, colorCls = "text-indigo-600" }) => (
  <div className="bg-white rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9] p-6 h-full transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_15px_-3px_rgb(0,0,0,0.1),0_4px_6px_-4px_rgb(0,0,0,0.1)] duration-300">
    <div className="flex items-center gap-2 mb-6">
      <div className={`p-2 rounded-xl bg-slate-50 ${colorCls}`}>
        <Icon size={18} />
      </div>
      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">{title}</h3>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
      {children}
    </div>
  </div>
);

const DataRow = ({ label, value, icon: Icon, fullWidth = false }) => (
  <div className={`flex flex-col gap-1 ${fullWidth ? 'col-span-full' : ''}`}>
    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
      {Icon && <Icon size={10} />} {label}
    </span>
    <span className="text-sm font-bold text-slate-700 break-words">
      {value !== null && value !== undefined && value !== '' ? (
        typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value
      ) : (
        <span className="text-slate-300 italic font-medium">Not Provided</span>
      )}
    </span>
  </div>
);

const StudentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const today = new Date();
    const from = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
    const to = today.toISOString().split('T')[0];

    studentApi.getById(id)
      .then(async (r) => {
        const s = r.data?.data || r.data;
        setStudent(s);

        const academicYear = s.academicYear || `${today.getFullYear()}-${String(today.getFullYear() + 1).slice(-2)}`;

        const [aRes, rcRes] = await Promise.all([
          attendanceApi.studentReport(id, from, to).catch(() => ({ data: { data: null } })),
          examApi.reportCard(id, academicYear).catch(() => ({ data: { data: [] } })),
        ]);

        setAttendance(aRes.data?.data || null);
        setReport(Array.isArray(rcRes.data?.data) ? rcRes.data.data : []);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to load student details.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const attendancePercent = Number(attendance?.percentage || 0);

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return null;
    try {
      return new Date(dateTimeStr).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateTimeStr;
    }
  };

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><LoadingSpinner /></div>;
  if (error) return <div className="p-8 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 font-bold flex items-center gap-3"><AlertCircle /> {error}</div>;

  return (
    <div className="max-w-[1600px] mx-auto pb-20 animate-fade-in px-4 md:px-8">
      
      {/* ── Top Navigation & Actions ─────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/students')}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-[#1E40AF] hover:border-[#1E40AF]/30 hover:bg-[#DBEAFE]/30 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">
              <span>Directory</span> <ChevronRight size={10} /> <span>Student Profile</span>
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              {student.firstName} {student.lastName}
              <span className={`text-[10px] px-2.5 py-1 rounded-lg border font-black uppercase tracking-wider ${student.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                {student.status || 'ACTIVE'}
              </span>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(`/admin/students/${id}/edit`)}
            className="px-6 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold text-sm hover:border-[#1E40AF]/30 hover:text-[#1E40AF] transition-all shadow-sm flex items-center gap-2"
          >
            <FileText size={16} /> Edit Profile
          </button>
          <button 
            onClick={() => navigate(`/admin/attendance`)}
            className="px-6 py-2.5 rounded-xl bg-[#1E40AF] text-white font-black text-sm hover:bg-[#1E3A8A] transition-all shadow-md flex items-center gap-2"
          >
            <CheckCircle2 size={16} /> Manage Attendance
          </button>
        </div>
      </div>

      {/* ── Top Horizontal Profile Persona Card ─────────────────────────── */}
      <div className="bg-white rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9] p-8 mb-6 flex flex-col lg:flex-row items-center gap-8">
        <div className="relative group">
          <div className="w-24 h-24 rounded-[16px] bg-[#DBEAFE] border-4 border-white shadow-md overflow-hidden flex items-center justify-center ring-1 ring-slate-100 transition-transform group-hover:scale-105 duration-300">
            {student.profilePhoto ? (
              <img src={fileApi.toPublicUrl(student.profilePhoto)} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-black text-[#1E40AF]/50">{student.firstName?.[0]}{student.lastName?.[0]}</span>
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-[#1E40AF] text-white p-1.5 rounded-xl shadow-lg border-2 border-white">
            <ShieldCheck size={12} />
          </div>
        </div>

        <div className="text-center lg:text-left space-y-1 flex-1">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">{student.firstName} {student.lastName}</h2>
          <p className="text-[#1E40AF] font-bold text-sm">ID: {student.studentId} • Roll: {student.rollNumber || 'TBD'}</p>
          <div className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2 text-xs text-slate-500 font-semibold pt-1">
            <span className="flex items-center gap-1.5"><Mail size={14} className="text-slate-400" /> {student.email || 'No email provided'}</span>
            <span className="flex items-center gap-1.5"><Phone size={14} className="text-slate-400" /> {student.phone || 'No phone provided'}</span>
            <span className="flex items-center gap-1.5"><User size={14} className="text-slate-400" /> Gender: {student.gender || 'Not specified'}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 w-full lg:w-auto">
          <div className="flex items-center gap-4 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 flex-1 lg:flex-initial justify-between">
            <div className="text-left">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Attendance</span>
              <span className={`text-base font-black ${attendancePercent > 80 ? 'text-emerald-600' : 'text-amber-600'}`}>{attendancePercent}%</span>
            </div>
            <div className="w-8 h-8 rounded-full border-4 border-[#DBEAFE] border-t-[#1E40AF] flex items-center justify-center">
              <span className="text-[8px] font-black text-slate-700">{attendancePercent}%</span>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 flex-1 lg:flex-initial">
            <div className="text-left">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Current Class</span>
              <span className="text-sm font-black text-slate-700">{student.className ? `${student.className} - ${student.sectionName || '—'}` : '—'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Grid Content Layout ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        
        <InfoCard title="Academic Identity" icon={BookOpen}>
          <DataRow label="Current Class" value={student.className ? `${student.className} - ${student.sectionName || '—'}` : '—'} icon={School} />
          <DataRow label="Personal Section" value={student.section} icon={School} />
          <DataRow label="Session" value={student.academicYear} icon={Calendar} />
          <DataRow label="Admission Date" value={formatDate(student.admissionDate)} icon={Clock} />
          <DataRow label="Admission Source" value={student.admissionSource} icon={GraduationCap} />
          <DataRow label="Admission Class" value={student.admissionClass} icon={School} />
          <DataRow label="New Admission" value={student.isNewAdmission} icon={ShieldCheck} />
          <DataRow label="Previous School" value={student.previousSchool} icon={School} />
          <DataRow label="Graduation Date" value={formatDate(student.graduationDate)} icon={Calendar} />
        </InfoCard>

        <InfoCard title="Family Contact" icon={Heart} colorCls="text-rose-500">
          <DataRow label="Guardian" value={student.parentName} icon={User} />
          <DataRow label="Phone" value={student.parentPhone} icon={Phone} />
          <DataRow label="Relationship" value={student.guardianRelationship || student.parentRelationship} icon={Clock} />
          <DataRow label="Guardian Email" value={student.parentEmail} icon={Mail} />
          <DataRow label="Emergency Contact" value={student.emergencyContact} icon={Activity} />
        </InfoCard>

        <InfoCard title="Compliance & Personal" icon={ShieldCheck}>
          <DataRow label="Aadhar Card" value={student.aadharCard} icon={CreditCard} />
          <DataRow label="Date of Birth" value={formatDate(student.dateOfBirth)} icon={Calendar} />
          <DataRow label="Nationality" value={student.nationality} icon={Globe} />
          <DataRow label="Religion" value={student.religion} icon={BookOpen} />
          <DataRow label="Category" value={student.category} icon={User} />
          <DataRow label="User ID Key" value={student.userId} icon={Tag} />
        </InfoCard>

        <InfoCard title="Health & Vitals" icon={Activity} colorCls="text-emerald-600">
          <DataRow label="Blood Group" value={student.bloodGroup} icon={Heart} />
          <div className="flex flex-col gap-1 col-span-full pt-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <AlertCircle size={10} /> Medical Conditions
            </span>
            <p className="text-sm font-semibold text-slate-600 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/50 leading-relaxed mt-1">
              {student.medicalConditions || "No known allergies or conditions reported."}
            </p>
          </div>
        </InfoCard>

        <InfoCard title="Assigned Courses" icon={Briefcase} colorCls="text-amber-500">
          <div className="flex flex-col gap-1 col-span-full pt-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <BookOpen size={10} /> Registered Courses (Text Payload)
            </span>
            <p className="text-sm font-semibold text-slate-600 bg-amber-50/50 p-4 rounded-xl border border-amber-100/50 leading-relaxed mt-1">
              {student.courses || "No special elective courses registered."}
            </p>
          </div>
        </InfoCard>

        <InfoCard title="Promotions & Transfers" icon={Award} colorCls="text-purple-600">
          <DataRow label="Promoted From Class ID" value={student.promotedFromClassroomId} icon={Award} />
          <DataRow label="Previous Student ID" value={student.previousStudentId} icon={Tag} />
          <DataRow label="Transfer Certificate No" value={student.transferCertificateNo} icon={FileText} />
        </InfoCard>

      </div>

      {/* ── Row 4: Wide Stats, Residential Address & System Audit Details ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Quick Stats & Performance */}
        <div className="space-y-6">
          <div className="bg-white rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9] p-6 flex items-center gap-6">
            <div className="w-16 h-16 rounded-full border-4 border-[#DBEAFE] border-t-[#1E40AF] flex items-center justify-center flex-shrink-0 shadow-inner">
               <span className="text-sm font-black text-slate-800">{attendancePercent}%</span>
            </div>
            <div>
               <h4 className="text-sm font-bold text-slate-800 tracking-tight">Academic Attendance</h4>
               <p className="text-slate-400 text-xs font-medium">Monthly progress for session</p>
               <div className="flex gap-2 mt-2">
                  <div className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100/30">Pres: {attendance?.presentDays || 0}d</div>
                  <div className="text-[9px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100/30">Abs: {attendance?.absentDays || 0}d</div>
               </div>
            </div>
          </div>

          <div className="bg-white rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9] p-6 flex items-center justify-between group cursor-pointer hover:border-[#1E40AF]/30 transition-all hover:-translate-y-0.5">
             <div className="flex items-center gap-4">
               <div className="p-3 rounded-xl bg-[#DBEAFE] text-[#1E40AF] group-hover:bg-[#1E40AF] group-hover:text-white transition-all border border-[#DBEAFE]">
                  <BookOpen size={20} />
               </div>
               <div>
                  <h4 className="text-sm font-bold text-slate-800 tracking-tight">View Full Report Card</h4>
                  <p className="text-slate-400 text-xs font-medium">Semester grade cards</p>
               </div>
             </div>
             <ChevronRight size={18} className="text-slate-300 group-hover:text-[#1E40AF] transition-all" />
          </div>
        </div>

        {/* Address Card */}
        <div className="bg-white rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9] p-6 flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wider">
            <MapPin size={16} className="text-[#1E40AF]" /> Residential Address
          </h3>
          <p className="text-slate-600 font-semibold text-sm leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 mt-4 flex-1">
             {student.address || "Permanent residential address not updated in records."}
          </p>
        </div>

        {/* System Audit Details */}
        <InfoCard title="System Audit Details" icon={Database} colorCls="text-slate-500">
          <DataRow label="Academic Branch" value={student.branchName ? `${student.branchName} (ID: ${student.branchId})` : '—'} icon={School} />
          <DataRow label="System Created At" value={formatDateTime(student.createdAt)} icon={Calendar} />
          <DataRow label="Created By" value={student.createdBy} icon={User} />
          <DataRow label="System Updated At" value={formatDateTime(student.updatedAt)} icon={Calendar} />
          <DataRow label="Updated By" value={student.updatedBy} icon={User} />
        </InfoCard>

      </div>

    </div>
  );
};

export default StudentDetailPage;
