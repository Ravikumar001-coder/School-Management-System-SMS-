import React, { useState, useEffect } from 'react';
import { Truck, Navigation, AlertCircle, CheckCircle, Activity, Map, Users, RefreshCw } from 'lucide-react';
import { getFleetStats, getVehicles, getRoutes, getEvents } from '../../../api/transportApi';
import { useToast } from '../../../hooks/useToast';

export default function FleetDashboard() {
  const [stats, setStats] = useState({
    totalVehicles: 0,
    activeVehicles: 0,
    maintenanceVehicles: 0,
    totalRoutes: 0,
    activeRoutes: 0,
    studentsAssigned: 0,
  });

  const [vehicles, setVehicles] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const branchId = 1;
      
      const [statsRes, vehiclesRes, routesRes] = await Promise.all([
        getFleetStats(branchId),
        getVehicles(branchId),
        getRoutes(branchId)
      ]);

      const fleetStats = statsRes.data;
      const allVehicles = vehiclesRes.data || [];
      const allRoutes = routesRes.data || [];
      
      setStats({
        totalVehicles: fleetStats.total || 0,
        activeVehicles: fleetStats.active || 0,
        maintenanceVehicles: fleetStats.maintenance || 0,
        totalRoutes: allRoutes.length,
        activeRoutes: allRoutes.filter(r => r.status === 'ACTIVE').length,
        studentsAssigned: fleetStats.totalCapacity || 0
      });

      setVehicles(allVehicles);

      // Fetch alerts for all active vehicles
      let allAlerts = [];
      const activeBusIds = allVehicles.filter(v => v.currentStatus === 'ACTIVE').map(v => v.id);
      
      for (const vId of activeBusIds) {
        try {
          const eventsRes = await getEvents(vId);
          if (eventsRes.data && eventsRes.data.length > 0) {
            allAlerts.push(...eventsRes.data.map(ev => ({
              id: ev.id,
              type: ev.eventType === 'OVERSPEED' || ev.eventType === 'ROUTE_DEVIATION' ? 'DANGER' : 'WARNING',
              message: `Vehicle ${vId}: ${ev.description || ev.eventType}`,
              time: new Date(ev.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
            })));
          }
        } catch (err) {
          console.warn('Failed to fetch events for vehicle', vId);
        }
      }
      
      if (allAlerts.length === 0) {
        allAlerts.push({ id: 'info-1', type: 'SUCCESS', message: 'All fleet operations normal. No active alerts.', time: 'Just now' });
      }
      
      setAlerts(allAlerts);

    } catch (err) {
      toast.error('Failed to load dashboard data from database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Sticky Header Blueprint */}
      <div className="sticky top-0 bg-white/95 backdrop-blur z-20 border-b border-slate-200 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Fleet Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">Mission Control for Institutional Transport.</p>
          </div>
          <button 
            onClick={fetchDashboardData}
            className="flex items-center justify-center w-12 h-[52px] text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors border border-slate-200 bg-white shadow-sm"
            title="Refresh Dashboard"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin text-blue-500' : ''}`} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-5 transform group-hover:scale-110 transition-transform duration-300">
              <Truck className="w-24 h-24" />
            </div>
            <p className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Total Fleet</p>
            <h3 className="text-3xl font-bold text-slate-900">{loading ? '-' : stats.totalVehicles}</h3>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-5 transform group-hover:scale-110 transition-transform duration-300 text-emerald-600">
              <Activity className="w-24 h-24" />
            </div>
            <p className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Active on Route</p>
            <h3 className="text-3xl font-bold text-emerald-600">{loading ? '-' : stats.activeVehicles}</h3>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-5 transform group-hover:scale-110 transition-transform duration-300 text-blue-600">
              <Navigation className="w-24 h-24" />
            </div>
            <p className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Total Routes</p>
            <h3 className="text-3xl font-bold text-blue-600">{loading ? '-' : stats.totalRoutes}</h3>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-5 transform group-hover:scale-110 transition-transform duration-300">
              <Users className="w-24 h-24" />
            </div>
            <p className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Total Capacity</p>
            <h3 className="text-3xl font-bold text-slate-900">{loading ? '-' : stats.studentsAssigned}</h3>
          </div>
        </div>

        {/* Dashboard Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Active Fleet View */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Map className="h-5 w-5 text-slate-400"/>
              <h3 className="text-[15px] font-bold text-slate-900">Active Fleet Monitor</h3>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-1">
              <div className="space-y-1">
                {loading && vehicles.length === 0 ? (
                  <div className="p-5 space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-[72px] bg-slate-50 rounded-xl animate-pulse"></div>
                    ))}
                  </div>
                ) : vehicles.length === 0 ? (
                  <div className="p-12 text-center">
                    <Truck className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-[15px] font-medium text-slate-900">No vehicles tracked</p>
                    <p className="text-sm text-slate-500 mt-1">Configure your first vehicle to see telemetry data.</p>
                  </div>
                ) : vehicles.map((bus) => (
                  <div key={bus.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors cursor-default border border-transparent hover:border-slate-100">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm shadow-sm border border-blue-100">
                        {bus.vehicleNumber ? bus.vehicleNumber.substring(0, 3) : 'BUS'}
                      </div>
                      <div>
                        <h4 className="text-[15px] font-bold text-slate-900">{bus.vehicleNumber} <span className="font-normal text-slate-500 ml-1">({bus.brand})</span></h4>
                        <p className="text-[13px] text-slate-500 mt-0.5">Seats: {bus.seatingCapacity || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="mt-3 sm:mt-0 flex sm:flex-col sm:items-end items-center justify-between">
                      <span className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-lg text-[11px] font-bold tracking-wider uppercase border ${
                        bus.currentStatus === 'ACTIVE' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                          : bus.currentStatus === 'MAINTENANCE'
                          ? 'bg-amber-50 text-amber-700 border-amber-100'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}>
                        {bus.currentStatus === 'ACTIVE' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>}
                        {bus.currentStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Alert Cards Feed */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-slate-400"/>
                <h3 className="text-[15px] font-bold text-slate-900">Live Alerts</h3>
              </div>
              <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded-lg">{alerts.length}</span>
            </div>

            <div className="space-y-3">
              {loading && alerts.length === 0 ? (
                <div className="h-24 bg-slate-100 rounded-2xl animate-pulse"></div>
              ) : alerts.map((alert) => {
                
                // Semantic Semantic Backgrounds
                let bgClass = "bg-white border-slate-100";
                let iconClass = "text-slate-400";
                let Icon = AlertCircle;
                
                if (alert.type === 'DANGER') {
                  bgClass = "bg-red-50 border-red-100";
                  iconClass = "text-red-600";
                } else if (alert.type === 'WARNING') {
                  bgClass = "bg-amber-50 border-amber-100";
                  iconClass = "text-amber-600";
                } else if (alert.type === 'SUCCESS') {
                  bgClass = "bg-emerald-50 border-emerald-100";
                  iconClass = "text-emerald-600";
                  Icon = CheckCircle;
                }

                return (
                  <div key={alert.id} className={`p-4 rounded-2xl border ${bgClass} shadow-sm transition-all hover:shadow-md`}>
                    <div className="flex gap-3 items-start">
                      <div className={`mt-0.5 ${iconClass}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className={`text-[14px] font-medium leading-snug ${alert.type === 'DANGER' ? 'text-red-900' : alert.type === 'WARNING' ? 'text-amber-900' : 'text-slate-800'}`}>
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
      </div>
    </div>
  );
}
