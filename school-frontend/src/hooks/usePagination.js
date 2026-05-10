// src/hooks/usePagination.js
import { useState, useMemo } from 'react';

/**
 * Enterprise Pagination Hook
 * Handles: Page indexing, page size, data slicing, total calculations
 */
const usePagination = (data = [], pageSize = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  
  // Ensure current page is never out of bounds
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }

  const pagedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return data.slice(start, end);
  }, [data, currentPage, pageSize]);

  return {
    currentPage,
    setCurrentPage,
    totalPages,
    pagedData,
    pageSize,
    totalItems: data.length,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1
  };
};

export default usePagination;
