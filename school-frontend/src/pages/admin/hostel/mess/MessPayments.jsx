import React, { useState, useEffect } from 'react';
import { CreditCard, Search, FileText, Download, IndianRupee, Plus, XCircle, Filter } from 'lucide-react';
import PageHeader from '../../../../components/common/PageHeader';
import LoadingSpinner from '../../../../components/common/LoadingSpinner';
import { useToast } from '../../../../hooks/useToast';
import { getMessPayments, getMessBills, recordMessPayment } from '../../../../api/hostelApi';

export default function MessPayments() {
  const [payments, setPayments] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const toast = useToast();

  const [formData, setFormData] = useState({
    billId: '',
    amountPaid: '',
    paymentMode: 'UPI'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [paymentsData, billsData] = await Promise.all([
        getMessPayments(),
        getMessBills()
      ]);
      setPayments(paymentsData || []);
      setBills((billsData || []).filter(b => b.status !== 'PAID'));
    } catch (error) {
      toast.error('Failed to load payments data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await recordMessPayment({
        billId: parseInt(formData.billId),
        amountPaid: parseFloat(formData.amountPaid),
        paymentMode: formData.paymentMode
      });
      toast.success('Payment recorded successfully');
      setIsModalOpen(false);
      setFormData({ billId: '', amountPaid: '', paymentMode: 'UPI' });
      fetchData();
    } catch (error) {
      toast.error('Failed to record payment');
    }
  };

  const filteredPayments = payments.filter(p => {
    if (search) {
      const studentName = (p.bill?.allocation?.student?.firstName + ' ' + p.bill?.allocation?.student?.lastName).toLowerCase();
      const receipt = (p.receiptNumber || '').toLowerCase();
      return studentName.includes(search.toLowerCase()) || receipt.includes(search.toLowerCase());
    }
    return true;
  });

  const totalCollected = payments.reduce((acc, curr) => acc + (curr.amountPaid || 0), 0);

  return (
    <>
      <PageHeader
        title="Mess Collections & Payments"
        subtitle="Manage incoming mess fees and generate receipts"
        actions={
          <div className="flex gap-3">
            <button className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2.5 rounded-xl font-medium transition-colors shadow-sm text-sm flex items-center gap-2">
              <Download size={16}/> Export Ledger
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm flex items-center gap-2"
            >
              <IndianRupee size={16} /> Collect Payment
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-xl">
             <IndianRupee className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Collection</p>
            <h3 className="text-xl font-bold text-slate-800">₹ {totalCollected.toLocaleString()}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-xl">
             <CreditCard className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Transactions</p>
            <h3 className="text-xl font-bold text-slate-800">{payments.length}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 rounded-xl">
             <FileText className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Bills</p>
            <h3 className="text-xl font-bold text-slate-800">{bills.length}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-5 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] group">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by student name or receipt..."
            className="w-full border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hidden sm:block">
        {loading ? (
          <div className="py-20 text-center"><LoadingSpinner /></div>
        ) : filteredPayments.length === 0 ? (
          <div className="text-center py-20">
             <CreditCard className="h-12 w-12 text-slate-300 mx-auto mb-3" />
             <p className="text-slate-500 font-medium">No payments recorded.</p>
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-slate-500 font-semibold text-xs uppercase tracking-wider">Receipt No</th>
                <th className="px-4 py-4 text-slate-500 font-semibold text-xs uppercase tracking-wider">Date</th>
                <th className="px-4 py-4 text-slate-500 font-semibold text-xs uppercase tracking-wider">Student Name</th>
                <th className="px-4 py-4 text-slate-500 font-semibold text-xs uppercase tracking-wider">Bill Ref</th>
                <th className="px-4 py-4 text-slate-500 font-semibold text-xs uppercase tracking-wider text-right">Amount</th>
                <th className="px-4 py-4 text-slate-500 font-semibold text-xs uppercase tracking-wider text-center">Mode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredPayments.map(pay => (
                <tr key={pay.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 font-mono text-xs text-indigo-600 font-bold">{pay.receiptNumber}</td>
                  <td className="px-4 py-4 text-slate-500 font-medium">{new Date(pay.paymentDate).toLocaleDateString()}</td>
                  <td className="px-4 py-4 font-bold text-slate-800">{pay.bill?.allocation?.student?.firstName} {pay.bill?.allocation?.student?.lastName}</td>
                  <td className="px-4 py-4 font-mono text-xs text-slate-500">#{pay.bill?.id}</td>
                  <td className="px-4 py-4 text-emerald-600 font-bold text-right flex justify-end items-center h-full"><IndianRupee className="w-3.5 h-3.5 mr-0.5" />{pay.amountPaid?.toLocaleString()}</td>
                  <td className="px-4 py-4 text-center">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase bg-slate-100 text-slate-700 border border-slate-200">
                      {pay.paymentMode}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-3">
        {loading && <div className="py-10 text-center"><LoadingSpinner /></div>}
        {!loading && filteredPayments.map(pay => (
          <div key={pay.id} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
             <div className="flex items-start justify-between">
                <div className="flex flex-col">
                   <span className="font-bold text-slate-800">{pay.bill?.allocation?.student?.firstName} {pay.bill?.allocation?.student?.lastName}</span>
                   <span className="text-[11px] font-mono text-indigo-600 font-bold mt-0.5">{pay.receiptNumber}</span>
                </div>
                <span className="font-bold text-emerald-600 flex items-center"><IndianRupee className="w-3.5 h-3.5" />{pay.amountPaid}</span>
             </div>
             <div className="mt-3 flex justify-between items-center text-xs text-slate-500 bg-slate-50 p-2 rounded-lg">
                <span>{new Date(pay.paymentDate).toLocaleDateString()}</span>
                <span className="font-bold">{pay.paymentMode}</span>
             </div>
          </div>
        ))}
      </div>

      {/* Collect Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 shrink-0">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <IndianRupee className="h-5 w-5 text-blue-600"/>
                Record Payment
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <XCircle size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 overflow-y-auto flex-1 bg-white space-y-4">
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Select Pending Bill <span className="text-red-500">*</span></label>
                  <select required value={formData.billId} onChange={e => {
                      const id = e.target.value;
                      const bill = bills.find(b => b.id.toString() === id);
                      setFormData({ ...formData, billId: id, amountPaid: bill ? (bill.totalAmount - bill.amountPaid) : '' });
                    }} 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Select Bill...</option>
                    {bills.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.allocation?.student?.firstName} {b.allocation?.student?.lastName} - Due: ₹{b.totalAmount - b.amountPaid}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Amount Paid (₹) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.amountPaid}
                    onChange={(e) => setFormData({ ...formData, amountPaid: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Payment Mode <span className="text-red-500">*</span></label>
                  <select
                    value={formData.paymentMode}
                    onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="UPI">UPI</option>
                    <option value="CASH">Cash</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="CHEQUE">Cheque</option>
                  </select>
                </div>

              </div>
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex gap-3 shrink-0">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg font-bold">
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-6 py-2.5 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-bold shadow-sm">
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
