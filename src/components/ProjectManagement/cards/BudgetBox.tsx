import React from 'react';
import { BaseBox } from '@/components/ui/BaseBox';
import { Project } from '@/types/project';

interface BudgetCardProps {
  project: Project;
}

export const BudgetBox: React.FC<BudgetCardProps> = ({ project }) => {
  const totalBudget = parseInt(project.value.replace(/[^\d]/g, ''));
  const spentAmount = Math.floor(totalBudget * 0.75);
  const remainingAmount = totalBudget - spentAmount;
  const spentPercentage = (spentAmount / totalBudget) * 100;
  const isOverBudget = spentAmount > totalBudget;

  const totalBars = 60;
  const filledBars = Math.round((spentPercentage / 100) * totalBars);


  const cardBgColor = isOverBudget ? 'bg-[#f1b5b9]' : 'bg-[#96d8d0]';

  return (
    <BaseBox className={`h-full flex flex-col ${cardBgColor} border-0`} overflow="hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <h3 className="text-lg font-arabic font-bold text-black">النظرة المالية</h3>
        <div className="flex gap-1.5">
          <button className="w-7 h-7 rounded-full flex items-center justify-center text-black border border-black/80 bg-transparent hover:bg-black/5 text-xs font-extrabold">↖</button>
          <button className="w-7 h-7 rounded-full flex items-center justify-center text-black border border-black/80 bg-transparent hover:bg-black/5 text-xs font-extrabold">･･･</button>
        </div>
      </div>

      {/* Main content — responsive flex layout */}
      <div className="flex-1 flex flex-col items-center justify-center gap-3 min-h-0 overflow-hidden">
        {/* Circular chart — responsive sizing */}
        <div className="relative w-full max-w-[200px] aspect-square flex-shrink-0">
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <div className="text-4xl font-bold text-black">{Math.round(spentPercentage)}</div>
            <div className="text-xs text-black font-arabic text-center px-4">إجمالي الأرباح والخسائر</div>
          </div>
          <svg className="w-full h-full" viewBox="0 0 200 200">
            {Array.from({ length: totalBars }).map((_, index) => {
              const angle = (index / totalBars) * 360;
              const radius = 85;
              const barHeight = index < filledBars ? 20 : 14;
              const startRadius = radius - barHeight / 2;
              const endRadius = radius + barHeight / 2;
              const rad = (angle - 1.5) * (Math.PI / 180);
              const x1 = 100 + startRadius * Math.cos(rad);
              const y1 = 100 + startRadius * Math.sin(rad);
              const x2 = 100 + endRadius * Math.cos(rad);
              const y2 = 100 + endRadius * Math.sin(rad);
              const isFilled = index < filledBars;
              const fillRatio = (index + 1) / totalBars;
              const color = isFilled
                ? fillRatio <= 0.3 ? '#96d8d0' : fillRatio <= 0.6 ? '#7bc5bd' : fillRatio <= 0.8 ? '#f4c2a1' : '#f1b5b9'
                : 'rgba(200,200,200,0.4)';
              return <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={3} strokeLinecap="round" />;
            })}
          </svg>
        </div>

        {/* Stats row — contained, no absolute positioning */}
        <div className="flex justify-center gap-6 flex-shrink-0 flex-wrap">
          <div className="text-center">
            <div className="text-2xl font-bold text-black">02</div>
            <div className="text-xs text-black font-arabic">مثال</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-black">14</div>
            <div className="text-xs text-black font-arabic">مثال</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-black">{Math.round(remainingAmount / 1000)}</div>
            <div className="text-xs text-black font-arabic">مثال</div>
          </div>
        </div>

        {/* Footer text — contained */}
        <div className="text-center flex-shrink-0">
          <div className="text-xs text-black font-arabic">هذا النص مثال للشكل النهائي</div>
          <div className="text-xs text-black font-arabic">هذا النص مثال</div>
        </div>
      </div>
    </BaseBox>
  );
};
