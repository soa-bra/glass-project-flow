
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const financialData = [
  { name: 'الأرباح والخسائر', value: 78, color: '#000000' },
  { name: 'المصاريف', value: 14, color: '#fbe2aa' },
  { name: 'الاحتياطي', value: 2, color: '#d9d2fd' }
];

const totalRevenue = 78; // مليون
const isProfit = totalRevenue > 0;

export const FinancialOverviewCard: React.FC = () => {
  return (
    <BaseCard 
      variant="glass" 
      size="sm"
      className="row-span-2 h-[352px]"
      style={{ backgroundColor: '#f2ffff' }}
      header={
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800 font-arabic">النظرة المالية</h3>
          <div className="flex gap-2">
            <button className="p-1 rounded-full hover:bg-white/20">
              <span className="text-sm">←</span>
            </button>
            <button className="p-1 rounded-full hover:bg-white/20">
              <span className="text-sm">⋯</span>
            </button>
          </div>
        </div>
      }
    >
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <div className="relative w-40 h-40 mb-3">
          <ChartContainer
            config={{
              profits: { label: "الأرباح", color: "#000000" },
              expenses: { label: "المصاريف", color: "#fbe2aa" },
              reserves: { label: "الاحتياطي", color: "#d9d2fd" }
            }}
            className="w-full h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={financialData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  startAngle={90}
                  endAngle={450}
                  dataKey="value"
                >
                  {financialData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          
          {/* النص في وسط الدائرة */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-black font-arabic mb-1">
              {totalRevenue}
            </div>
            <div className="text-xs text-gray-700 font-arabic text-center">
              إجمالي الأرباح والخسائر
            </div>
          </div>
        </div>

        {/* التفاصيل السفلية */}
        <div className="grid grid-cols-3 gap-3 w-full mt-3">
          <div className="text-center">
            <div className="text-lg font-bold text-black font-arabic">02</div>
            <div className="text-xs text-gray-700 font-arabic">مليار</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-black font-arabic">14</div>
            <div className="text-xs text-gray-700 font-arabic">مليار</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-black font-arabic">78</div>
            <div className="text-xs text-gray-700 font-arabic">مليار</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full mt-2">
          <div className="text-xs text-gray-700 font-arabic text-center">
            هذا النص مثال للشكل البياني
          </div>
          <div className="text-xs text-gray-700 font-arabic text-center">
            هذا النص مثال للشكل البياني
          </div>
        </div>
      </div>
    </BaseCard>
  );
};
