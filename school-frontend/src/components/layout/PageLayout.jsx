// src/components/layout/PageContainer.jsx
import React from 'react';

/**
 * PageContainer — Universal wrapper for all operational views.
 */
export const PageContainer = ({ children, className = "" }) => (
  <div className={`flex flex-col gap-8 pb-12 ${className}`}>
    {children}
  </div>
);

/**
 * PageHeader — Enterprise header with contextual actions.
 */
export const PageHeader = ({ title, subtitle, actions }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
    <div className="space-y-1">
      <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
           {subtitle}
        </p>
      )}
    </div>
    {actions && (
      <div className="flex items-center gap-3">
        {actions}
      </div>
    )}
  </div>
);
