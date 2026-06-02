// src/pages/student/MyFeesPage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { feeApi } from '../../api/feeApi';
import { studentApi } from '../../api/studentApi';
import { classApi } from '../../api/classApi';
import { summarizeStudentFees } from '../../utils/feeCalculations';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import { Download, CreditCard, CheckCircle, AlertTriangle, FileText, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const statusClass = (status) => {
  const key = (status || '').toUpperCase();
  if (key === 'PAID') return 'green';
  if (key === 'PENDING' || key === 'PARTIAL') return 'yellow';
  if (key === 'OVERDUE') return 'red';
  return 'gray';
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

  const chartData = useMemo(() => {
    return [
      { name: 'Paid', value: feeSummary.totalPaid, color: '#10b981' },
      { name: 'Pending', value: feeSummary.pendingAmount, color: '#f59e0b' },
    ].filter(d => d.value > 0);
  }, [feeSummary]);

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
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader 
          title="My Fees"
          subtitle="Manage your payments and view ledger"
          className="!mb-0"
        />
        <button
          type="button"
          onClick={downloadFeeReport}
          className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-2.5 text-sm font-bold text-blue-700 hover:bg-blue-100 shadow-sm flex items-center gap-2"
        >
          <Download size={18} />
          Download Statement
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex items-center gap-2">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Paid" 
          value={money(feeSummary.totalPaid)} 
          subtitle={`Last Payment: ${lastPayment}`}
          variant="green" 
          icon={() => <CheckCircle size={24} className="text-green-500" />}
        />
        <StatCard 
          title="Pending Now" 
          value={money(feeSummary.pendingAmount)} 
          subtitle={`${feeSummary.dueNow.length} pending item(s)`}
          variant="orange" 
          icon={() => <AlertTriangle size={24} className="text-orange-500" />}
        />
        <StatCard 
          title="Total Fees" 
          value={money(feeSummary.totalPaid + feeSummary.pendingAmount)} 
          subtitle="Current Academic Year"
          variant="blue" 
          icon={() => <CreditCard size={24} className="text-blue-500" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fee Distribution Chart */}
        <div className="card lg:col-span-1 shadow-sm border border-gray-100 flex flex-col">
          <h3 className="card-title mb-6 flex items-center gap-2">
            <PieChartIcon size={18} className="text-gray-400" />
            Fee Distribution
          </h3>
          <div className="flex-1 min-h-[250px] w-full flex items-center justify-center">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => money(value)}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center border-2 border-dashed border-gray-100 rounded-xl w-full">
                <p className="text-gray-400 text-sm">No fee data available.</p>
              </div>
            )}
          </div>
        </div>

        {/* Current Dues Table */}
        <div className="card lg:col-span-2 shadow-sm border border-gray-100">
          <h3 className="card-title mb-6 flex items-center gap-2">
            <AlertTriangle size={18} className="text-gray-400" />
            Current Dues
          </h3>
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-widest font-black">
                <tr>
                  <th className="px-4 py-3 text-left">Fee Type</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3 text-right">Paid</th>
                  <th className="px-4 py-3 text-right">Balance</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {feeSummary.currentDueItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-4 font-bold text-gray-800">{item.label}</td>
                    <td className="px-4 py-4 text-right text-gray-600">{money(item.total)}</td>
                    <td className="px-4 py-4 text-right text-gray-600">{money(item.paid)}</td>
                    <td className="px-4 py-4 text-right font-bold text-gray-900">{money(item.balance)}</td>
                    <td className="px-4 py-4 text-center">
                      <StatusBadge status={item.status} variant={statusClass(item.status)} />
                    </td>
                  </tr>
                ))}
                {!feeSummary.currentDueItems.length && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-gray-400 italic">No pending dues found!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="card shadow-sm border border-gray-100 p-0 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b bg-gray-50/50 p-4">
          <h3 className="card-title mb-0 flex items-center gap-2">
            <FileText size={18} className="text-gray-400" />
            Payment History
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Show Paid Only</span>
            <button
              type="button"
              onClick={() => setShowOnlyPaid((v) => !v)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${showOnlyPaid ? 'bg-blue-600' : 'bg-gray-200'}`}
            >
              <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${showOnlyPaid ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        {/* Mobile View (Cards) */}
        <div className="md:hidden divide-y divide-gray-100">
          {!loading && filteredPayments.map((p, i) => (
            <div key={`${p.receiptNumber || i}`} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-gray-900">{p.month || p.paymentType || '-'}</h4>
                  <p className="text-sm font-bold text-blue-600">{money(p.amount)}</p>
                </div>
                <StatusBadge status={p.status || '-'} variant={statusClass(p.status)} />
              </div>
              <div className="text-xs text-gray-500 mb-3 space-y-1">
                <p>Due: <span className="font-medium text-gray-700">{p.dueDate || '-'}</span></p>
                <p>Paid: <span className="font-medium text-gray-700">{p.paymentDate || '-'}</span> via {p.paymentMethod || 'Payment'}</p>
              </div>
              <button type="button" className="w-full bg-white border border-gray-200 rounded-lg py-1.5 text-xs font-bold text-gray-700 flex justify-center items-center shadow-sm">
                View Invoice
              </button>
            </div>
          ))}
        </div>

        {/* Desktop View (Table) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-widest font-black">
              <tr>
                <th className="px-5 py-3 text-left">Fee Type</th>
                <th className="px-5 py-3 text-right">Amount</th>
                <th className="px-5 py-3 text-center">Due Date</th>
                <th className="px-5 py-3 text-center">Paid Date</th>
                <th className="px-5 py-3 text-center">Method</th>
                <th className="px-5 py-3 text-center">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {!loading && filteredPayments.map((p, i) => (
                <tr key={`${p.receiptNumber || i}`} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-5 py-4 font-bold text-gray-800">{p.month || p.paymentType || '-'}</td>
                  <td className="px-5 py-4 text-right font-bold text-gray-800">{money(p.amount)}</td>
                  <td className="px-5 py-4 text-center text-gray-600">{p.dueDate || '-'}</td>
                  <td className="px-5 py-4 text-center text-gray-600">{p.paymentDate || '-'}</td>
                  <td className="px-5 py-4 text-center text-gray-600">{p.paymentMethod || 'Payment'}</td>
                  <td className="px-5 py-4 text-center">
                    <StatusBadge status={p.status || '-'} variant={statusClass(p.status)} />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button type="button" className="text-blue-600 hover:text-blue-800 font-medium hover:underline text-xs">
                      View Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && filteredPayments.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <FileText size={32} className="mx-auto mb-3 opacity-50" />
            <p>No payment records found.</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
            <p className="text-gray-500">Loading fee records...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyFeesPage;
