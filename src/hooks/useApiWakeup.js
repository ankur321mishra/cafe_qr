import { useState, useEffect, useCallback, useRef } from 'react';

export default function useApiWakeup() {
  const [status, setStatus] = useState('idle');
  const abortControllerRef = useRef(null);

  const ping = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    
    setStatus('idle');
    
    const timeoutId = setTimeout(() => {
      setStatus(prev => prev === 'idle' ? 'waking' : prev);
    }, 3000);

    try {
      const fetchPromise = fetch(`${import.meta.env.VITE_API_URL}/health`, {
        signal: abortControllerRef.current.signal
      });
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('timeout')), 90000)
      );
      
      await Promise.race([fetchPromise, timeoutPromise]);
      
      clearTimeout(timeoutId);
      setStatus('ready');
    } catch (err) {
      if (err.name !== 'AbortError') {
        clearTimeout(timeoutId);
        setStatus('error');
      }
    }
  }, []);

  useEffect(() => {
    ping();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [ping]);

  return { status, retry: ping };
}
