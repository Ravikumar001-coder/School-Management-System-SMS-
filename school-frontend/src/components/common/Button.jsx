// src/components/common/Button.jsx
import React from 'react';
import LoadingSpinner from './LoadingSpinner';

/**
 * Enterprise Reusable Button
 * Variants: primary, secondary, danger, warning, success, outline, purple
 * Supports: loading state, disabled state, icons, different sizes
 */
const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled = false,
  icon: Icon,
  onClick,
  ...props
}) => {
  const baseClasses = 'btn inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 active:scale-95';
  
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    warning: 'btn-warning',
    success: 'btn-success',
    outline: 'btn-outline',
    purple: 'btn-purple',
  };

  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
  };

  const combinedClasses = `
    ${baseClasses} 
    ${variantClasses[variant] || variantClasses.primary} 
    ${sizeClasses[size] || ''} 
    ${className}
  `.trim();

  return (
    <button
      type={type}
      className={combinedClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <LoadingSpinner className="!w-4 !h-4 !border-2" />
          {children && <span>Processing...</span>}
        </div>
      ) : (
        <>
          {Icon && <Icon className={children ? 'text-lg' : 'text-xl'} />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
