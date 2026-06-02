// src/pages/student/MyAttendancePage.jsx
import React, { useMemo, useState } from 'react';
import { attendanceApi } from '../../api/attendanceApi';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import Button from '../../components/common/Button';
import { Calendar, Download, PieChart, Activity, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

const MyAttendancePage = () => {
  const { user } = useAuth();
  const studentId = user?.studentId;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Use current month start and end as default
  const [from, setFrom] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0];
  });
  const [to, setTo] = useState(new Date().toISOString().split('T')[0]);
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
      title: current.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
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
      percentNum: x.total ? Math.round((x.attended / x.total) * 100) : 0
    }));
  }, [data]);

  const absentDays = data?.records?.filter((r) => r.status === 'ABSENT').length || 0;
  const lateDays = data?.records?.filter((r) => r.status === 'LATE').length || 0;

  const moveMonth = (delta) => {
    setViewMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  const getDateKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const dayCellClass = (status) => {
    if (status === 'PRESENT') return 'bg-green-100 text-green-700 font-bold border border-green-200';
    if (status === 'ABSENT') return 'bg-red-100 text-red-700 font-bold border border-red-200';
    if (status === 'LATE') return 'bg-amber-100 text-amber-700 font-bold border border-amber-200';
    return 'bg-white text-gray-500 border border-gray-100';
  };

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
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader 
          title="My Attendance"
          subtitle="Track your daily class presence and statistics"
          className="!mb-0"
        />
      </div>

      <div className="card shadow-sm border border-gray-100 p-5">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-gray-500">From Date</label>
            <input type="date" value={from}
              onChange={e => setFrom(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-gray-500">To Date</label>
            <input type="date" value={to}
              onChange={e => setTo(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button onClick={fetchReport} variant="primary" className="flex-1 md:flex-none py-2.5">
              Get Report
            </Button>
            <Button
              onClick={downloadReport}
              variant="outline"
              className="flex-1 md:flex-none flex items-center justify-center gap-2 py-2.5"
              disabled={!data?.records?.length}
            >
              <Download size={16} />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex items-center gap-2">
          <AlertTriangle size={18} />
          {error}
        </div>
      )}

      {loading && (
        <div className="card text-center p-12 shadow-sm border border-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-sm text-gray-500">Loading attendance data...</p>
        </div>
      )}

      {data && !loading && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
              title="Overall Attendance" 
              value={`${data.percentage || 0}%`} 
              subtitle="Current Selection"
              variant={data.percentage >= 75 ? "green" : "red"} 
              icon={() => <PieChart size={24} className={data.percentage >= 75 ? "text-green-500" : "text-red-500"} />}
            />
            <StatCard 
              title="Absent Days" 
              value={absentDays} 
              subtitle="Total missed"
              variant="orange" 
              icon={() => <AlertTriangle size={24} className="text-orange-500" />}
            />
            <StatCard 
              title="Late Days" 
              value={lateDays} 
              subtitle="Tardiness count"
              variant="yellow" 
              icon={() => <Activity size={24} className="text-yellow-500" />}
            />
          </div>

          {data.percentage < 75 && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm flex items-start gap-3 shadow-sm">
              <AlertTriangle size={20} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Attendance Warning</p>
                <p>Your attendance is below 75%. Please ensure you attend classes regularly to meet academic requirements.</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar View */}
            <div className="card lg:col-span-1 shadow-sm border border-gray-100 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="card-title mb-0 flex items-center gap-2">
                  <Calendar size={18} className="text-gray-400" />
                  Calendar View
                </h3>
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1 border border-gray-100">
                  <button type="button" onClick={() => moveMonth(-1)} className="p-1 rounded hover:bg-white hover:shadow-sm text-gray-600 transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <span className="text-xs font-bold text-gray-700 min-w-[80px] text-center">{monthMeta.title}</span>
                  <button type="button" onClick={() => moveMonth(1)} className="p-1 rounded hover:bg-white hover:shadow-sm text-gray-600 transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                  <div key={d} className="text-[10px] font-black uppercase text-gray-400 py-1">{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 flex-1">
                {monthMeta.cells.map((cell, idx) => {
                  if (!cell) {
                    return <div key={`empty-${idx}`} className="aspect-square rounded-lg bg-transparent" />;
                  }
                  const key = getDateKey(cell);
                  const status = recordByDate.get(key);
                  return (
                    <div key={key} className={`aspect-square flex items-center justify-center rounded-lg text-xs transition-all ${dayCellClass(status)}`}>
                      {cell.getDate()}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 text-gray-600"><span className="w-3 h-3 rounded-full bg-green-100 border border-green-200"></span> Present</div>
                <div className="flex items-center gap-2 text-gray-600"><span className="w-3 h-3 rounded-full bg-red-100 border border-red-200"></span> Absent</div>
                <div className="flex items-center gap-2 text-gray-600"><span className="w-3 h-3 rounded-full bg-amber-100 border border-amber-200"></span> Late</div>
                <div className="flex items-center gap-2 text-gray-600"><span className="w-3 h-3 rounded-full bg-white border border-gray-200"></span> None</div>
              </div>
            </div>

            {/* Subject Stats */}
            <div className="card lg:col-span-2 shadow-sm border border-gray-100">
              <h3 className="card-title mb-6 flex items-center gap-2">
                <Activity size={18} className="text-gray-400" />
                Subject-wise Attendance
              </h3>
              
              <div className="h-[200px] w-full mb-6">
                {subjectStats.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={subjectStats} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#888' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#888' }} domain={[0, 100]} />
                      <Tooltip 
                        cursor={{ fill: '#f8fafc' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value) => [`${value}%`, 'Attendance']}
                      />
                      <Bar dataKey="percentNum" name="Attendance %" radius={[4, 4, 0, 0]} barSize={32}>
                        {subjectStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.percentNum >= 75 ? '#10b981' : '#f43f5e'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center border-2 border-dashed border-gray-100 rounded-xl">
                    <p className="text-gray-400 text-sm">No subject data available.</p>
                  </div>
                )}
              </div>

              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-[10px] uppercase tracking-widest font-black">
                    <tr>
                      <th className="px-4 py-3 text-left">Subject</th>
                      <th className="px-4 py-3 text-center">Total</th>
                      <th className="px-4 py-3 text-center">Attended</th>
                      <th className="px-4 py-3 text-right">Percentage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {subjectStats.map((row) => (
                      <tr key={row.subject} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3 font-bold text-gray-800">{row.subject}</td>
                        <td className="px-4 py-3 text-center text-gray-600">{row.total}</td>
                        <td className="px-4 py-3 text-center text-gray-600">{row.attended}</td>
                        <td className="px-4 py-3 text-right">
                          <span className={`font-bold ${row.percentNum >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                            {row.percent}%
                          </span>
                        </td>
                      </tr>
                    ))}
                    {!subjectStats.length && (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-gray-400">No detailed records found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {!loading && !data && (
        <div className="card text-center p-12 border border-dashed border-gray-200 bg-gray-50/50 shadow-sm">
          <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Select a date range and click Get Report to view your attendance.</p>
        </div>
      )}
    </div>
  );
};

export default MyAttendancePage;
