import { useState, useEffect } from 'react';

export default function WakeupBanner({ status, retry }) {
  const [elapsed, setElapsed] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let timer;
    if (status === 'waking') {
      timer = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      setElapsed(0);
    }
    return () => clearInterval(timer);
  }, [status]);

  if (status === 'idle') return null;
  
  if (status === 'ready') {
    if (dismissed) return null;
    return (
      <div className="w-full bg-green-50 border-b border-green-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
          <span className="text-sm font-medium text-green-800">Server is ready!</span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-green-600 hover:text-green-800 transition-colors p-1 rounded-md hover:bg-green-100"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="w-full bg-red-50 border-b border-red-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
          <span className="text-sm font-medium text-red-800">Could not reach the server.</span>
        </div>
        <button
          onClick={retry}
          className="text-xs font-bold text-red-700 bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-md transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-amber-50 border-b border-amber-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative flex h-2 w-2 flex-shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </div>
        <span className="text-sm font-medium text-amber-800">
          Server is starting up, please wait… <span className="font-bold">{elapsed}s</span>
        </span>
      </div>
    </div>
  );
}
