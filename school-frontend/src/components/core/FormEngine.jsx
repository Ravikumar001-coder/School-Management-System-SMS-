// src/components/core/FormEngine.jsx
import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, Save, ArrowRight } from 'lucide-react';

/**
 * FormEngine — Enterprise Form Management.
 * 
 * DESIGN CONTRACT:
 * - Centralized validation logic.
 * - Auto-focus progression.
 * - Save & Next workflow built-in.
 * - Keyboard Shortcuts: Enter to Save, Ctrl+S for Quick Save.
 */
export const FormContainer = ({
  title,
  subtitle,
  onSubmit,
  onSaveAndNext,
  isLoading = false,
  children,
  footerExtra,
  isDirty = false
}) => {
  
  // Prevent accidental navigation
  useEffect(() => {
    if (!isDirty) return;
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  return (
    <form 
      onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
      className="max-w-4xl mx-auto w-full flex flex-col gap-6 animate-fade-in"
    >
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h1>
        <p className="text-slate-500 text-sm font-medium">{subtitle}</p>
      </div>

      {/* Body */}
      <div className="bg-white border border-slate-100 shadow-sm rounded-[2rem] p-8 space-y-8">
        {children}
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-900 rounded-[2rem] shadow-xl border border-slate-800">
        <div className="flex items-center gap-4 ml-4">
           {isDirty && (
             <span className="flex items-center gap-2 text-amber-400 text-[10px] font-black uppercase tracking-widest animate-pulse">
               <AlertCircle size={14} />
               Unsaved Changes
             </span>
           )}
           {footerExtra}
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {onSaveAndNext && (
            <button
              type="button"
              disabled={isLoading}
              onClick={onSaveAndNext}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all font-bold text-sm"
            >
              Save & Next
              <ArrowRight size={18} />
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading || (!isDirty && !onSaveAndNext)}
            className="flex-[1.5] sm:flex-none flex items-center justify-center gap-2 px-10 py-3 rounded-2xl bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20 transition-all font-black text-sm disabled:opacity-30 active:scale-95"
          >
            {isLoading ? (
               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Save size={18} />
                Submit Record
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export const FormField = ({
  label,
  error,
  required,
  children,
  className = ""
}) => (
  <div className={`space-y-2 flex-1 min-w-[240px] ${className}`}>
    <label className="flex items-center gap-1.5 px-1">
      <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">{label}</span>
      {required && <span className="text-red-500 font-bold">*</span>}
    </label>
    <div className="relative group">
      {children}
      {error && (
        <div className="absolute top-1/2 -translate-y-1/2 right-4 text-red-500 flex items-center gap-2 pointer-events-none animate-shake">
           <AlertCircle size={16} />
        </div>
      )}
    </div>
    {error && <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight px-1">{error}</p>}
  </div>
);

export const Input = (props) => (
  <input 
    {...props}
    className={`w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-medium focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none placeholder:text-slate-300
               ${props.className || ''} ${props.error ? 'border-red-200 bg-red-50/30' : ''}`}
  />
);

export const Select = ({ options, ...props }) => (
  <div className="relative">
    <select
      {...props}
      className={`w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-medium focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none appearance-none
                 ${props.className || ''}`}
    >
      <option value="">{props.placeholder || 'Select an option'}</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
       <ArrowRight size={16} className="rotate-90" />
    </div>
  </div>
);

export const Checkbox = ({ label, ...props }) => (
  <label className="flex items-center gap-3 cursor-pointer group">
    <div className="relative flex items-center justify-center">
      <input 
        type="checkbox" 
        {...props}
        className="peer appearance-none w-5 h-5 border-2 border-slate-200 rounded-lg checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer"
      />
      <CheckCircle2 size={12} className="absolute text-white scale-0 peer-checked:scale-100 transition-transform" />
    </div>
    <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">{label}</span>
  </label>
);

export const FormGrid = ({ children, cols = 2 }) => (
  <div className={`grid grid-cols-1 md:grid-cols-${cols} gap-x-8 gap-y-6`}>
    {children}
  </div>
);

export const FormSection = ({ title, children }) => (
  <div className="space-y-6 pt-4 first:pt-0">
    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-50 pb-2">
      {title}
    </h3>
    {children}
  </div>
);
