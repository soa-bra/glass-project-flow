
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const totalRevenue = 78; // مليون
const totalLoss = 14; // مليون
const profitLossRatio = totalLoss / (totalRevenue + totalLoss); // نسبة الخسارة من 0 إلى 1
const isProfit = totalRevenue > totalLoss;
const cardBackgroundColor = isProfit ? '#96d8d0' : '#f1b5b9';

// حساب عدد الشرائط (من 1 إلى 100)
const totalBars = 100;
const filledBars = Math.round(profitLossRatio * totalBars);

export const FinancialOverviewCard: React.FC = () => {
  // إنشاء مصفوفة الشرائط
  const renderBars = () => {
    const bars = [];
    const radius = 120; // نصف قطر أكبر بـ 300%
    const centerX = 150;
    const centerY = 150;
    const barLength = 15;
    
    for (let i = 0; i < totalBars; i++) {
      const angle = (i / totalBars) * 2 * Math.PI - Math.PI / 2; // بدء من الأعلى
      const startX = centerX + Math.cos(angle) * (radius - barLength);
      const startY = centerY + Math.sin(angle) * (radius - barLength);
      const endX = centerX + Math.cos(angle) * radius;
      const endY = centerY + Math.sin(angle) * radius;
      
      // تحديد لون الشريط
      const barColor = i < filledBars ? '#f1b5b9' : '#96d8d0';
      
      bars.push(
        <line
          key={i}
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke={barColor}
          strokeWidth="3"
          strokeLinecap="round"
        />
      );
    }
    return bars;
  };

  return (
    <BaseCard 
      variant="glass" 
      size="sm"
      className="row-span-2 h-[352px]"
      style={{ backgroundColor: cardBackgroundColor }}
      header={
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-black font-arabic">النظرة المالية</h3>
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded-full border border-black/20 flex items-center justify-center hover:bg-black/10">
              <span className="text-sm text-black">←</span>
            </button>
            <button className="w-8 h-8 rounded-full border border-black/20 flex items-center justify-center hover:bg-black/10">
              <span className="text-sm text-black">⋯</span>
            </button>
          </div>
        </div>
      }
    >
      <div className="flex-1 flex gap-4 h-full overflow-hidden">
        {/* النصوص والأرقام - النصف الأول */}
        <div className="flex-1 flex flex-col justify-center overflow-hidden">
          <div className="text-center mb-4">
            <div className="text-2xl font-bold text-black font-arabic mb-1">
              {totalRevenue}
            </div>
            <div className="text-xs font-normal text-gray-400 font-arabic text-center">
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

          <div className="text-xs font-normal text-gray-400 font-arabic text-center">
            هذا النص مثال للشكل البياني
            <br />
            هذا النص مثال
          </div>
        </div>

        {/* الرسم البياني - النصف الثاني */}
        <div className="flex-1 flex justify-center items-center overflow-hidden">
          <div className="relative">
            <svg width="300" height="300" viewBox="0 0 300 300">
              {renderBars()}
              {/* النص المركزي */}
              <text
                x="150"
                y="145"
                textAnchor="middle"
                className="text-4xl font-bold fill-black font-arabic"
              >
                78
              </text>
              <text
                x="150"
                y="165"
                textAnchor="middle"
                className="text-sm font-normal fill-black font-arabic"
              >
                إجمالي الأرباح والخسائر
              </text>
            </svg>
          </div>
        </div>
        
        {/* النصوص الجانبية */}
        <div className="flex-1 flex flex-col justify-center text-center">
          <div className="text-xs font-normal text-gray-400 font-arabic">
            هذا النص مثال
            <br />
            هذا النص مثال للشكل البياني
          </div>
        </div>
      </div>
    </BaseCard>
  );
};
