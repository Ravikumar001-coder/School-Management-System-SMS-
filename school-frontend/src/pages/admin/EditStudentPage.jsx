import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, MapPin, Briefcase, GraduationCap, 
  Calendar, CreditCard, ShieldCheck, Clock, Trash2, Heart,
  Globe, BookOpen, School, FileText, ArrowLeft, Activity, Award, Tag
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import { studentApi } from '../../api/studentApi';
import { classApi } from '../../api/classApi';
import { fileApi } from '../../api/fileApi';
import { getCurrentAcademicYear } from '../../utils/helpers';
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

const EditStudentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [classes, setClasses] = useState([]);

  // ── Persistent Form State ────────────────────────────────────────────────
  const { 
    formData: form, 
    setFormData: setForm,
    handleChange,
    clearDraft,
    isRestored
  } = usePersistedForm(`edit_student_form_enterprise_${id}`, {});

  useEffect(() => {
    Promise.all([studentApi.getById(id), classApi.getAll()])
      .then(([sRes, cRes]) => {
        const s = sRes.data?.data || sRes.data;
        const classList = cRes.data?.data || cRes.data || [];
        
        // Hydrate Enterprise Form Structure
        const dbForm = {
          firstName: s.firstName || '',
          lastName: s.lastName || '',
          email: s.email || '',
          phone: s.phone || '',
          dateOfBirth: s.dateOfBirth || '',
          gender: s.gender || '',
          address: s.address || '',
          bloodGroup: s.bloodGroup || '',
          profilePhoto: s.profilePhoto || '',
          // Compliance
          aadharCard: s.aadharCard || '',
          nationality: s.nationality || 'Indian',
          religion: s.religion || '',
          category: s.category || 'General',
          medicalConditions: s.medicalConditions || '',
          emergencyContact: s.emergencyContact || '',
          // Academic
          studentId: s.studentId || '',
          classRoomId: s.classRoomId || '',
          rollNumber: s.rollNumber || '',
          section: s.section || '',
          academicYear: s.academicYear || getCurrentAcademicYear(),
          admissionDate: s.admissionDate || '',
          admissionClass: s.admissionClass || '',
          admissionSource: s.admissionSource || 'Direct',
          isNewAdmission: s.isNewAdmission !== undefined ? s.isNewAdmission : true,
          previousSchool: s.previousSchool || '',
          graduationDate: s.graduationDate || '',
          promotedFromClassroomId: s.promotedFromClassroomId || '',
          previousStudentId: s.previousStudentId || '',
          transferCertificateNo: s.transferCertificateNo || '',
          courses: s.courses || '',
          status: s.status || 'ACTIVE',
          // Parent (Hydrated from relational link)
          parent: {
            id: s.parentId || null,
            firstName: s.parentName?.split(' ')[0] || '',
            lastName: s.parentName?.split(' ').slice(1).join(' ') || '',
            phone: s.parentPhone || '',
            email: s.parentEmail || '',
            occupation: s.parentOccupation || '',
            address: s.parentAddress || ''
          },
          guardianRelationship: s.guardianRelationship || s.parentRelationship || 'FATHER',
          isPrimaryGuardian: true
        };

        setForm(prev => ({ ...dbForm, ...prev }));
        setClasses(classList);
      })
      .catch(() => toast.showToast('Failed to load student data', 'error'))
      .finally(() => setLoading(false));
  }, [id, isRestored]);

  const handleParentChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      parent: { ...prev.parent, [name]: value }
    }));
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const path = await fileApi.uploadImage(file);
      setForm(prev => ({ ...prev, profilePhoto: path }));
      toast.showToast('Photo updated successfully', 'success');
    } catch (err) {
      toast.showToast('Photo upload failed', 'error');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await studentApi.update(id, {
        ...form,
        classRoomId: Number(form.classRoomId)
      });
      toast.showToast('Student profile updated!', 'success');
      clearDraft();
      setTimeout(() => navigate(`/admin/students/${id}`), 1000);
    } catch (err) {
      toast.showToast(err.response?.data?.message || 'Update failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><LoadingSpinner /></div>;

  return (
    <div className="max-w-[1600px] mx-auto pb-20 animate-fade-in px-4 md:px-8">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button 
            type="button"
            onClick={() => navigate(`/admin/students/${id}`)}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Edit Profile</h1>
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
              <Field label="Student ID (Fixed)">
                <input name="studentId" value={form.studentId} className={`${inputCls} bg-slate-50 text-slate-400 font-bold border-dashed`} readOnly disabled />
              </Field>
              <Field label="Personal Email *">
                <input type="email" name="email" value={form.email} onChange={handleChange} className={inputCls} required />
              </Field>
              <Field label="Phone *">
                <input name="phone" value={form.phone} onChange={handleChange} className={inputCls} required />
              </Field>
              <Field label="Date of Birth *">
                <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} className={inputCls} required />
              </Field>
              <Field label="Gender *">
                <select name="gender" value={form.gender} onChange={handleChange} className={inputCls} required>
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
                  <input name="address" value={form.address} onChange={handleChange} className={inputCls} />
                </Field>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: COMPLIANCE */}
        <div className="bg-white rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9] p-8">
          <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-wider">
            <ShieldCheck size={16} className="text-indigo-600" /> Compliance & Health
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Field label="Aadhar Card Number">
              <input name="aadharCard" value={form.aadharCard} onChange={handleChange} className={inputCls} />
            </Field>
            <Field label="Nationality">
              <input name="nationality" value={form.nationality} onChange={handleChange} className={inputCls} />
            </Field>
            <Field label="Religion">
              <input name="religion" value={form.religion} onChange={handleChange} className={inputCls} />
            </Field>
            <Field label="Category">
              <select name="category" value={form.category} onChange={handleChange} className={inputCls}>
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
              </select>
            </Field>
            <div className="md:col-span-4">
              <Field label="Medical Conditions">
                <textarea name="medicalConditions" value={form.medicalConditions} onChange={handleChange} className={`${inputCls} min-h-[80px]`} />
              </Field>
            </div>
          </div>
        </div>

        {/* SECTION 3: ACADEMIC */}
        <div className="bg-white rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9] p-8">
          <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-wider">
            <BookOpen size={16} className="text-indigo-600" /> Academic Assignment
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Field label="Current Class *">
              <select name="classRoomId" value={form.classRoomId} onChange={handleChange} className={inputCls} required>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name} — {c.section}</option>
                ))}
              </select>
            </Field>
            <Field label="Roll Number">
              <input name="rollNumber" value={form.rollNumber} onChange={handleChange} className={inputCls} />
            </Field>
            <Field label="Personal Section">
              <input name="section" value={form.section} onChange={handleChange} className={inputCls} placeholder="e.g. A, B, C" />
            </Field>
            <Field label="Admission Date">
              <input type="date" name="admissionDate" value={form.admissionDate} onChange={handleChange} className={inputCls} />
            </Field>
            <Field label="Admission Class">
              <input name="admissionClass" value={form.admissionClass} onChange={handleChange} className={inputCls} placeholder="e.g. Grade 10" />
            </Field>
            <Field label="Admission Source">
              <input name="admissionSource" value={form.admissionSource} onChange={handleChange} className={inputCls} />
            </Field>
            <Field label="New Admission Status">
              <select name="isNewAdmission" value={form.isNewAdmission} onChange={(e) => setForm(prev => ({ ...prev, isNewAdmission: e.target.value === 'true' }))} className={inputCls}>
                <option value="true">Yes (First Session)</option>
                <option value="false">No (Continuing)</option>
              </select>
            </Field>
            <Field label="Previous School">
              <input name="previousSchool" value={form.previousSchool} onChange={handleChange} className={inputCls} />
            </Field>
            <Field label="Enrollment Status">
              <select name="status" value={form.status} onChange={handleChange} className={inputCls}>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="GRADUATED">Graduated</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </Field>
            <Field label="Academic Session">
              <input name="academicYear" value={form.academicYear} className={`${inputCls} bg-slate-50 text-slate-400 font-semibold border-dashed`} readOnly disabled />
            </Field>
          </div>
        </div>

        {/* SECTION 4: ELECTIVES */}
        <div className="bg-white rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9] p-8">
          <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-wider">
            <BookOpen size={16} className="text-amber-500" /> Registered Electives & Courses
          </h3>
          <Field label="Registered Courses (Text Payload)">
            <textarea name="courses" value={form.courses} onChange={handleChange} className={`${inputCls} min-h-[80px]`} placeholder="List elective subjects or special courses registered..." />
          </Field>
        </div>

        {/* SECTION 5: PROMOTIONS & TRANSFERS */}
        <div className="bg-white rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9] p-8">
          <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-wider">
            <Award size={16} className="text-purple-600" /> Promotions & Transfers
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Field label="Promoted From Class ID">
              <input type="number" name="promotedFromClassroomId" value={form.promotedFromClassroomId} onChange={handleChange} className={inputCls} placeholder="e.g. 5" />
            </Field>
            <Field label="Previous Student ID">
              <input name="previousStudentId" value={form.previousStudentId} onChange={handleChange} className={inputCls} placeholder="e.g. STU-2023-009" />
            </Field>
            <Field label="Transfer Certificate (TC) No">
              <input name="transferCertificateNo" value={form.transferCertificateNo} onChange={handleChange} className={inputCls} placeholder="TC-XXXXX" />
            </Field>
            <Field label="Graduation Date">
              <input type="date" name="graduationDate" value={form.graduationDate} onChange={handleChange} className={inputCls} />
            </Field>
          </div>
        </div>

        {/* SECTION 6: FAMILY */}
        <div className="bg-white rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9] p-8">
          <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-wider">
            <Heart size={16} className="text-rose-500" /> Family & Guardian
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Field label="Parent First Name *">
              <input name="firstName" value={form.parent.firstName} onChange={handleParentChange} className={inputCls} required />
            </Field>
            <Field label="Parent Last Name">
              <input name="lastName" value={form.parent.lastName} onChange={handleParentChange} className={inputCls} />
            </Field>
            <Field label="Relationship *">
              <select name="guardianRelationship" value={form.guardianRelationship} onChange={handleChange} className={inputCls} required>
                <option value="FATHER">Father</option>
                <option value="MOTHER">Mother</option>
                <option value="GUARDIAN">Guardian</option>
              </select>
            </Field>
            <Field label="Parent Phone *">
              <input name="phone" value={form.parent.phone} onChange={handleParentChange} className={inputCls} required />
            </Field>
            <Field label="Parent Email">
              <input name="email" value={form.parent.email} onChange={handleParentChange} className={inputCls} />
            </Field>
            <Field label="Parent Occupation">
              <input name="occupation" value={form.parent.occupation} onChange={handleParentChange} className={inputCls} />
            </Field>
            <Field label="Emergency Contact Phone">
              <input name="emergencyContact" value={form.emergencyContact} onChange={handleChange} className={inputCls} placeholder="Secondary emergency phone" />
            </Field>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-between items-center bg-white p-6 rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9]">
          <button type="button" onClick={() => clearDraft(true)} className="text-slate-400 hover:text-rose-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors">
            <Trash2 size={14} /> Clear Draft
          </button>
          <div className="flex gap-4">
            <button type="button" onClick={() => navigate(`/admin/students/${id}`)} className="px-6 py-3 min-h-[44px] rounded-[16px] bg-gray-100 text-gray-700 font-bold text-sm hover:bg-gray-200 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={saving || uploadingPhoto} className="bg-[#1E40AF] hover:bg-[#1E3A8A] text-white px-6 py-3 rounded-[16px] min-h-[44px] text-sm font-bold shadow-md transition-all disabled:opacity-50">
              {saving ? 'Saving Changes...' : 'Update Record'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditStudentPage;
