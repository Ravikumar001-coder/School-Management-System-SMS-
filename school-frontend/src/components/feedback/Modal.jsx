// src/components/feedback/Modal.jsx
import React, { useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';

/**
 * Modal — Standardized Enterprise Dialog.
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md', // sm, md, lg, xl
  variant = 'default' // default, danger
}) => {
  
  // Close on Escape
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl'
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Box */}
      <div className={`relative w-full ${sizeClasses[size]} bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-bounce-in`}>
        
        {/* Header */}
        <div className={`p-6 flex items-center justify-between border-b border-slate-50 ${variant === 'danger' ? 'bg-red-50/50' : ''}`}>
           <div className="flex items-center gap-3">
              {variant === 'danger' && <AlertCircle className="text-red-500" size={20} />}
              <h2 className={`text-xl font-black tracking-tight ${variant === 'danger' ? 'text-red-900' : 'text-slate-900'}`}>
                {title}
              </h2>
           </div>
           <button 
             onClick={onClose}
             className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors"
           >
             <X size={20} />
           </button>
        </div>

        {/* Body */}
        <div className="p-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
