import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { studentApi } from '../../api/studentApi';
import { attendanceApi } from '../../api/attendanceApi';
import { examApi } from '../../api/examApi';
import { fileApi } from '../../api/fileApi';

const InfoRow = ({ label, value }) => (
  <div className="flex py-2.5 border-b last:border-0">
    <span className="w-44 text-sm text-gray-600 flex-shrink-0">
      {label}
    </span>
    <span className="text-sm font-medium text-gray-900">
      {value || '—'}
    </span>
  </div>
);

const StudentDetailPage = () => {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [report, setReport] = useState([]);
  const [activeSection, setActiveSection] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const today = new Date();
    const from = new Date(today.getFullYear(), 0, 1)
      .toISOString().split('T')[0];
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
  const attendanceRing = {
    background: `conic-gradient(#16a34a ${attendancePercent * 3.6}deg, #dbeafe 0deg)`,
  };

  const gradeSummary = useMemo(() => {
    const counts = {};
    report.forEach((item) => {
      const key = item?.grade || 'NA';
      counts[key] = (counts[key] || 0) + 1;
    });
    const entries = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
    const max = entries[0]?.[1] || 1;
    return entries.map(([grade, count], index) => ({
      grade,
      count,
      height: Math.max(24, Math.round((count / max) * 90)),
      color: ['#16a34a', '#2563eb', '#d97706', '#7c3aed'][index % 4],
    }));
  }, [report]);

  const jumpToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (!el) return;

    setActiveSection(sectionId);
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.focus({ preventScroll: true });

    window.setTimeout(() => {
      setActiveSection((current) => (current === sectionId ? '' : current));
    }, 1200);
  };

  if (loading) return <><LoadingSpinner /></>;
  if (error) return (
    <>
      <p className="text-red-500">{error}</p>
    </>
  );
  if (!student) return (
    <>
      <p className="text-red-500">Student not found.</p>
    </>
  );

  return (
    <>
      <div className="mb-4 text-sm text-gray-500">
        Home &gt; Students &gt; Student Profile
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Student Detail</h1>

      <div className="bg-white rounded-2xl shadow p-5 md:p-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          <div className="xl:col-span-8">
            <div className="flex flex-col md:flex-row md:items-center gap-5">
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-3xl font-bold border-4 border-blue-50">
                {student.profilePhoto ? (
                  <img
                    src={fileApi.toPublicUrl(student.profilePhoto)}
                    alt={`${student.firstName || ''} ${student.lastName || ''}`.trim()}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <>{student.firstName?.[0]}{student.lastName?.[0]}</>
                )}
              </div>
              <div>
                <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                  {student.firstName} {student.lastName}
                </h2>
                <p className="text-2xl text-gray-700 mt-1">
                  Student ID: {student.studentId}
                </p>
                <span className="inline-block mt-2 bg-blue-600 text-white text-sm px-3 py-1 rounded-lg font-medium">
                  Student
                </span>
              </div>
            </div>

            <div className="mt-5">
              <h3 className="text-3xl font-semibold text-gray-900 mb-2">Personal Details</h3>
              <InfoRow label="Date of Birth" value={student.dateOfBirth} />
              <InfoRow label="Gender" value={student.gender} />
              <InfoRow label="Phone Number" value={student.phone} />
              <InfoRow label="Email Address" value={student.email} />
            </div>

            <div className="mt-5">
              <h3 className="text-3xl font-semibold text-gray-900 mb-2">Academic Details</h3>
              <InfoRow label="Class" value={student.className || '—'} />
              <InfoRow label="Academic Year" value={student.academicYear} />
              <InfoRow label="Blood Group" value={student.bloodGroup} />
              <InfoRow label="Address" value={student.address} />
            </div>
          </div>

          <div className="xl:col-span-4 space-y-4">
            <div className="rounded-xl border border-gray-200 p-4">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                Parent/Guardian Information
              </h3>
              <InfoRow label="Guardian Name" value={student.parentName} />
              <InfoRow label="Phone Number" value={student.parentPhone} />
              <InfoRow label="Email" value={student.parentEmail} />
              <InfoRow label="Relationship" value={student.guardianRelationship || 'Parent'} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                id="attendance-summary"
                tabIndex={-1}
                className={`rounded-xl border p-4 outline-none transition-all duration-300 ${
                  activeSection === 'attendance-summary'
                    ? 'border-indigo-400 ring-2 ring-indigo-200'
                    : 'border-gray-200'
                }`}
              >
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

              <div
                id="report-summary"
                tabIndex={-1}
                className={`rounded-xl border p-4 outline-none transition-all duration-300 ${
                  activeSection === 'report-summary'
                    ? 'border-cyan-400 ring-2 ring-cyan-200'
                    : 'border-gray-200'
                }`}
              >
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">Report Card Summary</h3>
                <div className="flex items-end gap-3 h-32">
                  {gradeSummary.length > 0 ? gradeSummary.map((g) => (
                    <div key={g.grade} className="flex-1 text-center">
                      <div className="text-xs font-semibold text-gray-700 mb-1">{g.grade}</div>
                      <div
                        className="mx-auto rounded-t"
                        style={{ width: '28px', height: `${g.height}px`, backgroundColor: g.color }}
                      />
                    </div>
                  )) : (
                    <p className="text-sm text-gray-500">No report data</p>
                  )}
                </div>
                <div className="mt-3 text-sm text-gray-600">Exams: {report.length}</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-end pt-1">
              <button
                onClick={() => navigate(`/admin/students/${id}/edit`)}
                className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800"
              >
                Edit Profile
              </button>
              <button
                onClick={() => jumpToSection('attendance-summary')}
                className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-200"
              >
                View Attendance
              </button>
              <button
                onClick={() => jumpToSection('report-summary')}
                className="bg-cyan-100 text-cyan-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-cyan-200"
              >
                View Report Card
              </button>
            </div>

            <button
              onClick={() => navigate('/admin/students')}
              className="text-sm text-gray-600 hover:text-gray-900 mt-1"
            >
              ← Back to Students
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentDetailPage;
