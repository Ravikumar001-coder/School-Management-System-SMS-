import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import { studentApi } from '../../api/studentApi';
import { feeApi } from '../../api/feeApi';
import { fileApi } from '../../api/fileApi';
import { classApi } from '../../api/classApi';

import usePersistedForm from '../../hooks/usePersistedForm';

const CollectFeePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedStudentId = searchParams.get('studentId');

  const toast = useToast();
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [search, setSearch] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ── Combined State for Persistence ────────────────────────────────────────
  const { 
    formData: state, 
    setFormData: setState,
    clearDraft 
  } = usePersistedForm('fee_collection_form', {
    form: {
      paymentType: 'Class Fee',
      amount: 1,
      paymentMethod: 'Cash',
      paymentDate: new Date().toISOString().split('T')[0],
      transactionId: '',
      note: '',
    },
    selectedRows: []
  });

  const { form, selectedRows } = state;

  const setForm = (newForm) => {
    setState(prev => ({
      ...prev,
      form: typeof newForm === 'function' ? newForm(prev.form) : { ...prev.form, ...newForm }
    }));
  };

  const setSelectedRows = (newRows) => {
    setState(prev => ({
      ...prev,
      selectedRows: typeof newRows === 'function' ? newRows(prev.selectedRows) : newRows
    }));
  };

  useEffect(() => {
    Promise.all([studentApi.getAll(0, 200), classApi.getAll()])
      .then(([studentRes, classRes]) => {
        const list = studentRes.data?.data?.content || [];
        setStudents(list);
        setClasses(classRes.data?.data || []);

        if (preselectedStudentId) {
          const match = list.find((s) => String(s.id) === String(preselectedStudentId));
          if (match) {
            setSelectedStudent(match);
          }
        }
      })
      .catch((err) => toast.error(err.response?.data?.message || 'Failed to load students.'))
      .finally(() => setLoading(false));
  }, [preselectedStudentId]);

  useEffect(() => {
    if (!selectedStudent?.id) {
      setHistory([]);
      setSelectedRows([]);
      return;
    }

    feeApi.studentFees(selectedStudent.id)
      .then((res) => {
        const rows = res.data.data || [];
        setHistory(rows);
        const unpaid = rows
          .filter((r) => !['PAID', 'CANCELLED'].includes((r.status || '').toUpperCase()))
          .map((r) => String(r.id));
        setSelectedRows(unpaid);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Failed to load student fee history.');
      });
  }, [selectedStudent]);

  const selectedClassConfig = useMemo(() => {
    if (!selectedStudent) return null;
    const byId = classes.find((c) => String(c.id) === String(selectedStudent.classRoomId));
    if (byId) return byId;
    return classes.find((c) => `${c.name} - ${c.section}` === selectedStudent.className) || null;
  }, [classes, selectedStudent]);

  const currentMonthLabel = useMemo(
    () => new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date(form.paymentDate)),
    [form.paymentDate]
  );

  const outstandingRows = useMemo(() => {
    if (!selectedStudent) return [];

    const rows = [];
    const classFee = Number(selectedClassConfig?.classFee || 0);
    const admissionFee = Number(selectedClassConfig?.admissionFee || 0);

    const paidClassFeeForMonth = history
      .filter((h) => (h.status || '').toUpperCase() === 'PAID')
      .filter((h) => String(h.month || '').toLowerCase() === `class fee - ${currentMonthLabel}`.toLowerCase())
      .reduce((sum, h) => sum + Number(h.amount || 0), 0);

    const paidAdmissionFee = history
      .filter((h) => (h.status || '').toUpperCase() === 'PAID')
      .filter((h) => String(h.month || '').toLowerCase().startsWith('admission fee'))
      .reduce((sum, h) => sum + Number(h.amount || 0), 0);

    if (classFee > 0) {
      rows.push({
        id: `class-fee-${currentMonthLabel}`,
        month: `Class Fee - ${currentMonthLabel}`,
        amount: classFee,
        paidAmount: Math.min(classFee, paidClassFeeForMonth),
        status: paidClassFeeForMonth >= classFee ? 'PAID' : 'PENDING',
      });
    }

    if (admissionFee > 0) {
      rows.push({
        id: 'admission-fee-one-time',
        month: 'Admission Fee - One Time',
        amount: admissionFee,
        paidAmount: Math.min(admissionFee, paidAdmissionFee),
        status: paidAdmissionFee >= admissionFee ? 'PAID' : 'PENDING',
      });
    }

    if (!rows.length) {
      return history;
    }
    return rows;
  }, [selectedStudent, selectedClassConfig, history, currentMonthLabel]);

  useEffect(() => {
    const defaultSelected = outstandingRows
      .filter((r) => (Number(r.amount || 0) - Number(r.paidAmount || 0)) > 0)
      .map((r) => String(r.id));
    setSelectedRows(defaultSelected);
  }, [outstandingRows]);

  const selectableRows = outstandingRows.filter((r) => !['PAID', 'CANCELLED'].includes((r.status || '').toUpperCase()));
  const totalSelected = selectableRows
    .filter((r) => selectedRows.includes(String(r.id)))
    .reduce((sum, r) => sum + Math.max(0, Number(r.amount || 0) - Number(r.paidAmount || 0)), 0);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      amount: totalSelected > 0 ? totalSelected : 1,
      paymentType: selectedRows.length === 1
        ? (outstandingRows.find((r) => String(r.id) === String(selectedRows[0]))?.month?.split(' - ')[0] || prev.paymentType)
        : prev.paymentType,
    }));
  }, [totalSelected, selectedRows, outstandingRows]);

  const handleSearch = async () => {
    if (!search.trim()) {
      const [studentRes, classRes] = await Promise.all([studentApi.getAll(0, 200), classApi.getAll()]);
      setStudents(studentRes.data?.data?.content || []);
      setClasses(classRes.data?.data || []);
      return;
    }
    const res = await studentApi.search(search.trim());
    setStudents(res.data.data || []);
  };

  const toggleRow = (id) => {
    setSelectedRows((prev) => (
      prev.includes(String(id))
        ? prev.filter((x) => x !== String(id))
        : [...prev, String(id)]
    ));
  };

  const handleCollect = async () => {
    if (!selectedStudent?.id) {
      toast.error('Please select a student first.');
      return;
    }
    const amountToPay = Number(form.amount || 0);
    if (!amountToPay || amountToPay <= 0) {
      toast.error('Please enter a valid payment amount.');
      return;
    }

    const selectedPayables = selectableRows
      .filter((r) => selectedRows.includes(String(r.id)))
      .map((r) => ({
        ...r,
        balance: Math.max(0, Number(r.amount || 0) - Number(r.paidAmount || 0)),
      }))
      .filter((r) => r.balance > 0);

    if (!selectedPayables.length) {
      toast.error('Please select at least one pending fee item.');
      return;
    }

    if (amountToPay > totalSelected) {
      toast.error('Entered amount is greater than selected pending balance.');
      return;
    }

    setSaving(true);
    try {
      let remaining = amountToPay;
      const payloads = [];

      selectedPayables.forEach((row) => {
        if (remaining <= 0) return;
        const pay = Math.min(remaining, row.balance);
        if (pay > 0) {
          payloads.push({
            studentId: Number(selectedStudent.id),
            amount: Number(pay.toFixed(2)),
            paymentDate: form.paymentDate,
            paymentMethod: form.paymentMethod,
            transactionId: form.transactionId || null,
            month: row.month,
            remarks: form.note,
          });
          remaining -= pay;
        }
      });

      await Promise.all(payloads.map((payload) => feeApi.collect(payload)));

      toast.success('Recent payment recorded.');
      clearDraft();
      setTimeout(() => {
        navigate('/admin/fees', { state: { successMessage: 'Recent payment recorded.' } });
      }, 700);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to record payment.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const paymentTypeOptions = Array.from(
    new Set(outstandingRows.map((r) => String(r.month || '').split(' - ')[0] || 'Class Fee'))
  );

  const formatInr = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;

  return (
    <>
      <PageHeader
        title="Collect Fee"
        subtitle="Home > Academic > Collect Fee"
        action={
          <button onClick={() => navigate('/admin/fees')} className="bg-blue-700 text-white px-5 py-2.5 rounded-lg hover:bg-blue-800 text-sm font-semibold">
            Back to Fees Page
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-xl shadow border border-gray-100 p-4">
            <h3 className="text-3xl font-semibold text-gray-900 mb-3">Student Search</h3>
            <div className="flex gap-2 mb-3">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search Student (Name, ID)"
              />
              <button onClick={handleSearch} className="px-4 py-2.5 bg-gray-200 rounded-lg text-sm font-medium hover:bg-gray-300">Search</button>
            </div>

            <div className="max-h-44 overflow-y-auto divide-y border rounded-lg">
              {students.slice(0, 12).map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStudent(s)}
                  className={`w-full text-left px-3 py-2.5 hover:bg-gray-50 ${selectedStudent?.id === s.id ? 'bg-blue-50' : ''}`}
                >
                  <span className="font-medium text-gray-800">{s.firstName} {s.lastName}</span>
                  <span className="text-xs text-gray-500 ml-2">{s.studentId}</span>
                </button>
              ))}
            </div>

            {selectedStudent && (
              <div className="mt-3 flex items-center justify-between gap-3 bg-gray-50 rounded-lg p-3 border">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-green-100 overflow-hidden flex items-center justify-center text-green-700 font-semibold">
                    {selectedStudent.profilePhoto ? (
                      <img src={fileApi.toPublicUrl(selectedStudent.profilePhoto)} alt={`${selectedStudent.firstName} ${selectedStudent.lastName}`} className="w-14 h-14 rounded-full object-cover" />
                    ) : (
                      <>{selectedStudent.firstName?.[0]}{selectedStudent.lastName?.[0]}</>
                    )}
                  </div>
                  <div>
                    <p className="text-3xl font-semibold text-gray-900">{selectedStudent.firstName} {selectedStudent.lastName}</p>
                    <p className="text-gray-700">Name:</p>
                    <p className="text-gray-700">ID: {selectedStudent.studentId}</p>
                  </div>
                </div>
                <div className="text-gray-700 text-xl">
                  <p>Class: {selectedStudent.className || 'A11'}</p>
                  <p>Roll No. {String(selectedStudent.studentId || '').replace(/\D/g, '').slice(-4) || '0011'}</p>
                  {selectedClassConfig && (
                    <p className="text-sm mt-1">
                      Fee Plan: Class Fee {formatInr(selectedClassConfig.classFee)} / month, Admission Fee {formatInr(selectedClassConfig.admissionFee)} one-time
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow border border-gray-100 p-4">
            <h3 className="text-3xl font-semibold text-gray-900 mb-3">Outstanding Fees</h3>
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="text-left px-2 py-2">Outstanding</th>
                  <th className="text-left px-2 py-2">Total Amount</th>
                  <th className="text-left px-2 py-2">Paid Amount</th>
                  <th className="text-left px-2 py-2">Balance Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {outstandingRows.map((r) => {
                  const paid = Number(r.paidAmount || ((r.status || '').toUpperCase() === 'PAID' ? Number(r.amount || 0) : 0));
                  const balance = Math.max(0, Number(r.amount || 0) - paid);
                  const canSelect = !['PAID', 'CANCELLED'].includes((r.status || '').toUpperCase());
                  return (
                    <tr key={r.id}>
                      <td className="px-2 py-2">
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(String(r.id))}
                            disabled={!canSelect || balance <= 0}
                            onChange={() => toggleRow(r.id)}
                            className="accent-blue-600"
                          />
                          {String(r.month || '').replace(/-/g, ' - ')}
                        </label>
                      </td>
                      <td className="px-2 py-2">{formatInr(r.amount)}</td>
                      <td className="px-2 py-2">{formatInr(paid)}</td>
                      <td className="px-2 py-2">{formatInr(balance)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl shadow border border-gray-100 p-4">
          <h3 className="text-3xl font-semibold text-gray-900 mb-3">Payment Information</h3>

          <div className="space-y-3">
            <div>
              <label className="text-xl font-medium text-gray-700 block mb-1">Select Payment Type</label>
              <select
                value={form.paymentType}
                onChange={(e) => setForm((prev) => ({ ...prev, paymentType: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled
              >
                {paymentTypeOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Auto-selected from outstanding fee item(s).</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xl font-medium text-gray-700 block mb-1">Paying Amount</label>
                <input
                  type="number"
                  min="1"
                  value={form.amount}
                  onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-lg mt-1 text-gray-800">Total Selected: <span className="font-semibold">{formatInr(totalSelected)}</span></p>
              </div>
              <div className="flex items-end text-xl font-semibold text-gray-800">
                Balance: {formatInr(Math.max(0, totalSelected - Number(form.amount || 0)))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xl font-medium text-gray-700 block mb-1">Payment Method</label>
                <select
                  value={form.paymentMethod}
                  onChange={(e) => setForm((prev) => ({ ...prev, paymentMethod: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Cash</option>
                  <option>Card</option>
                  <option>Cheque</option>
                  <option>Online Transfer</option>
                </select>
              </div>
              <div>
                <label className="text-xl font-medium text-gray-700 block mb-1">Payment Date</label>
                <input
                  type="date"
                  value={form.paymentDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, paymentDate: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xl font-medium text-gray-700 block mb-1">Transaction ID</label>
              <input
                value={form.transactionId}
                onChange={(e) => setForm((prev) => ({ ...prev, transactionId: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Transaction ID"
              />
            </div>

            <div>
              <label className="text-xl font-medium text-gray-700 block mb-1">Payment Note</label>
              <textarea
                rows={3}
                value={form.note}
                onChange={(e) => setForm((prev) => ({ ...prev, note: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Payment Note"
              />
            </div>

            <div className="flex justify-between items-center pt-1">
              <button
                type="button"
                onClick={() => clearDraft(true)}
                className="text-gray-400 hover:text-red-500 text-xs flex items-center gap-1"
              >
                🗑️ Clear Draft
              </button>
              <div className="flex gap-2">
                <button
                  onClick={handleCollect}
                  disabled={saving}
                  className="bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-800 disabled:opacity-60"
                >
                  {saving ? 'Recording...' : 'Record Payment'}
                </button>
                <button
                  onClick={() => navigate('/admin/fees')}
                  className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CollectFeePage;
