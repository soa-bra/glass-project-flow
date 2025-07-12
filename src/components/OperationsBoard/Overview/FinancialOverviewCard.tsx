
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';

const financialData = {
  totalRevenue: 78,
  profits: 78,
  expenses: 14,
  reserves: 2
};

// حساب نسبة الخسارة إلى الربح
const lossRatio = financialData.expenses / financialData.profits;
const isLoss = lossRatio > 0.5; // إذا كانت النسبة أكثر من 50% تعتبر خسارة

// حساب عدد الشرائط (من 1 إلى 20)
const totalBars = 20;
const filledBars = Math.min(Math.round(lossRatio * totalBars), totalBars);

export const FinancialOverviewCard: React.FC = () => {
  return (
    <BaseCard 
      variant="glass" 
      size="sm"
      className="row-span-2 h-[352px]"
      style={{ 
        backgroundColor: isLoss ? '#f1b5b9' : '#96d8d0',
        borderRadius: '32px' // زوايا شديدة الدوران
      }}
      header={
        <div className="flex items-center justify-between">
          <h3 className="text-large font-semibold text-black font-arabic">النظرة المالية</h3>
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded-full border border-black/20 bg-transparent hover:bg-white/20 flex items-center justify-center">
              <span className="text-black">←</span>
            </button>
            <button className="w-8 h-8 rounded-full border border-black/20 bg-transparent hover:bg-white/20 flex items-center justify-center">
              <span className="text-black">⋯</span>
            </button>
          </div>
        </div>
      }
    >
      <div className="flex-1 flex gap-4 h-full overflow-hidden">
        {/* النصوص والأرقام - النصف الأول */}
        <div className="flex-1 flex flex-col justify-center overflow-hidden">
          <div className="text-center mb-6">
            <div className="text-2xl font-bold text-black font-arabic mb-2">
              {financialData.totalRevenue}
            </div>
            <div className="text-sm font-bold text-black font-arabic mb-4">
              إجمالي الأرباح والخسائر
            </div>
          </div>

          {/* التفاصيل */}
          <div className="grid grid-cols-1 gap-3 text-center mb-4">
            <div>
              <div className="text-2xl font-bold text-black font-arabic">{financialData.reserves}</div>
              <div className="text-sm font-normal text-black font-arabic">مليار</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-black font-arabic">{financialData.expenses}</div>
              <div className="text-sm font-normal text-black font-arabic">مليار</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-black font-arabic">{financialData.profits}</div>
              <div className="text-sm font-normal text-black font-arabic">مليار</div>
            </div>
          </div>

          <div className="text-xs font-normal text-gray-400 font-arabic text-center">
            هذا النص مثال للشكل البياني
          </div>
        </div>

        {/* الرسم البياني بشكل شرائط - النصف الثاني */}
        <div className="flex-1 flex justify-center items-center overflow-hidden">
          <div className="w-full max-w-[120px] flex flex-col items-center">
            {/* دائرة الشرائط */}
            <div className="relative w-24 h-24 mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {Array.from({ length: totalBars }).map((_, index) => {
                  const angle = (index * 360) / totalBars;
                  const isFilled = index < filledBars;
                  const color = isFilled 
                    ? (isLoss ? '#f1b5b9' : '#96d8d0')
                    : '#fbe2aa'; // اللون الأصفر للشرائط غير المكتملة
                  
                  return (
                    <g key={index}>
                      <line
                        x1="50"
                        y1="15"
                        x2="50"
                        y2="25"
                        stroke={color}
                        strokeWidth="1.5"
                        transform={`rotate(${angle} 50 50)`}
                      />
                    </g>
                  );
                })}
              </svg>
              
              {/* النص المركزي */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-2xl font-bold text-black font-arabic">78</div>
              </div>
            </div>
            
            <div className="text-xs font-normal text-gray-400 font-arabic text-center">
              هذا النص مثال للشكل البياني<br />
              هذا النص مثال
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  );
};
