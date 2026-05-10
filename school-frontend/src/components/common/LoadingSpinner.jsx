// src/components/common/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ className = '' }) => (
  <div
    role="status"
    className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
    aria-label="Loading"
  />
);

export default LoadingSpinner;
