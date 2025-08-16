import { useState, useEffect, useCallback, useRef } from 'react';

interface UseOptimizedDataOptions<T> {
  fetchFn: () => Promise<T>;
  dependencies?: any[];
  cacheKey?: string;
  cacheTime?: number; // in milliseconds
  retryCount?: number;
  retryDelay?: number;
}

interface UseOptimizedDataReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearCache: () => void;
}

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number; cacheTime: number }>();

export function useOptimizedData<T>({
  fetchFn,
  dependencies = [],
  cacheKey,
  cacheTime = 5 * 60 * 1000, // 5 minutes default
  retryCount = 3,
  retryDelay = 1000
}: UseOptimizedDataOptions<T>): UseOptimizedDataReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const retryCountRef = useRef(0);

  const clearCache = useCallback(() => {
    if (cacheKey) {
      cache.delete(cacheKey);
    }
  }, [cacheKey]);

  const fetchData = useCallback(async (isRetry = false) => {
    if (!isRetry) {
      setLoading(true);
      setError(null);
      retryCountRef.current = 0;
    }

    // Check cache first
    if (cacheKey && !isRetry) {
      const cached = cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < cached.cacheTime) {
        setData(cached.data);
        setLoading(false);
        return;
      }
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    try {
      const result = await fetchFn();
      
      // Cache the result
      if (cacheKey) {
        cache.set(cacheKey, {
          data: result,
          timestamp: Date.now(),
          cacheTime
        });
      }

      setData(result);
      setError(null);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return; // Request was cancelled
      }

      console.error('Data fetch error:', err);
      
      // Retry logic
      if (retryCountRef.current < retryCount) {
        retryCountRef.current++;
        setTimeout(() => {
          fetchData(true);
        }, retryDelay);
        return;
      }

      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [fetchFn, cacheKey, cacheTime, retryCount, retryDelay]);

  const refetch = useCallback(async () => {
    clearCache();
    await fetchData();
  }, [fetchData, clearCache]);

  useEffect(() => {
    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, dependencies);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    data,
    loading,
    error,
    refetch,
    clearCache
  };
} 