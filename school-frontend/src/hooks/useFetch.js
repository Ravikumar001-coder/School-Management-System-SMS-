// src/hooks/useFetch.js
import { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react';
import { useToast } from './useToast';

/**
 * Enterprise Data Fetching Hook
 * - Stable execute reference (only depends on apiCall)
 * - toast stored in ref via useLayoutEffect (safe side-effect pattern)
 * - No infinite loop: callers must pass stable apiCall via useMemo
 */
const useFetch = (apiCall, options = {}) => {
  const {
    immediate     = true,
    onSuccess,
    onError,
    initialData   = null,
    errorMessage  = 'Failed to fetch data',
  } = options;

  const [data, setData]       = useState(initialData);
  const [loading, setLoading] = useState(immediate);
  const [error, setError]     = useState(null);

  const toast     = useToast();
  const toastRef  = useRef(toast);
  const isMounted = useRef(true);

  // Sync toast ref before paint — safe side-effect, no renders triggered
  useLayoutEffect(() => { toastRef.current = toast; });

  // Handle React 18 Strict Mode double mount
  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall(...args);
      if (!isMounted.current) return;

      // Unwrap backend ApiResponse wrapper:
      // axios response: { data: { success, message, data: <payload> } }
      let result = response;
      if (response?.data !== undefined) {
        result = response.data?.data !== undefined
          ? response.data.data
          : response.data;
      }

      setData(result);
      onSuccess?.(result);
      return result;
    } catch (err) {
      if (!isMounted.current) throw err;
      const msg = err?.response?.data?.message || errorMessage;
      setError(msg);
      toastRef.current?.error?.(msg);
      onError?.(err);
    } finally {
      if (isMounted.current) setLoading(false);
    }
  // toast is accessed via ref; onSuccess/onError must be stable in caller
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiCall]);

  const hasRun = useRef(false);
  useEffect(() => {
    if (immediate && !hasRun.current) {
      execute();
      hasRun.current = true;
    }
  }, [immediate, execute]);

  return {
    data: data ?? initialData,
    loading,
    error,
    execute,
    setData,
  };
};

export default useFetch;
