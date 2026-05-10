// src/pages/admin/AddStudentPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import FormField from '../../components/common/FormField';
import { studentApi } from '../../api/studentApi';
import { classApi } from '../../api/classApi';
import { fileApi } from '../../api/fileApi';
import { useToast } from '../../context/ToastContext';
import { getCurrentAcademicYear } from '../../utils/helpers';

const AddStudentPage = () => {
  const navigate = useNavigate();
  const toast    = useToast();

  const [loading,        setLoading]        = useState(false);
  const [uploadingPhoto, setUploadingPhoto]  = useState(false);
  const [classes,        setClasses]         = useState([]);
  const [classesLoading, setClassesLoading]  = useState(true);

  // ── Load classes on mount (direct call — no useFetch) ──────────────────────
  useEffect(() => {
    let cancelled = false;
    classApi.getAll()
      .then(res => {
        if (!cancelled) {
          const data = res?.data?.data ?? res?.data ?? [];
          setClasses(Array.isArray(data) ? data : []);
        }
      })
      .catch(() => {
        if (!cancelled) toast.error('Failed to load classes. Please refresh.');
      })
      .finally(() => {
        if (!cancelled) setClassesLoading(false);
      });
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    dateOfBirth: '', gender: '', address: '', parentName: '',
    parentPhone: '', parentEmail: '', bloodGroup: '',
    classRoomId: '', academicYear: getCurrentAcademicYear(),
    profilePhoto: '',
  });

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const path = await fileApi.uploadImage(file);
      setForm(prev => ({ ...prev, profilePhoto: path }));
      toast.success('Photo uploaded successfully.');
    } catch (err) {
      toast.error(err.response?.data || 'Photo upload failed.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.classRoomId) { toast.warning('Please select a class.'); return; }
    setLoading(true);
    try {
      await studentApi.create({ ...form, classRoomId: Number(form.classRoomId) });
      toast.success('Student enrolled successfully!');
      setTimeout(() => navigate('/admin/students'), 1200);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to enroll student.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Admit Student"
        subtitle="Complete the form below to enroll a new student."
        actions={
          <Button variant="secondary" size="sm" onClick={() => navigate('/admin/students')}>
            ← Back to Directory
          </Button>
        }
      />

      <form onSubmit={handleSubmit} className="card animate-fade-in space-y-8">

        {/* Profile Photo */}
        <section className="form-section">
          <h3 className="form-section-title">👤 Profile Picture</h3>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-blue-50 border-2 border-dashed border-blue-200 overflow-hidden flex items-center justify-center text-blue-400 text-3xl font-bold">
              {form.profilePhoto
                ? <img src={fileApi.toPublicUrl(form.profilePhoto)} alt="Student" className="w-full h-full object-cover" />
                : <>{form.firstName?.[0] || 'S'}{form.lastName?.[0] || 'T'}</>}
            </div>
            <div className="space-y-2">
              <label className="btn btn-outline btn-sm cursor-pointer inline-flex">
                {uploadingPhoto ? 'Uploading...' : 'Choose Image'}
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
              <p className="text-gray-400 text-xs">JPG, PNG or GIF. Max 2MB.</p>
            </div>
          </div>
        </section>

        {/* Personal Details */}
        <section className="form-section">
          <h3 className="form-section-title">📄 Personal Details</h3>
          <div className="form-grid">
            <FormField label="First Name" required>
              <input name="firstName" value={form.firstName} onChange={handleChange}
                required className="input" placeholder="e.g. John" />
            </FormField>
            <FormField label="Last Name" required>
              <input name="lastName" value={form.lastName} onChange={handleChange}
                required className="input" placeholder="e.g. Doe" />
            </FormField>
            <FormField label="Email Address" required>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                required className="input" placeholder="john.doe@example.com" />
            </FormField>
            <FormField label="Phone Number">
              <input name="phone" value={form.phone} onChange={handleChange}
                className="input" placeholder="10-digit mobile number" />
            </FormField>
            <FormField label="Date of Birth">
              <input type="date" name="dateOfBirth" value={form.dateOfBirth}
                onChange={handleChange} className="input" />
            </FormField>
            <FormField label="Gender">
              <select name="gender" value={form.gender} onChange={handleChange} className="select">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </FormField>
            <FormField label="Blood Group">
              <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange} className="select">
                <option value="">Select Group</option>
                {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(b =>
                  <option key={b} value={b}>{b}</option>)}
              </select>
            </FormField>
            <FormField label="Residential Address">
              <input name="address" value={form.address} onChange={handleChange}
                className="input" placeholder="Full permanent address" />
            </FormField>
          </div>
        </section>

        {/* Guardian Info */}
        <section className="form-section">
          <h3 className="form-section-title">👨‍👩‍👦 Guardian Information</h3>
          <div className="form-grid-3">
            <FormField label="Parent Name" required>
              <input name="parentName" value={form.parentName} onChange={handleChange}
                required className="input" placeholder="Full name of guardian" />
            </FormField>
            <FormField label="Parent Phone">
              <input name="parentPhone" value={form.parentPhone} onChange={handleChange}
                className="input" placeholder="Guardian contact number" />
            </FormField>
            <FormField label="Parent Email">
              <input type="email" name="parentEmail" value={form.parentEmail} onChange={handleChange}
                className="input" placeholder="guardian@example.com" />
            </FormField>
          </div>
        </section>

        {/* Academic Enrollment */}
        <section className="form-section">
          <h3 className="form-section-title">🏛️ Academic Enrollment</h3>
          <div className="form-grid">
            <FormField label="Assigned Class" required>
              <select name="classRoomId" value={form.classRoomId}
                onChange={handleChange} required className="select">
                <option value="">
                  {classesLoading ? 'Loading classes...' :
                   classes.length === 0 ? 'No classes available' :
                   'Choose a Class...'}
                </option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.section}
                    {c.academicYear ? ` (${c.academicYear})` : ''}
                  </option>
                ))}
              </select>
              {!classesLoading && classes.length === 0 && (
                <p className="text-xs text-red-500 mt-1">
                  No classes found. Please create classes first in Academic → Classes & Sections.
                </p>
              )}
            </FormField>
            <FormField label="Academic Session">
              <input name="academicYear" value={form.academicYear} onChange={handleChange}
                className="input" placeholder="e.g. 2026-27" />
            </FormField>
          </div>
        </section>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-6 border-t border-gray-100">
          <Button type="submit" loading={loading} className="px-10" variant="primary">
            Enroll Student
          </Button>
          <Button variant="secondary" onClick={() => navigate('/admin/students')}>
            Cancel
          </Button>
        </div>
      </form>
    </>
  );
};

export default AddStudentPage;
