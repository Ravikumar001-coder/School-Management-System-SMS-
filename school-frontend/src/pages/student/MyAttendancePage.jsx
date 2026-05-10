import React, { useMemo, useState } from 'react';
import { attendanceApi } from '../../api/attendanceApi';
import { useAuth } from '../../context/AuthContext';

const MyAttendancePage = () => {
  const { user } = useAuth();
  const studentId = user?.studentId;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [from, setFrom] = useState('2024-01-01');
  const [to, setTo] = useState(
    new Date().toISOString().split('T')[0]);
  const [viewMonth, setViewMonth] = useState(() => new Date());

  const fetchReport = async () => {
    if (!studentId) {
      setError('Student profile is not linked to this account.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await attendanceApi.studentReport(studentId, from, to);
      setData(res.data.data);
      setViewMonth(new Date(to));
    } catch (e) {
      setError('Failed to load attendance report.');
    }
    finally { setLoading(false); }
  };

  const monthMeta = useMemo(() => {
    const current = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
    const firstWeekday = current.getDay();
    const totalDays = new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstWeekday; i += 1) {
      cells.push(null);
    }
    for (let day = 1; day <= totalDays; day += 1) {
      cells.push(new Date(current.getFullYear(), current.getMonth(), day));
    }
    return {
      title: current.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
      cells,
    };
  }, [viewMonth]);

  const recordByDate = useMemo(() => {
    const map = new Map();
    (data?.records || []).forEach((r) => {
      map.set(r.date, r.status);
    });
    return map;
  }, [data]);

  const subjectStats = useMemo(() => {
    const grouped = {};
    (data?.records || []).forEach((r) => {
      const key = r.subjectName || 'General';
      if (!grouped[key]) {
        grouped[key] = { subject: key, total: 0, attended: 0, absent: 0, late: 0 };
      }
      grouped[key].total += 1;
      if (r.status === 'PRESENT') grouped[key].attended += 1;
      if (r.status === 'ABSENT') grouped[key].absent += 1;
      if (r.status === 'LATE') grouped[key].late += 1;
    });
    return Object.values(grouped).map((x) => ({
      ...x,
      percent: x.total ? ((x.attended / x.total) * 100).toFixed(1) : '0.0',
    }));
  }, [data]);

  const absentDays = data?.records?.filter((r) => r.status === 'ABSENT').length || 0;
  const lateDays = data?.records?.filter((r) => r.status === 'LATE').length || 0;

  const moveMonth = (delta) => {
    setViewMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  const getDateKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const dayCellClass = (status) => {
    if (status === 'PRESENT') return 'bg-green-400 text-white';
    if (status === 'ABSENT') return 'bg-red-400 text-white';
    if (status === 'LATE') return 'bg-amber-300 text-slate-800';
    return 'bg-slate-200 text-slate-700';
  };

  const cardShadow = { boxShadow: '0 2px 12px rgba(15, 23, 42, 0.08)' };

  const downloadReport = () => {
    if (!data?.records?.length) {
      setError('No attendance data available to download.');
      return;
    }

    const lines = [
      'Attendance Report',
      `Student,${`${user?.firstName || ''} ${user?.lastName || ''}`.trim()}`,
      `From,${from}`,
      `To,${to}`,
      `Total Days,${data.totalDays || 0}`,
      `Present,${data.present || 0}`,
      `Absent,${data.absent || 0}`,
      `Percentage,${data.percentage || 0}%`,
      '',
      'Date,Subject,Status,Remarks',
    ];

    data.records.forEach((row) => {
      const safeSubject = (row.subjectName || '').replace(/,/g, ' ');
      const safeRemarks = (row.remarks || '').replace(/,/g, ' ');
      lines.push(`${row.date || ''},${safeSubject},${row.status || ''},${safeRemarks}`);
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const fileName = `attendance-report-${studentId || 'student'}-${to}.csv`;
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="mb-3 text-sm font-medium text-gray-500">Home {'>'} Academic {'>'} My Attendance ({user?.role || 'S'})</div>
      <h1 className="mb-5 text-[48px] font-semibold leading-none tracking-tight text-slate-900">My Attendance</h1>

      <div className="mb-5 rounded-2xl bg-white p-5" style={cardShadow}>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">From</label>
            <input type="date" value={from}
              onChange={e => setFrom(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">To</label>
            <input type="date" value={to}
              onChange={e => setTo(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <button onClick={fetchReport}
            className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800">
            Get Report
          </button>
          <button
            type="button"
            onClick={downloadReport}
            className="rounded-lg bg-slate-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!data?.records?.length}
          >
            Download Attendance Report
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && (
        <div className="rounded-2xl bg-white p-8 text-center" style={cardShadow}>
          <p className="text-sm text-gray-600">Loading attendance report...</p>
        </div>
      )}

      {data && !loading && (
        <>
          <div className="mb-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {[
              {
                label: 'Overall Attendance',
                value: `${data.percentage || 0}%`,
                sub: 'All classes',
                color: 'from-green-50 to-emerald-100',
                icon: '📊',
              },
              {
                label: 'Absent Days',
                value: absentDays,
                sub: 'Total this term',
                color: 'from-slate-50 to-indigo-100',
                icon: '📄',
              },
              {
                label: 'Late Days',
                value: lateDays,
                sub: 'Requires promptness',
                color: 'from-yellow-50 to-amber-100',
                icon: '💵',
              },
            ].map((s, i) => (
              <div key={i}
                className={`rounded-2xl bg-gradient-to-r px-5 py-4 ${s.color}`}
                style={cardShadow}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[35px] font-medium leading-tight text-slate-900">{s.label}</p>
                    <p className="mt-1 text-[52px] font-bold leading-none text-slate-900">{s.value}</p>
                    <p className="mt-2 text-[24px] leading-tight text-slate-600">{s.sub}</p>
                  </div>
                  <span className="text-4xl text-slate-500">{s.icon}</span>
                </div>
              </div>
            ))}
          </div>

          {data.percentage < 75 && (
            <div className="bg-red-50 border border-red-200 
                            text-red-700 p-4 rounded-xl mb-5 text-sm">
              ⚠️ Your attendance is below 75%. 
              Please attend classes regularly.
            </div>
          )}

          <div className="mb-5 rounded-2xl bg-white p-4" style={cardShadow}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <button type="button" onClick={() => moveMonth(-1)} className="rounded-lg border px-3 py-1 text-lg text-slate-600 hover:bg-slate-100">{'<'}</button>
                <p className="text-3xl font-semibold text-slate-800">{monthMeta.title}</p>
                <button type="button" onClick={() => moveMonth(1)} className="rounded-lg border px-3 py-1 text-lg text-slate-600 hover:bg-slate-100">{'>'}</button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500">Mark All Present</span>
                <button
                  type="button"
                  className="relative h-7 w-14 cursor-not-allowed rounded-full bg-blue-600/70"
                  title="Students cannot mark attendance"
                  disabled
                >
                  <span className="absolute right-1 top-1 h-5 w-5 rounded-full bg-white" />
                </button>
              </div>
            </div>

            <div className="mb-4 grid grid-cols-7 gap-2 text-center text-[15px] font-semibold text-slate-600">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div key={d} className="rounded-lg bg-slate-100 py-2">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {monthMeta.cells.map((cell, idx) => {
                if (!cell) {
                  return <div key={`empty-${idx}`} className="h-10 rounded-lg bg-slate-100/50" />;
                }
                const key = getDateKey(cell);
                const status = recordByDate.get(key);
                return (
                  <div key={key} className={`flex h-10 items-center justify-center rounded-lg text-[14px] font-semibold ${dayCellClass(status)}`}>
                    {cell.getDate()}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <span className="inline-flex items-center gap-2 text-slate-700"><span className="inline-block h-3 w-3 rounded-full bg-green-400" />Present</span>
              <span className="inline-flex items-center gap-2 text-slate-700"><span className="inline-block h-3 w-3 rounded-full bg-red-400" />Absent</span>
              <span className="inline-flex items-center gap-2 text-slate-700"><span className="inline-block h-3 w-3 rounded-full bg-amber-300" />Late</span>
              <span className="inline-flex items-center gap-2 text-slate-700"><span className="inline-block h-3 w-3 rounded-full bg-slate-300" />No Entry</span>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl bg-white" style={cardShadow}>
            <table className="w-full text-[15px]">
              <thead className="border-b bg-slate-50">
                <tr>
                  <th className="px-5 py-3.5 text-left text-[14px] font-semibold text-slate-700">Subject</th>
                  <th className="px-5 py-3.5 text-left text-[14px] font-semibold text-slate-700">Total Classes</th>
                  <th className="px-5 py-3.5 text-left text-[14px] font-semibold text-slate-700">Attended</th>
                  <th className="px-5 py-3.5 text-left text-[14px] font-semibold text-slate-700">Attendance %</th>
                  <th className="px-5 py-3.5 text-left text-[14px] font-semibold text-slate-700">Details</th>
                </tr>
              </thead>
              <tbody>
                {subjectStats.map((row) => (
                  <tr key={row.subject} className="border-b hover:bg-slate-50">
                    <td className="px-5 py-3.5 text-slate-800">{row.subject}</td>
                    <td className="px-5 py-3.5 text-slate-700">{row.total}</td>
                    <td className="px-5 py-3.5 text-slate-700">{row.attended}</td>
                    <td className="px-5 py-3.5 text-slate-700">{row.percent}%</td>
                    <td className="px-5 py-3.5">
                      <span className="text-blue-700">View Subject Calendar</span>
                    </td>
                  </tr>
                ))}
                {!subjectStats.length && (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-slate-500">No attendance records in this range.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!loading && !data && (
        <div className="rounded-2xl bg-white p-10 text-center" style={cardShadow}>
          <p className="text-sm text-slate-600">Choose a date range and click Get Report.</p>
        </div>
      )}
    </>
  );
};

export default MyAttendancePage;
