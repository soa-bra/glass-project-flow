import React from 'react';
import { ResponsiveContainer } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';

interface ChartWrapperProps {
  children: React.ReactElement;
  config?: any;
  className?: string;
  minHeight?: number;
  minWidth?: number;
  aspectRatio?: string;
}

export const ChartWrapper: React.FC<ChartWrapperProps> = ({
  children,
  config,
  className = '',
  minHeight = 200,
  minWidth = 300,
  aspectRatio = 'auto'
}) => {
  const containerStyle = {
    minHeight: `${minHeight}px`,
    minWidth: `${minWidth}px`,
    aspectRatio: aspectRatio !== 'auto' ? aspectRatio : undefined,
    width: '100%',
    height: '100%'
  };

  if (config) {
    return (
      <div style={containerStyle} className={className}>
        <ChartContainer config={config} className="w-full h-full">
          <ResponsiveContainer 
            width="100%" 
            height="100%"
            minHeight={minHeight}
          >
            {children}
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    );
  }

  return (
    <div style={containerStyle} className={className}>
      <ResponsiveContainer 
        width="100%" 
        height="100%"
        minHeight={minHeight}
      >
        {children}
      </ResponsiveContainer>
    </div>
  );
};