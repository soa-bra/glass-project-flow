
import React from 'react';
import { ChevronLeft, MoreHorizontal } from 'lucide-react';
import { CircularIconButton } from '@/components/ui/CircularIconButton';

interface FinancialOverviewChartProps {
  title: string;
  data: {
    total: number;
    segments: {
      label: string;
      value: number;
      color: string;
    }[];
  };
  isProfit?: boolean;
}

export const FinancialOverviewChart: React.FC<FinancialOverviewChartProps> = ({
  title,
  data,
  isProfit = true
}) => {
  const backgroundColor = isProfit ? '#96d8d0' : '#f1b5b9';
  
  return (
    <div className="h-full flex flex-col p-4 rounded-lg" style={{ backgroundColor }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <CircularIconButton icon={MoreHorizontal} size="sm" />
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-3xl font-bold mb-2">
          {data.total.toLocaleString()}
        </div>
        
        <div className="w-full space-y-2">
          {data.segments.map((segment, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: segment.color }}
                ></div>
                <span className="text-sm">{segment.label}</span>
              </div>
              <span className="text-sm font-medium">{segment.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
