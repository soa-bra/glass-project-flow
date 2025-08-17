import React, { useEffect, useRef, ReactElement, JSXElementConstructor } from 'react';
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
  const isMountedRef = useRef(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      // Clear any potential chart references
      if (containerRef.current) {
        const chartElements = containerRef.current.querySelectorAll('svg');
        chartElements.forEach(svg => {
          // Remove any event listeners that might be attached
          const listeners = (svg as any)._listeners;
          if (listeners) {
            Object.keys(listeners).forEach(event => {
              svg.removeEventListener(event, listeners[event]);
            });
          }
        });
      }
    };
  }, []);

  // Don't render if component is unmounted
  if (!isMountedRef.current) {
    return null;
  }

  return (
    <div ref={containerRef}>
      <ResponsiveContainer width={width} height={height}>
        {children}
      </ResponsiveContainer>
    </div>
  );
};

export default SafeChart;