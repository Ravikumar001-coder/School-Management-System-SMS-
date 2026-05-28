import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit2, Trash2, CheckCircle, IndianRupee, XCircle } from 'lucide-react';
import PageHeader from '../../../../components/common/PageHeader';
import LoadingSpinner from '../../../../components/common/LoadingSpinner';
import { useToast } from '../../../../hooks/useToast';
import { getMessPlans, createMessPlan } from '../../../../api/hostelApi';

export default function MessPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toast = useToast();

  const [formData, setFormData] = useState({
    planName: '',
    planType: 'VEG',
    dailyRate: '',
    monthlyRate: '',
    breakfastCost: '',
    lunchCost: '',
    dinnerCost: '',
    snacksCost: '',
    holidayDeductionRule: 'FULL_DAY',
    refundRule: 'PRO_RATA',
    lateJoiningRule: 'PRO_RATA'
  });

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const branchId = 1; // Default
      const data = await getMessPlans(branchId);
      setPlans(data || []);
    } catch (error) {
      toast.error('Failed to load mess plans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const branchId = 1;
      const payload = {
        ...formData,
        dailyRate: parseFloat(formData.dailyRate) || 0,
        monthlyRate: parseFloat(formData.monthlyRate) || 0,
        breakfastCost: parseFloat(formData.breakfastCost) || 0,
        lunchCost: parseFloat(formData.lunchCost) || 0,
        dinnerCost: parseFloat(formData.dinnerCost) || 0,
        snacksCost: parseFloat(formData.snacksCost) || 0,
      };

      await createMessPlan(branchId, payload);
      toast.success('Mess plan created successfully');
      setIsModalOpen(false);
      fetchPlans();
    } catch (error) {
      toast.error('Failed to create mess plan');
    }
  };

  const openModal = () => {
    setFormData({
      planName: '',
      planType: 'VEG',
      dailyRate: '',
      monthlyRate: '',
      breakfastCost: '',
      lunchCost: '',
      dinnerCost: '',
      snacksCost: '',
      holidayDeductionRule: 'FULL_DAY',
      refundRule: 'PRO_RATA',
      lateJoiningRule: 'PRO_RATA'
    });
    setIsModalOpen(true);
  };

  const SectionHeader = ({ title }) => (
    <div className="col-span-full mt-4 mb-2">
      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">{title}</h3>
    </div>
  );

  return (
    <>
      <PageHeader
        title="Mess Plans"
        subtitle="Configure pricing, meal rates, and deduction rules"
        actions={
          <button
            onClick={openModal}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm"
          >
            <Plus size={16} /> Create Plan
          </button>
        }
      />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hidden sm:block">
        {loading ? (
          <div className="py-20 text-center"><LoadingSpinner /></div>
        ) : plans.length === 0 ? (
          <div className="text-center py-20">
             <Layers className="h-12 w-12 text-slate-300 mx-auto mb-3" />
             <p className="text-slate-500 font-medium">No plans found. Create your first mess plan.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="text-left px-6 py-4 text-slate-500 font-semibold text-xs uppercase tracking-wider">Plan Name</th>
                <th className="text-left px-4 py-4 text-slate-500 font-semibold text-xs uppercase tracking-wider">Type</th>
                <th className="text-left px-4 py-4 text-slate-500 font-semibold text-xs uppercase tracking-wider">Monthly Rate</th>
                <th className="text-left px-4 py-4 text-slate-500 font-semibold text-xs uppercase tracking-wider">Daily Rate</th>
                <th className="text-left px-4 py-4 text-slate-500 font-semibold text-xs uppercase tracking-wider">Deduction Rule</th>
                <th className="text-left px-4 py-4 text-slate-500 font-semibold text-xs uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {plans.map(plan => (
                <tr key={plan.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 font-bold text-slate-800">{plan.planName}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      plan.planType === 'VEG' ? 'bg-green-100 text-green-700' : 
                      plan.planType === 'NON_VEG' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {plan.planType}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-700 font-bold flex items-center h-full pt-4.5"><IndianRupee className="w-3.5 h-3.5 mr-0.5 text-slate-400"/>{plan.monthlyRate?.toLocaleString()}</td>
                  <td className="px-4 py-4 text-slate-600 font-medium"><div className="flex items-center"><IndianRupee className="w-3 h-3 mr-0.5 text-slate-400"/>{plan.dailyRate}</div></td>
                  <td className="px-4 py-4 text-slate-500 font-medium">{plan.holidayDeductionRule}</td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle className="w-3 h-3"/> ACTIVE
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
         {loading ? (
            <div className="py-10 text-center"><LoadingSpinner /></div>
         ) : plans.map(plan => (
            <div key={plan.id} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
               <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                     <span className="font-bold text-slate-800">{plan.planName}</span>
                     <span className={`px-2 py-0.5 w-max mt-1 rounded text-[10px] font-bold uppercase ${
                        plan.planType === 'VEG' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                     }`}>
                        {plan.planType}
                     </span>
                  </div>
                  <span className="font-bold text-slate-800 flex items-center"><IndianRupee className="w-3.5 h-3.5 mr-0.5 text-slate-400"/>{plan.monthlyRate?.toLocaleString()}</span>
               </div>
               <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500 bg-slate-50 p-2 rounded-lg">
                  <div className="flex items-center gap-1">Daily: ₹{plan.dailyRate}</div>
                  <div>Rule: {plan.holidayDeductionRule}</div>
               </div>
            </div>
         ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 shrink-0">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Layers className="h-5 w-5 text-blue-600"/>
                Create Mess Plan
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <XCircle size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 overflow-y-auto flex-1 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  
                  <SectionHeader title="Basic Info" />
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Plan Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={formData.planName}
                      onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="e.g. Standard Veg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Plan Type <span className="text-red-500">*</span></label>
                    <select
                      value={formData.planType}
                      onChange={(e) => setFormData({ ...formData, planType: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="VEG">Veg</option>
                      <option value="NON_VEG">Non-Veg</option>
                      <option value="SPECIAL">Special</option>
                    </select>
                  </div>

                  <SectionHeader title="Pricing Rates" />

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Monthly Rate (₹) <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.monthlyRate}
                      onChange={(e) => setFormData({ ...formData, monthlyRate: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Daily Rate (₹) <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.dailyRate}
                      onChange={(e) => setFormData({ ...formData, dailyRate: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>

                  <SectionHeader title="Meal Breakdown (Optional)" />

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Breakfast (₹)</label>
                    <input type="number" value={formData.breakfastCost} onChange={e => setFormData({...formData, breakfastCost: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Lunch (₹)</label>
                    <input type="number" value={formData.lunchCost} onChange={e => setFormData({...formData, lunchCost: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Dinner (₹)</label>
                    <input type="number" value={formData.dinnerCost} onChange={e => setFormData({...formData, dinnerCost: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Snacks (₹)</label>
                    <input type="number" value={formData.snacksCost} onChange={e => setFormData({...formData, snacksCost: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                  </div>

                  <SectionHeader title="Deduction Rules" />

                  <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Holiday Rule</label>
                      <select value={formData.holidayDeductionRule} onChange={e => setFormData({...formData, holidayDeductionRule: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                        <option value="FULL_DAY">Full Day</option>
                        <option value="PERCENTAGE">Percentage</option>
                        <option value="NONE">None</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Refund Rule</label>
                      <select value={formData.refundRule} onChange={e => setFormData({...formData, refundRule: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                        <option value="PRO_RATA">Pro Rata</option>
                        <option value="FIXED">Fixed Amount</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Late Joining Rule</label>
                      <select value={formData.lateJoiningRule} onChange={e => setFormData({...formData, lateJoiningRule: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                        <option value="PRO_RATA">Pro Rata</option>
                        <option value="FULL_MONTH">Full Month</option>
                      </select>
                    </div>
                  </div>

                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex gap-3 shrink-0">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg font-bold">Cancel</button>
                <button type="submit" className="flex-1 px-6 py-2.5 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-bold shadow-sm">Save Plan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
