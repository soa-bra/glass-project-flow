import React from 'react';
import { BaseBox } from '@/components/ui/BaseBox';
import { TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const createCircularBars = (lossPercentage: number) => {
  const totalBars = 60;
  const filledBars = Math.floor((lossPercentage / 100) * totalBars);
  
  return Array.from({ length: totalBars }, (_, index) => {
    const angle = (index * 360) / totalBars;
    const isFilled = index < filledBars;
    
    const greenIntensity = Math.max(0, 1 - (lossPercentage / 100));
    const redIntensity = lossPercentage / 100;
    const color = isFilled 
      ? `rgb(${Math.floor(241 * redIntensity + 150 * greenIntensity)}, ${Math.floor(181 * greenIntensity + 181 * (1 - redIntensity))}, ${Math.floor(185 * (1 - redIntensity) + 208 * greenIntensity)})` 
      : `rgba(${Math.floor(241 * redIntensity + 150 * greenIntensity)}, ${Math.floor(181 * greenIntensity + 181 * (1 - redIntensity))}, ${Math.floor(185 * (1 - redIntensity) + 208 * greenIntensity)}, 0.3)`;
    
    return { id: index, angle, isFilled, color };
  });
};

const totalRevenue = 78;
const lossPercentage = 30;
const isProfit = lossPercentage < 50;
const circularBars = createCircularBars(lossPercentage);

export const FinancialOverviewBox: React.FC = () => {
  const navigate = useNavigate();

  const handleFinancialClick = () => {
    navigate('/departments/financial');
  };

  return (
    <BaseBox 
      variant="standard" 
      size="sm"
      className={`h-full min-h-0 flex flex-col ${isProfit ? 'bg-[#96D8D0]' : 'bg-[#F1B5B9]'}`}
      overflow="hidden"
    >
      {/* Header — fixed */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <h3 className="text-lg font-semibold text-[hsl(var(--ink))] font-arabic">النظرة المالية</h3>
        <button 
          onClick={handleFinancialClick}
          className="w-8 h-8 bg-transparent border border-[hsl(var(--ink))]/20 rounded-full flex items-center justify-center hover:bg-[hsl(var(--ink))]/10 transition-colors flex-shrink-0"
        >
          <TrendingUp className="w-4 h-4 text-[hsl(var(--ink))]" />
        </button>
      </div>

      {/* Content — flexible, contained */}
      <div className="flex gap-3 flex-1 min-h-0 overflow-hidden">
        {/* Left stats column */}
        <div className="w-2/5 flex flex-col justify-center gap-3 min-w-0 overflow-hidden">
          <div className="text-center">
            <div className="text-xl font-bold text-[hsl(var(--ink))] font-arabic">{totalRevenue}</div>
            <div className="text-[10px] font-normal text-[hsl(var(--ink))] font-arabic">إجمالي الأرباح والخسائر</div>
          </div>
          <div className="space-y-2">
            {[{ val: '02' }, { val: '14' }, { val: '78' }].map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-lg font-bold text-[hsl(var(--ink))] font-arabic">{item.val}</div>
                <div className="text-[10px] font-normal text-[hsl(var(--ink-60))] font-arabic">مثال</div>
              </div>
            ))}
          </div>
          <div className="text-[10px] font-normal text-[hsl(var(--ink))] font-arabic text-center">هذا النص مثال</div>
        </div>

        {/* Right chart — responsive SVG */}
        <div className="w-3/5 flex justify-center items-center min-w-0 overflow-hidden">
          <div className="relative w-full max-w-[160px] aspect-square">
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <div className="text-3xl font-bold text-[hsl(var(--ink))] font-arabic">{totalRevenue}</div>
              <div className="text-[10px] font-normal text-[hsl(var(--ink))] font-arabic text-center px-2">إجمالي الأرباح والخسائر</div>
            </div>
            <svg className="w-full h-full" viewBox="0 0 200 200">
              {circularBars.map((bar) => {
                const radius = 85;
                const barHeight = bar.isFilled ? 24 : 16;
                const startRadius = radius - (barHeight / 2);
                const endRadius = radius + (barHeight / 2);
                const startAngle = (bar.angle - 1.5) * (Math.PI / 180);
                const x1 = 100 + startRadius * Math.cos(startAngle);
                const y1 = 100 + startRadius * Math.sin(startAngle);
                const x2 = 100 + endRadius * Math.cos(startAngle);
                const y2 = 100 + endRadius * Math.sin(startAngle);
                return (
                  <line key={bar.id} x1={x1} y1={y1} x2={x2} y2={y2} stroke={bar.color} strokeWidth={3} strokeLinecap="round" />
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </BaseBox>
  );
};
