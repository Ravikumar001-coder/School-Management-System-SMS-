import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  User, Mail, Phone, MapPin, Briefcase, GraduationCap, 
  Calendar, CreditCard, ShieldCheck, Clock, Trash2, ArrowLeft,
  CheckCircle2, AlertCircle, Landmark, Receipt, Fingerprint, Activity
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import { teacherApi } from '../../api/teacherApi';
import { subjectApi } from '../../api/subjectApi';
import { classApi } from '../../api/classApi';
import { fileApi } from '../../api/fileApi';
import usePersistedForm from '../../hooks/usePersistedForm';

const Field = ({ label, children, error }) => (
  <div className="space-y-1.5">
    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    {children}
    {error && <p className="text-red-500 text-[10px] mt-1 font-medium italic">{error}</p>}
  </div>
);

const inputCls = `w-full border border-slate-200 rounded-xl px-4 py-3
                  text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2
                  focus:ring-indigo-500 transition-all placeholder:text-slate-300 bg-white shadow-sm`;

const EditTeacherPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  
  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);

  // ── Persistent Form State ────────────────────────────────────────────────
  const { 
    formData: form, 
    setFormData: setForm,
    handleChange,
    clearDraft,
    isRestored
  } = usePersistedForm(`edit_teacher_form_hrms_${id}`, {});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teacherRes, subRes, classRes, deptRes] = await Promise.all([
          teacherApi.getById(id),
          subjectApi.getAll(),
          classApi.getAll(),
          teacherApi.getDepartments ? teacherApi.getDepartments() : Promise.resolve({ data: { data: [] } })
        ]);

        const t = teacherRes.data?.data || teacherRes.data;
        const dbForm = {
          firstName: t.firstName || '',
          lastName: t.lastName || '',
          email: t.email || '',
          phone: t.phone || '',
          employeeId: t.employeeId || '',
          qualification: t.qualification || '',
          specialization: t.specialization || '',
          dateOfBirth: t.dateOfBirth || '',
          joiningDate: t.joiningDate || '',
          gender: t.gender || '',
          address: t.address || '',
          salary: t.salary ?? '',
          departmentId: t.departmentId || '',
          subjectIds: t.subjectIds || [],
          assignedClassIds: t.assignedClassIds || [],
          designation: t.designation || '',
          employmentType: t.employmentType || 'FULL_TIME',
          workShift: t.workShift || '',
          experienceYears: t.experienceYears || '',
          bankAccountNo: t.bankAccountNo || '',
          ifscCode: t.ifscCode || '',
          panCard: t.panCard || '',
          aadharCard: t.aadharCard || '',
          pfNumber: t.pfNumber || '',
          esiNumber: t.esiNumber || '',
          paymentMode: t.paymentMode || 'BANK_TRANSFER',
          probationEndDate: t.probationEndDate || '',
          contractEndDate: t.contractEndDate || '',
          biometricId: t.biometricId || '',
          emergencyContact: t.emergencyContact || '',
          bloodGroup: t.bloodGroup || '',
          profilePhoto: t.profilePhoto || '',
          status: t.status || 'ACTIVE'
        };

        setDepartments(deptRes.data?.data || []);
        setSubjects(subRes.data?.data || []);
        setClasses(classRes.data?.data || []);
        setForm(prev => ({ ...dbForm, ...prev }));
      } catch (err) {
        toast.showToast('Failed to load staff data.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isRestored]);

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const path = await fileApi.uploadImage(file);
      setForm((prev) => ({ ...prev, profilePhoto: path }));
      toast.showToast('Photo updated successfully', 'success');
    } catch (err) {
      toast.showToast('Photo upload failed.', 'error');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await teacherApi.update(id, {
        ...form,
        salary: form.salary === '' ? null : Number(form.salary),
        experienceYears: form.experienceYears === '' ? 0 : Number(form.experienceYears)
      });
      toast.showToast('Staff profile updated!', 'success');
      clearDraft();
      setTimeout(() => navigate(`/admin/teachers/${id}`), 1000);
    } catch (err) {
      toast.showToast(err.response?.data?.message || 'Update failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><LoadingSpinner /></div>;

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-fade-in">
      {/* ── Header Area ────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(`/admin/teachers/${id}`)}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Edit Staff Record</h1>
            <p className="text-slate-500 font-medium text-sm">Modifying record for <span className="text-indigo-600 font-bold">{form.firstName} {form.lastName}</span></p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECTION 1: IDENTITY */}
        <div className="bg-white rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9] p-8">
          <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-wider">
            <User size={16} className="text-indigo-600" /> Identity & Profile
          </h3>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex flex-col items-center gap-4">
              <div className="w-32 h-32 rounded-[2rem] bg-indigo-50 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden ring-1 ring-slate-100">
                {form.profilePhoto ? (
                  <img src={fileApi.toPublicUrl(form.profilePhoto)} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-black text-indigo-200">{form.firstName?.[0]}{form.lastName?.[0]}</span>
                )}
              </div>
              <label className="bg-[#1E40AF] text-white px-4 py-2 rounded-[16px] text-xs font-bold cursor-pointer hover:bg-[#1E3A8A] shadow-md transition-all">
                {uploadingPhoto ? 'Uploading...' : 'Change Photo'}
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Field label="First Name *">
                <input name="firstName" value={form.firstName} onChange={handleChange} className={inputCls} required />
              </Field>
              <Field label="Last Name *">
                <input name="lastName" value={form.lastName} onChange={handleChange} className={inputCls} required />
              </Field>
              <Field label="Employee ID (Fixed)">
                <input name="employeeId" value={form.employeeId} className={`${inputCls} bg-slate-50 text-slate-400 font-bold border-dashed`} readOnly disabled />
              </Field>
              <Field label="Personal Email *">
                <input type="email" name="email" value={form.email} onChange={handleChange} className={inputCls} required />
              </Field>
              <Field label="Phone Number">
                <input name="phone" value={form.phone} onChange={handleChange} className={inputCls} />
              </Field>
              <Field label="Date of Birth *">
                <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} className={inputCls} required />
              </Field>
            </div>
          </div>
        </div>

        {/* SECTION 2: PROFESSIONAL */}
        <div className="bg-white rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9] p-8">
          <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-wider">
            <Briefcase size={16} className="text-indigo-600" /> Professional & Employment
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Field label="Department *">
              <select name="departmentId" value={form.departmentId} onChange={handleChange} className={inputCls} required>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </Field>
            <Field label="Designation *">
              <input name="designation" value={form.designation} onChange={handleChange} className={inputCls} required />
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
              <input name="workShift" value={form.workShift} onChange={handleChange} className={inputCls} />
            </Field>
            <Field label="Joining Date *">
              <input type="date" name="joiningDate" value={form.joiningDate} onChange={handleChange} className={inputCls} required />
            </Field>
            <Field label="Monthly Salary">
              <input type="number" name="salary" value={form.salary} onChange={handleChange} className={inputCls} />
            </Field>
            <Field label="Qualification">
              <input name="qualification" value={form.qualification} onChange={handleChange} className={inputCls} />
            </Field>
            <Field label="Experience (Years)">
              <input type="number" name="experienceYears" value={form.experienceYears} onChange={handleChange} className={inputCls} />
            </Field>
          </div>
        </div>

        {/* SECTION 3: PAYROLL & COMPLIANCE */}
        <div className="bg-white rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9] p-8">
          <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-wider">
            <Landmark size={16} className="text-emerald-600" /> Payroll & Banking
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Field label="PAN Card Number *">
              <input name="panCard" value={form.panCard} onChange={handleChange} className={inputCls} required />
            </Field>
            <Field label="Aadhar Card Number *">
              <input name="aadharCard" value={form.aadharCard} onChange={handleChange} className={inputCls} required />
            </Field>
            <Field label="Bank Account No">
              <input name="bankAccountNo" value={form.bankAccountNo} onChange={handleChange} className={inputCls} />
            </Field>
            <Field label="IFSC Code">
              <input name="ifscCode" value={form.ifscCode} onChange={handleChange} className={inputCls} />
            </Field>
            <Field label="PF Number">
              <input name="pfNumber" value={form.pfNumber} onChange={handleChange} className={inputCls} />
            </Field>
            <Field label="ESI Number">
              <input name="esiNumber" value={form.esiNumber} onChange={handleChange} className={inputCls} />
            </Field>
            <Field label="Payment Mode">
              <select name="paymentMode" value={form.paymentMode} onChange={handleChange} className={inputCls}>
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="CASH">Cash</option>
                <option value="CHEQUE">Cheque</option>
              </select>
            </Field>
            <Field label="Staff Status">
              <select name="status" value={form.status} onChange={handleChange} className={inputCls}>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="ON_LEAVE">On Leave</option>
                <option value="RESIGNED">Resigned</option>
              </select>
            </Field>
          </div>
        </div>

        {/* SECTION 4: LIFECYCLE & ACADEMIC */}
        <div className="bg-white rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9] p-8">
          <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-wider">
            <Clock size={16} className="text-indigo-600" /> Lifecycle & Assignments
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Field label="Probation End Date">
              <input type="date" name="probationEndDate" value={form.probationEndDate} onChange={handleChange} className={inputCls} />
            </Field>
            <Field label="Contract End Date">
              <input type="date" name="contractEndDate" value={form.contractEndDate} onChange={handleChange} className={inputCls} />
            </Field>
            <Field label="Biometric ID">
              <input name="biometricId" value={form.biometricId} onChange={handleChange} className={inputCls} />
            </Field>
            
            <div className="lg:col-span-1">
               <Field label="Subject Assignments">
                  <div className="border border-slate-100 rounded-xl p-3 max-h-48 overflow-y-auto space-y-2 bg-slate-50/50">
                    {subjects.map(s => (
                      <label key={s.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white cursor-pointer transition-colors group">
                        <input 
                          type="checkbox" 
                          checked={form.subjectIds?.includes(s.id)}
                          onChange={(e) => {
                            const current = form.subjectIds || [];
                            const next = e.target.checked ? [...current, s.id] : current.filter(id => id !== s.id);
                            setForm(f => ({ ...f, subjectIds: next }));
                          }}
                          className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="text-xs font-bold text-slate-600 group-hover:text-indigo-600 truncate">
                          <span className="text-indigo-300 mr-2">{s.code}</span>{s.name}
                        </div>
                      </label>
                    ))}
                  </div>
               </Field>
            </div>

            <div className="lg:col-span-2">
               <Field label="Assigned Classes (Class Teacher)">
                  <div className="border border-slate-100 rounded-xl p-3 max-h-48 overflow-y-auto grid grid-cols-2 gap-2 bg-slate-50/50">
                    {classes.map(c => (
                      <label key={c.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white cursor-pointer transition-colors group">
                        <input 
                          type="checkbox" 
                          checked={form.assignedClassIds?.includes(c.id)}
                          onChange={(e) => {
                            const current = form.assignedClassIds || [];
                            const next = e.target.checked ? [...current, c.id] : current.filter(id => id !== c.id);
                            setForm(f => ({ ...f, assignedClassIds: next }));
                          }}
                          className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="text-xs font-bold text-slate-600 group-hover:text-indigo-600 truncate">
                          {c.name} - {c.section}
                        </div>
                      </label>
                    ))}
                  </div>
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
            <button type="button" onClick={() => navigate(`/admin/teachers/${id}`)} className="px-6 py-3 min-h-[44px] rounded-[16px] bg-gray-100 text-gray-700 font-bold text-sm hover:bg-gray-200 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={saving || uploadingPhoto} className="bg-[#1E40AF] hover:bg-[#1E3A8A] text-white px-6 py-3 rounded-[16px] min-h-[44px] text-sm font-bold shadow-md transition-all disabled:opacity-50">
              {saving ? 'Saving Changes...' : 'Update Staff Record'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditTeacherPage;
