import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, MapPin, Briefcase, GraduationCap, 
  Calendar, CreditCard, ShieldCheck, Clock, Trash2, Heart,
  Globe, BookOpen, School, FileText, ArrowLeft, Activity,
  AlertCircle, CheckCircle2, ChevronRight, Landmark, Receipt
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import { useToast } from '../../context/ToastContext';
import { teacherApi } from '../../api/teacherApi';
import { subjectApi } from '../../api/subjectApi';
import { classApi } from '../../api/classApi';
import { fileApi } from '../../api/fileApi';
import usePersistedForm from '../../hooks/usePersistedForm';

const Field = ({ label, error, children }) => (
  <div className="space-y-1.5">
    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    {children}
    {error && <p className="text-red-500 text-[10px] mt-1 font-medium italic">{error}</p>}
  </div>
);

const inputCls = `w-full border border-slate-200 rounded-[12px] px-4 py-3
                  text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2
                  focus:ring-[#1E40AF] transition-all placeholder:text-slate-300 bg-white shadow-sm`;

const AddTeacherPage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const { 
    formData: form, 
    handleChange, 
    setFormData: setForm,
    clearDraft 
  } = usePersistedForm('add_teacher_form_hrms', {
    firstName: '', lastName: '', email: '', phone: '',
    departmentId: '', designation: '', qualification: '', specialization: '',
    salary: '', dateOfBirth: '', joiningDate: new Date().toISOString().split('T')[0],
    gender: '', bloodGroup: '', address: '', emergencyContact: '',
    profilePhoto: '', status: 'ACTIVE',
    // HRMS Enterprise Fields
    employmentType: 'FULL_TIME', workShift: 'General', experienceYears: '',
    bankAccountNo: '', ifscCode: '', panCard: '', aadharCard: '',
    pfNumber: '', esiNumber: '', paymentMode: 'BANK_TRANSFER',
    probationEndDate: '', contractEndDate: '', biometricId: '',
    subjectIds: [], assignedClassIds: [],
  });

  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [subRes, classRes, deptRes] = await Promise.all([
          subjectApi.getAll(),
          classApi.getAll(),
          teacherApi.getDepartments ? teacherApi.getDepartments() : Promise.resolve({ data: { data: [] } })
        ]);
        setSubjects(subRes.data?.data || []);
        setClasses(classRes.data?.data || []);
        setDepartments(deptRes.data?.data || []);
      } catch (err) {
        toast.showToast('Failed to load system metadata', 'error');
      }
    };
    fetchMetadata();
  }, []);

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const path = await fileApi.uploadImage(file);
      setForm((prev) => ({ ...prev, profilePhoto: path }));
      toast.showToast('Photo uploaded successfully', 'success');
    } catch (err) {
      toast.showToast('Photo upload failed', 'error');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const onMultiSelect = (name, e) => {
    const values = Array.from(e.target.selectedOptions).map((option) => Number(option.value));
    setForm((prev) => ({ ...prev, [name]: values }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await teacherApi.create({
        ...form,
        salary: form.salary === '' ? null : Number(form.salary),
        departmentId: form.departmentId || null,
        experienceYears: form.experienceYears === '' ? 0 : Number(form.experienceYears)
      });
      toast.showToast('Staff member onboarded successfully!', 'success');
      clearDraft();
      setTimeout(() => navigate('/admin/teachers'), 1200);
    } catch (err) {
      toast.showToast(err.response?.data?.message || 'Onboarding failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-fade-in">
      {/* ── Header Area ────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Staff Onboarding (HRMS)</h1>
          <p className="text-slate-500 font-medium text-sm">Create an enterprise-hardened employee record</p>
        </div>
        <button 
          onClick={() => navigate('/admin/teachers')}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm"
        >
          <ArrowLeft size={16} /> Staff Directory
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECTION 1: IDENTITY & PROFILE */}
        <div className="bg-white rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9] p-8">
          <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-wider">
            <User size={16} className="text-[#1E40AF]" /> Identity & Profile
          </h3>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex flex-col items-center gap-4">
              <div className="w-32 h-32 rounded-[2rem] bg-indigo-50 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden ring-1 ring-slate-100">
                {form.profilePhoto ? (
                  <img src={fileApi.toPublicUrl(form.profilePhoto)} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <User size={48} className="text-indigo-200" />
                )}
              </div>
              <label className="bg-[#1E40AF] hover:bg-[#1E3A8A] text-white px-4 py-2 rounded-[12px] text-xs font-bold cursor-pointer transition shadow-md">
                {uploadingPhoto ? 'Uploading...' : 'Upload Photo'}
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Field label="First Name *">
                <input name="firstName" value={form.firstName} onChange={handleChange} className={inputCls} placeholder="Alice" required />
              </Field>
              <Field label="Last Name *">
                <input name="lastName" value={form.lastName} onChange={handleChange} className={inputCls} placeholder="Johnson" required />
              </Field>
              <Field label="Personal Email *">
                <input type="email" name="email" value={form.email} onChange={handleChange} className={inputCls} placeholder="alice@school.com" required />
              </Field>
              <Field label="Phone Number">
                <input name="phone" value={form.phone} onChange={handleChange} className={inputCls} placeholder="+1 000-000-0000" />
              </Field>
              <Field label="Date of Birth *">
                <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} className={inputCls} required />
              </Field>
              <Field label="Gender *">
                <select name="gender" value={form.gender} onChange={handleChange} className={inputCls} required>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </Field>
            </div>
          </div>
        </div>

        {/* SECTION 2: PROFESSIONAL ASSIGNMENT */}
        <div className="bg-white rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9] p-8">
          <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-wider">
            <Briefcase size={16} className="text-[#1E40AF]" /> Professional & Employment
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Field label="Department *">
              <select name="departmentId" value={form.departmentId} onChange={handleChange} className={inputCls} required>
                <option value="">Choose Dept</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </Field>
            <Field label="Designation *">
              <input name="designation" value={form.designation} onChange={handleChange} className={inputCls} placeholder="e.g. Senior Teacher" required />
            </Field>
            <Field label="Employment Type">
              <select name="employmentType" value={form.employmentType} onChange={handleChange} className={inputCls}>
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="VISITING">Visiting</option>
              </select>
            </Field>
            <Field label="Work Shift">
              <input name="workShift" value={form.workShift} onChange={handleChange} className={inputCls} placeholder="e.g. Morning" />
            </Field>
            <Field label="Experience (Years)">
              <input type="number" name="experienceYears" value={form.experienceYears} onChange={handleChange} className={inputCls} placeholder="0" />
            </Field>
            <Field label="Joining Date *">
              <input type="date" name="joiningDate" value={form.joiningDate} onChange={handleChange} className={inputCls} required />
            </Field>
            <Field label="Qualification">
              <input name="qualification" value={form.qualification} onChange={handleChange} className={inputCls} placeholder="e.g. M.Ed, PhD" />
            </Field>
            <Field label="Monthly Salary">
              <input type="number" name="salary" value={form.salary} onChange={handleChange} className={inputCls} placeholder="0.00" />
            </Field>
          </div>
        </div>

        {/* SECTION 3: PAYROLL & BANKING */}
        <div className="bg-white rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9] p-8">
          <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-wider">
            <Landmark size={16} className="text-emerald-600" /> Payroll & Banking
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Field label="PAN Card Number *">
              <input name="panCard" value={form.panCard} onChange={handleChange} className={inputCls} placeholder="ABCDE1234F" required />
            </Field>
            <Field label="Aadhar Card Number *">
              <input name="aadharCard" value={form.aadharCard} onChange={handleChange} className={inputCls} placeholder="12-digit number" required />
            </Field>
            <Field label="Bank Account No">
              <input name="bankAccountNo" value={form.bankAccountNo} onChange={handleChange} className={inputCls} placeholder="Account Number" />
            </Field>
            <Field label="IFSC Code">
              <input name="ifscCode" value={form.ifscCode} onChange={handleChange} className={inputCls} placeholder="IFSC" />
            </Field>
            <Field label="PF Number">
              <input name="pfNumber" value={form.pfNumber} onChange={handleChange} className={inputCls} placeholder="PF-XXXX" />
            </Field>
            <Field label="ESI Number">
              <input name="esiNumber" value={form.esiNumber} onChange={handleChange} className={inputCls} placeholder="ESI-XXXX" />
            </Field>
            <Field label="Payment Mode">
              <select name="paymentMode" value={form.paymentMode} onChange={handleChange} className={inputCls}>
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="CASH">Cash</option>
                <option value="CHEQUE">Cheque</option>
              </select>
            </Field>
          </div>
        </div>

        {/* SECTION 4: LIFECYCLE & ACADEMIC */}
        <div className="bg-white rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9] p-8">
          <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-wider">
            <Clock size={16} className="text-[#1E40AF]" /> Lifecycle & Assignments
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Field label="Probation End Date">
              <input type="date" name="probationEndDate" value={form.probationEndDate} onChange={handleChange} className={inputCls} />
            </Field>
            <Field label="Contract End Date">
              <input type="date" name="contractEndDate" value={form.contractEndDate} onChange={handleChange} className={inputCls} />
            </Field>
            <Field label="Biometric ID">
              <input name="biometricId" value={form.biometricId} onChange={handleChange} className={inputCls} placeholder="BIO-XXXX" />
            </Field>
            <div className="lg:col-span-1">
               <Field label="Subject Assignments">
                  <select multiple value={form.subjectIds.map(String)} onChange={(e) => onMultiSelect('subjectIds', e)} className={`${inputCls} h-32`}>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                  </select>
               </Field>
            </div>
            <div className="lg:col-span-2">
               <Field label="Assigned Classes (Class Teacher)">
                  <select multiple value={form.assignedClassIds.map(String)} onChange={(e) => onMultiSelect('assignedClassIds', e)} className={`${inputCls} h-32`}>
                    {classes.map(c => <option key={c.id} value={c.id}>{c.name} - {c.section}</option>)}
                  </select>
               </Field>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-between items-center bg-white p-6 rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9]">
          <button type="button" onClick={() => clearDraft(true)} className="text-slate-400 hover:text-rose-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors">
            <Trash2 size={14} /> Clear Draft
          </button>
          <div className="flex gap-4">
            <button type="button" onClick={() => navigate('/admin/teachers')} className="px-8 py-3 rounded-[12px] text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all border border-slate-200">
              Cancel
            </button>
            <button type="submit" disabled={loading || uploadingPhoto} className="bg-[#1E40AF] hover:bg-[#1E3A8A] text-white px-10 py-3 rounded-[12px] text-sm font-black shadow-md transition-all disabled:opacity-50">
              {loading ? 'Hiring Staff...' : 'Finalize Onboarding'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddTeacherPage;
