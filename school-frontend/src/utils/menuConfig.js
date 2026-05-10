import { 
  LayoutDashboard, 
  Users, 
  UserSquare2, 
  BookOpen, 
  CalendarCheck, 
  CreditCard, 
  ClipboardList, 
  Settings, 
  ShieldCheck,
  Database,
  GraduationCap
} from 'lucide-react';

export const menuConfig = {
  ADMIN: [
    {
      title: 'Dashboard',
      path: '/admin/dashboard',
      icon: LayoutDashboard,
      permission: 'DASHBOARD_VIEW'
    },
    {
      title: 'User Management',
      icon: Users,
      children: [
        { title: 'Teachers', path: '/admin/teachers', permission: 'TEACHERS_VIEW' },
        { title: 'Students', path: '/admin/students', permission: 'STUDENTS_VIEW' }
      ]
    },
    {
      title: 'Academic',
      icon: GraduationCap,
      children: [
        { title: 'Classes', path: '/admin/classes', permission: 'CLASSES_VIEW' },
        { title: 'Subjects', path: '/admin/subjects', permission: 'SUBJECTS_VIEW' },
        { title: 'Attendance', path: '/admin/attendance', permission: 'ATTENDANCE_VIEW' }
      ]
    },
    {
      title: 'Exams & Marks',
      icon: ClipboardList,
      children: [
        { title: 'Exams', path: '/admin/exams', permission: 'EXAMS_VIEW' },
        { title: 'Enter Marks', path: '/admin/exams/new', permission: 'EXAMS_EDIT' }
      ]
    },
    {
      title: 'Finance',
      icon: CreditCard,
      children: [
        { title: 'Fees Management', path: '/admin/fees', permission: 'FEES_VIEW' },
        { title: 'Collect Fee', path: '/admin/fees/collect', permission: 'FEES_EDIT' }
      ]
    },
    {
      title: 'System',
      icon: Settings,
      children: [
        { title: 'Roles & Permissions', path: '/admin/roles', permission: 'ROLES_VIEW' },
        { title: 'Database Backup', path: '/admin/backups', permission: 'BACKUP_VIEW' }
      ]
    }
  ],
  TEACHER: [
    {
      title: 'Dashboard',
      path: '/teacher/dashboard',
      icon: LayoutDashboard,
      permission: 'DASHBOARD_VIEW'
    },
    {
      title: 'Attendance',
      path: '/teacher/attendance',
      icon: CalendarCheck,
      permission: 'ATTENDANCE_EDIT'
    },
    {
      title: 'Exams',
      path: '/teacher/exams',
      icon: ClipboardList,
      permission: 'EXAMS_VIEW'
    },
    {
      title: 'My Students',
      path: '/teacher/students',
      icon: Users,
      permission: 'STUDENTS_VIEW'
    },
    {
      title: 'My Profile',
      path: '/teacher/profile',
      icon: UserSquare2,
      permission: 'TEACHERS_VIEW'
    }
  ],
  STUDENT: [
    {
      title: 'Dashboard',
      path: '/student/dashboard',
      icon: LayoutDashboard,
      permission: 'DASHBOARD_VIEW'
    },
    {
      title: 'Attendance',
      path: '/student/attendance',
      icon: CalendarCheck,
      permission: 'ATTENDANCE_VIEW'
    },
    {
      title: 'Exams',
      path: '/student/exams',
      icon: ClipboardList,
      permission: 'EXAMS_VIEW'
    },
    {
      title: 'Report Card',
      path: '/student/report-card',
      icon: GraduationCap,
      permission: 'EXAMS_VIEW'
    },
    {
      title: 'Fees',
      path: '/student/fees',
      icon: CreditCard,
      permission: 'FEES_VIEW'
    },
    {
      title: 'My Profile',
      path: '/student/profile',
      icon: UserSquare2,
      permission: 'STUDENTS_VIEW'
    }
  ]
};
