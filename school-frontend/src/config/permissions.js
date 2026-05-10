// src/config/permissions.js

/**
 * Enterprise Permission Matrix
 * Maps application-specific permissions to generic roles.
 */
export const permissions = {
  // Dashboard
  DASHBOARD_VIEW: ['ADMIN', 'SUPERADMIN', 'TEACHER', 'STUDENT'],
  
  // Student Management
  STUDENTS_VIEW:   ['ADMIN', 'SUPERADMIN', 'TEACHER'],
  STUDENTS_CREATE: ['ADMIN', 'SUPERADMIN'],
  STUDENTS_EDIT:   ['ADMIN', 'SUPERADMIN'],
  STUDENTS_DELETE: ['SUPERADMIN'],
  
  // Teacher Management
  TEACHERS_VIEW:   ['ADMIN', 'SUPERADMIN'],
  TEACHERS_CREATE: ['ADMIN', 'SUPERADMIN'],
  TEACHERS_EDIT:   ['ADMIN', 'SUPERADMIN'],
  TEACHERS_DELETE: ['SUPERADMIN'],
  
  // Academic
  CLASSES_VIEW:    ['ADMIN', 'SUPERADMIN', 'TEACHER'],
  CLASSES_EDIT:    ['ADMIN', 'SUPERADMIN'],
  ATTENDANCE_VIEW: ['ADMIN', 'SUPERADMIN', 'TEACHER', 'STUDENT'],
  ATTENDANCE_EDIT: ['ADMIN', 'SUPERADMIN', 'TEACHER'],
  
  // Finance
  FEES_VIEW:       ['ADMIN', 'SUPERADMIN', 'STUDENT'],
  FEES_EDIT:       ['ADMIN', 'SUPERADMIN'],
  
  // System
  SYSTEM_ADMIN:    ['SUPERADMIN'],
  BACKUP_VIEW:     ['SUPERADMIN'],
};

/**
 * Helper to check if a role has a permission
 */
export const hasPermission = (userRoles = [], permissionName) => {
  const allowedRoles = permissions[permissionName];
  if (!allowedRoles) return false;
  return userRoles.some(role => allowedRoles.includes(role));
};
