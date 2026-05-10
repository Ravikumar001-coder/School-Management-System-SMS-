import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { examApi } from '../../api/examApi';
import { studentApi } from '../../api/studentApi';

const cardShadow = { boxShadow: '0 2px 12px rgba(15, 23, 42, 0.08)' };

const getAcademicYear = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const startYear = month >= 4 ? year : year - 1;
  return `${startYear}-${String((startYear + 1) % 100).padStart(2, '0')}`;
};

const gradePoint = (grade) => {
  const map = {
    'A+': 4.0,
    A: 3.8,
    'B+': 3.4,
    B: 3.0,
    C: 2.4,
    D: 1.8,
    F: 0,
  };
  return map[(grade || '').toUpperCase()] ?? 0;
};

const gradeClass = (grade) => {
  const g = (grade || '').toUpperCase();
  if (g === 'A+' || g === 'A') return 'bg-green-100 text-green-800';
  if (g === 'B+' || g === 'B') return 'bg-amber-100 text-amber-800';
  if (g === 'C' || g === 'D') return 'bg-blue-100 text-blue-800';
  if (g === 'F') return 'bg-red-100 text-red-800';
  return 'bg-gray-100 text-gray-700';
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
    <>
      <div className="mb-3 text-sm font-medium text-gray-500">Home {'>'} Dashboard {'>'} Report Card</div>

      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-[48px] font-semibold leading-none tracking-tight text-slate-900">Report Card</h1>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => document.getElementById('performance-table')?.scrollIntoView({ behavior: 'smooth' })}
            className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
          >
            View Detailed Performance
          </button>
          <button
            type="button"
            onClick={downloadReport}
            className="rounded-lg bg-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-400"
          >
            Download Progress Report
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      <div className="mb-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl bg-gradient-to-r from-slate-50 to-blue-100 px-5 py-4" style={cardShadow}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[35px] font-medium leading-tight text-slate-900">Welcome, {user?.firstName || 'Student'}!</p>
              <p className="mt-1 text-[40px] font-semibold leading-tight text-slate-900">{`${user?.firstName || ''} ${user?.lastName || ''}`.trim()}</p>
              <p className="text-[30px] leading-tight text-slate-700">School ID: {student?.studentId || 'STU001'}</p>
            </div>
            <span className="text-4xl text-blue-400">📊</span>
          </div>
          <p className="mt-3 text-[30px] text-slate-700">Term 1 Performance</p>
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-slate-50 to-indigo-100 px-5 py-4" style={cardShadow}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[35px] font-medium leading-tight text-slate-900">Overall GPA:</p>
              <p className="mt-1 text-[56px] font-bold leading-none text-slate-900">{overallGpa || 0}</p>
              <p className="mt-2 text-[30px] leading-tight text-slate-700">Class: {student?.className || '10-A'}</p>
            </div>
            <span className="text-4xl text-indigo-400">📄</span>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-slate-50 to-green-100 px-5 py-4" style={cardShadow}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[35px] font-medium leading-tight text-slate-900">Recent Results</p>
              <p className="mt-1 text-[52px] font-bold leading-none text-slate-900">{latestResult ? `${latestResult.subjectName}: ${latestResult.grade}` : 'No Data'}</p>
              <p className="mt-2 text-[24px] leading-tight text-slate-700">Exam: {latestResult?.examName || '-'}</p>
            </div>
            <span className="text-4xl text-green-500">💵</span>
          </div>
        </div>
      </div>

      <div id="performance-table" className="overflow-hidden rounded-2xl bg-white" style={cardShadow}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-slate-50 px-4 py-2.5">
          <div className="flex items-center gap-3">
            <span className="text-slate-700">Legend</span>
            <button
              type="button"
              onClick={() => setShowOnlyPassed((v) => !v)}
              className={`relative h-7 w-14 rounded-full transition ${showOnlyPassed ? 'bg-blue-700' : 'bg-slate-300'}`}
            >
              <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${showOnlyPassed ? 'right-1' : 'left-1'}`} />
            </button>
            <span className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700">
              {showOnlyPassed ? 'Passed Grades' : 'All Grades'}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[15px]">
            <thead className="border-b bg-slate-100">
              <tr>
                {['Subject', 'Teacher', 'Midterm 2024', 'Final 2024', 'Overall Term 1', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-[14px] font-semibold text-slate-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {!loading && filteredRows.map((row, i) => (
                <tr key={`${row.examName}-${row.subjectName}-${i}`} className="border-b hover:bg-slate-50">
                  <td className="px-5 py-3.5 text-slate-800">{row.subjectName || '-'}</td>
                  <td className="px-5 py-3.5 text-slate-700">{student?.classTeacherName || 'Class Teacher'}</td>
                  <td className="px-5 py-3.5 text-slate-700">Marks: {row.marksObtained ?? 0} <span className={`ml-1 rounded-full px-2 py-0.5 text-xs font-semibold ${gradeClass(row.grade)}`}>{row.grade || '-'}</span></td>
                  <td className="px-5 py-3.5 text-slate-700">Marks / Grade</td>
                  <td className="px-5 py-3.5">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${gradeClass(row.grade)}`}>{row.grade || '-'}</span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-700">
                    <button
                      type="button"
                      className="text-blue-700 hover:underline"
                      onClick={() => document.getElementById('performance-table')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}

              {!loading && filteredRows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-slate-500">No report entries found.</td>
                </tr>
              )}

              {loading && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-slate-500">Loading report card...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ReportCardPage;
