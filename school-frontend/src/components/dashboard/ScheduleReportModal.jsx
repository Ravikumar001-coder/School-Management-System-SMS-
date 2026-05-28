import React, { useState } from 'react';
import { X, Calendar, Mail, FileText, Landmark, Check } from 'lucide-react';
import api from '../../api/axios';

const ScheduleReportModal = ({ isOpen, onClose }) => {
  const [reportName, setReportName] = useState('Monthly Financial Statement');
  const [frequency, setFrequency] = useState('MONTHLY');
  const [recipients, setRecipients] = useState('board@schoolos.edu, finance@schoolos.edu');
  const [exportFormat, setExportFormat] = useState('PDF');
  const [branchId, setBranchId] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        reportName,
        frequency,
        recipients,
        exportFormat,
        branch: branchId ? { id: parseInt(branchId) } : null
      };
      await api.post('/export/reports', payload);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Failed to schedule report", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 p-6 animate-in fade-in zoom-in-95 duration-150">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-slate-50 rounded-lg text-slate-400">
          <X size={18} />
        </button>

        <h3 className="text-sm font-black text-slate-800 mb-2 flex items-center gap-2">
          <Calendar size={18} className="text-blue-600" />
          Schedule Regular Report
        </h3>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-6">
          Cron-based backend automatic report delivery
        </p>

        {success ? (
          <div className="flex flex-col items-center justify-center py-8 text-emerald-500">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mb-3">
              <Check size={24} />
            </div>
            <p className="text-sm font-black">Report Scheduled Successfully</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Report Name</label>
              <input
                type="text"
                required
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                placeholder="e.g. Weekly Attendance Summary"
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Frequency</label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500"
                >
                  <option value="DAILY">Daily</option>
                  <option value="WEEKLY">Weekly</option>
                  <option value="MONTHLY">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Format</label>
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500"
                >
                  <option value="PDF">PDF Document</option>
                  <option value="EXCEL">Excel Sheet</option>
                  <option value="CSV">CSV Data</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Email Recipients</label>
              <div className="relative flex items-center">
                <Mail size={14} className="absolute left-3 text-slate-400" />
                <input
                  type="text"
                  required
                  value={recipients}
                  onChange={(e) => setRecipients(e.target.value)}
                  placeholder="admin@school.com, finance@school.com"
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Branch Isolations (Optional)</label>
              <select
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500"
              >
                <option value="">All Branches</option>
                <option value="1">Main Campus</option>
                <option value="2">North Wing Campus</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-xs font-black transition-colors"
            >
              {loading ? 'Scheduling...' : 'Configure Active Schedule'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default React.memo(ScheduleReportModal);
