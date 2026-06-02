// src/pages/student/StudentProfile.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentApi } from '../../api/studentApi';
import { attendanceApi } from '../../api/attendanceApi';
import { examApi } from '../../api/examApi';
import { fileApi } from '../../api/fileApi';
import PageHeader from '../../components/common/PageHeader';
import { User, Phone, Mail, MapPin, Calendar, Award, BookOpen, Clock, Settings, Edit3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, PieChart, Pie, Label } from 'recharts';

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

  const gradeChartData = useMemo(() => {
    const map = {};
    report.forEach((row) => {
      const key = row?.grade || 'NA';
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map).map(([grade, count], index) => ({
      grade,
      count,
      color: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'][index % 5],
    })).sort((a, b) => a.grade.localeCompare(b.grade));
  }, [report]);

  const attendanceData = [
    { name: 'Present', value: attendancePercent, fill: '#10b981' },
    { name: 'Absent', value: 100 - attendancePercent, fill: '#f1f5f9' }
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500">Loading student profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader 
          title="Student Profile"
          subtitle="View your personal and academic information"
          className="!mb-0"
        />
        <button
          type="button"
          className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 shadow-sm flex items-center gap-2"
        >
          <Settings size={18} />
          Settings
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Main Profile & Personal Details */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Hero Profile Card */}
          <div className="card shadow-sm border border-gray-100 p-0 overflow-hidden relative">
            <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
            <div className="px-6 pb-6 relative">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 sm:-mt-12 mb-6">
                <div className="h-32 w-32 rounded-full border-4 border-white bg-white shadow-md overflow-hidden shrink-0">
                  {student?.profilePhoto ? (
                    <img
                      src={fileApi.toPublicUrl(student.profilePhoto)}
                      alt={`${student?.firstName || ''} ${student?.lastName || ''}`.trim()}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-blue-50 text-4xl font-black text-blue-300">
                      {student?.firstName?.[0]}{student?.lastName?.[0]}
                    </div>
                  )}
                </div>
                <div className="flex-1 text-center sm:text-left pt-2">
                  <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                    {`${student?.firstName || ''} ${student?.lastName || ''}`.trim() || 'Student Name'}
                  </h1>
                  <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mt-1">
                    Student ID: {student?.studentId || '-'}
                  </p>
                </div>
                <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-bold border border-gray-200 transition-colors">
                  <Edit3 size={16} /> Edit Profile
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Class</p>
                  <p className="font-bold text-gray-800 mt-1">{student?.className || '-'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Section</p>
                  <p className="font-bold text-gray-800 mt-1">{student?.section || student?.classSection || '-'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">DOB</p>
                  <p className="font-bold text-gray-800 mt-1">{student?.dateOfBirth || '-'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Gender</p>
                  <p className="font-bold text-gray-800 mt-1">{student?.gender || '-'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Guardian Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card shadow-sm border border-gray-100">
              <h3 className="card-title mb-6 flex items-center gap-2">
                <User size={18} className="text-gray-400" />
                Contact Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0"><Phone size={16} /></div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Phone</p>
                    <p className="font-medium text-gray-800 text-sm mt-0.5">{student?.phone || '-'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0"><Mail size={16} /></div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email</p>
                    <p className="font-medium text-gray-800 text-sm mt-0.5">{student?.email || '-'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0"><MapPin size={16} /></div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Address</p>
                    <p className="font-medium text-gray-800 text-sm mt-0.5">{student?.address || 'Address not provided'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card shadow-sm border border-gray-100">
              <h3 className="card-title mb-6 flex items-center gap-2">
                <User size={18} className="text-gray-400" />
                Guardian Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0"><User size={16} /></div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Name ({student?.guardianRelationship || 'Parent'})</p>
                    <p className="font-medium text-gray-800 text-sm mt-0.5">{student?.parentName || '-'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0"><Phone size={16} /></div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Phone</p>
                    <p className="font-medium text-gray-800 text-sm mt-0.5">{student?.parentPhone || '-'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0"><Mail size={16} /></div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email</p>
                    <p className="font-medium text-gray-800 text-sm mt-0.5">{student?.parentEmail || '-'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column - Academic Summaries */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Attendance Summary */}
          <div className="card shadow-sm border border-gray-100 flex flex-col items-center">
            <h3 className="card-title w-full mb-4 flex items-center gap-2">
              <Clock size={18} className="text-gray-400" />
              Attendance Overview
            </h3>
            <div className="h-48 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attendanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    stroke="none"
                  >
                    <Label
                      value={`${attendancePercent}%`}
                      position="center"
                      className="text-2xl font-black fill-gray-900"
                    />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full flex justify-around mt-2 text-sm">
              <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Present</p>
                <p className="font-bold text-green-600">{attendance?.present || attendance?.presentDays || 0}%</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Absent</p>
                <p className="font-bold text-red-500">{attendance?.absent || attendance?.absentDays || 0}%</p>
              </div>
            </div>
          </div>

          {/* Grades Summary */}
          <div className="card shadow-sm border border-gray-100 flex flex-col">
            <h3 className="card-title mb-6 flex items-center gap-2">
              <Award size={18} className="text-gray-400" />
              Grade Distribution
            </h3>
            <div className="flex-1 h-48 w-full">
              {gradeChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={gradeChartData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="grade" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888', fontWeight: 'bold' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#888' }} allowDecimals={false} />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(value) => [value, 'Subjects']}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={32}>
                      {gradeChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center border-2 border-dashed border-gray-100 rounded-xl">
                  <p className="text-gray-400 text-sm">No exam results available.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
