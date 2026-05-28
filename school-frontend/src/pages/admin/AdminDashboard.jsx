import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardApi } from '../../api/dashboardApi';
import useFetch from '../../hooks/useFetch';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import KPIStatsGrid from '../../components/dashboard/KPIStatsGrid';
import InstitutionHealth from '../../components/dashboard/InstitutionHealth';
import AttendanceTrends from '../../components/dashboard/AttendanceTrends';
import CriticalAlerts from '../../components/dashboard/CriticalAlerts';
import DepartmentOverviews from '../../components/dashboard/DepartmentOverviews';
import OperationalBottomRow from '../../components/dashboard/OperationalBottomRow';
import ErrorBoundary from '../../components/common/ErrorBoundary';

import QuickActionModal from '../../components/dashboard/QuickActionModal';
import ScheduleReportModal from '../../components/dashboard/ScheduleReportModal';

import StudentAnalyticsDrawer from '../../components/dashboard/drawers/StudentAnalyticsDrawer';
import FinanceAnalyticsDrawer from '../../components/dashboard/drawers/FinanceAnalyticsDrawer';
import AttendanceDetailsDrawer from '../../components/dashboard/drawers/AttendanceDetailsDrawer';
import AlertResolutionModal from '../../components/dashboard/modals/AlertResolutionModal';

import { useDashboardWebsocket } from '../../hooks/useDashboardWebsocket';
import { useDashboardFilters, DashboardFilterProvider } from '../../contexts/DashboardFilterContext';

import { UserPlus, User, Shield, Landmark, FileText, Briefcase, Users, Megaphone, Truck, Home, BookOpen, Sparkles } from 'lucide-react';

const AdminDashboardContent = () => {
  const navigate = useNavigate();
  const { filters } = useDashboardFilters();
  
  // Stabilize the apiCall so it only changes when branchId changes
  const stableApiCall = useCallback(
    () => dashboardApi.admin(filters.branchId),
    [filters.branchId]
  );

  const { data: stats, loading, error, execute } = useFetch(stableApiCall, {
    initialData: {},
    errorMessage: "Unable to refresh dashboard stats."
  });

  // Websocket Integration
  const { isConnected } = useDashboardWebsocket(
    useCallback(() => { execute(); }, [execute]),
    useCallback(() => { execute(); }, [execute])
  );

  const [activeAction, setActiveAction] = useState(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  // Drawer States
  const [activeDrawer, setActiveDrawer] = useState(null);
  const [attendanceDate, setAttendanceDate] = useState(null);
  
  // Alert State
  const [activeAlert, setActiveAlert] = useState(null);

  // Auto-refresh polling as fallback if WS fails (every 60s)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isConnected) execute();
    }, 60000);
    return () => clearInterval(interval);
  }, [execute, isConnected]);

  const quickActionButtons = [
    { label: 'Admit Student', icon: UserPlus, actionType: 'ADD_STUDENT', bg: 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100' },
    { label: 'Add Staff', icon: User, actionType: 'ADD_STAFF', bg: 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100' },
    { label: 'Add Teacher', icon: Shield, actionType: 'ADD_TEACHER', bg: 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100' },
    { label: 'Collect Fees', icon: Landmark, actionType: 'COLLECT_FEES', bg: 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100' },
    { label: 'Create Invoice', icon: FileText, actionType: 'CREATE_INVOICE', bg: 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100' },
    { label: 'Run Payroll', icon: Briefcase, actionType: 'RUN_PAYROLL', bg: 'bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-100' },
    { label: 'Mark Attendance', icon: Users, actionType: 'MARK_ATTENDANCE', bg: 'bg-sky-50 text-sky-600 border-sky-100 hover:bg-sky-100' },
    { label: 'Add Expense', icon: Landmark, actionType: 'ADD_EXPENSE', bg: 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100' },
    { label: 'Send Notice', icon: Megaphone, actionType: 'SEND_NOTICE', bg: 'bg-violet-50 text-violet-600 border-violet-100 hover:bg-violet-100' },
    { label: 'Register Vehicle', icon: Truck, actionType: 'REGISTER_VEHICLE', bg: 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100' },
    { label: 'Allocate Hostel', icon: Home, actionType: 'ALLOCATE_HOSTEL', bg: 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100' },
    { label: 'Create Exam', icon: BookOpen, actionType: 'CREATE_EXAM', bg: 'bg-teal-50 text-teal-600 border-teal-100 hover:bg-teal-100' },
  ];

  return (
    <div className="animate-fade-in -mt-2 p-4 lg:p-0">
      <DashboardHeader 
        title="Enterprise Operational Control Center" 
        subtitle={isConnected ? "Real-time connection active" : "Connecting to live feed..."} 
      />

      <ErrorBoundary>
        <KPIStatsGrid 
            stats={stats} 
            loading={loading} 
            onCardClick={(type) => {
                if (type === 'STUDENTS') setActiveDrawer('STUDENTS');
                else if (type === 'FINANCE') setActiveDrawer('FINANCE');
                else if (type === 'ATTENDANCE') {
                    setAttendanceDate(new Date().toISOString().split('T')[0]);
                    setActiveDrawer('ATTENDANCE_DETAILS');
                }
                else if (type === 'TRANSPORT') navigate('/admin/transport/dashboard');
                else if (type === 'HOSTEL') navigate('/admin/hostel/dashboard');
                else if (type === 'HR') navigate('/admin/teachers');
                else navigate(`/admin/${type.toLowerCase()}`);
            }}
        />
      </ErrorBoundary>

      {/* QUICK ACTION CENTER */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-6">
        <h3 className="text-xs font-black text-slate-800 mb-4 flex items-center gap-2">
          <Sparkles size={16} className="text-indigo-600 animate-pulse" />
          Enterprise Operational Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {quickActionButtons.map((btn, index) => (
            <button
              key={index}
              onClick={() => setActiveAction(btn.actionType)}
              className={`flex items-center gap-3 p-3 rounded-xl border font-bold text-xs transition-all text-left ${btn.bg}`}
            >
              <btn.icon size={16} className="flex-shrink-0" />
              <span className="leading-tight">{btn.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ROW 2: LIVE OPERATIONAL OVERVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="lg:col-span-1">
          <ErrorBoundary>
             <InstitutionHealth healthScore={stats?.summary?.healthScore} loading={loading} />
          </ErrorBoundary>
        </div>
        <div className="lg:col-span-2">
          <ErrorBoundary>
             <AttendanceTrends 
                 trends={stats?.trends} 
                 loading={loading} 
                 onDateClick={(date) => {
                     setAttendanceDate(date);
                     setActiveDrawer('ATTENDANCE_DETAILS');
                 }}
             />
          </ErrorBoundary>
        </div>
        <div className="lg:col-span-1">
          <ErrorBoundary>
             <CriticalAlerts 
                 alerts={stats?.criticalAlerts} 
                 loading={loading} 
                 onAlertClick={(alert) => setActiveAlert(alert)}
             />
          </ErrorBoundary>
        </div>
      </div>

      {/* ROW 3: ACADEMIC + HR + FINANCE + OPERATIONS GRID */}
      <ErrorBoundary>
         <DepartmentOverviews 
             stats={stats} 
             loading={loading} 
             onActionClick={(action) => setActiveAction(action)}
         />
      </ErrorBoundary>

      {/* ROW 4: ACTIVITY, TOP CLASSES, FEES, EXPORTS */}
      <ErrorBoundary>
        <OperationalBottomRow 
          recentActivity={stats?.recentActivity} 
          loading={loading} 
          onScheduleReportClick={() => setIsScheduleOpen(true)}
          onViewAllActivityClick={() => navigate('/admin/audit-logs')}
        />
      </ErrorBoundary>

      {/* Action Modals */}
      <QuickActionModal
        isOpen={activeAction !== null}
        onClose={() => setActiveAction(null)}
        actionType={activeAction}
        onComplete={() => execute()}
      />

      <ScheduleReportModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
      />

      {/* Drill-down Drawers & Modals */}
      <StudentAnalyticsDrawer 
          isOpen={activeDrawer === 'STUDENTS'} 
          onClose={() => setActiveDrawer(null)} 
          branchId={filters.branchId} 
      />

      <FinanceAnalyticsDrawer 
          isOpen={activeDrawer === 'FINANCE'} 
          onClose={() => setActiveDrawer(null)} 
          branchId={filters.branchId} 
      />

      <AttendanceDetailsDrawer 
          isOpen={activeDrawer === 'ATTENDANCE_DETAILS'} 
          onClose={() => {
              setActiveDrawer(null);
              setAttendanceDate(null);
          }} 
          date={attendanceDate}
          branchId={filters.branchId} 
      />

      <AlertResolutionModal
          isOpen={activeAlert !== null}
          onClose={() => setActiveAlert(null)}
          alert={activeAlert}
          onResolved={() => execute()}
      />
    </div>
  );
};

const AdminDashboard = () => (
  <DashboardFilterProvider>
    <AdminDashboardContent />
  </DashboardFilterProvider>
);

export default AdminDashboard;
