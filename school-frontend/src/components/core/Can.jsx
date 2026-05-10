// src/components/core/Can.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { hasPermission } from '../../config/permissions';

/**
 * Can — Declarative Permission Component.
 * 
 * Usage:
 * <Can do="STUDENTS_CREATE">
 *   <button>Add Student</button>
 * </Can>
 */
const Can = ({ do: permission, children, fallback = null }) => {
  const { user } = useAuth();
  
  if (!user || !user.roles) return fallback;
  
  const allowed = hasPermission(user.roles, permission);
  
  if (allowed) return <>{children}</>;
  
  return fallback;
};

export default Can;
