// src/components/common/FilterPanel.jsx
import React, { useState, useEffect } from 'react';
import { Filter, X, RotateCcw, Save, Check } from 'lucide-react';

/**
 * FilterPanel — Reusable sidebar/drawer for advanced searching.
 */
const FilterPanel = ({
  filters = [],
  values = {},
  onChange = () => {},
  onClear = () => {},
  onSavePreset = () => {},
  isOpen = false,
  onClose = () => {},
  title = "Advanced Filters"
}) => {
  const [localValues, setLocalValues] = useState(values);

  useEffect(() => {
    setLocalValues(values);
  }, [values]);

  const handleApply = () => {
    onChange(localValues);
    onClose();
  };

  const handleClear = () => {
    setLocalValues({});
    onClear();
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-xs bg-white shadow-2xl z-[101] transform transition-transform duration-300 ease-in-out border-l border-slate-100 flex flex-col
                   ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-blue-600" />
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight">{title}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {filters.map((filter) => (
            <div key={filter.key} className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                {filter.label}
              </label>
              
              {filter.type === 'select' ? (
                <select
                  value={localValues[filter.key] || ''}
                  onChange={(e) => setLocalValues(prev => ({ ...prev, [filter.key]: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                >
                  <option value="">All {filter.label}</option>
                  {filter.options?.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : filter.type === 'date' ? (
                <input
                  type="date"
                  value={localValues[filter.key] || ''}
                  onChange={(e) => setLocalValues(prev => ({ ...prev, [filter.key]: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              ) : (
                <input
                  type="text"
                  placeholder={`Search ${filter.label}...`}
                  value={localValues[filter.key] || ''}
                  onChange={(e) => setLocalValues(prev => ({ ...prev, [filter.key]: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/30 space-y-3">
          <div className="flex gap-3">
            <button
              onClick={handleClear}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-all"
            >
              <RotateCcw size={16} />
              Reset
            </button>
            <button
              onClick={handleApply}
              className="flex-[2] flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
            >
              <Check size={16} />
              Apply Filters
            </button>
          </div>
          <button
            onClick={() => onSavePreset(localValues)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:bg-blue-50 rounded-lg transition-all"
          >
            <Save size={14} />
            Save current as preset
          </button>
        </div>
      </aside>
    </>
  );
};

export default FilterPanel;
