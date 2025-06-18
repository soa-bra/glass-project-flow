
import React from 'react';
import { ChevronLeft, MoreHorizontal, TrendingUp, Download } from 'lucide-react';

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
    <div className="financial-card-profit">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800 font-arabic">{title}</h3>
        <div className="flex gap-2">
          {/* أيقونة دائرية للاتجاه */}
          <button className="w-8 h-8 rounded-full bg-white/60 hover:bg-white/80 flex items-center justify-center transition-colors">
            <TrendingUp className="w-4 h-4 text-gray-600" />
          </button>
          {/* أيقونة دائرية للتحميل */}
          <button className="w-8 h-8 rounded-full bg-white/60 hover:bg-white/80 flex items-center justify-center transition-colors">
            <Download className="w-4 h-4 text-gray-600" />
          </button>
          {/* أيقونة دائرية للمزيد */}
          <button className="w-8 h-8 rounded-full bg-white/60 hover:bg-white/80 flex items-center justify-center transition-colors">
            <MoreHorizontal className="w-4 h-4 text-gray-600" />
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
              
              const colors = [
                'var(--visual-data-donut-slice-1)',
                'var(--visual-data-donut-slice-2)',
                'var(--visual-data-secondary-2)',
                'var(--visual-data-secondary-5)'
              ];
              
              return (
                <circle
                  key={index}
                  cx="64"
                  cy="64"
                  r="56"
                  stroke={colors[index] || segment.color}
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
            <span className="text-xs text-gray-600 font-arabic">المعدل الأرباح والخسائر</span>
            <span className="text-2xl font-bold text-gray-800 font-arabic">{centerValue}</span>
            <div className="flex gap-4 mt-2">
              <div className="text-center">
                <div className="text-lg font-bold font-arabic">78</div>
                <div className="text-xs text-gray-600 font-arabic">مليار</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold font-arabic">02</div>
                <div className="text-xs text-gray-600 font-arabic">مليار</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold font-arabic">14</div>
                <div className="text-xs text-gray-600 font-arabic">مليار</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-600 font-arabic">هذا النص هنا للشكل البرئي</p>
        <p className="text-xs text-gray-600 font-arabic">هذا النص هنا للشكل البرئي</p>
      </div>
    </div>
  );
};
