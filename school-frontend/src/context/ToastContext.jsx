// src/context/ToastContext.jsx
import React, { createContext, useContext, useCallback, useMemo, useState, useRef } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const ToastContext = createContext(null);

let _id = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    if (timers.current.has(id)) {
      clearTimeout(timers.current.get(id));
      timers.current.delete(id);
    }
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = ++_id;
    
    setToasts((prev) => {
      // Limit to 5 simultaneous toasts
      const limited = prev.length >= 5 ? prev.slice(1) : prev;
      return [...limited, { id, message, type }];
    });

    if (duration > 0) {
      const timer = setTimeout(() => removeToast(id), duration);
      timers.current.set(id, timer);
    }
  }, [removeToast]);

  // Memoize the toast API object so its reference stays stable across renders.
  // Without this, every render created a new plain-object literal, which caused
  // useFetch's useCallback (which depends on `toast`) to regenerate its execute
  // function on every render, triggering an infinite API re-fetch loop.
  const toast = useMemo(() => ({
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    warning: (msg) => addToast(msg, 'warning'),
    info: (msg) => addToast(msg, 'info'),
    // Explicit enterprise methods
    showSuccess: (msg) => addToast(msg, 'success'),
    showError: (msg) => addToast(msg, 'error'),
    showWarning: (msg) => addToast(msg, 'warning'),
    showInfo: (msg) => addToast(msg, 'info'),
    showToast: (msg, type) => addToast(msg, type || 'info'),
  }), [addToast]);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

// ── UI Components ──────────────────────────────────────────────────────────

const ToastContainer = ({ toasts, onRemove }) => {
  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={() => onRemove(t.id)} />
      ))}
    </div>
  );
};

const TYPE_MAP = {
  success: {
    icon: CheckCircle,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    progress: 'bg-emerald-500'
  },
  error: {
    icon: AlertCircle,
    color: 'text-red-500',
    bg: 'bg-red-50',
    border: 'border-red-100',
    progress: 'bg-red-500'
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    progress: 'bg-amber-500'
  },
  info: {
    icon: Info,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    progress: 'bg-blue-500'
  }
};

const ToastItem = ({ toast, onRemove }) => {
  const config = TYPE_MAP[toast.type] || TYPE_MAP.info;
  const Icon = config.icon;

  return (
    <div 
      role="alert"
      className={`pointer-events-auto flex items-start gap-4 p-4 rounded-2xl shadow-xl border ${config.bg} ${config.border} animate-slide-in-right overflow-hidden relative group`}
    >
      <div className={`mt-0.5 ${config.color}`}>
        <Icon size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-800 leading-snug">
          {toast.message}
        </p>
      </div>
      <button 
        onClick={onRemove}
        className="text-slate-400 hover:text-slate-600 transition-colors"
      >
        <X size={18} />
      </button>

      {/* Auto-dismiss Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1 w-full bg-black/5">
        <div className={`h-full ${config.progress} animate-shrink-width`} style={{ animationDuration: '5s' }}></div>
      </div>
    </div>
  );
};
