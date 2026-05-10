// src/components/common/FormField.jsx
import React from 'react';

/**
 * Enterprise Form Field Wrapper
 * Handles: Labels, Required indicators, Error messages, Help text
 */
const FormField = ({
  label,
  id,
  error,
  helpText,
  required = false,
  className = '',
  children,
}) => {
  return (
    <div className={`form-section mb-4 ${className}`}>
      {label && (
        <label 
          htmlFor={id} 
          className={`label ${required ? 'label-required' : ''}`}
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {children}
      </div>

      {error && (
        <p className="field-error animate-fade-in" role="alert">
          {error}
        </p>
      )}
      
      {!error && helpText && (
        <p className="text-gray-400 text-xs mt-1">
          {helpText}
        </p>
      )}
    </div>
  );
};

export default FormField;
