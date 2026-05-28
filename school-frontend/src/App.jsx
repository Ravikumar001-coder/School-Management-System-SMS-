// src/App.jsx
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import AxiosToastWire from './components/common/AxiosToastWire';
import ErrorBoundary from './components/feedback/ErrorBoundary';
import Loading from './components/common/Loading';
import AppLayout from './components/layout/AppLayout';
import ParentLayout from './components/layout/ParentLayout';
import TeacherLayout from './components/layout/TeacherLayout';

// ── LAZY LOADED PAGES ──

// Public
const LoginPage        = lazy(() => import('./pages/LoginPage'));
const UnauthorizedPage = lazy(() => import('./pages/UnauthorizedPage'));
const ChangePasswordPage = lazy(() => import('./pages/ChangePasswordPage'));

// Admin
const AdminDashboard   = lazy(() => import('./pages/admin/AdminDashboard'));
const StudentsListPage = lazy(() => import('./pages/admin/StudentsListPage'));
const AddStudentPage   = lazy(() => import('./pages/admin/AddStudentPage'));
const StudentDetailPage = lazy(() => import('./pages/admin/StudentDetailPage'));
const EditStudentPage  = lazy(() => import('./pages/admin/EditStudentPage'));
const TeachersListPage = lazy(() => import('./pages/admin/TeachersListPage'));
const AddTeacherPage   = lazy(() => import('./pages/admin/AddTeacherPage'));
const TeacherDetailPage = lazy(() => import('./pages/admin/TeacherDetailPage'));
const EditTeacherPage  = lazy(() => import('./pages/admin/EditTeacherPage'));
const ClassesPage      = lazy(() => import('./pages/admin/ClassesPage'));
const SubjectsPage     = lazy(() => import('./pages/admin/SubjectsPage'));
const AttendancePage   = lazy(() => import('./pages/admin/AttendancePage'));
const ExamsPage        = lazy(() => import('./pages/admin/ExamsPage'));
const CreateExamPage   = lazy(() => import('./pages/admin/CreateExamPage'));
const EnterMarksPage   = lazy(() => import('./pages/admin/EnterMarksPage'));
const FeesPage         = lazy(() => import('./pages/admin/FeesPage'));
const CollectFeePage   = lazy(() => import('./pages/admin/CollectFeePage'));
const FeeInvoicePage   = lazy(() => import('./pages/admin/FeeInvoicePage'));
const BackupDashboard  = lazy(() => import('./pages/admin/BackupDashboard'));
const RolePermissionMatrix = lazy(() => import('./pages/admin/RolePermissionMatrix'));
const SessionDashboard = lazy(() => import('./pages/admin/SessionDashboard'));
const AuditLogListPage = lazy(() => import('./pages/admin/AuditLogListPage'));
const ExamRankingsPage = lazy(() => import('./pages/admin/ExamRankingsPage'));
const ParentListPage = lazy(() => import('./pages/admin/ParentListPage'));
const AddParentPage = lazy(() => import('./pages/admin/AddParentPage'));
const ParentDetailPage = lazy(() => import('./pages/admin/ParentDetailPage'));
const EditParentPage = lazy(() => import('./pages/admin/EditParentPage'));
const DepartmentsPage = lazy(() => import('./pages/admin/DepartmentsPage'));
const NoticesPage = lazy(() => import('./pages/admin/NoticesPage'));
const TimetableManagementPage = lazy(() => import('./pages/admin/TimetableManagementPage'));
const AdmissionCRM      = lazy(() => import('./pages/admin/AdmissionCRM'));
const PromotionEngine   = lazy(() => import('./pages/admin/PromotionEngine'));
const IdCardGenerator   = lazy(() => import('./pages/admin/IdCardGenerator'));

// Transport
const FleetDashboard = lazy(() => import('./pages/admin/transport/FleetDashboard'));
const LiveTrackingMap = lazy(() => import('./pages/admin/transport/LiveTrackingMap'));
const RouteManager = lazy(() => import('./pages/admin/transport/RouteManager'));
const VehicleManager = lazy(() => import('./pages/admin/transport/VehicleManager'));
const DriverManager = lazy(() => import('./pages/admin/transport/DriverManager'));
const StudentTransportMapping = lazy(() => import('./pages/admin/transport/StudentTransportMapping'));
const TripPlaybackMap = lazy(() => import('./pages/admin/transport/TripPlaybackMap'));

// Hostel
const WardenDashboard = lazy(() => import('./pages/admin/hostel/WardenDashboard'));
const HostelInfrastructure = lazy(() => import('./pages/admin/hostel/HostelInfrastructure'));
const RoomAllocation = lazy(() => import('./pages/admin/hostel/RoomAllocation'));
const HostelAttendance = lazy(() => import('./pages/admin/hostel/HostelAttendance'));
const MessDashboard = lazy(() => import('./pages/admin/hostel/mess/MessDashboard'));
const MessPlans = lazy(() => import('./pages/admin/hostel/mess/MessPlans'));
const MessBilling = lazy(() => import('./pages/admin/hostel/mess/MessBilling'));
const MessPayments = lazy(() => import('./pages/admin/hostel/mess/MessPayments'));

// HRMS
const StaffOnboardingWizard = lazy(() => import('./pages/admin/hrms/StaffOnboardingWizard'));
const PayrollDashboard = lazy(() => import('./pages/admin/hrms/PayrollDashboard'));
const LeaveApprovalCenter = lazy(() => import('./pages/admin/hrms/LeaveApprovalCenter'));
const ComplianceDashboard = lazy(() => import('./pages/admin/hrms/ComplianceDashboard'));
const PerformanceReviewBoard = lazy(() => import('./pages/admin/hrms/PerformanceReviewBoard'));

// Teacher
const TeacherDashboard      = lazy(() => import('./pages/teacher/TeacherDashboard'));

// Finance (Enterprise Module)
const FinanceDashboard = lazy(() => import('./pages/admin/finance/FinanceDashboard'));
const ChartOfAccountsUI = lazy(() => import('./pages/admin/finance/ChartOfAccountsUI'));
const JournalEntryUI = lazy(() => import('./pages/admin/finance/JournalEntryUI'));
const TrialBalanceReport = lazy(() => import('./pages/admin/finance/TrialBalanceReport'));
const ExpenseTrackerUI = lazy(() => import('./pages/admin/finance/ExpenseTrackerUI'));
const VendorPaymentsUI = lazy(() => import('./pages/admin/finance/VendorPaymentsUI'));
const SalaryPayoutsUI = lazy(() => import('./pages/admin/finance/SalaryPayoutsUI'));
const FinancialReportsUI = lazy(() => import('./pages/admin/finance/FinancialReportsUI'));
const TallyExportUI = lazy(() => import('./pages/admin/finance/TallyExportUI'));

const TeacherExamsPage      = lazy(() => import('./pages/teacher/TeacherExamsPage'));
const TeacherStudentsPage   = lazy(() => import('./pages/teacher/TeacherStudentsPage'));
const TeacherProfilePage    = lazy(() => import('./pages/teacher/TeacherProfilePage'));
const TeacherQuickAttendance = lazy(() => import('./pages/teacher/TeacherQuickAttendance'));
const TeacherTimetable      = lazy(() => import('./pages/teacher/TeacherTimetable'));
const TeacherDiary          = lazy(() => import('./pages/teacher/TeacherDiary'));
const TeacherLessonPlanner  = lazy(() => import('./pages/teacher/TeacherLessonPlanner'));
const TeacherExamPapers     = lazy(() => import('./pages/teacher/TeacherExamPapers'));
const TeacherReports        = lazy(() => import('./pages/teacher/TeacherReports'));
const TeacherResources      = lazy(() => import('./pages/teacher/TeacherResources'));
const TeacherSettings       = lazy(() => import('./pages/teacher/TeacherSettings'));
const TeacherHomework       = lazy(() => import('./pages/teacher/TeacherHomework'));
const SubstituteManagement  = lazy(() => import('./pages/teacher/SubstituteManagement'));

// Parent
const ParentLogin = lazy(() => import('./pages/parent/ParentLogin'));
const ParentDashboard = lazy(() => import('./pages/parent/ParentDashboard'));
const ParentAttendancePage = lazy(() => import('./pages/parent/ParentAttendancePage'));
const ParentFeesPage = lazy(() => import('./pages/parent/ParentFeesPage'));
const ParentHomeworkPage = lazy(() => import('./pages/parent/ParentHomeworkPage'));
const ParentLeavePage = lazy(() => import('./pages/parent/ParentLeavePage'));
const ParentCircularsPage = lazy(() => import('./pages/parent/ParentCircularsPage'));
const ParentComplaintsPage = lazy(() => import('./pages/parent/ParentComplaintsPage'));
const ParentPtmPage = lazy(() => import('./pages/parent/ParentPtmPage'));
const ParentResultsPage = lazy(() => import('./pages/parent/ParentResultsPage'));
const ParentDownloadsPage = lazy(() => import('./pages/parent/ParentDownloadsPage'));
const ParentConsentPage = lazy(() => import('./pages/parent/ParentConsentPage'));
const ParentProfilePage = lazy(() => import('./pages/parent/ParentProfilePage'));
const ParentDiaryPage   = lazy(() => import('./pages/parent/ParentDiaryPage'));

// Student
const StudentDashboard = lazy(() => import('./pages/student/StudentDashboard'));
const MyAttendancePage = lazy(() => import('./pages/student/MyAttendancePage'));
const MyExamsPage      = lazy(() => import('./pages/student/MyExamsPage'));
const ReportCardPage   = lazy(() => import('./pages/student/ReportCardPage'));
const MyFeesPage       = lazy(() => import('./pages/student/MyFeesPage'));
const StudentProfile   = lazy(() => import('./pages/student/StudentProfile'));

// Role Groups
const A  = ['ADMIN', 'SUPERADMIN'];
const AT = ['ADMIN', 'TEACHER', 'SUPERADMIN'];
const S  = ['STUDENT', 'PARENT'];

const DashboardRedirect = () => {
  const { user } = useAuth();
  const rawRoles = user?.roles ?? (user?.role ? [user.role] : []);
  const roles = rawRoles.map(r => String(r).replace(/^ROLE_/, '').toUpperCase());

  if (roles.includes('SUPERADMIN') || roles.includes('ADMIN')) return <Navigate to="/admin/dashboard" replace />;
  if (roles.includes('TEACHER')) return <Navigate to="/teacher/dashboard" replace />;
  if (roles.includes('PARENT')) return <Navigate to="/parent/dashboard" replace />;
  return <Navigate to="/student/dashboard" replace />;
};

const P = ({ roles, children }) => (
  <ProtectedRoute allowedRoles={roles}>{children}</ProtectedRoute>
);

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ToastProvider>
            <AxiosToastWire />
            <Suspense fallback={<Loading fullScreen />}>
              <Routes>
                {/* Public */}
                <Route path="/"             element={<Navigate to="/login" />} />
                <Route path="/login"        element={<LoginPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
                <Route path="/parent/login" element={<ParentLogin />} />
                
                {/* ── PROTECTED ROUTES (WITH LAYOUT) ── */}
                <Route element={<P roles={['ADMIN', 'TEACHER', 'STUDENT', 'SUPERADMIN', 'PARENT']}><AppLayout /></P>}>
                   <Route path="/change-password" element={<ChangePasswordPage />} />
                   <Route path="/dashboard" element={<DashboardRedirect />} />
                   
                   {/* Admin */}
                   <Route path="/admin/dashboard" element={<P roles={A}><AdminDashboard /></P>} />
                   <Route path="/admin/students" element={<P roles={A}><StudentsListPage /></P>} />
                   <Route path="/admin/students/new" element={<P roles={A}><AddStudentPage /></P>} />
                   <Route path="/admin/students/:id" element={<P roles={A}><StudentDetailPage /></P>} />
                   <Route path="/admin/students/:id/edit" element={<P roles={A}><EditStudentPage /></P>} />
                   <Route path="/admin/teachers" element={<P roles={A}><TeachersListPage /></P>} />
                   <Route path="/admin/teachers/new" element={<P roles={A}><AddTeacherPage /></P>} />
                   <Route path="/admin/teachers/:id" element={<P roles={A}><TeacherDetailPage /></P>} />
                   <Route path="/admin/teachers/:id/edit" element={<P roles={A}><EditTeacherPage /></P>} />
                   <Route path="/admin/classes" element={<P roles={A}><ClassesPage /></P>} />
                   <Route path="/admin/subjects" element={<P roles={A}><SubjectsPage /></P>} />
                   <Route path="/admin/attendance" element={<P roles={AT}><AttendancePage /></P>} />
                   <Route path="/admin/exams" element={<P roles={AT}><ExamsPage /></P>} />
                   <Route path="/admin/exams/new" element={<P roles={A}><CreateExamPage /></P>} />
                   <Route path="/admin/exams/:id/marks" element={<P roles={AT}><EnterMarksPage /></P>} />
                   <Route path="/admin/exams/:examId/rankings" element={<P roles={AT}><ExamRankingsPage /></P>} />
                   <Route path="/admin/fees" element={<P roles={A}><FeesPage /></P>} />
                   <Route path="/admin/fees/collect" element={<P roles={A}><CollectFeePage /></P>} />
                   <Route path="/admin/fees/invoice/:id" element={<P roles={A}><FeeInvoicePage /></P>} />
                   <Route path="/admin/backups" element={<P roles={A}><BackupDashboard /></P>} />
                   <Route path="/admin/roles" element={<P roles={A}><RolePermissionMatrix /></P>} />
                   <Route path="/admin/sessions" element={<P roles={['ADMIN','TEACHER','STUDENT','SUPERADMIN']}><SessionDashboard /></P>} />
                   <Route path="/admin/audit-logs" element={<P roles={A}><AuditLogListPage /></P>} />
                   <Route path="/admin/parents" element={<P roles={A}><ParentListPage /></P>} />
                   <Route path="/admin/parents/new" element={<P roles={A}><AddParentPage /></P>} />
                   <Route path="/admin/parents/:id" element={<P roles={A}><ParentDetailPage /></P>} />
                   <Route path="/admin/parents/:id/edit" element={<P roles={A}><EditParentPage /></P>} />
                   <Route path="/admin/departments" element={<P roles={A}><DepartmentsPage /></P>} />
                   <Route path="/admin/notices" element={<P roles={A}><NoticesPage /></P>} />
                   <Route path="/admin/timetable" element={<P roles={A}><TimetableManagementPage /></P>} />
                   <Route path="/admin/admissions/crm" element={<P roles={A}><AdmissionCRM /></P>} />
                   <Route path="/admin/promotions" element={<P roles={A}><PromotionEngine /></P>} />
                   <Route path="/admin/id-cards" element={<P roles={A}><IdCardGenerator /></P>} />
                   
                   {/* Transport */}
                   <Route path="/admin/transport/dashboard" element={<P roles={A}><FleetDashboard /></P>} />
                   <Route path="/admin/transport/tracking" element={<P roles={A}><LiveTrackingMap /></P>} />
                   <Route path="/admin/transport/routes" element={<P roles={A}><RouteManager /></P>} />
                   <Route path="/admin/transport/vehicles" element={<P roles={A}><VehicleManager /></P>} />
                   <Route path="/admin/transport/drivers" element={<P roles={A}><DriverManager /></P>} />
                   <Route path="/admin/transport/assignments" element={<P roles={A}><StudentTransportMapping /></P>} />
                   <Route path="/admin/transport/playback" element={<P roles={A}><TripPlaybackMap /></P>} />

                   {/* Hostel */}
                   <Route path="/admin/hostel/dashboard" element={<P roles={A}><WardenDashboard /></P>} />
                   <Route path="/admin/hostel/infrastructure" element={<P roles={A}><HostelInfrastructure /></P>} />
                   <Route path="/admin/hostel/allocations" element={<P roles={A}><RoomAllocation /></P>} />
                   <Route path="/admin/hostel/attendance" element={<P roles={A}><HostelAttendance /></P>} />
                   <Route path="/admin/hostel/mess/dashboard" element={<P roles={A}><MessDashboard /></P>} />
                   <Route path="/admin/hostel/mess/plans" element={<P roles={A}><MessPlans /></P>} />
                   <Route path="/admin/hostel/mess/bills" element={<P roles={A}><MessBilling /></P>} />
                   <Route path="/admin/hostel/mess/payments" element={<P roles={A}><MessPayments /></P>} />

                   {/* HRMS */}
                   <Route path="/admin/hrms/onboarding" element={<P roles={A}><StaffOnboardingWizard /></P>} />
                   <Route path="/admin/hrms/payroll" element={<P roles={A}><PayrollDashboard /></P>} />
                   <Route path="/admin/hrms/leave" element={<P roles={A}><LeaveApprovalCenter /></P>} />
                   <Route path="/admin/hrms/compliance" element={<P roles={A}><ComplianceDashboard /></P>} />
                   <Route path="/admin/hrms/performance" element={<P roles={A}><PerformanceReviewBoard /></P>} />

                   {/* Finance */}
                   <Route path="/admin/finance/dashboard" element={<P roles={A}><FinanceDashboard /></P>} />
                   <Route path="/admin/finance/coa" element={<P roles={A}><ChartOfAccountsUI /></P>} />
                   <Route path="/admin/finance/journal" element={<P roles={A}><JournalEntryUI /></P>} />
                   <Route path="/admin/finance/trial-balance" element={<P roles={A}><TrialBalanceReport /></P>} />
                   <Route path="/admin/finance/expenses" element={<P roles={A}><ExpenseTrackerUI /></P>} />
                   <Route path="/admin/finance/vendors" element={<P roles={A}><VendorPaymentsUI /></P>} />
                   <Route path="/admin/finance/salary-payouts" element={<P roles={A}><SalaryPayoutsUI /></P>} />
                   <Route path="/admin/finance/reports" element={<P roles={A}><FinancialReportsUI /></P>} />
                   <Route path="/admin/finance/tally" element={<P roles={A}><TallyExportUI /></P>} />


                   {/* Teacher routes are moved down to TeacherLayout */}
                </Route>

                {/* Teacher OS - Unified Mobile Shell */}
                <Route element={<P roles={AT}><TeacherLayout /></P>}>
                  <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
                  <Route path="/teacher/quick-attendance" element={<TeacherQuickAttendance />} />
                  <Route path="/teacher/attendance" element={<AttendancePage />} />
                  <Route path="/teacher/timetable" element={<TeacherTimetable />} />
                  <Route path="/teacher/diary" element={<TeacherDiary />} />
                  <Route path="/teacher/exams" element={<TeacherExamsPage />} />
                  <Route path="/teacher/exams/:id/marks" element={<EnterMarksPage />} />
                  <Route path="/teacher/lesson-plans" element={<TeacherLessonPlanner />} />
                  <Route path="/teacher/exam-papers" element={<TeacherExamPapers />} />
                  <Route path="/teacher/students" element={<TeacherStudentsPage />} />
                  <Route path="/teacher/profile" element={<TeacherProfilePage />} />
                  <Route path="/teacher/reports" element={<TeacherReports />} />
                  <Route path="/teacher/resources" element={<TeacherResources />} />
                  <Route path="/teacher/settings" element={<TeacherSettings />} />
                  <Route path="/teacher/homework" element={<TeacherHomework />} />
                  <Route path="/teacher/substitutes" element={<SubstituteManagement />} />
                </Route>

                {/* Parent Super App - Unified Mobile Shell */}
                <Route element={<P roles={['PARENT']}><ParentLayout /></P>}>
                  <Route path="/parent/dashboard" element={<ParentDashboard />} />
                  <Route path="/parent/attendance" element={<ParentAttendancePage />} />
                  <Route path="/parent/fees" element={<ParentFeesPage />} />
                  <Route path="/parent/homework" element={<ParentHomeworkPage />} />
                  <Route path="/parent/leave" element={<ParentLeavePage />} />
                  <Route path="/parent/circulars" element={<ParentCircularsPage />} />
                  <Route path="/parent/complaints" element={<ParentComplaintsPage />} />
                  <Route path="/parent/ptm" element={<ParentPtmPage />} />
                  <Route path="/parent/results" element={<ParentResultsPage />} />
                  <Route path="/parent/downloads" element={<ParentDownloadsPage />} />
                  <Route path="/parent/consent" element={<ParentConsentPage />} />
                  <Route path="/parent/profile" element={<ParentProfilePage />} />
                  <Route path="/parent/diary" element={<ParentDiaryPage />} />
                </Route>

                {/* Student */}
                <Route element={<P roles={['ADMIN', 'TEACHER', 'STUDENT', 'SUPERADMIN', 'PARENT']}><AppLayout /></P>}>
                   <Route path="/student/dashboard" element={<P roles={S}><StudentDashboard /></P>} />
                   <Route path="/student/attendance" element={<P roles={S}><MyAttendancePage /></P>} />
                   <Route path="/student/exams" element={<P roles={S}><MyExamsPage /></P>} />
                   <Route path="/student/report-card" element={<P roles={S}><ReportCardPage /></P>} />
                   <Route path="/student/fees" element={<P roles={S}><MyFeesPage /></P>} />
                   <Route path="/student/profile" element={<P roles={S}><StudentProfile /></P>} />
                </Route>

                {/* 404 */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Suspense>
          </ToastProvider>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;