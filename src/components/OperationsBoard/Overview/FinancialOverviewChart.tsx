
import React from 'react';
import { ChevronLeft, MoreHorizontal } from 'lucide-react';
import { CircularIconButton } from '@/components/ui/CircularIconButton';

interface FinancialOverviewChartProps {
  title: string;
  data: {
    total: number;
    segments: { label: string; value: number; color: string }[];
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
    <div 
      className="h-full p-6 rounded-3xl shadow-lg border border-white/40"
      style={{ background: backgroundColor }}
    >
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-gray-800 font-arabic">{title}</h3>
        <div className="flex gap-2">
          <CircularIconButton icon={ChevronLeft} size="sm" />
          <CircularIconButton icon={MoreHorizontal} size="sm" />
        </div>
      </div>
      
      <div className="flex items-center justify-center mb-8">
        {/* دائرة مع خطوط شعاعية */}
        <div className="relative w-40 h-40">
          {/* الخطوط الشعاعية الخارجية */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 160 160">
            {Array.from({ length: 60 }).map((_, i) => {
              const angle = (i * 6) * Math.PI / 180;
              const x1 = 80 + Math.cos(angle) * 65;
              const y1 = 80 + Math.sin(angle) * 65;
              const x2 = 80 + Math.cos(angle) * 75;
              const y2 = 80 + Math.sin(angle) * 75;
              
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#fbe2aa"
                  strokeWidth="2"
                  opacity="0.8"
                />
              );
            })}
          </svg>
          
          {/* الرقم المركزي */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold text-gray-800 font-arabic mb-2">78</span>
            <span className="text-sm text-gray-700 font-arabic text-center">
              اجمالي الأرباح والخسائر
            </span>
          </div>
        </div>
      </div>

      {/* القيم الجانبية */}
      <div className="flex flex-col gap-6 items-end">
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-800 font-arabic">02</div>
          <div className="text-sm text-gray-700 font-arabic">مثال</div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-800 font-arabic">14</div>
          <div className="text-sm text-gray-700 font-arabic">مثال</div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-800 font-arabic">78</div>
          <div className="text-sm text-gray-700 font-arabic">مثال</div>
        </div>
      </div>
      
      <div className="mt-6 text-center space-y-2">
        <p className="text-xs text-gray-700 font-arabic">هذا النص مثال للشكل النهائي</p>
        <p className="text-xs text-gray-700 font-arabic">هذا النص مثال للشكل النهائي</p>
      </div>
    </div>
  );
};
