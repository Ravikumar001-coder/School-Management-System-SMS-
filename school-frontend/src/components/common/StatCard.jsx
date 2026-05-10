// src/components/common/StatCard.jsx
import React from 'react';

/**
 * Enterprise Stat Card
 * Standardized for dashboard overview metrics
 */
const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'blue',
  onClick,
  loading = false
}) => {
  const variantClasses = {
    blue:   'bg-blue-50 text-blue-600',
    green:  'bg-green-50 text-green-600',
    red:    'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
    yellow: 'bg-yellow-50 text-yellow-600',
  };

  return (
    <div 
      className={`stat-card transition-all duration-300 ${onClick ? 'cursor-pointer hover:shadow-card-hover hover:-translate-y-1' : ''}`}
      onClick={onClick}
    >
      <div className={`stat-icon ${variantClasses[variant] || variantClasses.blue}`}>
        {Icon ? <Icon size={24} /> : <span>📊</span>}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="stat-label truncate">{title}</p>
        {loading ? (
          <div className="h-8 w-24 bg-gray-100 animate-pulse rounded mt-1" />
        ) : (
          <h3 className="stat-value truncate">{value}</h3>
        )}
        {subtitle && (
          <p className="text-[10px] font-medium text-gray-400 mt-0.5 uppercase tracking-wider">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;