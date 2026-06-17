import { useEffect } from 'react';

// Singleton state
let activeRequests = 0;
let barElement = null;

const updateBar = () => {
  if (!barElement) return;
  
  if (activeRequests > 0) {
    // Start loading
    barElement.style.transition = 'width 1.5s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.2s';
    barElement.style.opacity = '1';
    barElement.style.width = '85%';
  } else {
    // Finish loading
    barElement.style.transition = 'width 0.2s ease-out, opacity 0.4s ease-in 0.2s';
    barElement.style.width = '100%';
    barElement.style.opacity = '0';
    
    // Reset after fade out
    setTimeout(() => {
      if (activeRequests === 0 && barElement) {
        barElement.style.transition = 'none';
        barElement.style.width = '0%';
      }
    }, 600);
  }
};

export const globalLoading = {
  show: () => {
    activeRequests++;
    updateBar();
  },
  hide: () => {
    activeRequests = Math.max(0, activeRequests - 1);
    updateBar();
  }
};

export default function GlobalLoadingBar() {
  useEffect(() => {
    barElement = document.getElementById('global-loading-bar');
    return () => {
      barElement = null;
    };
  }, []);

  return (
    <div
      id="global-loading-bar"
      className="fixed top-0 left-0 h-[3px] bg-indigo-500 z-[9999] w-0 opacity-0 pointer-events-none"
    />
  );
}
