import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentApi } from '../../api/studentApi';
import { attendanceApi } from '../../api/attendanceApi';
import { examApi } from '../../api/examApi';
import { fileApi } from '../../api/fileApi';

const cardShadow = { boxShadow: '0 2px 12px rgba(15, 23, 42, 0.08)' };

const getAcademicYear = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const startYear = month >= 4 ? year : year - 1;
  return `${startYear}-${String((startYear + 1) % 100).padStart(2, '0')}`;
};

const StudentProfile = () => {
  const { user } = useAuth();
  const studentId = user?.studentId;

  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!studentId) {
      setLoading(false);
      setError('Student profile is not linked to this account.');
      return;
    }

    const today = new Date();
    const from = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
    const to = today.toISOString().split('T')[0];

    Promise.all([
      studentApi.getById(studentId),
      attendanceApi.studentReport(studentId, from, to),
      examApi.reportCard(studentId, getAcademicYear()),
    ]).then(([sRes, aRes, rRes]) => {
      setStudent(sRes?.data?.data || sRes?.data || null);
      setAttendance(aRes?.data?.data || null);
      setReport(rRes?.data?.data || []);
      setError('');
    }).catch(() => {
      setError('Unable to load profile details right now.');
    }).finally(() => {
      setLoading(false);
    });
  }, [studentId]);

  const attendancePercent = Number(attendance?.percentage || 0);

  const attendanceRing = {
    background: `conic-gradient(#16a34a ${attendancePercent * 3.6}deg, #2563eb 0deg, #e2e8f0 0deg)`,
  };

  const gradeCounts = useMemo(() => {
    const map = {};
    report.forEach((row) => {
      const key = row?.grade || 'NA';
      map[key] = (map[key] || 0) + 1;
    });
    const entries = Object.entries(map).slice(0, 4);
    const max = Math.max(...entries.map((e) => e[1]), 1);
    return entries.map(([grade, count], index) => ({
      grade,
      count,
      height: Math.max(42, Math.round((count / max) * 95)),
      color: ['#16a34a', '#3b82f6', '#8b5cf6', '#f59e0b'][index % 4],
    }));
  }, [report]);

  if (loading) {
    return (
      <>
        <div className="rounded-2xl bg-white p-10 text-center" style={cardShadow}>
          <p className="text-sm text-gray-600">Loading profile details...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm font-medium text-gray-500">Home {'>'} Dashboard {'>'} Student Profile</div>
        <div className="flex items-center gap-2">
          <span className="text-slate-700">Filters</span>
          <button type="button" className="relative h-7 w-14 rounded-full bg-blue-700">
            <span className="absolute right-1 top-1 h-5 w-5 rounded-full bg-white" />
          </button>
        </div>
      </div>

      <h1 className="mb-5 text-[48px] font-semibold leading-none tracking-tight text-slate-900">Student Profile</h1>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      <div className="rounded-2xl bg-white p-4" style={cardShadow}>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <div className="xl:col-span-9">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="mb-3 flex items-start justify-between">
                  <h2 className="text-[42px] font-semibold leading-tight text-slate-900">Profile Overview</h2>
                  <span className="text-4xl text-blue-400">📊</span>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                    {student?.profilePhoto ? (
                      <img
                        src={fileApi.toPublicUrl(student.profilePhoto)}
                        alt={`${student?.firstName || ''} ${student?.lastName || ''}`.trim()}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-slate-500">
                        {student?.firstName?.[0]}{student?.lastName?.[0]}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-[88px_1fr] gap-x-3 gap-y-1 text-[32px] leading-tight">
                    <span className="text-slate-700">ID</span><span className="font-medium text-slate-900">{student?.studentId || '-'}</span>
                    <span className="text-slate-700">Name</span><span className="font-medium text-slate-900">{`${student?.firstName || ''} ${student?.lastName || ''}`.trim() || '-'}</span>
                    <span className="text-slate-700">Class</span><span className="font-medium text-slate-900">{student?.className || '-'}</span>
                    <span className="text-slate-700">Role</span><span className="font-medium text-slate-900">Student</span>
                    <span className="col-span-2 mt-2 inline-block w-max rounded-lg bg-blue-100 px-3 py-1 text-[28px] font-medium text-blue-800">Student</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <div className="mb-3 flex items-start justify-between">
                  <h2 className="text-[42px] font-semibold leading-tight text-slate-900">Personal Details</h2>
                  <span className="text-4xl text-blue-400">📈</span>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-[32px] leading-tight">
                  <span className="text-slate-700">DOB</span><span className="font-medium text-slate-900">{student?.dateOfBirth || '-'}</span>
                  <span className="text-slate-700">Gender</span><span className="font-medium text-slate-900">{student?.gender || '-'}</span>
                  <span className="text-slate-700">Phone</span><span className="font-medium text-slate-900">{student?.phone || '-'}</span>
                  <span className="text-slate-700">Email</span><span className="font-medium text-slate-900">{student?.email || '-'}</span>
                </div>

                <h3 className="mt-4 text-[40px] font-semibold text-slate-900">Academic Details</h3>
                <div className="mt-1 grid grid-cols-2 gap-x-6 gap-y-1 text-[32px] leading-tight">
                  <span className="text-slate-700">Class</span><span className="font-medium text-slate-900">{student?.className || '-'}</span>
                  <span className="text-slate-700">Section</span><span className="font-medium text-slate-900">{student?.section || student?.classSection || '-'}</span>
                  <span className="text-slate-700">Admission</span><span className="font-medium text-slate-900">{student?.admissionNumber || student?.studentId || '-'}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-slate-200 p-4">
                <h3 className="mb-3 text-[40px] font-semibold text-slate-900">Attendance</h3>
                <div className="mx-auto h-40 w-40 rounded-full p-2" style={attendanceRing}>
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-[44px] font-bold text-slate-900">
                    {attendancePercent || 0}%
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-4 text-[24px] text-slate-700">
                  <span className="inline-flex items-center gap-2"><span className="inline-block h-3.5 w-3.5 rounded-sm bg-green-600" />Present: {attendance?.present || attendance?.presentDays || 0}%</span>
                  <span className="inline-flex items-center gap-2"><span className="inline-block h-3.5 w-3.5 rounded-sm bg-blue-600" />Absent: {attendance?.absent || attendance?.absentDays || 0}%</span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <div className="mb-3 flex items-start justify-between">
                  <h3 className="text-[40px] font-semibold text-slate-900">Parent/Guardian Information</h3>
                  <span className="text-4xl text-indigo-400">📄</span>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-[30px] leading-tight">
                  <span className="text-slate-700">Guardian Name</span><span className="font-medium text-slate-900">{student?.parentName || '-'}</span>
                  <span className="text-slate-700">Phone Number</span><span className="font-medium text-slate-900">{student?.parentPhone || '-'}</span>
                  <span className="text-slate-700">Email</span><span className="font-medium text-slate-900">{student?.parentEmail || '-'}</span>
                  <span className="text-slate-700">Relationship</span><span className="font-medium text-slate-900">{student?.guardianRelationship || 'Parent'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="xl:col-span-3 space-y-4">
            <div className="rounded-xl border border-slate-200 p-4">
              <h3 className="mb-3 text-[38px] font-semibold text-slate-900">Attendance Summary</h3>
              <div className="mx-auto h-40 w-40 rounded-full p-2" style={attendanceRing}>
                <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-[44px] font-bold text-slate-900">{attendancePercent || 0}%</div>
              </div>
              <div className="mt-3 text-[22px] text-slate-700">
                <p>Present: {attendance?.present || attendance?.presentDays || 0}%</p>
                <p>Absent: {attendance?.absent || attendance?.absentDays || 0}%</p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <h3 className="mb-3 text-[38px] font-semibold text-slate-900">Report Card Summary</h3>
              <div className="flex h-40 items-end gap-4">
                {gradeCounts.length > 0 ? gradeCounts.map((item) => (
                  <div key={item.grade} className="flex-1 text-center">
                    <div
                      className="mx-auto rounded-t"
                      style={{ width: '36px', height: `${item.height}px`, backgroundColor: item.color }}
                    />
                    <p className="mt-2 text-[22px] font-medium text-slate-700">{item.grade}</p>
                  </div>
                )) : (
                  <p className="text-[22px] text-slate-500">No result data</p>
                )}
              </div>
            </div>

            
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentProfile;
