import React, { useState } from 'react';
import { LogOut, X, AlertCircle } from 'lucide-react';
import { vacateRoom } from '../../../../api/hostelApi';

export default function VacateModal({ allocation, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    vacateDate: new Date().toISOString().split('T')[0],
    damageCharges: 0,
    refundAmount: 0,
    remarks: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleVacate = async (e) => {
    e.preventDefault();
    if (!window.confirm('Confirm vacate operation? This action cannot be undone.')) return;
    try {
      setSubmitting(true);
      await vacateRoom(allocation.id, formData);
      onSuccess();
    } catch (e) {
      console.error(e);
      alert('Vacate failed: ' + (e.response?.data?.message || e.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-rose-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <LogOut className="text-rose-500 h-5 w-5" />
              Vacate Room
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Process checkout for {allocation.student?.firstName} {allocation.student?.lastName}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleVacate} className="p-6 space-y-5">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
            <AlertCircle className="text-amber-500 h-5 w-5 shrink-0" />
            <div className="text-sm text-amber-800">
              <span className="font-semibold block mb-1">Important Checkout Steps</span>
              <ul className="list-disc pl-4 space-y-1">
                <li>Collect room keys and locker keys</li>
                <li>Deactivate RFID card access</li>
                <li>Clear mess dues from accountant</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Vacate Date *</label>
              <input
                type="date"
                required
                value={formData.vacateDate}
                onChange={(e) => setFormData({ ...formData, vacateDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Damage Charges (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.damageCharges}
                  onChange={(e) => setFormData({ ...formData, damageCharges: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Deposit Refund (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.refundAmount}
                  onChange={(e) => setFormData({ ...formData, refundAmount: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Checkout Remarks / Inspection Notes *</label>
              <textarea
                required
                rows={3}
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                placeholder="Details about room condition, missing items..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-2 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Processing...' : 'Complete Vacate Process'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
