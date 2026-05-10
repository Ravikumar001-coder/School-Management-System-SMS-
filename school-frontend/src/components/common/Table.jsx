// src/components/common/Table.jsx
import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';

/**
 * Enterprise Data Table
 * Features: 
 * - Sticky Header
 * - Mobile horizontal scroll
 * - Loading state with skeleton or spinner
 * - Empty state integration
 * - Pinned columns (simulated with CSS)
 */
const Table = ({
  columns,
  data = [],
  loading = false,
  emptyMessage = "No data found",
  emptySubMessage = "Try adjusting your filters",
  rowKey = "id",
  onRowClick,
  className = "",
  containerClassName = ""
}) => {
  return (
    <div className={`table-container ${containerClassName}`}>
      <div className="overflow-x-auto scrollbar-thin">
        <table className={`table ${className}`}>
          <thead className="sticky top-0 z-10">
            <tr>
              {columns.map((col) => (
                <th 
                  key={col.key || col.header}
                  className={`whitespace-nowrap ${col.className || ''}`}
                  style={{ width: col.width }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody className="relative min-h-[100px]">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <LoadingSpinner />
                    <span className="text-gray-400 text-sm animate-pulse">
                      Loading data...
                    </span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-10">
                  <EmptyState 
                    text={emptyMessage} 
                    subText={emptySubMessage}
                  />
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr 
                  key={row[rowKey] || index}
                  onClick={() => onRowClick?.(row)}
                  className={`${onRowClick ? 'cursor-pointer hover:bg-blue-50 transition-colors' : ''}`}
                >
                  {columns.map((col) => (
                    <td 
                      key={col.key || col.header}
                      className={col.className || ''}
                    >
                      {col.render ? col.render(row[col.key], row, index) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
