// src/components/common/BulkActionBar.jsx
import React from 'react';
import { X, Trash2, Download, CheckCircle, AlertCircle } from 'lucide-react';

/**
 * BulkActionBar — Floating action bar for multi-selection operations.
 */
const BulkActionBar = ({
  selectedCount = 0,
  onClear = () => {},
  actions = [],
  isVisible = false
}) => {
  if (!isVisible || selectedCount === 0) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 animate-slide-up">
      <div className="bg-slate-900 text-white rounded-2xl shadow-2xl p-4 flex items-center justify-between gap-4 border border-slate-700/50 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClear}
            className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
            title="Clear selection"
          >
            <X size={18} />
          </button>
          <div className="flex flex-col">
            <span className="text-sm font-bold">{selectedCount} Selected</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Bulk Operations Active</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {actions.map((action, i) => (
            <button
              key={i}
              onClick={action.onClick}
              disabled={action.disabled}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all
                         ${action.variant === 'danger' 
                            ? 'bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20' 
                            : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'}
                         ${action.disabled ? 'opacity-30 cursor-not-allowed' : 'active:scale-95'}`}
            >
              {action.icon}
              <span className="hidden sm:inline">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BulkActionBar;
