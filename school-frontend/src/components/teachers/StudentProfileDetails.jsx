import React from 'react';
import { FiMail, FiPhone, FiUser, FiCalendar, FiBookOpen, FiAward, FiBarChart2, FiClock } from 'react-icons/fi';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { fileApi } from '../../api/fileApi';

const StudentProfileDetails = ({ student, score, attendanceStatus }) => {
  if (!student) return null;

  // Mock data for charts - in real app would fetch from API
  const attendanceData = [
    { name: 'Present', value: 85, color: '#10B981' },
    { name: 'Absent', value: 10, color: '#EF4444' },
    { name: 'Late', value: 5, color: '#F59E0B' },
  ];

  const academicData = [
    { name: 'Unit 1', score: 78 },
    { name: 'Unit 2', score: 85 },
    { name: 'Midterm', score: 72 },
    { name: 'Unit 3', score: 90 },
    { name: 'Final', score: score || 0 },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Header Section with Glassmorphism */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-700 p-1 shadow-xl">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative bg-white/10 backdrop-blur-md rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 text-white">
          <div className="relative group">
            <div className="w-24 h-24 rounded-2xl border-4 border-white/30 overflow-hidden shadow-2xl transition-transform group-hover:scale-105 duration-300">
              {student.profilePhoto ? (
                <img 
                  src={fileApi.toPublicUrl(student.profilePhoto)} 
                  alt={student.firstName} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-white/20 flex items-center justify-center text-3xl font-bold">
                  {student.firstName?.[0]}{student.lastName?.[0]}
                </div>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-indigo-600 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
              <h2 className="text-3xl font-bold tracking-tight">{student.firstName} {student.lastName}</h2>
              <span className="bg-white/20 px-3 py-0.5 rounded-full text-xs font-medium backdrop-blur-sm border border-white/10">
                {student.studentId}
              </span>
            </div>
            <p className="text-indigo-100 flex items-center justify-center md:justify-start gap-2 text-sm">
              <FiBookOpen size={14} /> {student.className} • Section {student.section || 'A'}
            </p>
            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
              <a href={`mailto:${student.email}`} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 transition px-3 py-1.5 rounded-lg text-xs font-medium backdrop-blur-sm">
                <FiMail size={12} /> Email Student
              </a>
              <a href={`tel:${student.phone}`} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 transition px-3 py-1.5 rounded-lg text-xs font-medium backdrop-blur-sm">
                <FiPhone size={12} /> Call Parents
              </a>
            </div>
          </div>

          <div className="hidden xl:flex flex-col items-end gap-2 border-l border-white/20 pl-8">
            <p className="text-xs uppercase tracking-widest text-indigo-200 font-bold">Performance Index</p>
            <div className="text-4xl font-black text-white">{score || 0}%</div>
            <div className="flex items-center gap-1 text-xs text-green-300 font-medium">
              <FiAward /> Top 10% of Class
            </div>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Details */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow duration-300">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <FiUser size={16} className="text-indigo-500" /> Personal Profile
            </h3>
            <div className="space-y-4">
              <div className="group">
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Contact Email</p>
                <p className="text-sm text-gray-700 font-medium break-all">{student.email || 'N/A'}</p>
              </div>
              <div className="group">
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Phone Number</p>
                <p className="text-sm text-gray-700 font-medium">{student.phone || 'N/A'}</p>
              </div>
              <div className="group">
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Date of Birth</p>
                <p className="text-sm text-gray-700 font-medium">{student.dob || 'May 12, 2010'}</p>
              </div>
              <div className="pt-2 border-t border-gray-50">
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-2">Guardian Information</p>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-sm font-bold text-gray-800">{student.parentName || 'Mr. Rajesh Kumar'}</p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <FiMail size={10} /> {student.parentEmail || 'rajesh@parent.com'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow duration-300 overflow-hidden relative">
             <div className="absolute -right-4 -bottom-4 text-indigo-50 opacity-10">
                <FiClock size={120} />
             </div>
             <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <FiClock size={16} className="text-indigo-500" /> Enrollment Status
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Member Since</p>
                <p className="text-sm font-bold text-gray-800">Aug 2023</p>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-tighter uppercase ${student.status === 'ACTIVE' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {student.status}
              </span>
            </div>
          </div>
        </div>

        {/* Right Columns - Analytics */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Top Analytics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <FiCalendar size={16} className="text-green-500" /> Attendance Overview
              </h3>
              <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={attendanceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={60}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {attendanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between text-center mt-2 px-4">
                {attendanceData.map((item) => (
                  <div key={item.name}>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{item.name}</p>
                    <p className="text-sm font-black" style={{ color: item.color }}>{item.value}%</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <FiBarChart2 size={16} className="text-blue-500" /> Grade Trends
              </h3>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={academicData}>
                    <XAxis dataKey="name" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip 
                       contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                       cursor={{ fill: '#f3f4f6' }}
                    />
                    <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                      {academicData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.score >= 75 ? '#3B82F6' : '#94A3B8'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Bottom Academic Section */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <FiBookOpen size={16} className="text-indigo-500" /> Academic Reports
              </h3>
              <button className="text-[10px] font-bold text-indigo-600 hover:underline uppercase tracking-widest">
                Download Full Report
              </button>
            </div>
            
            <div className="space-y-3">
              {[
                { subject: 'Mathematics', teacher: 'Dr. Sarah Wilson', grade: 'A+', color: 'text-green-500' },
                { subject: 'Physics', teacher: 'Prof. James Bond', grade: 'B', color: 'text-blue-500' },
                { subject: 'English', teacher: 'Ms. Emily Blunt', grade: 'A', color: 'text-green-500' },
              ].map((sub, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-indigo-50/50 transition duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-indigo-500 shadow-sm border border-gray-100">
                      <FiBookOpen size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{sub.subject}</p>
                      <p className="text-[10px] text-gray-500 font-medium">{sub.teacher}</p>
                    </div>
                  </div>
                  <div className={`text-lg font-black ${sub.color}`}>{sub.grade}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentProfileDetails;
