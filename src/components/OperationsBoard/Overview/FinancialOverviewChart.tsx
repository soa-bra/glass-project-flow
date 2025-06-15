
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { ChevronLeft, MoreHorizontal } from 'lucide-react';

interface FinancialOverviewChartProps {
  title: string;
  data: {
    total: number;
    segments: { label: string; value: number; color: string }[];
  };
}

export const FinancialOverviewChart: React.FC<FinancialOverviewChartProps> = ({ title, data }) => {
  const centerValue = data.segments.reduce((sum, segment) => sum + segment.value, 0);
  
  return (
    <BaseCard variant="glass" className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800 font-arabic">{title}</h3>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-center mb-6">
        {/* دائرة تقدم مبسطة */}
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle 
              cx="64" 
              cy="64" 
              r="56" 
              stroke="#e5e7eb" 
              strokeWidth="8" 
              fill="transparent"
            />
            {/* الشرائح الملونة */}
            {data.segments.map((segment, index) => {
              const circumference = 2 * Math.PI * 56;
              const segmentLength = (segment.value / data.total) * circumference;
              const offset = data.segments.slice(0, index).reduce((sum, prev) => 
                sum + (prev.value / data.total) * circumference, 0
              );
              
              return (
                <circle
                  key={index}
                  cx="64"
                  cy="64"
                  r="56"
                  stroke={segment.color}
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
                  strokeDashoffset={-offset}
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-800 font-arabic">{centerValue}</span>
            <span className="text-xs text-gray-600 font-arabic">الباقي من الميزانية</span>
          </div>
        </div>
      </div>
      
      {/* شرح البيانات */}
      <div className="grid grid-cols-2 gap-4">
        {data.segments.map((segment, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: segment.color }}
            ></div>
            <div>
              <p className="text-lg font-bold text-gray-800 font-arabic">{segment.value}</p>
              <p className="text-xs text-gray-600 font-arabic">{segment.label}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500 font-arabic">هذا النص هنا للشكل المرئي</p>
        <p className="text-xs text-gray-500 font-arabic">هذا النص هنا للشكل المرئي</p>
      </div>
    </BaseCard>
  );
};
