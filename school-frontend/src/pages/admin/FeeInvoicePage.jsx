import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import { feeApi } from '../../api/feeApi';

const FeeInvoicePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    feeApi.getById(id)
      .then((res) => setInvoice(res.data.data))
      .catch((err) => {
        showToast(err.response?.data?.message || 'Failed to load invoice.', 'error');
      })
      .finally(() => setLoading(false));
  }, [id, showToast]);

  const formattedDate = useMemo(() => {
    if (!invoice?.paymentDate) return '-';
    const d = new Date(invoice.paymentDate);
    return Number.isNaN(d.getTime())
      ? invoice.paymentDate
      : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }, [invoice]);

  const handlePrint = () => {
    window.print();
    showToast('Invoice is being printed.', 'success');
  };

  if (loading) {
    return <><LoadingSpinner /></>;
  }

  return (
    <>
      <PageHeader
        title="School Fee Invoice"
        subtitle="Home > Academic > Fees > Invoice"
        action={
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/admin/fees')}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-[16px] min-h-[44px] text-sm font-bold hover:bg-gray-200"
            >
              Back
            </button>
            <button
              onClick={handlePrint}
              className="bg-[#1E40AF] hover:bg-[#1E3A8A] text-white px-6 py-3 rounded-[16px] min-h-[44px] text-sm font-bold shadow-md"
            >
              Download / Print
            </button>
          </div>
        }
      />

      {invoice && (
        <div className="bg-white rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9] p-6 print:shadow-none print:border-none print:rounded-none">
          <div className="flex items-start justify-between border-b pb-4 mb-5">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Springdale Public School</h2>
              <p className="text-gray-600 text-sm mt-1">Official Monthly Fee Invoice</p>
              <p className="text-gray-500 text-xs mt-1">Academic Session Invoice</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Receipt No.</p>
              <p className="text-lg font-semibold text-gray-900">{invoice.receiptNumber || `INV-${invoice.id}`}</p>
              <p className="text-xs text-gray-500 mt-1">Status: {invoice.status || 'PAID'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="border rounded-lg p-4 bg-gray-50">
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">Student Details</p>
              <p className="text-gray-900 font-semibold">{invoice.studentName}</p>
              <p className="text-sm text-gray-700">Student ID: {invoice.studentCode || '-'}</p>
              <p className="text-sm text-gray-700">Class: {invoice.className || '-'}</p>
            </div>

            <div className="border rounded-lg p-4 bg-gray-50">
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">Payment Details</p>
              <p className="text-sm text-gray-700">Payment Date: {formattedDate}</p>
              <p className="text-sm text-gray-700">Payment Method: {invoice.paymentMethod || '-'}</p>
              <p className="text-sm text-gray-700">Transaction ID: {invoice.transactionId || '-'}</p>
              <p className="text-sm text-gray-700">Billing Month: {invoice.month || '-'}</p>
            </div>
          </div>

          <div className="overflow-x-auto border rounded-lg mb-4">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-700">Description</th>
                  <th className="text-right px-4 py-2.5 font-semibold text-gray-700">Amount (INR)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-3">{invoice.month || 'Monthly School Fee'}</td>
                  <td className="px-4 py-3 text-right font-semibold">₹{Number(invoice.amount || 0).toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold">Total Paid</td>
                  <td className="px-4 py-3 text-right text-lg font-bold text-green-700">₹{Number(invoice.amount || 0).toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="rounded-lg border bg-blue-50 p-4">
            <p className="text-sm text-blue-900 font-medium">Remarks</p>
            <p className="text-sm text-blue-900 mt-1">{invoice.remarks || 'Thank you for paying your school monthly fee on time.'}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default FeeInvoicePage;
