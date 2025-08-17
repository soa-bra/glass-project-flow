import React, { useEffect, useRef, ReactElement, JSXElementConstructor, useState } from 'react';
import { ResponsiveContainer } from 'recharts';

interface SafeChartProps {
  children: ReactElement<any, string | JSXElementConstructor<any>>;
  width?: string | number;
  height?: string | number;
}

export const SafeChart: React.FC<SafeChartProps> = ({ 
  children, 
  width = "100%", 
  height = 300 
}) => {
  const [isMounted, setIsMounted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    console.log('SafeChart mounted');
    
    return () => {
      console.log('SafeChart unmounting - cleaning up');
      setIsMounted(false);
      
      // Clear any pending timeouts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Clean up chart references with a small delay to ensure DOM cleanup
      timeoutRef.current = setTimeout(() => {
        if (containerRef.current) {
          const chartElements = containerRef.current.querySelectorAll('svg, canvas');
          chartElements.forEach(element => {
            // Remove any potential event listeners
            const listeners = (element as any)._listeners;
            if (listeners) {
              Object.keys(listeners).forEach(event => {
                element.removeEventListener(event, listeners[event]);
              });
            }
            
            // Clear any animation frames or timers that might be running
            if ((element as any).__resizeObserver) {
              (element as any).__resizeObserver.disconnect();
            }
          });
        }
      }, 100);
    };
  }, []);

  // Always call hooks consistently, then conditionally render
  return (
    <div ref={containerRef}>
      {isMounted ? (
        <ResponsiveContainer width={width} height={height}>
          {children}
        </ResponsiveContainer>
      ) : (
        <div 
          style={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          className="text-gray-400"
        >
          Chart unmounted
        </div>
      )}
    </div>
  );
};

export default SafeChart;