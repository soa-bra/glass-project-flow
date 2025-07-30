
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// إنشاء شرائط دائرية للمخطط المالي
const createCircularBars = (lossPercentage: number) => {
  const totalBars = 60; // عدد الشرائط حول الدائرة
  const filledBars = Math.floor((lossPercentage / 100) * totalBars);
  
  return Array.from({ length: totalBars }, (_, index) => {
    const angle = (index * 360) / totalBars;
    const isFilled = index < filledBars;
    
    // تدرج اللون من الأخضر إلى الأحمر بناءً على النسبة
    const greenIntensity = Math.max(0, 1 - (lossPercentage / 100));
    const redIntensity = lossPercentage / 100;
    const color = isFilled 
      ? `rgb(${Math.floor(241 * redIntensity + 150 * greenIntensity)}, ${Math.floor(181 * greenIntensity + 181 * (1 - redIntensity))}, ${Math.floor(185 * (1 - redIntensity) + 208 * greenIntensity)})` 
      : `rgba(${Math.floor(241 * redIntensity + 150 * greenIntensity)}, ${Math.floor(181 * greenIntensity + 181 * (1 - redIntensity))}, ${Math.floor(185 * (1 - redIntensity) + 208 * greenIntensity)}, 0.3)`;
    
    return {
      id: index,
      angle,
      isFilled,
      color
    };
  });
};

const totalRevenue = 78; // مليون
const lossPercentage = 30; // نسبة الخسارة (0-100)
const isProfit = lossPercentage < 50;
const circularBars = createCircularBars(lossPercentage);

export const FinancialOverviewCard: React.FC = () => {
  const navigate = useNavigate();

  const handleFinancialClick = () => {
    navigate('/departments/financial');
  };

  return (
    <BaseCard 
      variant="glass" 
      size="sm"
      className="row-span-2 h-[376px]"
      style={{ backgroundColor: isProfit ? '#96d8d0' : '#f1b5b9' }}
      header={
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-black font-arabic">النظرة المالية</h3>
          <button 
            onClick={handleFinancialClick}
            className="w-8 h-8 bg-transparent border border-black/20 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors"
          >
            <TrendingUp className="w-4 h-4 text-black" />
          </button>
        </div>
      }
    >
      <div className="flex gap-4 h-full overflow-hidden">
        {/* النصوص والأرقام - 2/5 من المساحة */}
        <div className="w-2/5 flex flex-col justify-center overflow-hidden">
          <div className="text-center mb-4">
            <div className="text-2xl font-bold text-black font-arabic mb-1">
              {totalRevenue}
            </div>
            <div className="text-xs font-normal text-black font-arabic text-center">
              إجمالي الأرباح والخسائر
            </div>
          </div>

          {/* التفاصيل */}
          <div className="grid grid-cols-1 gap-2 text-center mb-4">
            <div>
              <div className="text-2xl font-bold text-black font-arabic">02</div>
              <div className="text-xs font-normal text-gray-400 font-arabic">مثال</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-black font-arabic">14</div>
              <div className="text-xs font-normal text-gray-400 font-arabic">مثال</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-black font-arabic">78</div>
              <div className="text-xs font-normal text-gray-400 font-arabic">مثال</div>
            </div>
          </div>

          <div className="text-xs font-normal text-black font-arabic text-center mb-2">
            هذا النص مثال للشكل النهائي
          </div>
          <div className="text-xs font-normal text-black font-arabic text-center">
            هذا النص مثال
          </div>
        </div>

        {/* الرسم البياني الدائري - 3/5 من المساحة */}
        <div className="w-3/5 flex justify-center items-center overflow-hidden">
          <div className="relative w-48 h-48">
            {/* الرقم المركزي */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl font-bold text-black font-arabic mb-1">
                {totalRevenue}
              </div>
              <div className="text-xs font-normal text-black font-arabic text-center px-2">
                إجمالي الأرباح والخسائر
              </div>
            </div>
            
            {/* الشرائط الدائرية */}
            <svg className="w-full h-full" viewBox="0 0 200 200">
              {circularBars.map((bar, index) => {
                const radius = 85;
                const centerX = 100;
                const centerY = 100;
                const barWidth = 3;
                const barHeight = bar.isFilled ? 24 : 16;
                
                const startRadius = radius - (barHeight / 2);
                const endRadius = radius + (barHeight / 2);
                
                const startAngle = (bar.angle - 1.5) * (Math.PI / 180);
                const endAngle = (bar.angle + 1.5) * (Math.PI / 180);
                
                const x1 = centerX + startRadius * Math.cos(startAngle);
                const y1 = centerY + startRadius * Math.sin(startAngle);
                const x2 = centerX + endRadius * Math.cos(startAngle);
                const y2 = centerY + endRadius * Math.sin(startAngle);
                
                return (
                  <line
                    key={bar.id}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={bar.color}
                    strokeWidth={barWidth}
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </BaseCard>
  );
};
