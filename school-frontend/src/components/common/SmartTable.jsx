// src/components/common/SmartTable.jsx
import React, { useState } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  MoreVertical, 
  Eye, 
  Edit2, 
  Trash2,
  Search,
  Filter
} from 'lucide-react';

/**
 * SmartTable — Enterprise-grade responsive table.
 * 
 * Features:
 * - Desktop: Sticky header, sticky first column (pinned), sortable.
 * - Mobile: Card-based rendering below breakpoint.
 * - Selection: Bulk actions support.
 * - States: Loading, Empty, Error.
 */
const SmartTable = ({
  columns = [],
  data = [],
  loading = false,
  onRowClick,
  actions = [],
  selection = { enabled: false, selected: [], onSelect: () => {} },
  sort = { field: '', direction: 'asc', onSort: () => {} },
  emptyMessage = "No data found.",
  pinnedColumnIndex = 0,
}) => {

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      selection.onSelect(data.map(row => row.id));
    } else {
      selection.onSelect([]);
    }
  };

  const handleSelectRow = (id) => {
    const isSelected = selection.selected.includes(id);
    if (isSelected) {
      selection.onSelect(selection.selected.filter(item => item !== id));
    } else {
      selection.onSelect([...selection.selected, id]);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center gap-4 bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-medium animate-pulse">Loading data...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center gap-2 bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="text-4xl mb-2">📁</div>
        <p className="text-slate-500 font-semibold">{emptyMessage}</p>
        <p className="text-slate-400 text-sm">Try adjusting your filters or search query.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Desktop View: Table */}
      <div className="hidden md:block overflow-hidden bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                {selection.enabled && (
                  <th className="px-6 py-4 w-12 sticky left-0 z-20 bg-slate-50/50">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 transition-all"
                      onChange={handleSelectAll}
                      checked={data.length > 0 && selection.selected.length === data.length}
                    />
                  </th>
                )}
                {columns.map((col, idx) => (
                  <th
                    key={col.key}
                    className={`px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider
                               ${idx === pinnedColumnIndex ? 'sticky left-0 md:left-12 z-20 bg-slate-50/50' : ''}
                               ${col.sortable ? 'cursor-pointer hover:text-blue-600 transition-colors' : ''}`}
                    onClick={() => col.sortable && sort.onSort(col.key)}
                  >
                    <div className="flex items-center gap-2">
                      {col.title}
                      {col.sortable && sort.field === col.key && (
                        sort.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      )}
                    </div>
                  </th>
                ))}
                {actions.length > 0 && <th className="px-6 py-4 text-right sticky right-0 z-20 bg-slate-50/50 w-24">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`hover:bg-blue-50/30 transition-colors cursor-pointer group
                             ${selection.selected.includes(row.id) ? 'bg-blue-50/50' : ''}`}
                >
                  {selection.enabled && (
                    <td className="px-6 py-4 sticky left-0 z-10 bg-inherit group-hover:bg-blue-50/30 transition-colors">
                      <input
                        type="checkbox"
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                        onClick={(e) => e.stopPropagation()}
                        onChange={() => handleSelectRow(row.id)}
                        checked={selection.selected.includes(row.id)}
                      />
                    </td>
                  )}
                  {columns.map((col, idx) => (
                    <td
                      key={col.key}
                      className={`px-6 py-4 text-sm text-slate-600 whitespace-nowrap
                                 ${idx === pinnedColumnIndex ? 'sticky left-0 md:left-12 z-10 font-semibold text-slate-900 bg-inherit group-hover:bg-blue-50/30 transition-colors' : ''}`}
                    >
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="px-6 py-4 text-right sticky right-0 z-10 bg-inherit group-hover:bg-blue-50/30 transition-colors">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         {actions.map((action, i) => (
                           <button
                             key={i}
                             onClick={(e) => { e.stopPropagation(); action.onClick(row); }}
                             className={`p-1.5 rounded-lg transition-all ${action.className || 'text-slate-400 hover:text-blue-600 hover:bg-blue-100/50'}`}
                             title={action.title}
                           >
                             {action.icon}
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
      </div>

      {/* Mobile View: Cards */}
      <div className="md:hidden space-y-4">
        {data.map((row) => (
          <div
            key={row.id}
            className={`p-4 bg-white rounded-2xl border transition-all active:scale-[0.98]
                       ${selection.selected.includes(row.id) ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-100'}`}
            onClick={() => onRowClick && onRowClick(row)}
          >
            <div className="flex justify-between items-start mb-3">
               <div className="flex items-center gap-3">
                  {selection.enabled && (
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-blue-600 w-5 h-5"
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => handleSelectRow(row.id)}
                      checked={selection.selected.includes(row.id)}
                    />
                  )}
                  <div className="text-sm font-bold text-slate-900">
                    {row[columns[pinnedColumnIndex].key]}
                  </div>
               </div>
               <div className="flex gap-2">
                 {actions.slice(0, 2).map((action, i) => (
                    <button
                      key={i}
                      onClick={(e) => { e.stopPropagation(); action.onClick(row); }}
                      className={`p-2 rounded-xl bg-slate-50 text-slate-500 active:bg-slate-200`}
                    >
                      {action.icon}
                    </button>
                 ))}
               </div>
            </div>
            
            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
               {columns.map((col, idx) => idx !== pinnedColumnIndex && (
                 <div key={col.key} className="flex flex-col">
                   <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">{col.title}</span>
                   <span className="text-xs text-slate-700 font-medium">
                     {col.render ? col.render(row[col.key], row) : row[col.key]}
                   </span>
                 </div>
               ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmartTable;
