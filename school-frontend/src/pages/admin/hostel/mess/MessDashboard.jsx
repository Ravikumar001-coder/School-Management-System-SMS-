import React, { useState, useEffect } from 'react';
import { IndianRupee, Users, Activity, Layers, Bell, ArrowUpRight, TrendingUp } from 'lucide-react';
import PageHeader from '../../../../components/common/PageHeader';
import LoadingSpinner from '../../../../components/common/LoadingSpinner';
import { useToast } from '../../../../hooks/useToast';
import { getMessBills, getMessPayments, getAllocations } from '../../../../api/hostelApi';

export default function MessDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    collected: 0,
    pendingDues: 0,
    defaulters: 0,
    activeStudents: 0,
    avgDailyCost: 0
  });
  const toast = useToast();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [bills, payments, allocations] = await Promise.all([
        getMessBills(),
        getMessPayments(),
        getAllocations()
      ]);

      const activeAllocations = (allocations || []).filter(a => a.status === 'ACTIVE');
      
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();

      // Filter payments for this month
      const currentMonthPayments = (payments || []).filter(p => {
        const date = new Date(p.paymentDate);
        return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
      });

      const collected = currentMonthPayments.reduce((acc, curr) => acc + (curr.amountPaid || 0), 0);

      // Pending dues across all bills
      let pendingDues = 0;
      let defaultersSet = new Set();
      (bills || []).forEach(b => {
        const due = b.totalAmount - b.amountPaid;
        if (due > 0) {
          pendingDues += due;
          defaultersSet.add(b.allocation?.student?.id);
        }
      });

      // Calculate avg daily cost (rough estimate)
      let totalDailyCost = 0;
      let billCount = 0;
      (bills || []).forEach(b => {
        if (b.totalDays - b.absentDays > 0) {
          totalDailyCost += (b.totalAmount / (b.totalDays - b.absentDays));
          billCount++;
        }
      });
      const avgDailyCost = billCount > 0 ? (totalDailyCost / billCount).toFixed(0) : 0;

      setStats({
        collected,
        pendingDues,
        defaulters: defaultersSet.size,
        activeStudents: activeAllocations.length,
        avgDailyCost
      });

    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <>
      <PageHeader
        title="Mess Finance Command Center"
        subtitle="Operational KPIs and Financial Overview"
        actions={
          <div className="flex items-center gap-4">
            <select className="border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 bg-white shadow-sm outline-none">
              <option>Current Month</option>
            </select>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-colors text-sm">
              Export Report
            </button>
          </div>
        }
      />

      {loading ? (
        <div className="py-20 text-center"><LoadingSpinner /></div>
      ) : (
        <>
          {/* KPI GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
               <div className="absolute -right-4 -bottom-4 opacity-5 transform group-hover:scale-110 transition-transform duration-300">
                 <IndianRupee className="w-24 h-24" />
               </div>
               <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-2">Collected (This Month)</p>
               <h3 className="text-3xl font-bold text-emerald-600">₹ {stats.collected.toLocaleString()}</h3>
               <p className="text-xs text-emerald-600 mt-2 font-medium flex items-center gap-1">
                 <ArrowUpRight className="w-3 h-3"/> Live Data
               </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
               <div className="absolute -right-4 -bottom-4 opacity-5 transform group-hover:scale-110 transition-transform duration-300">
                 <IndianRupee className="w-24 h-24" />
               </div>
               <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-2">Pending Dues</p>
               <h3 className="text-3xl font-bold text-amber-500">₹ {stats.pendingDues.toLocaleString()}</h3>
               <p className="text-xs text-amber-600 mt-2 font-medium">From {stats.defaulters} Defaulters</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
               <div className="absolute -right-4 -bottom-4 opacity-5 transform group-hover:scale-110 transition-transform duration-300">
                 <Users className="w-24 h-24" />
               </div>
               <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-2">Active Students</p>
               <h3 className="text-3xl font-bold text-blue-600">{stats.activeStudents}</h3>
               <p className="text-xs text-slate-500 mt-2 font-medium">Currently Allocated</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
               <div className="absolute -right-4 -bottom-4 opacity-5 transform group-hover:scale-110 transition-transform duration-300">
                 <TrendingUp className="w-24 h-24" />
               </div>
               <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-2">Avg Daily Cost</p>
               <h3 className="text-3xl font-bold text-indigo-600">₹ {stats.avgDailyCost}</h3>
               <p className="text-xs text-slate-500 mt-2 font-medium">Per student calculation</p>
            </div>
          </div>

          {/* LOWER SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm min-h-[300px]">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-500"/> Revenue Trend
              </h3>
              <div className="flex flex-col items-center justify-center h-[200px] text-slate-400 text-sm font-medium bg-slate-50 rounded-xl border border-slate-100 border-dashed p-6">
                <Activity className="h-10 w-10 text-slate-300 mb-2" />
                <p>Not enough historical data to generate trend analysis.</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-500"/> Action Required
              </h3>
              <div className="space-y-3">
                {stats.defaulters > 0 ? (
                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                    <p className="text-sm font-semibold text-amber-900">{stats.defaulters} Overdue Accounts</p>
                    <p className="text-xs text-amber-700 mt-1">Totaling ₹{stats.pendingDues.toLocaleString()}</p>
                  </div>
                ) : (
                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                    <p className="text-sm font-semibold text-emerald-900">All Accounts Clear</p>
                    <p className="text-xs text-emerald-700 mt-1">No pending dues.</p>
                  </div>
                )}
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <p className="text-sm font-semibold text-blue-900">Billing Cycle Active</p>
                  <p className="text-xs text-blue-700 mt-1">Review allocations before end of month.</p>
                </div>
              </div>
            </div>
            
          </div>
        </>
      )}
    </>
  );
}
