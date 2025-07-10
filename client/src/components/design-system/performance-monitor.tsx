import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  loading: boolean;
  error: string | null;
  timing: {
    navigationStart: number;
    domContentLoaded: number;
    loadComplete: number;
    firstPaint: number;
    firstContentfulPaint: number;
  };
  vitals: {
    cls: number;
    fid: number;
    lcp: number;
  };
}

export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loading: true,
    error: null,
    timing: {
      navigationStart: 0,
      domContentLoaded: 0,
      loadComplete: 0,
      firstPaint: 0,
      firstContentfulPaint: 0,
    },
    vitals: {
      cls: 0,
      fid: 0,
      lcp: 0,
    }
  });

  useEffect(() => {
    const measurePerformance = () => {
      if (typeof window !== 'undefined' && 'performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const paint = performance.getEntriesByType('paint');
        
        const timing = {
          navigationStart: navigation.navigationStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
          loadComplete: navigation.loadEventEnd - navigation.navigationStart,
          firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
          firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
        };

        setMetrics(prev => ({
          ...prev,
          timing,
          loading: false
        }));
      }
    };

    const measureVitals = () => {
      // Web Vitals measurement
      if ('PerformanceObserver' in window) {
        // Cumulative Layout Shift
        const clsObserver = new PerformanceObserver((list) => {
          let cls = 0;
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              cls += (entry as any).value;
            }
          }
          setMetrics(prev => ({
            ...prev,
            vitals: { ...prev.vitals, cls }
          }));
        });

        // Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          setMetrics(prev => ({
            ...prev,
            vitals: { ...prev.vitals, lcp: lastEntry.startTime }
          }));
        });

        // First Input Delay
        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            setMetrics(prev => ({
              ...prev,
              vitals: { ...prev.vitals, fid: (entry as any).processingStart - entry.startTime }
            }));
          }
        });

        try {
          clsObserver.observe({ type: 'layout-shift', buffered: true });
          lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
          fidObserver.observe({ type: 'first-input', buffered: true });
        } catch (error) {
          console.warn('Performance observer not supported:', error);
        }
      }
    };

    measurePerformance();
    measureVitals();

    window.addEventListener('load', measurePerformance);
    return () => window.removeEventListener('load', measurePerformance);
  }, []);

  return metrics;
}

export function PerformanceMonitor({ children }: { children: React.ReactNode }) {
  const metrics = usePerformanceMonitor();

  // Log performance metrics in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && !metrics.loading) {
      console.group('🚀 Performance Metrics');
      console.log('DOM Content Loaded:', `${metrics.timing.domContentLoaded}ms`);
      console.log('Page Load Complete:', `${metrics.timing.loadComplete}ms`);
      console.log('First Paint:', `${metrics.timing.firstPaint}ms`);
      console.log('First Contentful Paint:', `${metrics.timing.firstContentfulPaint}ms`);
      console.log('Largest Contentful Paint:', `${metrics.vitals.lcp}ms`);
      console.log('Cumulative Layout Shift:', metrics.vitals.cls);
      console.log('First Input Delay:', `${metrics.vitals.fid}ms`);
      console.groupEnd();
    }
  }, [metrics]);

  return <>{children}</>;
}