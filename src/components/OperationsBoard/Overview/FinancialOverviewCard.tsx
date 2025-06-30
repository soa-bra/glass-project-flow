
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
      <div className="flex-1 flex gap-4">
        {/* النصوص والأرقام - النصف الأول */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-black font-arabic mb-1">
              {totalRevenue}
            </div>
            <div className="text-xs text-gray-700 font-arabic text-center">
              إجمالي الأرباح والخسائر
            </div>
          </div>

          {/* التفاصيل */}
          <div className="grid grid-cols-1 gap-2 text-center mb-4">
            <div>
              <div className="text-lg font-bold text-black font-arabic">02</div>
              <div className="text-xs text-gray-700 font-arabic">مليار</div>
            </div>
            <div>
              <div className="text-lg font-bold text-black font-arabic">14</div>
              <div className="text-xs text-gray-700 font-arabic">مليار</div>
            </div>
            <div>
              <div className="text-lg font-bold text-black font-arabic">78</div>
              <div className="text-xs text-gray-700 font-arabic">مليار</div>
            </div>
          </div>

          <div className="text-xs text-gray-700 font-arabic text-center">
            هذا النص مثال للشكل البياني
          </div>
        </div>

        {/* الرسم البياني - النصف الثاني بنسبة 9:16 */}
        <div className="flex-1 flex justify-center items-center">
          <div 
            className="w-full max-w-[100px]"
            style={{ aspectRatio: '9/16' }}
          >
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
                    innerRadius={30}
                    outerRadius={50}
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
          </div>
        </div>
      </div>
    </BaseCard>
  );
};
