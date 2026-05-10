// src/components/core/FilterEngine.jsx
import React from 'react';
import { X, Filter, RotateCcw, Search } from 'lucide-react';

/**
 * FilterEngine — Advanced Query & Sidebar Filter Drawer.
 * 
 * FEATURES:
 * - Responsive Drawer (Mobile Friendly)
 * - URL State Sync ready
 * - Custom Filter Types
 */
export const FilterPanel = ({
  isOpen,
  onClose,
  filters = [], // { key, label, type, options }
  values = {},
  onChange,
  onClear
}) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[200] lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar / Drawer */}
      <aside
        className={`fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl z-[201] flex flex-col transition-transform duration-300 ease-out
                   ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
               <Filter size={20} />
             </div>
             <h2 className="text-xl font-black text-slate-900 tracking-tight">Advanced Filters</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Filters */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {filters.map((f) => (
            <div key={f.key} className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 px-1">
                {f.label}
              </label>
              
              {f.type === 'select' ? (
                <select
                  value={values[f.key] || ''}
                  onChange={(e) => onChange(f.key, e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none appearance-none"
                >
                  <option value="">All {f.label}s</option>
                  {f.options?.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : f.type === 'date' ? (
                <input
                  type="date"
                  value={values[f.key] || ''}
                  onChange={(e) => onChange(f.key, e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                />
              ) : (
                <input
                  type="text"
                  placeholder={`Filter by ${f.label.toLowerCase()}...`}
                  value={values[f.key] || ''}
                  onChange={(e) => onChange(f.key, e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                />
              )}
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
           <button 
             onClick={onClear}
             className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all"
           >
             <RotateCcw size={16} />
             Reset
           </button>
           <button 
             onClick={onClose}
             className="flex-[2] flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-500 shadow-lg shadow-blue-500/20 transition-all"
           >
             Apply Filters
           </button>
        </div>
      </aside>
    </>
  );
};
