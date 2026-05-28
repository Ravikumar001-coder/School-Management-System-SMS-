import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, MapPin, Briefcase, GraduationCap, 
  Calendar, CreditCard, ShieldCheck, Clock, Trash2, Heart,
  Globe, BookOpen, School, FileText, ArrowLeft
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import { studentApi } from '../../api/studentApi';
import { classApi } from '../../api/classApi';
import { fileApi } from '../../api/fileApi';
import { useToast } from '../../context/ToastContext';
import { getCurrentAcademicYear } from '../../utils/helpers';
import usePersistedForm from '../../hooks/usePersistedForm';

const Field = ({ label, error, children }) => (
  <div className="space-y-1.5">
    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    {children}
    {error && <p className="text-red-500 text-[10px] mt-1 font-medium italic">{error}</p>}
  </div>
);

const inputCls = `w-full border border-slate-200 rounded-xl px-4 py-3
                  text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2
                  focus:ring-indigo-500 transition-all placeholder:text-slate-300 bg-white shadow-sm`;

const AddStudentPage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [classes, setClasses] = useState([]);
  const [classesLoading, setClassesLoading] = useState(true);

  // ── Form State with Enterprise Persistence ────────────────────────────────
  const { 
    formData: form, 
    handleChange, 
    setFormData: setForm,
    clearDraft 
  } = usePersistedForm('add_student_form_enterprise', {
    firstName: '', lastName: '', email: '', phone: '',
    dateOfBirth: '', gender: '', address: '', bloodGroup: '',
    profilePhoto: '',
    // Compliance & Medical
    aadharCard: '', nationality: 'Indian', religion: '', category: 'General',
    medicalConditions: '',
    // Academic
    classRoomId: '', academicYear: getCurrentAcademicYear(),
    rollNumber: '', section: '', admissionDate: new Date().toISOString().split('T')[0],
    previousSchool: '', admissionSource: 'Direct',
    // Parent (Normalized)
    parent: {
      firstName: '', lastName: '', phone: '', email: '',
      occupation: '', address: ''
    },
    guardianRelationship: 'FATHER',
    isPrimaryGuardian: true
  });

  useEffect(() => {
    classApi.getAll()
      .then(res => setClasses(res?.data?.data ?? res?.data ?? []))
      .catch(() => toast.showToast('Failed to load classes', 'error'))
      .finally(() => setClassesLoading(false));
  }, []);

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const path = await fileApi.uploadImage(file);
      setForm(prev => ({ ...prev, profilePhoto: path }));
      toast.showToast('Photo uploaded successfully', 'success');
    } catch (err) {
      toast.showToast('Photo upload failed', 'error');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleParentChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      parent: { ...prev.parent, [name]: value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.classRoomId) return toast.showToast('Please select a class', 'warning');
    
    setLoading(true);
    try {
      await studentApi.create({
        ...form,
        classRoomId: Number(form.classRoomId)
      });
      toast.showToast('Student enrolled successfully!', 'success');
      clearDraft(); 
      setTimeout(() => navigate('/admin/students'), 1200);
    } catch (err) {
      toast.showToast(err.response?.data?.message || 'Enrollment failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-fade-in">
      {/* ── Header Area ────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Student Admission</h1>
          <p className="text-slate-500 font-medium text-sm">Onboarding for Academic Session <span className="text-indigo-600 font-bold">{form.academicYear}</span></p>
        </div>
        <button 
          onClick={() => navigate('/admin/students')}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm"
        >
          <ArrowLeft size={16} /> Directory
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECTION 1: IDENTITY */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-wider">
            <User size={16} className="text-indigo-600" /> Identity & Profile
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
              <label className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
                {uploadingPhoto ? 'Uploading...' : 'Upload Photo'}
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Field label="First Name *">
                <input name="firstName" value={form.firstName} onChange={handleChange} className={inputCls} placeholder="John" required />
              </Field>
              <Field label="Last Name *">
                <input name="lastName" value={form.lastName} onChange={handleChange} className={inputCls} placeholder="Doe" required />
              </Field>
              <Field label="Personal Email">
                <input type="email" name="email" value={form.email} onChange={handleChange} className={inputCls} placeholder="john.doe@email.com" />
              </Field>
              <Field label="Phone">
                <input name="phone" value={form.phone} onChange={handleChange} className={inputCls} placeholder="+91 00000 00000" />
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
              <Field label="Blood Group">
                <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange} className={inputCls}>
                  <option value="">Select</option>
                  {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </Field>
              <div className="md:col-span-2">
                <Field label="Full Address">
                  <input name="address" value={form.address} onChange={handleChange} className={inputCls} placeholder="123 Street, City, State" />
                </Field>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: COMPLIANCE & MEDICAL */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-wider">
            <ShieldCheck size={16} className="text-indigo-600" /> Compliance & Health
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Field label="Aadhar Card Number">
              <input name="aadharCard" value={form.aadharCard} onChange={handleChange} className={inputCls} placeholder="12-digit number" />
            </Field>
            <Field label="Nationality">
              <input name="nationality" value={form.nationality} onChange={handleChange} className={inputCls} />
            </Field>
            <Field label="Religion">
              <input name="religion" value={form.religion} onChange={handleChange} className={inputCls} placeholder="Hinduism, Islam, etc." />
            </Field>
            <Field label="Category">
              <select name="category" value={form.category} onChange={handleChange} className={inputCls}>
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
              </select>
            </Field>
            <div className="md:col-span-2 lg:col-span-4">
              <Field label="Medical Conditions (Allergies, etc.)">
                <textarea name="medicalConditions" value={form.medicalConditions} onChange={handleChange} className={`${inputCls} min-h-[80px]`} placeholder="Specify any medical requirements or allergies" />
              </Field>
            </div>
          </div>
        </div>

        {/* SECTION 3: ACADEMIC ASSIGNMENT */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-wider">
            <BookOpen size={16} className="text-indigo-600" /> Academic Assignment
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Field label="Admission Class *">
              <select name="classRoomId" value={form.classRoomId} onChange={handleChange} className={inputCls} required>
                <option value="">Choose a Class...</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name} — {c.section}</option>
                ))}
              </select>
            </Field>
            <Field label="Assigned Roll Number">
              <input name="rollNumber" value={form.rollNumber} onChange={handleChange} className={inputCls} placeholder="Optional - Autogen if empty" />
            </Field>
            <Field label="Admission Date">
              <input type="date" name="admissionDate" value={form.admissionDate} onChange={handleChange} className={inputCls} />
            </Field>
            <Field label="Previous School Name">
              <input name="previousSchool" value={form.previousSchool} onChange={handleChange} className={inputCls} placeholder="Transfered from..." />
            </Field>
            <Field label="Admission Source">
              <select name="admissionSource" value={form.admissionSource} onChange={handleChange} className={inputCls}>
                <option value="Direct">Direct</option>
                <option value="Transfer">Transfer</option>
                <option value="Promotion">Promotion</option>
              </select>
            </Field>
          </div>
        </div>

        {/* SECTION 4: FAMILY & GUARDIAN */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wider">
              <Heart size={16} className="text-rose-500" /> Family & Guardian
            </h3>
            <div className="flex items-center gap-4 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary Guardian?</span>
               <input 
                  type="checkbox" 
                  checked={form.isPrimaryGuardian}
                  onChange={(e) => setForm(f => ({ ...f, isPrimaryGuardian: e.target.checked }))}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600"
               />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Field label="Parent First Name *">
              <input name="firstName" value={form.parent.firstName} onChange={handleParentChange} className={inputCls} placeholder="Guardian First Name" required />
            </Field>
            <Field label="Parent Last Name">
              <input name="lastName" value={form.parent.lastName} onChange={handleParentChange} className={inputCls} placeholder="Guardian Last Name" />
            </Field>
            <Field label="Relationship *">
              <select name="guardianRelationship" value={form.guardianRelationship} onChange={handleChange} className={inputCls} required>
                <option value="FATHER">Father</option>
                <option value="MOTHER">Mother</option>
                <option value="GUARDIAN">Other Guardian</option>
              </select>
            </Field>
            <Field label="Parent Phone *">
              <input name="phone" value={form.parent.phone} onChange={handleParentChange} className={inputCls} placeholder="Primary Contact Number" required />
            </Field>
            <Field label="Parent Email">
              <input name="email" value={form.parent.email} onChange={handleParentChange} className={inputCls} placeholder="For Portal Access" />
            </Field>
            <Field label="Parent Occupation">
              <input name="occupation" value={form.parent.occupation} onChange={handleParentChange} className={inputCls} placeholder="e.g. Engineer" />
            </Field>
            <div className="md:col-span-3">
              <Field label="Guardian Full Address">
                <input name="address" value={form.parent.address} onChange={handleParentChange} className={inputCls} placeholder="Permanent residential address" />
              </Field>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <button type="button" onClick={() => clearDraft(true)} className="text-slate-400 hover:text-rose-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors">
            <Trash2 size={14} /> Clear Draft
          </button>
          <div className="flex gap-4">
            <button type="button" onClick={() => navigate('/admin/students')} className="px-8 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all border border-slate-200">
              Cancel
            </button>
            <button type="submit" disabled={loading || uploadingPhoto} className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-3 rounded-xl text-sm font-black shadow-lg shadow-indigo-100 transition-all disabled:opacity-50">
              {loading ? 'Processing Admission...' : 'Finalize Admission'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddStudentPage;
