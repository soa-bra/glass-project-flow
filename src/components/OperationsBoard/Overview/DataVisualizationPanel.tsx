
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';

interface DataVisualizationPanelProps {
  title: string;
  value: number;
  description: string;
  chart?: 'bar' | 'line';
}

export const DataVisualizationPanel: React.FC<DataVisualizationPanelProps> = ({ 
  title, 
  value, 
  description,
  chart = 'bar'
}) => {
  const renderChart = () => {
    if (chart === 'bar') {
      return (
        <div className="space-y-2">
          {[90, 70, 85, 60].map((height, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-2 bg-gray-300 rounded-full h-2"></div>
              <div 
                className="bg-green-400 rounded-full h-2 transition-all duration-300"
                style={{ width: `${height}%` }}
              ></div>
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div className="h-16 relative">
          <svg className="w-full h-full">
            <path
              d="M 0 40 Q 20 20 40 35 T 80 30 T 120 25"
              stroke="#8b5cf6"
              strokeWidth="2"
              fill="none"
              className="opacity-70"
            />
          </svg>
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500">
            <span>يناير</span>
            <span>مارس</span>
          </div>
        </div>
      );
    }
  };

  return (
    <BaseCard variant="glass" className="p-6">
      <h3 className="text-lg font-bold text-gray-800 font-arabic mb-2">{title}</h3>
      <div className="text-center mb-4">
        <div className="text-3xl font-bold text-gray-800 font-arabic mb-1">{value}</div>
        <div className="text-xs text-gray-600 font-arabic">{description}</div>
      </div>
      {renderChart()}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500 font-arabic">هذا النص هنا للشكل المرئي</p>
      </div>
    </BaseCard>
  );
};
