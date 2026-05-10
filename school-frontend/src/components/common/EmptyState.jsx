// src/components/common/EmptyState.jsx
import React from 'react';

/**
 * Enterprise Empty State Component
 * Used when tables or lists have no data
 */
const EmptyState = ({
  icon = "🔍",
  text = "No records found",
  subText = "We couldn't find what you're looking for.",
  children
}) => {
  return (
    <div className="empty-state animate-fade-in">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-text">{text}</h3>
      <p className="empty-state-sub">{subText}</p>
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
};

export default EmptyState;
