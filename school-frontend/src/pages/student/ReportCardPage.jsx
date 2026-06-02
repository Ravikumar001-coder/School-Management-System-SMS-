// src/pages/student/ReportCardPage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { examApi } from '../../api/examApi';
import { studentApi } from '../../api/studentApi';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import { Download, Filter, GraduationCap, Award, BookOpen, LineChart as LineChartIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

const getAcademicYear = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const startYear = month >= 4 ? year : year - 1;
  return `${startYear}-${String((startYear + 1) % 100).padStart(2, '0')}`;
};

const gradePoint = (grade) => {
  const map = { 'A+': 4.0, A: 3.8, 'B+': 3.4, B: 3.0, 'C+': 2.6, C: 2.2, D: 1.5, F: 0 };
  return map[(grade || '').toUpperCase()] ?? 0;
};

const ReportCardPage = () => {
  const { user } = useAuth();
  const studentId = user?.studentId;
  const [report, setReport] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showOnlyPassed, setShowOnlyPassed] = useState(false);

  useEffect(() => {
    if (!studentId) {
      setLoading(false);
      setError('Student profile is not linked to this account.');
      return;
    }

    Promise.all([
      examApi.reportCard(studentId, getAcademicYear()),
      studentApi.getById(studentId),
    ]).then(([rRes, sRes]) => {
      setReport(rRes?.data?.data || []);
      setStudent(sRes?.data?.data || sRes?.data || null);
      setError('');
    }).catch(() => {
      setError('Unable to load report card data.');
    }).finally(() => {
      setLoading(false);
    });
  }, [studentId]);

  const filteredRows = useMemo(
    () => showOnlyPassed ? report.filter((r) => (r.grade || '').toUpperCase() !== 'F') : report,
    [report, showOnlyPassed]
  );

  const overallGpa = useMemo(() => {
    if (!report.length) return 0;
    const total = report.reduce((sum, row) => sum + gradePoint(row.grade), 0);
    return Math.round((total / report.length) * 10) / 10;
  }, [report]);

  const latestResult = report[0];

  const chartData = useMemo(() => {
    return report.map(r => ({
      subject: r.subjectName,
      score: r.marksObtained ? Math.round((r.marksObtained / (r.totalMarks || 100)) * 100) : 0,
      grade: r.grade,
      isPass: (r.grade || '').toUpperCase() !== 'F'
    }));
  }, [report]);

  const downloadReport = () => {
    if (!report.length) {
      setError('No report data available to download.');
      return;
    }

    const lines = [
      'Progress Report',
      `Student,${`${user?.firstName || ''} ${user?.lastName || ''}`.trim()}`,
      `School ID,${student?.studentId || '-'}`,
      `Class,${student?.className || '-'}`,
      `Academic Year,${getAcademicYear()}`,
      `Overall GPA,${overallGpa}`,
      '',
      'Exam,Subject,Marks Obtained,Total Marks,Grade',
    ];

    report.forEach((row) => {
      lines.push([
        row.examName || '-',
        row.subjectName || '-',
        row.marksObtained ?? 0,
        row.totalMarks ?? 0,
        row.grade || '-',
      ].join(','));
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `progress-report-${student?.studentId || studentId}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader 
          title="Academic Report Card"
          subtitle={`Performance overview for ${getAcademicYear()} Academic Year`}
          className="!mb-0"
        />
        <Button onClick={downloadReport} variant="primary" className="flex items-center gap-2 shadow-sm">
          <Download size={18} />
          Download PDF
        </Button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 animate-fade-in">{error}</div>
      )}

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Student Profile" 
          value={`${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Student'} 
          subtitle={`Class ${student?.className || 'N/A'} • ID: ${student?.studentId || 'N/A'}`}
          variant="purple" 
          loading={loading}
          icon={() => <GraduationCap size={24} className="text-purple-500" />}
        />
        <StatCard 
          title="Overall GPA" 
          value={overallGpa.toString()} 
          subtitle="Cumulative Term GPA"
          variant="blue" 
          loading={loading}
          icon={() => <Award size={24} className="text-blue-500" />}
        />
        <StatCard 
          title="Latest Result" 
          value={latestResult ? latestResult.grade : 'N/A'} 
          subtitle={latestResult ? `${latestResult.subjectName} (${latestResult.examName})` : 'No recent exams'}
          variant={latestResult && latestResult.grade !== 'F' ? 'green' : 'orange'} 
          loading={loading}
          icon={() => <BookOpen size={24} className={latestResult && latestResult.grade !== 'F' ? 'text-green-500' : 'text-orange-500'} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <div className="card lg:col-span-1 shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <LineChartIcon size={20} className="text-gray-400" />
            <h3 className="card-title mb-0">Score Distribution</h3>
          </div>
          
          <div className="flex-1 min-h-[250px] w-full">
            {!loading && chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis dataKey="subject" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} width={80} />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                  />
                  <Bar dataKey="score" name="Score (%)" radius={[0, 4, 4, 0]} barSize={16}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.isPass ? '#3b82f6' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center border-2 border-dashed border-gray-100 rounded-xl">
                <p className="text-gray-400 text-sm">No data for chart</p>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Results Table */}
        <div className="card lg:col-span-2 shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="card-title mb-0">Detailed Performance</h3>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Show Passed Only</span>
              <button
                type="button"
                onClick={() => setShowOnlyPassed((v) => !v)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${showOnlyPassed ? 'bg-blue-600' : 'bg-gray-200'}`}
              >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${showOnlyPassed ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-widest font-black">
                <tr>
                  <th className="px-4 py-3 text-left rounded-tl-xl">Subject</th>
                  <th className="px-4 py-3 text-left">Exam</th>
                  <th className="px-4 py-3 text-center">Marks</th>
                  <th className="px-4 py-3 text-right rounded-tr-xl">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {!loading && filteredRows.map((row, i) => (
                  <tr key={`${row.examName}-${row.subjectName}-${i}`} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-4 py-4">
                      <p className="font-bold text-gray-800">{row.subjectName || '-'}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">Teacher: {student?.classTeacherName || 'N/A'}</p>
                    </td>
                    <td className="px-4 py-4 text-gray-600">{row.examName || '-'}</td>
                    <td className="px-4 py-4 text-center">
                      <span className="font-medium text-gray-800">{row.marksObtained ?? 0}</span>
                      <span className="text-gray-400 mx-1">/</span>
                      <span className="text-gray-500 text-xs">{row.totalMarks ?? 100}</span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <StatusBadge 
                        status={row.grade || '-'} 
                        variant={gradePoint(row.grade) >= 2.0 ? 'green' : 'red'} 
                      />
                    </td>
                  </tr>
                ))}
                {!loading && filteredRows.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-12 text-center text-gray-400 italic">No report entries found matching criteria.</td>
                  </tr>
                )}
                {loading && (
                  <tr>
                    <td colSpan={4} className="px-4 py-12 text-center text-gray-400">Loading report card data...</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCardPage;
