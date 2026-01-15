import { useState, useEffect, useCallback } from 'react';

interface UseAsyncDataOptions<T> {
  /** Function that returns a Promise with the data */
  fetchFn: () => Promise<T>;

  /** Whether to automatically fetch on mount (default: true) */
  autoFetch?: boolean;

  /** Initial data value */
  initialData?: T;

  /** Callback on success */
  onSuccess?: (data: T) => void;

  /** Callback on error */
  onError?: (error: Error) => void;

  /** Dependencies array for re-fetching */
  deps?: React.DependencyList;
}

interface UseAsyncDataReturn<T> {
  /** The fetched data */
  data: T | null;

  /** Loading state */
  loading: boolean;

  /** Error object if fetch failed */
  error: Error | null;

  /** Error message string */
  errorMessage: string | null;

  /** Manually trigger a refetch */
  refetch: () => Promise<void>;

  /** Reset to initial state */
  reset: () => void;

  /** Whether data has been loaded at least once */
  isInitialized: boolean;
}

/**
 * Universal async data fetching hook with loading and error states
 * Eliminates boilerplate for data fetching across components
 *
 * @example Basic usage:
 * const { data, loading, error, refetch } = useAsyncData({
 *   fetchFn: () => axios.get('/api/books').then(r => r.data)
 * });
 *
 * @example With dependencies:
 * const { data, loading } = useAsyncData({
 *   fetchFn: () => fetchBookById(bookId),
 *   deps: [bookId]
 * });
 *
 * @example Manual fetch:
 * const { data, loading, refetch } = useAsyncData({
 *   fetchFn: () => fetchData(),
 *   autoFetch: false
 * });
 * // Call refetch() when needed
 *
 * @example With callbacks:
 * const { data, loading } = useAsyncData({
 *   fetchFn: () => fetchData(),
 *   onSuccess: (data) => toast.success('Loaded!'),
 *   onError: (error) => toast.error(error.message)
 * });
 */
export function useAsyncData<T = unknown>({
  fetchFn,
  autoFetch = true,
  initialData = null,
  onSuccess,
  onError,
  deps = [],
}: UseAsyncDataOptions<T>): UseAsyncDataReturn<T> {
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchFn();
      setData(result);
      setIsInitialized(true);

      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err) {
      const fetchError = err instanceof Error ? err : new Error(String(err));
      setError(fetchError);

      if (onError) {
        onError(fetchError);
      }
    } finally {
      setLoading(false);
    }
  }, [fetchFn, onSuccess, onError]);

  const reset = useCallback(() => {
    setData(initialData);
    setLoading(false);
    setError(null);
    setIsInitialized(false);
  }, [initialData]);

  // Auto-fetch on mount or when dependencies change
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, ...deps]);

  return {
    data,
    loading,
    error,
    errorMessage: error?.message || null,
    refetch: fetchData,
    reset,
    isInitialized,
  };
}

/**
 * Specialized hook for fetching with Redux dispatchers
 *
 * @example With Redux thunk:
 * const { data, loading } = useAsyncDataWithDispatch({
 *   dispatchFn: () => dispatch(fetchMyBooks())
 * });
 */
export function useAsyncDataWithDispatch<T = unknown>({
  dispatchFn,
  autoFetch = true,
  deps = [],
}: {
  dispatchFn: () => Promise<T>;
  autoFetch?: boolean;
  deps?: React.DependencyList;
}): Omit<UseAsyncDataReturn<T>, 'reset'> {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await dispatchFn();
      setIsInitialized(true);
    } catch (err) {
      const fetchError = err instanceof Error ? err : new Error(String(err));
      setError(fetchError);
    } finally {
      setLoading(false);
    }
  }, [dispatchFn]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, ...deps]);

  // Note: data comes from selector, so we can't provide it directly
  // This is just for the pattern - actual data should be accessed via selector
  return {
    data: null, // Use selector separately in component
    loading,
    error,
    errorMessage: error?.message || null,
    refetch: fetchData,
    isInitialized,
  };
}
