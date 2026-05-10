// src/components/common/Modal.jsx
import React, { useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {

  // Close on Escape key
  useEffect(() => {
    const handleEsc = e => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Prevent background scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else        document.body.style.overflow = '';
    return () =>{ document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClass =
    size === 'sm' ? 'max-w-sm'  :
    size === 'lg' ? 'max-w-2xl' :
    size === 'xl' ? 'max-w-4xl' :
    'max-w-lg';

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className={`modal-box ${sizeClass}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 
                       hover:bg-red-100 hover:text-red-600 
                       flex items-center justify-center 
                       text-gray-500 transition-colors 
                       text-lg font-bold leading-none"
          >
            ×
          </button>
        </div>
        {/* Body */}
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;