import { 
  LayoutDashboard, 
  Users, 
  UserSquare2, 
  CalendarCheck, 
  CreditCard, 
  ClipboardList, 
  Settings, 
  GraduationCap,
  BookOpen,
  ShieldCheck,
  Database,
  FileText,
  UserCircle,
  Monitor,
  Truck,
  Home,
  Briefcase,
  Megaphone
} from 'lucide-react';


/**
 * Global Menu Configuration
 * This drives the Sidebar, Mobile Nav, and Breadcrumbs.
 */
export const menuConfig = [
  // --- SHARED / ADMIN ---
  {
    id: 'dashboard',
    title: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
    roles: ['ADMIN', 'SUPERADMIN', 'TEACHER', 'STUDENT']
  },
  
  // --- ADMIN SECTION ---
  {
    id: 'students',
    title: 'Students',
    icon: Users,
    roles: ['ADMIN', 'SUPERADMIN'],
    children: [
      { id: 'students-list', title: 'Directory', path: '/admin/students', permission: 'STUDENTS_VIEW' },
      { id: 'students-new', title: 'Admit Student', path: '/admin/students/new', permission: 'STUDENTS_CREATE' },
      { id: 'attendance', title: 'Daily Attendance', path: '/admin/attendance', permission: 'ATTENDANCE_EDIT' }
    ]
  },
  {
    id: 'teachers',
    title: 'Faculty',
    icon: UserSquare2,
    roles: ['ADMIN', 'SUPERADMIN'],
    children: [
      { id: 'teachers-list', title: 'Teachers Directory', path: '/admin/teachers', permission: 'TEACHERS_VIEW' },
      { id: 'teachers-new', title: 'Hire Teacher', path: '/admin/teachers/new', permission: 'TEACHERS_CREATE' }
    ]
  },
  {
    id: 'academic',
    title: 'Academic',
    icon: GraduationCap,
    roles: ['ADMIN', 'SUPERADMIN'],
    children: [
      { id: 'students', title: 'Students List',  path: '/admin/students' },
      { id: 'parents',  title: 'Parent Directory', path: '/admin/parents' },
      { id: 'classes', title: 'Classes & Sections', path: '/admin/classes', permission: 'CLASSES_VIEW' },
      { id: 'subjects', title: 'Subject Registry', path: '/admin/subjects', permission: 'CLASSES_VIEW' },
      { id: 'departments', title: 'Departments', path: '/admin/departments', permission: 'CLASSES_VIEW' },
      { id: 'timetable', title: 'School Timetable', path: '/admin/timetable', permission: 'CLASSES_VIEW' },
      { id: 'exams', title: 'Exams & Results', path: '/admin/exams', permission: 'ATTENDANCE_VIEW' }
    ]
  },
  {
    id: 'communication',
    title: 'Communication',
    icon: Megaphone,
    roles: ['ADMIN', 'SUPERADMIN'],
    children: [
      { id: 'notices', title: 'Bulletin Board', path: '/admin/notices', permission: 'SYSTEM_ADMIN' }
    ]
  },
  {
    id: 'transport',
    title: 'Transport',
    icon: Truck,
    roles: ['ADMIN', 'SUPERADMIN'],
    children: [
      { id: 'transport-dashboard', title: 'Fleet Dashboard', path: '/admin/transport/dashboard' },
      { id: 'transport-tracking', title: 'Live Tracking', path: '/admin/transport/tracking' },
      { id: 'transport-playback', title: 'GPS Playback', path: '/admin/transport/playback' },
      { id: 'transport-routes', title: 'Route Manager', path: '/admin/transport/routes' },
      { id: 'transport-vehicles', title: 'Vehicle Manager', path: '/admin/transport/vehicles' },
      { id: 'transport-drivers', title: 'Driver Manager', path: '/admin/transport/drivers' },
      { id: 'transport-assignments', title: 'Student Assignment', path: '/admin/transport/assignments' }
    ]
  },
  {
    id: 'finance',
    title: 'Finance & Accounts',
    icon: CreditCard,
    roles: ['ADMIN', 'SUPERADMIN'],
    children: [
      { id: 'finance-dashboard', title: 'Overview', path: '/admin/finance/dashboard' },
      { id: 'fees-list', title: 'Fees Dashboard', path: '/admin/fees', permission: 'FEES_VIEW' },
      { id: 'fees-collect', title: 'Fee Collection', path: '/admin/fees/collect', permission: 'FEES_EDIT' },
      { id: 'finance-coa', title: 'Chart of Accounts', path: '/admin/finance/coa' },
      { id: 'finance-journal', title: 'Journal Entries', path: '/admin/finance/journal' },
      { id: 'finance-tb', title: 'Trial Balance', path: '/admin/finance/trial-balance' },
      { id: 'finance-expenses', title: 'Expenses & Invoices', path: '/admin/finance/expenses' },
      { id: 'finance-vendors', title: 'Vendor Management', path: '/admin/finance/vendors' },
      { id: 'finance-salary', title: 'Payroll & Salary', path: '/admin/finance/salary-payouts' },
      { id: 'finance-reports', title: 'Financial Statements', path: '/admin/finance/reports' },
      { id: 'finance-tally', title: 'Tally Integration', path: '/admin/finance/tally' }
    ]
  },
  {
    id: 'hostel',
    title: 'Hostel',
    icon: Home,
    roles: ['ADMIN', 'SUPERADMIN'],
    children: [
      { id: 'hostel-dashboard', title: 'Warden Dashboard', path: '/admin/hostel/dashboard' },
      { id: 'hostel-infrastructure', title: 'Infrastructure', path: '/admin/hostel/infrastructure' },
      { id: 'hostel-allocations', title: 'Allocations', path: '/admin/hostel/allocations' },
      { id: 'hostel-attendance', title: 'Attendance', path: '/admin/hostel/attendance' },
      { id: 'hostel-mess-dashboard', title: 'Mess Dashboard', path: '/admin/hostel/mess/dashboard' },
      { id: 'hostel-mess-plans', title: 'Mess Plans', path: '/admin/hostel/mess/plans' },
      { id: 'hostel-mess-bills', title: 'Mess Bills', path: '/admin/hostel/mess/bills' },
      { id: 'hostel-mess-payments', title: 'Mess Payments', path: '/admin/hostel/mess/payments' }
    ]
  },
  {
    id: 'hrms',
    title: 'HRMS & Staff',
    icon: Briefcase,
    roles: ['ADMIN', 'SUPERADMIN'],
    children: [
      { id: 'hrms-onboarding', title: 'Staff Onboarding', path: '/admin/hrms/onboarding' },
      { id: 'hrms-payroll', title: 'Payroll Engine', path: '/admin/hrms/payroll' },
      { id: 'hrms-leave', title: 'Leave Approval Center', path: '/admin/hrms/leave' },
      { id: 'hrms-compliance', title: 'PF & ESI Compliance', path: '/admin/hrms/compliance' },
      { id: 'hrms-performance', title: 'Performance Reviews', path: '/admin/hrms/performance' }
    ]
  },
  {
    id: 'system',
    title: 'System',
    icon: Settings,
    roles: ['ADMIN', 'SUPERADMIN'],
    children: [
      { id: 'roles',    title: 'Roles & Access',   path: '/admin/roles',    permission: 'SYSTEM_ADMIN' },
      { id: 'backup',   title: 'Data Backup',      path: '/admin/backups',  permission: 'BACKUP_VIEW' },
      { id: 'audit',    title: 'Audit Trail',      path: '/admin/audit-logs', permission: 'SYSTEM_ADMIN' },
      { id: 'sessions', title: 'Active Sessions',  path: '/admin/sessions' }
    ]
  },

  // --- TEACHER SECTION ---
  {
    id: 'teacher-attendance',
    title: 'My Attendance',
    path: '/teacher/attendance',
    icon: CalendarCheck,
    roles: ['TEACHER']
  },
  {
    id: 'teacher-exams',
    title: 'Manage Exams',
    path: '/teacher/exams',
    icon: ClipboardList,
    roles: ['TEACHER']
  },
  {
    id: 'teacher-students',
    title: 'My Students',
    path: '/teacher/students',
    icon: Users,
    roles: ['TEACHER']
  },

  // --- STUDENT SECTION ---
  {
    id: 'student-attendance',
    title: 'My Attendance',
    path: '/student/attendance',
    icon: CalendarCheck,
    roles: ['STUDENT']
  },
  {
    id: 'student-exams',
    title: 'My Exams',
    path: '/student/exams',
    icon: ClipboardList,
    roles: ['STUDENT']
  },
  {
    id: 'student-report',
    title: 'Report Card',
    path: '/student/report-card',
    icon: FileText,
    roles: ['STUDENT']
  },
  {
    id: 'student-fees',
    title: 'Fee Status',
    path: '/student/fees',
    icon: CreditCard,
    roles: ['STUDENT']
  },
  {
    id: 'student-profile',
    title: 'My Profile',
    path: '/student/profile',
    icon: UserCircle,
    roles: ['STUDENT']
  }
];

/**
 * Filter menu for a specific user based on roles and permissions
 */
export const getFilteredMenu = (rawRoles = [], can) => {
  const roles = rawRoles.map(r => String(r).replace(/^ROLE_/, '').toUpperCase());
  
  return menuConfig.filter(item => {
    // 1. Role check (Highest priority)
    if (item.roles) {
      const hasRole = roles.some(r => item.roles.includes(r));
      if (!hasRole) return false;
    }

    // 2. Permission check (if role passed)
    if (item.permission && !can(item.permission)) return false;
    
    // 3. Filter children
    if (item.children) {
      item.filteredChildren = item.children.filter(child => {
        // Child role check
        if (child.roles) {
          const hasRole = roles.some(r => child.roles.includes(r));
          if (!hasRole) return false;
        }
        // Child permission check
        if (child.permission && !can(child.permission)) return false;
        return true;
      });
      return item.filteredChildren.length > 0;
    }
    
    return true;
  });
};
