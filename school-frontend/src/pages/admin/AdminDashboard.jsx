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
    { label: 'Admit Student', icon: UserPlus, actionType: 'ADD_STUDENT' },
    { label: 'Add Staff', icon: User, actionType: 'ADD_STAFF' },
    { label: 'Add Teacher', icon: Shield, actionType: 'ADD_TEACHER' },
    { label: 'Collect Fees', icon: Landmark, actionType: 'COLLECT_FEES' },
    { label: 'Create Invoice', icon: FileText, actionType: 'CREATE_INVOICE' },
    { label: 'Run Payroll', icon: Briefcase, actionType: 'RUN_PAYROLL' },
    { label: 'Mark Attendance', icon: Users, actionType: 'MARK_ATTENDANCE' },
    { label: 'Add Expense', icon: Landmark, actionType: 'ADD_EXPENSE' },
    { label: 'Send Notice', icon: Megaphone, actionType: 'SEND_NOTICE' },
    { label: 'Register Vehicle', icon: Truck, actionType: 'REGISTER_VEHICLE' },
    { label: 'Allocate Hostel', icon: Home, actionType: 'ALLOCATE_HOSTEL' },
    { label: 'Create Exam', icon: BookOpen, actionType: 'CREATE_EXAM' },
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
      <div className="bg-white p-5 rounded-[16px] border border-[#f1f5f9] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] mb-6">
        <h3 className="text-[16px] font-semibold text-[#1E40AF] mb-4 flex items-center gap-2">
          <Sparkles size={16} className="animate-pulse" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-5">
          {quickActionButtons.map((btn, index) => (
            <button
              key={index}
              onClick={() => setActiveAction(btn.actionType)}
              className={`flex items-center gap-3 p-3 rounded-[16px] bg-white border border-[#f1f5f9] text-[#1E40AF] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] hover:-translate-y-0.5 hover:shadow-[0_10px_15px_-3px_rgb(0,0,0,0.1),0_4px_6px_-4px_rgb(0,0,0,0.1)] transition-all text-left font-semibold text-[12px] min-h-[44px]`}
            >
              <btn.icon size={16} className="flex-shrink-0" />
              <span className="leading-tight">{btn.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ROW 2: LIVE OPERATIONAL OVERVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 mb-6">
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
