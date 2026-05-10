// src/components/common/PageHeader.jsx
import React from 'react';

/**
 * Enterprise Page Header
 * Supports: Breadcrumbs (implied by location), Title, Subtitle, Actions (buttons)
 */
const PageHeader = ({
  title,
  subtitle,
  actions,
  children
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-fade-in">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-gray-500 text-sm mt-1 max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex flex-wrap items-center gap-2.5">
          {actions}
        </div>
      )}
      
      {children}
    </div>
  );
};

export default PageHeader;
