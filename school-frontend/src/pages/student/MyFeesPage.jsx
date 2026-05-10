import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { feeApi } from '../../api/feeApi';
import { studentApi } from '../../api/studentApi';
import { classApi } from '../../api/classApi';
import { summarizeStudentFees } from '../../utils/feeCalculations';

const cardShadow = { boxShadow: '0 2px 12px rgba(15, 23, 42, 0.08)' };

const statusClass = (status) => {
  const key = (status || '').toUpperCase();
  if (key === 'PAID') return 'bg-green-100 text-green-800';
  if (key === 'PENDING' || key === 'PARTIAL') return 'bg-amber-100 text-amber-800';
  if (key === 'OVERDUE') return 'bg-red-100 text-red-800';
  return 'bg-gray-100 text-gray-700';
};

const money = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;

const MyFeesPage = () => {
  const { user } = useAuth();
  const studentId = user?.studentId;

  const [classes, setClasses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showOnlyPaid, setShowOnlyPaid] = useState(false);

  useEffect(() => {
    if (!studentId) {
      setLoading(false);
      setError('Student profile is not linked to this account.');
      return;
    }

    Promise.all([
      feeApi.studentFees(studentId),
      studentApi.getById(studentId),
      classApi.getAll(),
    ]).then(([payRes, stuRes, classRes]) => {
      setPayments(payRes?.data?.data || []);
      setStudent(stuRes?.data?.data || stuRes?.data || null);
      setClasses(classRes?.data?.data || []);
      setError('');
    }).catch(() => {
      setError('Unable to load fee details right now.');
    }).finally(() => {
      setLoading(false);
    });
  }, [studentId]);

  const filteredPayments = useMemo(() => (
    showOnlyPaid ? payments.filter((p) => (p.status || '').toUpperCase() === 'PAID') : payments
  ), [payments, showOnlyPaid]);

  const feeSummary = useMemo(
    () => summarizeStudentFees({ student, classes, payments, dateValue: new Date() }),
    [student, classes, payments]
  );

  const lastPayment = useMemo(() => {
    const paidRows = payments
      .filter((p) => (p.status || '').toUpperCase() === 'PAID')
      .sort((a, b) => new Date(b.paymentDate || 0) - new Date(a.paymentDate || 0));
    return paidRows[0]?.paymentDate || '-';
  }, [payments]);

  const downloadFeeReport = () => {
    if (!payments.length) {
      setError('No fee records available to download.');
      return;
    }

    const lines = [
      'Fee Report',
      `Student,${`${user?.firstName || ''} ${user?.lastName || ''}`.trim()}`,
      `School ID,${student?.studentId || '-'}`,
      `Total Paid,${feeSummary.totalPaid || 0}`,
      `Pending Amount,${feeSummary.pendingAmount || 0}`,
      '',
      'Fee Type,Amount,Due Date,Paid Date,Payment Method,Status,Receipt Number',
    ];

    payments.forEach((p) => {
      lines.push([
        p.month || p.paymentType || '-',
        p.amount ?? 0,
        p.dueDate || '-',
        p.paymentDate || '-',
        p.paymentMethod || '-',
        p.status || '-',
        p.receiptNumber || '-',
      ].join(','));
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fee-report-${student?.studentId || studentId}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="mb-2 text-sm text-gray-500">Home {'>'} Student {'>'} Fees</div>

      <div className="mb-5 rounded-2xl bg-gradient-to-r from-slate-100 via-blue-100 to-cyan-100 p-5 shadow-sm border border-blue-100">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">My Fees</h1>
            <p className="text-sm text-slate-700 mt-1">Monthly class fee and one-time admission fee summary.</p>
          </div>
          <button
            type="button"
            onClick={downloadFeeReport}
            className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
          >
            Download Fee Report
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100 p-4" style={cardShadow}>
          <p className="text-sm text-gray-700">Student</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{`${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Student'}</p>
          <p className="text-sm text-gray-700 mt-2">School ID: {student?.studentId || '-'}</p>
        </div>

        <div className="rounded-xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-emerald-100 p-4" style={cardShadow}>
          <p className="text-sm text-gray-700">Total Paid</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{money(feeSummary.totalPaid)}</p>
          <p className="text-xs text-gray-600 mt-2">Last Payment Date: {lastPayment}</p>
        </div>

        <div className="rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-indigo-100 p-4" style={cardShadow}>
          <p className="text-sm text-gray-700">Pending Now</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{money(feeSummary.pendingAmount)}</p>
          <p className="text-xs text-gray-600 mt-2">{feeSummary.dueNow.length} pending item(s)</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-4 mb-4 border border-gray-100">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">Current Dues</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-3 py-2.5 font-semibold text-gray-700">Fee Type</th>
                <th className="text-left px-3 py-2.5 font-semibold text-gray-700">Total</th>
                <th className="text-left px-3 py-2.5 font-semibold text-gray-700">Paid</th>
                <th className="text-left px-3 py-2.5 font-semibold text-gray-700">Balance</th>
                <th className="text-left px-3 py-2.5 font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {feeSummary.currentDueItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-3 py-2.5">{item.label}</td>
                  <td className="px-3 py-2.5">{money(item.total)}</td>
                  <td className="px-3 py-2.5">{money(item.paid)}</td>
                  <td className="px-3 py-2.5 font-semibold">{money(item.balance)}</td>
                  <td className="px-3 py-2.5">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(item.status)}`}>{item.status}</span>
                  </td>
                </tr>
              ))}
              {!feeSummary.currentDueItems.length && (
                <tr>
                  <td colSpan={5} className="px-3 py-6 text-center text-gray-500">No fee setup found for your class.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white" style={cardShadow}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-slate-50 px-4 py-2.5">
          <div className="flex items-center gap-3">
            <span className="text-slate-700 font-medium">Payment History</span>
            <button
              type="button"
              onClick={() => setShowOnlyPaid((v) => !v)}
              className={`relative h-7 w-14 rounded-full transition ${showOnlyPaid ? 'bg-blue-700' : 'bg-slate-300'}`}
            >
              <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${showOnlyPaid ? 'right-1' : 'left-1'}`} />
            </button>
            <span className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700">{showOnlyPaid ? 'Paid Only' : 'All Records'}</span>
          </div>
          <button
            type="button"
            onClick={downloadFeeReport}
            className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Download CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[15px]">
            <thead className="border-b bg-slate-100">
              <tr>
                {['Fee Type', 'Amount', 'Due Date', 'Paid Date', 'Payment Method', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-[14px] font-semibold text-slate-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {!loading && filteredPayments.map((p, i) => (
                <tr key={`${p.receiptNumber || i}`} className="border-b hover:bg-slate-50">
                  <td className="px-5 py-3.5 text-slate-800">{p.month || p.paymentType || '-'}</td>
                  <td className="px-5 py-3.5 text-slate-700">{money(p.amount)}</td>
                  <td className="px-5 py-3.5 text-slate-700">{p.dueDate || '-'}</td>
                  <td className="px-5 py-3.5 text-slate-700">{p.paymentDate || '-'}</td>
                  <td className="px-5 py-3.5 text-slate-700">{p.paymentMethod || 'Payment'}</td>
                  <td className="px-5 py-3.5">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClass(p.status)}`}>{p.status || '-'}</span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-700">
                    <div className="flex items-center gap-3 whitespace-nowrap">
                      <button type="button" className="text-blue-700 hover:underline">View Invoice</button>
                      <button type="button" className="text-sky-700 hover:underline" onClick={downloadFeeReport}>Download</button>
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && filteredPayments.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-slate-500">No fee records found.</td>
                </tr>
              )}

              {loading && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-slate-500">Loading fee records...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default MyFeesPage;
