import React, { useState, useEffect } from 'react';
import { Receipt, Plus, Search, CheckCircle, FileText, XCircle, AlertCircle, Eye, IndianRupee, Filter } from 'lucide-react';
import PageHeader from '../../../../components/common/PageHeader';
import LoadingSpinner from '../../../../components/common/LoadingSpinner';
import { useToast } from '../../../../hooks/useToast';
import { getMessBills, getMessPlans, getAllocations, generateMessBillPreview, generateMessBill } from '../../../../api/hostelApi';

export default function MessBilling() {
  const [bills, setBills] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const toast = useToast();

  const [previewData, setPreviewData] = useState([]);
  const [generating, setGenerating] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [formData, setFormData] = useState({
    allocationId: '',
    planId: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    totalDays: 30,
    absentDays: 0,
    extraCharges: 0,
    fines: 0,
    holidayDeductions: 0,
    dueDate: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const branchId = 1;
      const [billsData, allocData, plansData] = await Promise.all([
        getMessBills(),
        getAllocations(),
        getMessPlans(branchId)
      ]);
      setBills(billsData || []);
      setAllocations((allocData || []).filter(a => a.status === 'ACTIVE'));
      setPlans(plansData || []);
    } catch (error) {
      toast.error('Failed to load billing data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGeneratePreview = async (e) => {
    e.preventDefault();
    if (!formData.allocationId || !formData.planId) {
       toast.error('Please select an allocation and a mess plan');
       return;
    }
    try {
      setGenerating(true);
      const payload = {
        allocationId: parseInt(formData.allocationId),
        planId: parseInt(formData.planId),
        month: parseInt(formData.month),
        year: parseInt(formData.year),
        totalDays: parseInt(formData.totalDays),
        absentDays: parseInt(formData.absentDays),
        extraCharges: parseFloat(formData.extraCharges) || 0,
        fines: parseFloat(formData.fines) || 0,
        holidayDeductions: parseFloat(formData.holidayDeductions) || 0,
        dueDate: formData.dueDate ? formData.dueDate : null
      };

      const preview = await generateMessBillPreview(payload);
      setPreviewData([preview]); // For now, we support single allocation generation
      setIsPreviewMode(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate preview');
    } finally {
      setGenerating(false);
    }
  };

  const handleFinalSubmit = async () => {
    try {
      setGenerating(true);
      const payload = {
        allocationId: parseInt(formData.allocationId),
        planId: parseInt(formData.planId),
        month: parseInt(formData.month),
        year: parseInt(formData.year),
        totalDays: parseInt(formData.totalDays),
        absentDays: parseInt(formData.absentDays),
        extraCharges: parseFloat(formData.extraCharges) || 0,
        fines: parseFloat(formData.fines) || 0,
        holidayDeductions: parseFloat(formData.holidayDeductions) || 0,
        dueDate: formData.dueDate ? formData.dueDate : null
      };

      await generateMessBill(payload);
      toast.success('Bill generated successfully');
      setIsPreviewMode(false);
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate bill');
    } finally {
      setGenerating(false);
    }
  };

  const filteredBills = bills.filter(b => {
    if (statusFilter && b.status !== statusFilter) return false;
    if (search) {
      const studentName = (b.allocation?.student?.firstName + ' ' + b.allocation?.student?.lastName).toLowerCase();
      if (!studentName.includes(search.toLowerCase())) return false;
    }
    return true;
  });

  const StatusBadge = ({ status }) => {
    const styles = {
      PAID: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      PARTIAL: 'bg-amber-50 text-amber-700 border-amber-100',
      OVERDUE: 'bg-red-50 text-red-700 border-red-100',
      PENDING: 'bg-blue-50 text-blue-700 border-blue-100',
      CANCELLED: 'bg-slate-50 text-slate-700 border-slate-200',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase border ${styles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <>
      <PageHeader
        title="Monthly Mess Billing"
        subtitle="Generate invoices, track dues, and manage monthly cycles."
        actions={
          <button
            onClick={() => {
              setPreviewData([]);
              setIsPreviewMode(false);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm"
          >
            <Plus size={16} /> Generate Bill
          </button>
        }
      />

      {/* FILTER BAR */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-5 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] group">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by student name..."
            className="w-full border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center gap-1.5 text-slate-500 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
            <Filter size={12} />
            <span className="text-[11px] font-bold uppercase tracking-wider">Filters:</span>
          </div>

          <select 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-blue-500/20 outline-none bg-white cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PARTIAL">Partial</option>
            <option value="PAID">Paid</option>
            <option value="OVERDUE">Overdue</option>
          </select>
        </div>
      </div>

      {/* BILLING TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hidden sm:block">
        {loading ? (
          <div className="py-20 text-center"><LoadingSpinner /></div>
        ) : filteredBills.length === 0 ? (
          <div className="text-center py-20">
            <Receipt className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No bills found.</p>
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-slate-500 font-semibold text-xs uppercase tracking-wider">Bill ID</th>
                <th className="px-4 py-4 text-slate-500 font-semibold text-xs uppercase tracking-wider">Student</th>
                <th className="px-4 py-4 text-slate-500 font-semibold text-xs uppercase tracking-wider">Month/Year</th>
                <th className="px-4 py-4 text-slate-500 font-semibold text-xs uppercase tracking-wider">Mess Plan</th>
                <th className="px-4 py-4 text-slate-500 font-semibold text-xs uppercase tracking-wider text-center">Meal Days</th>
                <th className="px-4 py-4 text-slate-500 font-semibold text-xs uppercase tracking-wider text-right">Deductions</th>
                <th className="px-4 py-4 text-slate-500 font-semibold text-xs uppercase tracking-wider text-right">Total (₹)</th>
                <th className="px-4 py-4 text-slate-500 font-semibold text-xs uppercase tracking-wider text-right">Paid (₹)</th>
                <th className="px-4 py-4 text-slate-500 font-semibold text-xs uppercase tracking-wider text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredBills.map(bill => (
                <tr key={bill.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-indigo-600 font-bold">#{bill.id}</td>
                  <td className="px-4 py-4 font-bold text-slate-800">{bill.allocation?.student?.firstName} {bill.allocation?.student?.lastName}</td>
                  <td className="px-4 py-4 text-slate-600 font-medium">{bill.billingMonth}/{bill.billingYear}</td>
                  <td className="px-4 py-4 text-slate-600 text-sm">{bill.plan?.planName}</td>
                  <td className="px-4 py-4 text-slate-600 text-center">{bill.totalDays - bill.absentDays}</td>
                  <td className="px-4 py-4 text-slate-500 text-right">-₹{bill.holidayDeductions}</td>
                  <td className="px-4 py-4 text-slate-800 font-bold text-right">₹{bill.totalAmount?.toLocaleString()}</td>
                  <td className="px-4 py-4 text-emerald-600 font-bold text-right">₹{bill.amountPaid?.toLocaleString()}</td>
                  <td className="px-4 py-4 text-center">
                    <StatusBadge status={bill.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Mobile View */}
      <div className="sm:hidden space-y-3">
        {loading && <div className="py-10 text-center"><LoadingSpinner /></div>}
        {!loading && filteredBills.map(bill => (
          <div key={bill.id} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
             <div className="flex items-start justify-between">
                <div className="flex flex-col">
                   <span className="font-bold text-slate-800">{bill.allocation?.student?.firstName} {bill.allocation?.student?.lastName}</span>
                   <span className="text-[11px] font-mono text-indigo-600 font-bold mt-0.5">#{bill.id}</span>
                </div>
                <StatusBadge status={bill.status} />
             </div>
             <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500 bg-slate-50 p-2 rounded-lg">
                <div>Total: <span className="font-bold text-slate-800">₹{bill.totalAmount}</span></div>
                <div>Paid: <span className="font-bold text-emerald-600">₹{bill.amountPaid}</span></div>
             </div>
          </div>
        ))}
      </div>

      {/* GENERATE BATCH BILLS MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 shrink-0">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600"/>
                {isPreviewMode ? 'Bill Preview & Verification' : 'Generate Monthly Bill'}
              </h2>
              <button onClick={() => { setIsModalOpen(false); setIsPreviewMode(false); }} className="text-slate-400 hover:text-slate-600 transition-colors">
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto bg-white p-6">
              
              {!isPreviewMode ? (
                <form id="generateForm" onSubmit={handleGeneratePreview} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="col-span-full mb-2">
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3 text-sm text-blue-800">
                      <AlertCircle className="w-5 h-5 shrink-0 text-blue-600"/>
                      <p>Select the criteria below to generate a preview of the invoice. <strong>No bills will be finalized until you approve the preview on the next screen.</strong></p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Student Allocation <span className="text-red-500">*</span></label>
                    <select required value={formData.allocationId} onChange={e => setFormData({...formData, allocationId: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                      <option value="">Select Student</option>
                      {allocations.map(a => <option key={a.id} value={a.id}>{a.student?.firstName} {a.student?.lastName} (Room {a.bed?.room?.roomNumber})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Mess Plan <span className="text-red-500">*</span></label>
                    <select required value={formData.planId} onChange={e => setFormData({...formData, planId: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                      <option value="">Select Plan</option>
                      {plans.map(p => <option key={p.id} value={p.id}>{p.planName} (₹{p.monthlyRate})</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Billing Month <span className="text-red-500">*</span></label>
                    <input type="number" min="1" max="12" required value={formData.month} onChange={e => setFormData({...formData, month: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Billing Year <span className="text-red-500">*</span></label>
                    <input type="number" required value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Total Days in Month <span className="text-red-500">*</span></label>
                    <input type="number" required value={formData.totalDays} onChange={e => setFormData({...formData, totalDays: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Absent Days</label>
                    <input type="number" value={formData.absentDays} onChange={e => setFormData({...formData, absentDays: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Extra Charges (₹)</label>
                    <input type="number" value={formData.extraCharges} onChange={e => setFormData({...formData, extraCharges: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Fines (₹)</label>
                    <input type="number" value={formData.fines} onChange={e => setFormData({...formData, fines: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Holiday Deductions (₹)</label>
                    <input type="number" value={formData.holidayDeductions} onChange={e => setFormData({...formData, holidayDeductions: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Due Date</label>
                    <input type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                  </div>

                </form>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3 text-sm text-amber-800">
                    <Eye className="w-5 h-5 shrink-0 text-amber-600"/>
                    <div>
                      <p className="font-bold text-amber-900">Previewing Invoice</p>
                      <p className="mt-0.5">Please review the calculated deductions and totals. Clicking finalize will persist these to the ledger.</p>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-slate-600">
                        <tr>
                          <th className="p-3 font-semibold text-center">Meal Days</th>
                          <th className="p-3 font-semibold text-center">Absent Days</th>
                          <th className="p-3 font-semibold text-right">Deductions</th>
                          <th className="p-3 font-semibold text-right">Fines</th>
                          <th className="p-3 font-semibold text-right">Extra</th>
                          <th className="p-3 font-semibold text-right">Final Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {previewData.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-3 text-center font-mono">{row.totalDays - row.absentDays}</td>
                            <td className="p-3 text-center text-red-500 font-mono">{row.absentDays}</td>
                            <td className="p-3 text-right text-emerald-600">-₹{row.holidayDeductions}</td>
                            <td className="p-3 text-right text-amber-600">+₹{row.fines}</td>
                            <td className="p-3 text-right text-blue-600">+₹{row.extraCharges}</td>
                            <td className="p-3 text-right font-bold text-slate-900">₹{row.totalAmount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 shrink-0">
              {isPreviewMode ? (
                <>
                  <button onClick={() => setIsPreviewMode(false)} disabled={generating} className="px-6 py-2.5 text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg font-bold transition-colors disabled:opacity-50">
                    Back to Config
                  </button>
                  <button onClick={handleFinalSubmit} disabled={generating} className="px-6 py-2.5 text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg font-bold transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50">
                    <CheckCircle className="w-5 h-5"/> {generating ? 'Generating...' : 'Finalize & Generate'}
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg font-bold transition-colors">
                    Cancel
                  </button>
                  <button form="generateForm" type="submit" disabled={generating} className="px-6 py-2.5 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50">
                    <Eye className="w-5 h-5"/> {generating ? 'Processing...' : 'Generate Preview'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

    </>
  );
}
