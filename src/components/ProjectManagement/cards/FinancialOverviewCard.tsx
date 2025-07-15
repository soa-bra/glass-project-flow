
import React from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';

const financialData = [
  { name: 'الأرباح', value: 78, color: '#000000' },
  { name: 'المصاريف', value: 14, color: '#aec2cf' },
  { name: 'الاحتياطي', value: 8, color: '#f0f0f0' }
];

const monthlyData = [
  { month: 'يناير', revenue: 45, expenses: 30 },
  { month: 'فبراير', revenue: 52, expenses: 28 },
  { month: 'مارس', revenue: 68, expenses: 35 },
  { month: 'أبريل', revenue: 78, expenses: 32 }
];

export const FinancialOverviewCard: React.FC = () => {
  return (
    <div 
      className="h-full p-6 rounded-3xl border border-white/20 flex flex-col overflow-hidden"
      style={{ 
        background: '#f7ffff',
        fontFamily: 'IBM Plex Sans Arabic'
      }}
    >
      {/* الرأس */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-arabic font-semibold text-gray-800">النظرة المالية</h3>
        <div className="flex gap-2">
          <button 
            onClick={() => {
              // التنقل إلى تبويب الإدارة المالية
              window.dispatchEvent(new CustomEvent('navigateToFinancialTab'));
              console.log('التنقل إلى تبويب الإدارة المالية');
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-black transition-all duration-300 border border-black/80 bg-transparent hover:bg-black/5 hover:scale-105 active:scale-95"
          >
            <span className="text-sm">↗</span>
          </button>
        </div>
      </div>

      {/* المحتوى مقسم لنصفين */}
      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* النصوص والأرقام - النصف الأول */}
        <div className="flex-1 flex flex-col justify-center overflow-hidden">
          <div className="text-center mb-4">
            <div className="text-xl font-bold text-black font-arabic">
              78M
            </div>
            <div className="text-xs text-gray-700 font-arabic text-center">
              إجمالي الأرباح
            </div>
          </div>

          {/* المؤشرات */}
          <div className="grid grid-cols-1 gap-2 text-center">
            <div>
              <div className="text-sm font-bold text-black font-arabic">78M</div>
              <div className="text-xs text-gray-700 font-arabic">أرباح</div>
            </div>
            <div>
              <div className="text-sm font-bold text-black font-arabic">14M</div>
              <div className="text-xs text-gray-700 font-arabic">مصاريف</div>
            </div>
            <div>
              <div className="text-sm font-bold text-black font-arabic">8M</div>
              <div className="text-xs text-gray-700 font-arabic">احتياطي</div>
            </div>
          </div>
        </div>

        {/* الرسم البياني - النصف الثاني بنسبة 16:9 */}
        <div className="flex-1 flex justify-center items-center overflow-hidden">
          <div 
            className="w-full max-w-[120px]"
            style={{ aspectRatio: '16/9' }}
          >
            <ChartContainer
              config={{
                profits: { label: "الأرباح", color: "#000000" },
                expenses: { label: "المصاريف", color: "#aec2cf" },
                reserves: { label: "الاحتياطي", color: "#f0f0f0" }
              }}
              className="w-full h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={financialData}
                    cx="50%"
                    cy="50%"
                    innerRadius={15}
                    outerRadius={30}
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
    </div>
  );
};
