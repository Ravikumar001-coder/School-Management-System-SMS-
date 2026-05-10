// src/components/common/Loading.jsx
import React from 'react';
import LoadingSpinner from './LoadingSpinner';

/**
 * Enterprise Loading Component
 * Supports: fullScreen mode, custom labels
 */
const Loading = ({ 
  label = 'Loading System...', 
  fullScreen = false 
}) => {
  const containerClasses = fullScreen 
    ? "fixed inset-0 bg-white/80 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center"
    : "p-12 flex flex-col items-center justify-center text-center";

  return (
    <div className={containerClasses}>
      <div className="relative">
        <LoadingSpinner className="!w-16 !h-16" />
        <div className="absolute inset-0 flex items-center justify-center text-xl">
          🎓
        </div>
      </div>
      
      <div className="mt-6 space-y-2">
        <h3 className="text-gray-800 font-bold text-lg animate-pulse">
          {label}
        </h3>
        <p className="text-gray-400 text-sm">
          Please wait while we prepare your workspace
        </p>
      </div>
      
      {fullScreen && (
        <div className="absolute bottom-8 text-gray-300 text-xs tracking-widest uppercase">
          School Management System v1.0
        </div>
      )}
    </div>
  );
};

export default Loading;
