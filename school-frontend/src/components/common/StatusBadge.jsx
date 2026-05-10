// src/components/common/StatusBadge.jsx
import React from 'react';

/**
 * Enterprise Status Badge / Pill
 * Standardizes statuses like Active, Inactive, Paid, Pending, etc.
 */
const StatusBadge = ({
  status,
  variant = 'blue',
  className = '',
  dot = false
}) => {
  const variantClasses = {
    blue:   'badge-blue',
    green:  'badge-green',
    red:    'badge-red',
    yellow: 'badge-yellow',
    purple: 'badge-purple',
    gray:   'badge-gray',
  };

  const dotColors = {
    blue:   'bg-blue-500',
    green:  'bg-green-500',
    red:    'bg-red-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
    gray:   'bg-gray-500',
  };

  return (
    <span className={`${variantClasses[variant] || variantClasses.blue} flex items-center gap-1.5 w-fit ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant] || dotColors.blue}`} />}
      {status}
    </span>
  );
};

export default StatusBadge;
