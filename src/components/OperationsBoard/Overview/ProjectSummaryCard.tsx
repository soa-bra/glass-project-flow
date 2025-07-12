
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, ResponsiveContainer, XAxis } from 'recharts';

const projectData = [
  { name: '1', value: 20 },
  { name: '2', value: 35 },
  { name: '3', value: 25 },
  { name: '4', value: 80 },
  { name: '5', value: 30 },
  { name: '6', value: 15 },
];

export const ProjectSummaryCard: React.FC = () => {
  return (
    <BaseCard 
      variant="glass" 
      size="sm"
      className="h-[180px] w-full"
      style={{ backgroundColor: '#f3ffff' }}
      header={
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-black font-arabic">ملخص للمشاريع</h3>
          <div className="flex gap-2">
            <button className="w-8 h-8 border border-black/20 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors">
              <span className="text-sm text-black">←</span>
            </button>
            <button className="w-8 h-8 border border-black/20 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors">
              <span className="text-sm text-black">⋯</span>
            </button>
          </div>
        </div>
      }
    >
      <div className="flex h-[100px] gap-4 overflow-hidden">
        {/* النصوص والأرقام - النصف الأول */}
        <div className="flex-1 flex flex-col justify-center gap-1 overflow-hidden">
          <div className="text-right">
            <div className="text-2xl font-bold text-black font-arabic">140</div>
            <div className="text-xs font-normal text-gray-400 font-arabic">هذا النص مثال</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-black font-arabic">50</div>
            <div className="text-xs font-normal text-gray-400 font-arabic">هذا النص مثال</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-black font-arabic">02</div>
            <div className="text-xs font-normal text-gray-400 font-arabic">النص مثال</div>
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
                main: { label: "الرئيسي", color: "#000000" },
                others: { label: "الآخرين", color: "#f2ffff" }
              }}
              className="w-full h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 8, fill: '#666' }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#bdeed3"
                    radius={[2, 2, 0, 0]}
                    stroke="#000000"
                    strokeWidth={1}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
      </div>
    </BaseCard>
  );
};
