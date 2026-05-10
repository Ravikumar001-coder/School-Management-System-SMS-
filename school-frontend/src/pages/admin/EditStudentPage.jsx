import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import { studentApi } from '../../api/studentApi';
import { classApi } from '../../api/classApi';
import { attendanceApi } from '../../api/attendanceApi';
import { examApi } from '../../api/examApi';
import { fileApi } from '../../api/fileApi';
import { getCurrentAcademicYear } from '../../utils/helpers';

const inputCls = `w-full border border-gray-300 rounded-lg px-3 
                  py-2.5 text-sm focus:outline-none 
                  focus:ring-2 focus:ring-blue-500`;

const EditStudentPage = () => {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const toast = useToast();
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const [classes, setClasses]   = useState([]);
  const [attendance, setAttendance] = useState(null);
  const [report, setReport] = useState([]);
  const [form, setForm]         = useState({});
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    const today = new Date();
    const from = new Date(today.getFullYear(), 0, 1)
      .toISOString().split('T')[0];
    const to = today.toISOString().split('T')[0];

    Promise.all([studentApi.getById(id), classApi.getAll()])
      .then(async ([sRes, cRes]) => {
        const s = sRes.data?.data || sRes.data;
        const classList = cRes.data?.data || cRes.data || [];
        const selectedClassId = s.classRoomId
          ? String(s.classRoomId)
          : (() => {
              const classByName = classList.find(
                c => `${c.name} - ${c.section}` === s.className
              );
              return classByName ? String(classByName.id) : '';
            })();

        const selectedClass = classList.find((c) => String(c.id) === selectedClassId);

        const [aRes, rcRes] = await Promise.all([
          attendanceApi.studentReport(id, from, to).catch(() => ({ data: { data: null } })),
          examApi.reportCard(id, s.academicYear || getCurrentAcademicYear()).catch(() => ({ data: { data: [] } })),
        ]);

        setForm({
          firstName: s.firstName, lastName: s.lastName,
          email: s.email, phone: s.phone || '',
          dateOfBirth: s.dateOfBirth || '',
          gender: s.gender || '', address: s.address || '',
          parentName: s.parentName || '',
          parentPhone: s.parentPhone || '',
          parentEmail: s.parentEmail || '',
          guardianRelationship: s.guardianRelationship || 'Parent',
          bloodGroup: s.bloodGroup || '',
          classRoomId: selectedClassId,
          className: selectedClass?.name || (s.className?.split(' - ')[0] || ''),
          section: selectedClass?.section || (s.className?.split(' - ')[1] || ''),
          academicYear: s.academicYear || getCurrentAcademicYear(),
          studentId: s.studentId || '',
          profilePhoto: s.profilePhoto || '',
        });
        setClasses(classList);
        setAttendance(aRes.data?.data || null);
        setReport(Array.isArray(rcRes.data?.data) ? rcRes.data.data : []);
      })
      .catch(err => {
        toast.showToast(err.response?.data?.message || 'Failed to load student details.', 'error');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const classNames = useMemo(() => [...new Set(classes.map((c) => c.name))], [classes]);

  const sectionsForClass = useMemo(() => {
    if (!form.className) return [];
    return [...new Set(classes.filter((c) => c.name === form.className).map((c) => c.section))];
  }, [classes, form.className]);

  const attendancePercent = Number(attendance?.percentage || 0);
  const attendanceRing = {
    background: `conic-gradient(#16a34a ${attendancePercent * 3.6}deg, #dbeafe 0deg)`,
  };

  const gradeSummary = useMemo(() => {
    const counts = {};
    report.forEach((item) => {
      const key = item?.grade || 'NA';
      counts[key] = (counts[key] || 0) + 1;
    });
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 4);
    const max = entries[0]?.[1] || 1;
    return entries.map(([grade, count], index) => ({
      grade,
      height: Math.max(24, Math.round((count / max) * 90)),
      color: ['#16a34a', '#2563eb', '#d97706', '#7c3aed'][index % 4],
    }));
  }, [report]);

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === 'className') {
      setForm(prev => ({ ...prev, className: value, section: '', classRoomId: '' }));
      return;
    }
    if (name === 'section') {
      const selected = classes.find((c) => c.name === form.className && c.section === value);
      setForm(prev => ({ ...prev, section: value, classRoomId: selected ? String(selected.id) : '' }));
      return;
    }
    setForm({ ...form, [name]: value });
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setUploadingPhoto(true);
    try {
      const path = await fileApi.uploadImage(file);
      setForm((prev) => ({ ...prev, profilePhoto: path }));
    } catch (err) {
      setError(err.response?.data || 'Photo upload failed.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      if (!form.classRoomId) {
        toast.showToast('Please select a class.', 'error');
        setSaving(false);
        return;
      }
      await studentApi.update(id, {
        ...form, classRoomId: Number(form.classRoomId)
      });
      toast.showToast('Student updated successfully!', 'success');
      setTimeout(() => navigate(`/admin/students/${id}`), 1500);
    } catch (err) {
      toast.showToast(err.response?.data?.message || 'Update failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <><LoadingSpinner /></>;

  return (
    <>
      <div className="mb-4 text-sm text-gray-500">
        Home &gt; Students &gt; Edit Student Profile
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Edit Student (A) Form</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-5 md:p-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          <div className="xl:col-span-8">
            <div className="flex gap-4">
              <div className="w-24 h-24 rounded-full bg-blue-100 border-4 border-blue-50 overflow-hidden flex items-center justify-center text-blue-700 text-3xl font-bold">
                {form.profilePhoto ? (
                  <img src={fileApi.toPublicUrl(form.profilePhoto)} alt="Student" className="w-full h-full object-cover" />
                ) : (
                  <>{form.firstName?.[0]}{form.lastName?.[0]}</>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                  {form.firstName} {form.lastName} | {form.studentId || `STU${id}`}
                </h2>
                <p className="text-2xl text-gray-700 mt-1">Student ID: {form.studentId || `STU${id}`}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 max-w-md">
                  <input name="firstName" value={form.firstName || ''} onChange={handleChange} className={inputCls} placeholder="First Name" required />
                  <input name="lastName" value={form.lastName || ''} onChange={handleChange} className={inputCls} placeholder="Last Name" required />
                </div>
                <label className="inline-flex items-center mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm cursor-pointer hover:bg-blue-700 transition">
                  {uploadingPhoto ? 'Uploading...' : 'Update Photo'}
                  <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                </label>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-3xl font-semibold text-gray-900 mb-2">Personal Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input type="date" name="dateOfBirth" value={form.dateOfBirth || ''} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select name="gender" value={form.gender || ''} onChange={handleChange} className={inputCls}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input name="phone" value={form.phone || ''} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input type="email" name="email" value={form.email || ''} onChange={handleChange} className={inputCls} required />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-3xl font-semibold text-gray-900 mb-2">Academic Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                  <select name="className" value={form.className || ''} onChange={handleChange} className={inputCls} required>
                    <option value="">Select Class</option>
                    {classNames.map((name) => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                  <select name="section" value={form.section || ''} onChange={handleChange} className={inputCls} required>
                    <option value="">Select Section</option>
                    {sectionsForClass.map((sec) => (
                      <option key={sec} value={sec}>{sec}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
                  <input name="academicYear" value={form.academicYear || ''} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input name="address" value={form.address || ''} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                  <select name="bloodGroup" value={form.bloodGroup || ''} onChange={handleChange} className={inputCls}>
                    <option value="">Select</option>
                    {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-3 text-sm text-gray-700 space-y-1">
                <p><span className="font-medium">Admission Number:</span> {form.studentId ? `ADM-${form.studentId}` : '-'}</p>
                <p><span className="font-medium">Admission Date:</span> {form.dateOfBirth || '-'}</p>
              </div>
            </div>
        </div>

          <div className="xl:col-span-4 space-y-4">
            <div className="rounded-xl border border-gray-200 p-4">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Parent/Guardian Information</h3>
              <div className="space-y-2">
                <input name="parentName" value={form.parentName || ''} onChange={handleChange} className={inputCls} placeholder="Guardian Name" required />
                <input name="parentPhone" value={form.parentPhone || ''} onChange={handleChange} className={inputCls} placeholder="Guardian Phone Number" />
                <input type="email" name="parentEmail" value={form.parentEmail || ''} onChange={handleChange} className={inputCls} placeholder="Guardian Email" />
                <select name="guardianRelationship" value={form.guardianRelationship || 'Parent'} onChange={handleChange} className={inputCls}>
                  <option value="Parent">Parent</option>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Guardian">Guardian</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-gray-200 p-4">
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">Attendance Summary</h3>
                <div className="flex items-center justify-center py-2">
                  <div className="w-32 h-32 rounded-full p-2" style={attendanceRing}>
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-3xl font-bold text-gray-900">
                      {attendancePercent}%
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  Present: {attendance?.presentDays || 0} | Absent: {attendance?.absentDays || 0}
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 p-4">
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">Report Card Summary</h3>
                <div className="flex items-end gap-3 h-32">
                  {gradeSummary.length > 0 ? gradeSummary.map((g) => (
                    <div key={g.grade} className="flex-1 text-center">
                      <div className="text-xs font-semibold text-gray-700 mb-1">{g.grade}</div>
                      <div className="mx-auto rounded-t" style={{ width: '28px', height: `${g.height}px`, backgroundColor: g.color }} />
                    </div>
                  )) : <p className="text-sm text-gray-500">No report data</p>}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 justify-end pt-2">
              <button type="submit" disabled={saving}
                className="bg-blue-600 text-white px-8 py-2.5 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-60 font-medium">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" onClick={() => navigate(`/admin/students/${id}`)}
                className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg text-sm hover:bg-gray-200 font-medium">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default EditStudentPage;
