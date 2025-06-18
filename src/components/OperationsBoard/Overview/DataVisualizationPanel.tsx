
import React from 'react';

interface DataVisualizationPanelProps {
  title: string;
  value: number;
  description: string;
  chart?: 'bar' | 'line' | 'circle';
}

const COLORS = {
  primary: '#000000',
  secondary_1: '#bdeed3',
  secondary_2: '#f1b5b9', 
  secondary_3: '#d9d2fd',
  secondary_4: '#a4e2f6',
  secondary_5: '#fbe2aa'
};

export const DataVisualizationPanel: React.FC<DataVisualizationPanelProps> = ({ 
  title, 
  value, 
  description,
  chart = 'bar'
}) => {
  const renderChart = () => {
    if (chart === 'bar') {
      return (
        <div className="flex items-end justify-center gap-1 h-16 mb-4">
          {[40, 30, 50, 20, 35].map((height, index) => (
            <div
              key={index}
              className="rounded-sm transition-all duration-300"
              style={{ 
                width: '12px',
                height: `${height}px`,
                backgroundColor: index === 2 ? COLORS.secondary_1 : COLORS.secondary_4
              }}
            />
          ))}
        </div>
      );
    } else if (chart === 'circle') {
      return (
        <div className="flex items-center justify-center mb-4">
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 transform -rotate-90">
              <circle 
                cx="40" 
                cy="40" 
                r="32" 
                stroke="#e5e7eb" 
                strokeWidth="6" 
                fill="transparent"
              />
              <circle
                cx="40"
                cy="40"
                r="32"
                stroke={COLORS.primary}
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={`${(75/100) * 201} 201`}
                className="transition-all duration-300"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold font-arabic">75%</span>
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
              stroke={COLORS.secondary_4}
              strokeWidth="3"
              fill="none"
              className="opacity-80"
            />
            {/* نقاط البيانات */}
            <circle cx="0" cy="40" r="3" fill={COLORS.primary} />
            <circle cx="40" cy="35" r="3" fill={COLORS.primary} />
            <circle cx="80" cy="30" r="3" fill={COLORS.primary} />
            <circle cx="120" cy="25" r="3" fill={COLORS.primary} />
          </svg>
        </div>
      );
    }
  };

  return (
    <div 
      className="h-full p-6 rounded-3xl shadow-lg border border-white/40"
      style={{ background: '#f2ffff' }}
    >
      <h3 className="text-lg font-bold text-gray-800 font-arabic mb-4">{title}</h3>
      
      <div className="text-center mb-4">
        <div className="text-xs text-gray-600 font-arabic mb-2">{description}</div>
        <div className="text-3xl font-bold text-gray-800 font-arabic">{value}</div>
        <div className="text-xs text-gray-600 font-arabic">مثال</div>
      </div>
      
      {renderChart()}
      
      <div className="text-center">
        <p className="text-xs text-gray-500 font-arabic">هذا النص هنا للشكل المرئي</p>
      </div>
    </div>
  );
};
