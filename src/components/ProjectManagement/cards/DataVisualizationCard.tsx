
import React from 'react';

interface DataVisualizationCardProps {
  title: string;
  value: string;
  unit: string;
  chartType: 'donut' | 'bar' | 'line' | 'trend' | 'chart' | 'circular' | 'simple' | 'column';
}

export const DataVisualizationCard: React.FC<DataVisualizationCardProps> = ({
  title,
  value,
  unit,
  chartType
}) => {
  const renderChart = () => {
    switch (chartType) {
      case 'donut':
        return (
          <div className="relative w-20 h-20 mx-auto mb-4">
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="32" stroke="#e5e7eb" strokeWidth="8" fill="none" />
              <circle 
                cx="40" 
                cy="40" 
                r="32" 
                stroke="url(#gradient1)" 
                strokeWidth="8" 
                fill="none"
                strokeDasharray="201"
                strokeDashoffset="50"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="25%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-2xl font-bold">{value}</div>
            </div>
          </div>
        );
        
      case 'bar':
        return (
          <div className="flex items-end justify-center gap-1 h-16 mb-4">
            {[40, 60, 30, 80, 50].map((height, i) => (
              <div 
                key={i}
                className="w-3 bg-gradient-to-t from-blue-400 to-purple-500 rounded-t"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        );
        
      case 'line':
        return (
          <div className="h-16 mb-4 flex items-center justify-center">
            <svg className="w-24 h-12" viewBox="0 0 100 50">
              <path 
                d="M10,40 Q30,20 50,25 T90,15" 
                stroke="#8b5cf6" 
                strokeWidth="2" 
                fill="none"
                strokeLinecap="round"
              />
              <circle cx="10" cy="40" r="2" fill="#8b5cf6" />
              <circle cx="50" cy="25" r="2" fill="#8b5cf6" />
              <circle cx="90" cy="15" r="2" fill="#8b5cf6" />
            </svg>
          </div>
        );
        
      case 'circular':
        return (
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full border-t-blue-500 animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-lg font-bold">%{value}</div>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="h-16 mb-4 flex items-center justify-center">
            <div className="grid grid-cols-7 gap-1 h-12">
              {Array.from({length: 21}).map((_, i) => (
                <div 
                  key={i}
                  className="w-1 bg-gradient-to-t from-gray-300 to-green-400 rounded"
                  style={{ height: `${Math.random() * 100}%` }}
                />
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full bg-white/60 backdrop-blur-[20px] rounded-2xl p-4 border border-white/30 flex flex-col">
      <div className="flex-1 flex flex-col justify-center items-center">
        {renderChart()}
        
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800 mb-1">{value}</div>
          <div className="text-sm text-gray-600 font-arabic mb-2">{unit}</div>
          <div className="text-xs text-gray-500 font-arabic">{title}</div>
        </div>
      </div>
      
      <div className="text-xs text-gray-400 font-arabic text-center mt-2">
        هذا النص مثال للشكل البياني
      </div>
    </div>
  );
};
