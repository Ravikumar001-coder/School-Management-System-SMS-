import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import { useToast } from '../../context/ToastContext';
import { teacherApi } from '../../api/teacherApi';
import { subjectApi } from '../../api/subjectApi';
import { classApi } from '../../api/classApi';
import { fileApi } from '../../api/fileApi';

const Field = ({ label, error, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const inputCls = `w-full border border-gray-300 rounded-lg px-3 py-2.5
                  text-sm focus:outline-none focus:ring-2
                  focus:ring-green-500 transition`;

const AddTeacherPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    qualification: '',
    salary: '',
    dateOfBirth: '',
    joiningDate: '',
    gender: '',
    profilePhoto: '',
    status: 'ACTIVE',
    subjectIds: [],
    assignedClassIds: [],
  });
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      subjectApi.getAll().catch(() => ({ data: { data: [] } })),
      classApi.getAll().catch(() => ({ data: { data: [] } })),
    ]).then(([subjectRes, classRes]) => {
      setSubjects(subjectRes.data?.data || []);
      setClasses(classRes.data?.data || []);
    });
  }, []);

  const photoUrl = useMemo(() => fileApi.toPublicUrl(form.profilePhoto), [form.profilePhoto]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errors = {};

    if (!form.firstName.trim()) errors.firstName = 'First name is required.';
    if (!form.lastName.trim()) errors.lastName = 'Last name is required.';
    if (!form.email.trim()) errors.email = 'Email is required.';
    if (form.salary !== '' && (Number.isNaN(Number(form.salary)) || Number(form.salary) < 0)) {
      errors.salary = 'Salary must be a valid non-negative number.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;


    setUploadingPhoto(true);
    try {
      const path = await fileApi.uploadImage(file);
      setForm((prev) => ({ ...prev, profilePhoto: path }));
      showToast('Photo uploaded successfully', 'success');
    } catch (err) {
      showToast(err.response?.data || 'Photo upload failed.', 'error');
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

    if (!validate()) {
      showToast('Please fix validation errors', 'error');
      return;
    }

    const selectedSubjects = subjects.filter((s) => form.subjectIds.includes(s.id));
    const specialization = form.department.trim() || selectedSubjects.map((s) => s.name).join(', ');

    setLoading(true);
    try {
      await teacherApi.create({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email,
        phone: form.phone,
        qualification: form.qualification,
        specialization,
        salary: form.salary === '' ? null : Number(form.salary),
        dateOfBirth: form.dateOfBirth || null,
        joiningDate: form.joiningDate || null,
        gender: form.gender,
        profilePhoto: form.profilePhoto || null,
        status: form.status,
        subjectIds: form.subjectIds,
        assignedClassIds: form.assignedClassIds,
      });
      showToast('Teacher created successfully!', 'success');
      setTimeout(() => navigate('/admin/teachers'), 1200);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add teacher.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Add Teacher (A) Form"
        subtitle="Create teacher personal and professional profile"
        action={
          <button
            onClick={() => navigate('/admin/teachers')}
            className="text-gray-600 hover:text-gray-800 text-sm"
          >
            ← Back to Teachers
          </button>
        }
      />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Personal Details</h3>

          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="w-28 h-28 rounded-full bg-green-50 border border-green-100 overflow-hidden flex items-center justify-center text-3xl font-bold text-green-700">
              {photoUrl ? (
                <img src={photoUrl} alt="Teacher" className="w-full h-full object-cover" />
              ) : (
                (form.firstName || form.lastName || 'T').trim().charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1 space-y-3">
              <Field label="First Name *" error={fieldErrors.firstName}>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className={inputCls}
                  placeholder="e.g. Priya"
                />
              </Field>
              <Field label="Last Name *" error={fieldErrors.lastName}>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className={inputCls}
                  placeholder="e.g. Sharma"
                />
              </Field>
              <label className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg text-sm cursor-pointer hover:bg-blue-700 transition">
                {uploadingPhoto ? 'Uploading...' : 'Upload Photo'}
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Date of Birth">
              <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} className={inputCls} />
            </Field>

            <Field label="Gender">
              <select name="gender" value={form.gender} onChange={handleChange} className={inputCls}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </Field>

            <Field label="Phone Number">
              <input name="phone" value={form.phone} onChange={handleChange} className={inputCls} placeholder="+123456789" />
            </Field>

            <Field label="Email Address *" error={fieldErrors.email}>
              <input type="email" name="email" value={form.email} onChange={handleChange} className={inputCls} placeholder="teacher@sms.com" required />
            </Field>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Professional Details &amp; Account Info</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Department/Subject">
              <input
                name="department"
                value={form.department}
                onChange={handleChange}
                className={inputCls}
                placeholder="e.g. Department of Science"
              />
            </Field>

            <Field label="Qualification">
              <input
                name="qualification"
                value={form.qualification}
                onChange={handleChange}
                className={inputCls}
                placeholder="e.g. M.Sc, B.Ed"
              />
            </Field>

            <Field label="Salary" error={fieldErrors.salary}>
              <input
                type="number"
                min="0"
                step="0.01"
                name="salary"
                value={form.salary}
                onChange={handleChange}
                className={inputCls}
                placeholder="e.g. 42000"
              />
            </Field>

            <Field label="Subjects">
              <select
                multiple
                value={form.subjectIds.map(String)}
                onChange={(e) => onMultiSelect('subjectIds', e)}
                className={`${inputCls} h-28`}
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </Field>

            <Field label="Assigned Classes">
              <select
                multiple
                value={form.assignedClassIds.map(String)}
                onChange={(e) => onMultiSelect('assignedClassIds', e)}
                className={`${inputCls} h-28`}
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} - {c.section}</option>
                ))}
              </select>
            </Field>

            <Field label="Date of Joining">
              <input type="date" name="joiningDate" value={form.joiningDate} onChange={handleChange} className={inputCls} />
            </Field>

            <Field label="Account Username">
              <input
                value={`Auto-generated (Teacher ID, e.g. TCH-${new Date().getFullYear()}-001)`}
                className={`${inputCls} bg-gray-50`}
                readOnly
              />
            </Field>

            <Field label="Initial Password">
              <input value="Same as Teacher ID" className={`${inputCls} bg-gray-50`} readOnly />
            </Field>

            <Field label="Role">
              <select value="TEACHER" className={`${inputCls} bg-gray-50`} disabled>
                <option value="TEACHER">Teacher</option>
              </select>
            </Field>

            <div className="md:col-span-2 flex items-center justify-between border rounded-lg px-3 py-2.5">
              <span className="text-sm font-medium text-gray-700">Status</span>
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, status: prev.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' }))}
                className={`relative inline-flex h-6 w-12 items-center rounded-full transition ${form.status === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${form.status === 'ACTIVE' ? 'translate-x-6' : 'translate-x-1'}`}
                />
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button
              type="submit"
              disabled={loading || uploadingPhoto}
              className="bg-blue-700 text-white px-8 py-2.5 rounded-lg text-sm hover:bg-blue-800 disabled:opacity-60 font-medium"
            >
              {loading ? 'Saving...' : 'Save Teacher'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/teachers')}
              className="bg-cyan-100 text-cyan-800 px-6 py-2.5 rounded-lg text-sm hover:bg-cyan-200 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default AddTeacherPage;
