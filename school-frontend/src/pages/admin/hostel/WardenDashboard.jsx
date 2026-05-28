import React, { useState, useEffect } from 'react';
import { Home, Users, CheckCircle, AlertCircle, RefreshCw, Layers, Bed, Activity } from 'lucide-react';
import { getHostelBlocks, getDashboardStats } from '../../../api/hostelApi';
import { useToast } from '../../../hooks/useToast';
import PageHeader from '../../../components/common/PageHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

export default function WardenDashboard() {
  const [stats, setStats] = useState({
    totalBlocks: 0,
    totalRooms: 0,
    totalStudents: 0,
    availableBeds: 0
  });

  const [blocksList, setBlocksList] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const branchId = 1; // Assuming default branch
      
      const blocksRes = await getHostelBlocks(branchId);
      const statsRes = await getDashboardStats(branchId);
      
      setBlocksList(blocksRes || []);
      
      setStats({
        totalBlocks: statsRes.totalBlocks || 0,
        totalRooms: statsRes.totalRooms || 0,
        totalStudents: statsRes.totalStudents || 0,
        availableBeds: statsRes.availableBeds || 0
      });

      setAlerts([
        { id: 1, type: 'INFO', message: 'Dashboard is now showing live data from the database.', time: 'Just now' }
      ]);
      
    } catch (err) {
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
        title="Warden Dashboard"
        subtitle="Hostel Management & Occupancy Overview"
        actions={
          <button 
            onClick={fetchDashboardData}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-blue-500' : ''}`} /> Refresh Data
          </button>
        }
      />

      {loading ? (
        <div className="py-20 text-center"><LoadingSpinner /></div>
      ) : (
        <>
          {/* KPI Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-5 transform group-hover:scale-110 transition-transform duration-300">
                <Layers className="w-24 h-24" />
              </div>
              <p className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Total Blocks</p>
              <h3 className="text-3xl font-bold text-slate-900">{stats.totalBlocks}</h3>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-5 transform group-hover:scale-110 transition-transform duration-300 text-blue-600">
                <Home className="w-24 h-24" />
              </div>
              <p className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Total Rooms</p>
              <h3 className="text-3xl font-bold text-blue-600">{stats.totalRooms}</h3>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-5 transform group-hover:scale-110 transition-transform duration-300 text-emerald-600">
                <Users className="w-24 h-24" />
              </div>
              <p className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Total Students</p>
              <h3 className="text-3xl font-bold text-emerald-600">{stats.totalStudents}</h3>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-5 transform group-hover:scale-110 transition-transform duration-300 text-amber-500">
                <Bed className="w-24 h-24" />
              </div>
              <p className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Available Beds</p>
              <h3 className="text-3xl font-bold text-amber-500">{stats.availableBeds}</h3>
            </div>
          </div>

          {/* Dashboard Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Active Blocks View */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-5 w-5 text-slate-400"/>
                <h3 className="text-[15px] font-bold text-slate-900">Block Overview</h3>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-1">
                <div className="space-y-1">
                  {blocksList.length === 0 ? (
                    <div className="p-5 text-center text-slate-500 text-sm">No active blocks found.</div>
                  ) : (
                    blocksList.map(block => (
                      <div key={block.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <div className="flex items-center space-x-4">
                          <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-[10px] tracking-widest shadow-sm border border-blue-100 uppercase">
                            {block.blockCode || 'BLK'}
                          </div>
                          <div>
                            <h4 className="text-[15px] font-bold text-slate-900">{block.blockName}</h4>
                            <p className="text-[13px] text-slate-500 mt-0.5">
                              {block.warden ? `Warden: ${block.warden.firstName} ${block.warden.lastName}` : 'No Warden Assigned'}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 sm:mt-0 flex sm:flex-col sm:items-end items-center justify-between">
                          <span className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-lg text-[10px] font-bold tracking-wider uppercase border ${
                            block.status === 'ACTIVE' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                              : 'bg-slate-50 text-slate-700 border-slate-200'
                          }`}>
                            {block.status === 'ACTIVE' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>}
                            {block.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Alert Cards Feed */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-slate-400"/>
                  <h3 className="text-[15px] font-bold text-slate-900">Notifications</h3>
                </div>
                <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded-lg">{alerts.length}</span>
              </div>

              <div className="space-y-3">
                {alerts.length === 0 ? (
                  <div className="p-5 text-center text-slate-500 text-sm">No new notifications.</div>
                ) : alerts.map((alert) => {
                  let bgClass = "bg-white border-slate-100";
                  let iconClass = "text-slate-400";
                  let Icon = AlertCircle;
                  
                  if (alert.type === 'WARNING') {
                    bgClass = "bg-amber-50 border-amber-100";
                    iconClass = "text-amber-600";
                  } else if (alert.type === 'INFO') {
                    bgClass = "bg-blue-50 border-blue-100";
                    iconClass = "text-blue-600";
                  }

                  return (
                    <div key={alert.id} className={`p-4 rounded-2xl border ${bgClass} shadow-sm transition-all hover:shadow-md`}>
                      <div className="flex gap-3 items-start">
                        <div className={`mt-0.5 ${iconClass}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <p className={`text-[14px] font-medium leading-snug ${alert.type === 'WARNING' ? 'text-amber-900' : 'text-blue-900'}`}>
                            {alert.message}
                          </p>
                          <p className="text-[11px] font-semibold text-slate-500 mt-1.5 uppercase tracking-wide">{alert.time}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
          </div>
        </>
      )}
    </>
  );
}
