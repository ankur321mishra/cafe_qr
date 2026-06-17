import { useState, useEffect, useCallback, useRef } from 'react';
import { globalLoading } from '../components/GlobalLoadingBar';
import { apiClient } from '../utils/apiClient';

export default function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const abortControllerRef = useRef(null);
  const optionsRef = useRef(options);
  
  // Update options ref so we don't retrigger effect if options object reference changes
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const fetchData = useCallback(async () => {
    if (!url) return;
    
    setLoading(true);
    setError(null);
    globalLoading.show();

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const res = await apiClient(url, {
        ...optionsRef.current,
        signal: controller.signal
      });

      if (res.success) {
        setData(res.data);
      } else {
        throw new Error(res.error || 'Failed to fetch data');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err);
      }
    } finally {
      // Only hide loading if not aborted (because a new fetch might have started)
      if (!controller.signal.aborted) {
        setLoading(false);
        globalLoading.hide();
      }
    }
  }, [url]);

  useEffect(() => {
    fetchData();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        // Since we abort on unmount, we must also hide the global loading bar
        globalLoading.hide();
      }
    };
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
