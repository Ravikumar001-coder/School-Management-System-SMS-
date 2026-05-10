// src/pages/teacher/TeacherProfilePage.jsx
import React, { useEffect, useState, useMemo } from 'react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import FormField from '../../components/common/FormField';
import Loading from '../../components/common/Loading';
import { useAuth } from '../../context/AuthContext';
import { fileApi } from '../../api/fileApi';
import { teacherApi } from '../../api/teacherApi';
import { examApi } from '../../api/examApi';
import { getTeacherScopeData, getTodayAttendanceSummary } from '../../utils/teacherData';
import { useToast } from '../../hooks/useToast';
import StatusBadge from '../../components/common/StatusBadge';

/**
 * Enterprise Teacher Profile
 * Refactored with:
 * - Premium Profile Design
 * - Inline Editing with shared FormFields
 * - Global Toasts
 * - Loading Skeletons via shared Loading component
 */
const TeacherProfilePage = () => {
  const { user } = useAuth();
  const toast = useToast();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  
  const [teacher, setTeacher] = useState(null);
  const [scope, setScope] = useState({ exams: [], assignedClasses: [] });
  const [attendance, setAttendance] = useState({ rate: 0 });
  const [subjectSummary, setSubjectSummary] = useState([]);
  
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    qualification: '', specialization: '', gender: '',
    salary: '', address: '',
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const profileScope = await getTeacherScopeData(user);
        if (!profileScope.teacher) throw new Error('Teacher profile not found.');

        setTeacher(profileScope.teacher);
        setScope(profileScope);
        setForm({
          firstName: profileScope.teacher.firstName || '',
          lastName: profileScope.teacher.lastName || '',
          email: profileScope.teacher.email || '',
          phone: profileScope.teacher.phone || '',
          qualification: profileScope.teacher.qualification || '',
          specialization: profileScope.teacher.specialization || '',
          gender: profileScope.teacher.gender || '',
          salary: profileScope.teacher.salary ?? '',
          address: profileScope.teacher.address || '',
        });

        const att = await getTodayAttendanceSummary(profileScope.assignedClasses || []);
        setAttendance(att);

        // Subject performance summary (Simplified)
        setSubjectSummary([
          { name: 'Mathematics', pct: 88, grade: 'A' },
          { name: 'Physics', pct: 76, grade: 'B' },
          { name: 'Chemistry', pct: 82, grade: 'A-' },
        ]);
      } catch (err) {
        toast.error(err.message || 'Failed to sync profile.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, toast]);

  const onSave = async () => {
    setSaving(true);
    try {
      const payload = { ...teacher, ...form, salary: form.salary === '' ? null : Number(form.salary) };
      const res = await teacherApi.update(teacher.id, payload);
      setTeacher(res.data.data || payload);
      setEditing(false);
      toast.success("Profile updated successfully.");
    } catch (err) {
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <><Loading fullScreen /></>;

  return (
    <>
      <PageHeader 
        title="My Professional Profile" 
        subtitle="Manage your personal information, academic credentials, and view performance metrics."
        actions={
          !editing ? (
            <Button variant="primary" onClick={() => setEditing(true)}>Edit Profile</Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
              <Button variant="primary" loading={saving} onClick={onSave}>Save Changes</Button>
            </div>
          )
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
        
        {/* Left: Bio & Basic Info */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Identity Card */}
          <div className="card !p-8 flex flex-col md:flex-row items-center gap-8 bg-gradient-to-br from-white to-blue-50/30">
            <div className="w-32 h-32 rounded-3xl bg-blue-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl overflow-hidden ring-4 ring-white">
              {teacher.profilePhoto ? (
                <img src={fileApi.toPublicUrl(teacher.profilePhoto)} alt="" className="w-full h-full object-cover" />
              ) : (
                <>{teacher.firstName?.[0]}{teacher.lastName?.[0]}</>
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-4xl font-black text-gray-900 leading-none">
                {teacher.firstName} {teacher.lastName}
              </h2>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-3 flex items-center justify-center md:justify-start gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Employee ID: {teacher.employeeId}
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                <StatusBadge status="Faculty" variant="blue" />
                <StatusBadge status={teacher.specialization} variant="purple" />
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="card">
            <h3 className="card-title mb-8 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full" />
              Professional & Personal Information
            </h3>
            
            <div className="form-grid">
              <FormField label="First Name">
                {editing ? <input className="input" name="firstName" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} /> : <p className="text-sm font-bold text-gray-800">{teacher.firstName}</p>}
              </FormField>
              <FormField label="Last Name">
                {editing ? <input className="input" name="lastName" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} /> : <p className="text-sm font-bold text-gray-800">{teacher.lastName}</p>}
              </FormField>
              <FormField label="Email Address">
                {editing ? <input className="input" name="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /> : <p className="text-sm font-bold text-gray-800">{teacher.email}</p>}
              </FormField>
              <FormField label="Phone Number">
                {editing ? <input className="input" name="phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /> : <p className="text-sm font-bold text-gray-800">{teacher.phone || 'Not provided'}</p>}
              </FormField>
              <FormField label="Highest Qualification">
                {editing ? <input className="input" name="qualification" value={form.qualification} onChange={e => setForm({...form, qualification: e.target.value})} /> : <p className="text-sm font-bold text-gray-800">{teacher.qualification}</p>}
              </FormField>
              <FormField label="Specialization">
                {editing ? <input className="input" name="specialization" value={form.specialization} onChange={e => setForm({...form, specialization: e.target.value})} /> : <p className="text-sm font-bold text-gray-800">{teacher.specialization}</p>}
              </FormField>
              <FormField label="Gender">
                {editing ? <select className="select" name="gender" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select> : <p className="text-sm font-bold text-gray-800">{teacher.gender}</p>}
              </FormField>
              <FormField label="Monthly Salary (INR)">
                <p className="text-sm font-bold text-gray-800">₹{Number(teacher.salary).toLocaleString()}</p>
              </FormField>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-100">
              <FormField label="Permanent Address">
                {editing ? <textarea className="input min-h-[100px]" value={form.address} onChange={e => setForm({...form, address: e.target.value})} /> : <p className="text-sm text-gray-600 italic">{teacher.address || 'No address provided'}</p>}
              </FormField>
            </div>
          </div>
        </div>

        {/* Right: Metrics & Insights */}
        <div className="space-y-8">
          
          {/* Attendance Chart (Simulated Donut) */}
          <div className="card text-center">
            <h3 className="card-title !text-center mb-6">Attendance Record</h3>
            <div className="relative w-40 h-40 mx-auto">
              <div 
                className="w-full h-full rounded-full flex items-center justify-center text-3xl font-black text-gray-800 shadow-inner"
                style={{ background: `conic-gradient(#10b981 ${attendance.rate}%, #f1f5f9 0%)` }}
              >
                <div className="w-[85%] h-[85%] rounded-full bg-white flex flex-col items-center justify-center">
                  {attendance.rate}%
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest">Active</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-6 leading-relaxed">
              Consistently high attendance helps maintain class momentum and student trust.
            </p>
          </div>

          {/* Performance Summary */}
          <div className="card">
            <h3 className="card-title mb-6">Class Performance</h3>
            <div className="space-y-6">
              {subjectSummary.map((s, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-bold text-gray-700">{s.name}</p>
                    <StatusBadge status={s.grade} variant={s.pct > 80 ? 'green' : 'blue'} className="!text-[9px]" />
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full bg-gradient-to-r ${s.pct > 80 ? 'from-green-400 to-emerald-500' : 'from-blue-400 to-indigo-500'}`}
                      style={{ width: `${s.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button variant="secondary" className="w-full mt-8 !text-[10px] !uppercase !tracking-widest !font-black !py-3">
              View Detailed Metrics
            </Button>
          </div>

        </div>
      </div>
    </>
  );
};

export default TeacherProfilePage;
