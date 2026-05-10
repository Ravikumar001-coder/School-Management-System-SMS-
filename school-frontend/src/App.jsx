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
const ParentListPage = lazy(() => import('./pages/admin/ParentListPage'));
const AddParentPage = lazy(() => import('./pages/admin/AddParentPage'));
const ParentDetailPage = lazy(() => import('./pages/admin/ParentDetailPage'));
const EditParentPage = lazy(() => import('./pages/admin/EditParentPage'));

// Teacher
const TeacherDashboard      = lazy(() => import('./pages/teacher/TeacherDashboard'));
const TeacherExamsPage      = lazy(() => import('./pages/teacher/TeacherExamsPage'));
const TeacherStudentsPage   = lazy(() => import('./pages/teacher/TeacherStudentsPage'));
const TeacherProfilePage    = lazy(() => import('./pages/teacher/TeacherProfilePage'));

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
        <BrowserRouter>
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

                   {/* Teacher */}
                   <Route path="/teacher/dashboard" element={<P roles={AT}><TeacherDashboard /></P>} />
                   <Route path="/teacher/attendance" element={<P roles={AT}><AttendancePage /></P>} />
                   <Route path="/teacher/exams" element={<P roles={AT}><TeacherExamsPage /></P>} />
                   <Route path="/teacher/students" element={<P roles={AT}><TeacherStudentsPage /></P>} />
                   <Route path="/teacher/profile" element={<P roles={AT}><TeacherProfilePage /></P>} />
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