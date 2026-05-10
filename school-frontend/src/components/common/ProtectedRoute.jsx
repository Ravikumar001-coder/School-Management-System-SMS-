// src/components/common/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * ProtectedRoute — Multi-role aware route guard.
 *
 * Works with the new architecture where:
 *   AuthContext.user.roles = ['ADMIN', 'TEACHER', ...] (array)
 *
 * Features:
 * - Supports single-role and multi-role users
 * - Redirects unauthenticated users to /login
 * - Redirects unauthorized users to /unauthorized
 * - Forces first-login users to /change-password
 * - Handles null/malformed auth payloads gracefully
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // 1. Not authenticated → login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Force first-login password change
  if (user?.firstLogin && location.pathname !== '/change-password') {
    return <Navigate to="/change-password" replace />;
  }

  // 3. Role check — normalized to handle both "ROLE_ADMIN" and "ADMIN"
  if (allowedRoles && allowedRoles.length > 0) {
    const rawRoles = user?.roles ?? (user?.role ? [user.role] : []);
    const userRoles = rawRoles.map(r => r.replace(/^ROLE_/, '').toUpperCase());
    const normalizedAllowed = allowedRoles.map(r => r.toUpperCase());
    
    const hasAccess = userRoles.some(r => normalizedAllowed.includes(r));
    if (!hasAccess) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // 4. Authorized — render children
  return children;
};

export default ProtectedRoute;