// src/components/bulk/BulkActionBar.jsx
import React from 'react';
import { X, Trash2, Download, CheckCircle2, ChevronRight } from 'lucide-react';

/**
 * BulkActionBar — Floating HUD for multi-row operations.
 */
const BulkActionBar = ({
  isVisible,
  selectedCount,
  onClear,
  actions = [] // { label, icon, onClick, variant }
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[150] animate-bounce-in w-[90%] max-w-2xl">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-[2.5rem] shadow-2xl p-3 flex items-center justify-between gap-6 ring-4 ring-blue-500/10">
        
        {/* Left: Stats */}
        <div className="flex items-center gap-4 pl-4">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-sm">
            {selectedCount}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Items Selected</span>
            <button 
              onClick={onClear}
              className="text-xs font-bold text-blue-400 hover:text-blue-300 text-left transition-colors"
            >
              Clear Selection
            </button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 pr-2">
          {actions.map((act, i) => (
            <button
              key={i}
              onClick={act.onClick}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all
                         ${act.variant === 'danger' 
                            ? 'bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white' 
                            : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'}`}
            >
              {act.icon}
              <span className="hidden sm:inline">{act.label}</span>
            </button>
          ))}
          <button 
            onClick={onClear}
            className="p-3 bg-white/5 rounded-2xl text-slate-500 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default BulkActionBar;
