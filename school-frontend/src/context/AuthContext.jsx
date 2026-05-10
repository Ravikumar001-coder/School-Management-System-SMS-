// src/context/AuthContext.jsx

import React, { createContext, useContext, useEffect, useRef, useState, useMemo } from 'react';
import api from '../api/axios';
import { logoutApi } from '../api/authApi';

// Create the context
const AuthContext = createContext();

// Provider component - wraps the whole app
export const AuthProvider = ({ children }) => {
  
  // Initialize from localStorage (persist login on refresh)
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });

  // For Parent role: track which child is active and their list
  const [activeChildId, setActiveChildId] = useState(() => {
    return localStorage.getItem('activeChildId') || null;
  });

  const [myChildren, setMyChildren] = useState(() => {
    const saved = localStorage.getItem('children');
    return saved ? JSON.parse(saved) : [];
  });

  // Ref guard: prevents the hydration effect from re-running when the token
  // is cleared by the axios 401 interceptor, which previously caused an
  // infinite loop: 401 → clear token → token state change → re-run effect → 401 ...
  const isHydrating = useRef(false);

  useEffect(() => {
    const hydrateUserData = async () => {
      if (!user) return;
      const currentToken = localStorage.getItem('token');
      if (!currentToken) return;
      if (isHydrating.current) return;
      isHydrating.current = true;

      try {
        // Hydrate Student ID for STUDENTS
        if (user.role === 'STUDENT' && !user.studentId) {
          const res = await api.get('/auth/me');
          const data = res?.data || {};
          if (data.studentId) {
             const merged = { ...user, studentId: data.studentId };
             setUser(merged);
             localStorage.setItem('user', JSON.stringify(merged));
          }
        }

        // Hydrate Children for PARENTS
        if (user.role === 'PARENT' && myChildren.length === 0) {
          const res = await api.get('/parents/my-children');
          const data = res.data?.data || [];
          setMyChildren(data);
          localStorage.setItem('children', JSON.stringify(data));
          if (data.length > 0 && !activeChildId) {
            setActiveChildId(data[0].studentId);
            localStorage.setItem('activeChildId', data[0].studentId);
          }
        }
      } catch {
        // Ignore; existing auth interceptor handles invalid token globally.
      } finally {
        isHydrating.current = false;
      }
    };

    hydrateUserData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user?.role]);

  // Login function
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', authToken);
  };

  const selectChild = (childId) => {
    setActiveChildId(childId);
    localStorage.setItem('activeChildId', childId);
  };

  // Logout function
  const logout = async () => {
    try {
      await logoutApi();
    } catch {
      // Always clear client session even if API call fails.
    } finally {
      setUser(null);
      setToken(null);
      setActiveChildId(null);
      setMyChildren([]);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('activeChildId');
      localStorage.removeItem('children');
    }
  };

  // Check if user has a specific permission
  const can = (permission) => {
    if (user?.role === 'SUPERADMIN' || user?.role === 'ADMIN') return true;
    if (!user?.permissions) return false;
    return user.permissions.includes(permission.toUpperCase());
  };

  const isAdmin = () => user?.role === 'ADMIN' || user?.role === 'SUPERADMIN';
  const isTeacher = () => user?.role === 'TEACHER';
  const isStudent = () => user?.role === 'STUDENT';
  const isParent = () => user?.role === 'PARENT';

  const contextValue = useMemo(() => ({
    user,
    token,
    login,
    logout,
    isAdmin,
    isTeacher,
    isStudent,
    isParent,
    can,
    activeChildId,
    setActiveChildId: selectChild,
    children: myChildren,
    isAuthenticated: !!token
  }), [user, token, login, logout, isAdmin, isTeacher, isStudent, isParent, can, activeChildId, myChildren]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};