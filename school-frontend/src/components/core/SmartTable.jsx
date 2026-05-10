// src/components/core/SmartTable.jsx
import React, { useState, useMemo } from 'react';
import { 
  ChevronUp, ChevronDown, MoreVertical, 
  Search, Filter, Download, 
  AlertCircle, ChevronRight, Check
} from 'lucide-react';

/**
 * SmartTable — The Universal ERP Data Display Engine.
 * 
 * DESIGN CONTRACT:
 * - Desktop: Virtualizable, Sticky Headers, Selection enabled.
 * - Mobile: Adaptive Card transformation, Pinned Primary Column.
 * - State: Integrated Loading, Empty, and Error states.
 */
const SmartTable = ({
  columns = [],        // { key, title, sortable, render, mobileHidden }
  data = [],
  loading = false,
  error = null,
  actions = [],        // { label, icon, onClick, variant, disabled }
  selection = null,    // { selected, onSelect, onSelectAll }
  sort = null,         // { field, direction, onSort }
  search = null,       // { value, onChange, placeholder }
  filters = null,      // { active, onToggle }
  pagination = null,   // { current, total, pageSize, onPageChange }
  pinnedColumnIndex = 0,
}) => {

  const [localSelection, setLocalSelection] = useState([]);

  // Handling standard selection logic if not provided by parent
  const activeSelection = selection || {
    selected: localSelection,
    onSelect: setLocalSelection,
    onSelectAll: (all) => setLocalSelection(all ? data.map(r => r.id) : [])
  };

  if (loading && data.length === 0) return <TableSkeleton />;
  if (error) return <TableError error={error} />;

  return (
    <div className="w-full space-y-4">
      
      {/* 1. TABLE TOOLBAR */}
      {(search || filters || actions.length > 0) && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           {search && (
             <div className="relative flex-1 max-w-md">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text"
                  placeholder={search.placeholder || "Quick search..."}
                  value={search.value}
                  onChange={(e) => search.onChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                />
             </div>
           )}
           
           <div className="flex items-center gap-2">
              {filters && (
                <button 
                  onClick={filters.onToggle}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all
                             ${filters.active ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  <Filter size={16} />
                  Filters
                </button>
              )}
           </div>
        </div>
      )}

      {/* 2. MAIN DATA DISPLAY */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        
        {/* DESKTOP VIEW */}
        <div className="hidden md:block overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                {activeSelection && (
                  <th className="w-12 px-6 py-4 sticky left-0 z-20 bg-slate-50/50">
                    <input 
                      type="checkbox"
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      checked={data.length > 0 && activeSelection.selected.length === data.length}
                      onChange={(e) => activeSelection.onSelectAll(e.target.checked)}
                    />
                  </th>
                )}
                {columns.map((col, idx) => (
                  <th 
                    key={col.key}
                    className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-left
                               ${idx === pinnedColumnIndex ? 'sticky left-0 md:left-12 z-20 bg-slate-50/50' : ''}
                               ${col.sortable ? 'cursor-pointer hover:text-slate-600 transition-colors' : ''}`}
                    onClick={() => col.sortable && sort?.onSort(col.key)}
                  >
                    <div className="flex items-center gap-1.5">
                      {col.title}
                      {col.sortable && sort?.field === col.key && (
                        sort.direction === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                      )}
                    </div>
                  </th>
                ))}
                {actions.length > 0 && (
                   <th className="sticky right-0 z-20 bg-slate-50/50 px-6 py-4 text-right text-[10px] uppercase text-slate-400 font-black">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.map((row) => (
                <tr 
                  key={row.id}
                  className={`group transition-colors hover:bg-blue-50/20
                             ${activeSelection?.selected.includes(row.id) ? 'bg-blue-50/40' : ''}`}
                >
                  {activeSelection && (
                    <td className="px-6 py-4 sticky left-0 z-10 bg-inherit transition-colors">
                      <input 
                        type="checkbox"
                        className="rounded border-slate-300 text-blue-600"
                        checked={activeSelection.selected.includes(row.id)}
                        onChange={() => {
                          const isSelected = activeSelection.selected.includes(row.id);
                          activeSelection.onSelect(isSelected 
                            ? activeSelection.selected.filter(id => id !== row.id)
                            : [...activeSelection.selected, row.id]
                          );
                        }}
                      />
                    </td>
                  )}
                  {columns.map((col, idx) => (
                    <td 
                      key={col.key}
                      className={`px-6 py-5 text-sm transition-colors
                                 ${idx === pinnedColumnIndex ? 'sticky left-0 md:left-12 z-10 bg-inherit font-bold text-slate-900 group-hover:bg-blue-50/20' : 'text-slate-600'}`}
                    >
                      {col.render ? col.render(row[col.key], row) : (row[col.key] || '-')}
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="sticky right-0 z-10 bg-inherit px-6 py-4 text-right transition-colors">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        {actions.map((act, i) => (
                          <button
                            key={i}
                            onClick={() => act.onClick(row)}
                            className={`p-2 rounded-xl transition-all ${act.variant === 'danger' ? 'text-red-500 hover:bg-red-50' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}
                            title={act.label}
                          >
                            {act.icon || <MoreVertical size={16} />}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE ADAPTIVE VIEW */}
        <div className="md:hidden divide-y divide-slate-100">
          {data.map((row) => (
            <div key={row.id} className="p-4 space-y-4">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {activeSelection && (
                       <input 
                        type="checkbox"
                        className="rounded border-slate-300 text-blue-600"
                        checked={activeSelection.selected.includes(row.id)}
                        onChange={() => {}} // Handle similarly
                      />
                    )}
                    <span className="font-bold text-slate-900">
                      {row[columns[pinnedColumnIndex].key]}
                    </span>
                  </div>
                  <div className="flex gap-1">
                     {actions.map((act, i) => (
                        <button 
                          key={i}
                          onClick={() => act.onClick(row)}
                          className="p-2 bg-slate-50 rounded-lg text-slate-500"
                        >
                          {act.icon}
                        </button>
                     ))}
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  {columns.map((col, idx) => idx !== pinnedColumnIndex && !col.mobileHidden && (
                    <div key={col.key}>
                      <span className="block text-[9px] uppercase font-bold text-slate-400 tracking-widest">{col.title}</span>
                      <span className="text-xs font-medium text-slate-600">
                         {col.render ? col.render(row[col.key], row) : (row[col.key] || '-')}
                      </span>
                    </div>
                  ))}
               </div>
            </div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {data.length === 0 && !loading && (
          <div className="p-20 text-center flex flex-col items-center justify-center">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Search size={24} className="text-slate-300" />
             </div>
             <h3 className="text-slate-900 font-bold">No records found</h3>
             <p className="text-slate-400 text-sm max-w-xs mt-1">Try adjusting your search filters or check your permissions.</p>
          </div>
        )}
      </div>
      
      {/* 3. PAGINATION ENGINE */}
      {pagination && data.length > 0 && (
        <div className="flex items-center justify-between px-2 pt-2">
           <span className="text-xs text-slate-400 font-medium">
             Page <span className="text-slate-900 font-bold">{pagination.current}</span> of {Math.ceil(pagination.total / pagination.pageSize)}
           </span>
           <div className="flex gap-2">
              <button 
                disabled={pagination.current === 1}
                onClick={() => pagination.onPageChange(pagination.current - 1)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 disabled:opacity-30 hover:bg-slate-50 transition-all"
              >
                Previous
              </button>
              <button 
                disabled={pagination.current * pagination.pageSize >= pagination.total}
                onClick={() => pagination.onPageChange(pagination.current + 1)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 disabled:opacity-30 hover:bg-slate-50 transition-all"
              >
                Next
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

// ── SUB-COMPONENTS ──────────────────────────────────────────────────────────

const TableSkeleton = () => (
  <div className="w-full space-y-4 animate-pulse">
    <div className="h-10 bg-slate-200 rounded-2xl w-1/3"></div>
    <div className="bg-white rounded-3xl border border-slate-100 h-96"></div>
  </div>
);

const TableError = ({ error }) => (
  <div className="p-12 bg-red-50 border border-red-100 rounded-3xl text-center">
    <AlertCircle className="mx-auto text-red-500 mb-4" size={32} />
    <h3 className="text-red-900 font-bold">Data Fetching Failed</h3>
    <p className="text-red-700 text-sm mt-1">{error.message || "A system error occurred."}</p>
    <button className="mt-6 px-6 py-2 bg-red-500 text-white rounded-xl font-bold text-sm">Retry Connection</button>
  </div>
);

export default SmartTable;
