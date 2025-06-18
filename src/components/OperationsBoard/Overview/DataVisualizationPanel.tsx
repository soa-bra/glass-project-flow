
import React from 'react';

interface DataVisualizationPanelProps {
  title: string;
  value: number;
  description: string;
  chart?: 'bar' | 'line' | 'circle';
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
        <div className="space-y-2 mb-4">
          {[90, 70, 85, 60].map((height, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-2 bg-gray-300 rounded-full h-2"></div>
              <div 
                className="rounded-full h-2 transition-all duration-300"
                style={{ 
                  width: `${height}%`,
                  backgroundColor: '#bdeed3'
                }}
              ></div>
            </div>
          ))}
        </div>
      );
    } else if (chart === 'circle') {
      return (
        <div className="flex items-center justify-center h-20 mb-4">
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle 
                cx="32" 
                cy="32" 
                r="28" 
                stroke="#e5e7eb" 
                strokeWidth="4" 
                fill="transparent"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="#000000"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={`${(75/100) * 176} 176`}
                className="transition-all duration-300"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold">75%</span>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="h-16 relative mb-4">
          <svg className="w-full h-full">
            <path
              d="M 0 40 Q 20 20 40 35 T 80 30 T 120 25"
              stroke="#a4e2f6"
              strokeWidth="2"
              fill="none"
              className="opacity-70"
            />
          </svg>
        </div>
      );
    }
  };

  return (
    <div className="operations-board-card">
      <h3 className="text-lg font-bold text-gray-800 font-arabic mb-4">{title}</h3>
      <div className="text-center mb-4">
        <div className="text-4xl font-bold text-gray-800 font-arabic mb-2">{value}</div>
        <div className="text-xs text-gray-600 font-arabic">{description}</div>
      </div>
      {renderChart()}
      <div className="text-center">
        <p className="text-xs text-gray-500 font-arabic">هذا النص هنا للشكل المرئي</p>
      </div>
    </div>
  );
};
