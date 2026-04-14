
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartTooltipShell, CHART_CURSOR_STYLE } from '@/components/shared/visual-data';

const financialData = [
  { name: 'الأرباح', value: 78, color: '#0B0F12' },
  { name: 'المصاريف', value: 14, color: '#aec2cf' },
  { name: 'الاحتياطي', value: 8, color: 'rgba(11,15,18,0.08)' }
];

export const FinancialOverviewBox: React.FC = () => {
  return (
    <div 
      className="h-full p-6 rounded-3xl border border-[#DADCE0] flex flex-col overflow-hidden bg-[#96D8D0]"
      style={{ fontFamily: 'IBM Plex Sans Arabic' }}
    >
      {/* الرأس */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-arabic font-semibold text-gray-800">النظرة المالية</h3>
        <div className="flex gap-2">
          <button className="p-1 rounded-full hover:bg-white/20 text-gray-600">
            <span className="text-sm">←</span>
          </button>
          <button className="p-1 rounded-full hover:bg-white/20 text-gray-600">
            <span className="text-sm">⋯</span>
          </button>
        </div>
      </div>

      {/* المحتوى مقسم لنصفين */}
      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* النصوص والأرقام */}
        <div className="flex-1 flex flex-col justify-center overflow-hidden">
          <div className="text-center mb-4">
            <div className="text-[32px] sm:text-[36px] font-bold text-black font-arabic leading-none tracking-tight">
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

        {/* الرسم البياني */}
        <div className="flex-1 flex justify-center items-center overflow-hidden">
          <div className="w-full max-w-[120px]" style={{ aspectRatio: '16/9' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={financialData}
                  cx="50%"
                  cy="50%"
                  innerRadius={20}
                  outerRadius={40}
                  startAngle={90}
                  endAngle={450}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {financialData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltipShell />} cursor={CHART_CURSOR_STYLE} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
