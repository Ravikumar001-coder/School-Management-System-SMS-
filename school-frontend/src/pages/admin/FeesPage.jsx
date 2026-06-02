import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import { feeApi } from '../../api/feeApi';
import { studentApi } from '../../api/studentApi';
import { fileApi } from '../../api/fileApi';

const FeesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [payments, setPayments]   = useState([]);
  const [monthly, setMonthly]     = useState(null);
  const [studentsMap, setStudentsMap] = useState({});
  const [success, setSuccess]     = useState('');
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(true);

  const { showToast } = useToast();

  useEffect(() => {
    if (location.state?.successMessage) {
      showToast(location.state.successMessage, 'success');
    }

    const now = new Date();
    Promise.all([
      feeApi.all(),
      feeApi.monthlyReport(now.getMonth() + 1, now.getFullYear()),
      studentApi.getAll(0, 200),
    ]).then(([allRes, mRes, sRes]) => {
      const allPayments = allRes.data.data || [];
      const studentList = sRes.data?.data?.content || [];

      const index = {};
      studentList.forEach((s) => {
        index[String(s.studentId)] = s;
      });

      setPayments(allPayments);
      setMonthly(mRes.data.data);
      setStudentsMap(index);
    }).catch((err) => {
      showToast(err.response?.data?.message || 'Failed to load fee overview.', 'error');
    }).finally(() => setLoading(false));
  }, [location.state]);

  const getStatusMeta = (status) => {
    const key = (status || '').toUpperCase();
    if (key === 'PAID') return { label: 'Paid', cls: 'bg-green-100 text-green-800' };
    if (key === 'OVERDUE') return { label: 'Overdue', cls: 'bg-red-100 text-red-800' };
    if (key === 'PARTIAL') return { label: 'Partial', cls: 'bg-amber-100 text-amber-800' };
    if (key === 'PENDING') return { label: 'Pending', cls: 'bg-yellow-100 text-yellow-800' };
    return { label: key || 'Pending', cls: 'bg-gray-100 text-gray-700' };
  };

  const currentMonthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date());
  const dueThisMonth = payments
    .filter((p) => ['PENDING', 'OVERDUE'].includes((p.status || '').toUpperCase()))
    .filter((p) => {
      const monthText = String(p.month || '').toLowerCase();
      return monthText.includes(currentMonthName.toLowerCase());
    })
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const pendingAmount = payments
    .filter((p) => ['PENDING', 'OVERDUE'].includes((p.status || '').toUpperCase()))
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const collectedAmount = payments
    .filter((p) => (p.status || '').toUpperCase() === 'PAID')
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const recentRows = payments.slice(0, 12);

  const formatInr = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;

  return (
    <>
      <PageHeader title="School Monthly Fees Overview"
        subtitle="Home > Academic > Fees Page"
        action={
          <button onClick={() => navigate('/admin/fees/collect')}
            className="bg-[#1E40AF] text-white px-6 py-3 rounded-[16px] hover:bg-[#1E3A8A] font-bold text-sm min-h-[44px] shadow-md">
            Collect Fee
          </button>
        }
      />

      {loading ? <LoadingSpinner /> : (
      <>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <div className="bg-white rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9] overflow-hidden">
          <div className="p-4 flex items-start justify-between">
            <div>
              <p className="text-2xl font-bold text-green-700">{formatInr(monthly?.totalCollection ?? collectedAmount)}</p>
              <p className="text-lg font-semibold text-gray-800">Collected Fees</p>
            </div>
            <span className="text-2xl">📊</span>
          </div>
          <div className="bg-blue-50 text-blue-900 text-sm px-4 py-2.5">Total collected this term</div>
        </div>

        <div className="bg-white rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9] overflow-hidden">
          <div className="p-4 flex items-start justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{formatInr(monthly?.totalPending ?? pendingAmount)}</p>
              <p className="text-lg font-semibold text-gray-800">Pending Fees</p>
            </div>
            <span className="text-2xl">📄</span>
          </div>
          <div className="bg-indigo-50 text-indigo-900 text-sm px-4 py-2.5">Outstanding amount</div>
        </div>

        <div className="bg-white rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9] overflow-hidden">
          <div className="p-4 flex items-start justify-between">
            <div>
              <p className="text-2xl font-bold text-green-700">{formatInr(dueThisMonth)}</p>
              <p className="text-lg font-semibold text-gray-800">Due this Month</p>
            </div>
            <span className="text-2xl">💵</span>
          </div>
          <div className="bg-green-50 text-green-900 text-sm px-4 py-2.5">Expected payments</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
        {recentRows.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">🎉</div>
            <p className="text-gray-500">No fee records found</p>
          </div>
        ) : (
          <table className="w-full text-sm min-w-[980px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['ID','Student Name','Class','Roll No.','Fee Type','Amount','Due Date','Status','Actions']
                  .map(h => (
                  <th key={h}
                    className="text-left px-5 py-3 text-gray-600 
                               font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {recentRows.map((p, i) => {
                const info = studentsMap[String(p.studentCode)] || null;
                const status = getStatusMeta(p.status);
                return (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="px-5 py-3">{121 + i}</td>
                  <td className="px-5 py-3 font-medium text-gray-800">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 overflow-hidden flex items-center justify-center text-blue-700 text-xs font-bold">
                        {info?.profilePhoto ? (
                          <img src={fileApi.toPublicUrl(info.profilePhoto)} alt={p.studentName} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <>{p.studentName?.split(' ').map((n) => n[0]).join('').slice(0, 2)}</>
                        )}
                      </div>
                      <span>{p.studentName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">{info?.className || 'A11'}</td>
                  <td className="px-5 py-3">{String(p.studentCode || '').replace(/\D/g, '').slice(-4) || `00${i + 10}`}</td>
                  <td className="px-5 py-3">{String(p.month || '').toLowerCase().includes('library') ? 'Library' : 'Tuition'}</td>
                  <td className="px-5 py-3 text-gray-900 font-semibold">
                    {formatInr(p.amount)}
                  </td>
                  <td className="px-5 py-3 text-gray-600">{p.paymentDate || '-'}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${status.cls}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3 text-sm">
                      <button
                        onClick={() => {
                          const target = info?.id ? `/admin/fees/collect?studentId=${info.id}` : '/admin/fees/collect';
                          navigate(target);
                        }}
                        className="text-blue-700 hover:text-blue-900 font-medium"
                      >
                        Collect Fee
                      </button>
                      <button
                        onClick={() => navigate(`/admin/fees/invoice/${p.id}`)}
                        className="text-gray-700 hover:text-gray-900 font-medium"
                      >
                        View Invoice
                      </button>
                    </div>
                  </td>
                </tr>
              );})}
            </tbody>
          </table>
        )}
      </div>
      </>
      )}
    </>
  );
};

export default FeesPage;
