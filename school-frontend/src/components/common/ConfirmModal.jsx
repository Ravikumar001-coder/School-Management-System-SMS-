// src/components/common/ConfirmModal.jsx
import React from 'react';
import Modal from './Modal';
import Button from './Button';

/**
 * Enterprise Confirmation Modal
 * Standardized for Delete actions, status changes, etc.
 */
const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  loading = false
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="text-center">
        <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4 
                        ${variant === 'danger' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
          {variant === 'danger' ? '⚠️' : '❓'}
        </div>
        
        <p className="text-gray-600 mb-8 px-4">
          {message}
        </p>

        <div className="flex items-center gap-3 justify-center">
          <Button 
            variant="secondary" 
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button 
            variant={variant} 
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
