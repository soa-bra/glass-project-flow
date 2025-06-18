
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
      style={{ backgroundColor: '#f2ffff' }}
      header={
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800 font-arabic">ملخص للمشاريع</h3>
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
      <div className="flex-1 flex h-[100px]">
        {/* الرسم البياني */}
        <div className="flex-1">
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
                  tick={{ fontSize: 10, fill: '#666' }}
                />
                <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                  {projectData.map((entry, index) => (
                    <Bar 
                      key={`bar-${index}`} 
                      dataKey="value"
                      fill={index === 3 ? '#000000' : '#f2ffff'} 
                    />
                  ))}
                </Bar>
                <ChartTooltip content={<ChartTooltipContent />} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* البيانات الجانبية */}
        <div className="w-20 flex flex-col justify-center gap-1 mr-3">
          <div className="text-right">
            <div className="text-base font-bold text-black font-arabic">140</div>
            <div className="text-xs text-gray-700 font-arabic">هذا النص مثال</div>
          </div>
          <div className="text-right">
            <div className="text-base font-bold text-black font-arabic">50</div>
            <div className="text-xs text-gray-700 font-arabic">هذا النص مثال</div>
          </div>
          <div className="text-right">
            <div className="text-base font-bold text-black font-arabic">02</div>
            <div className="text-xs text-gray-700 font-arabic">النص مثال</div>
          </div>
        </div>
      </div>
    </BaseCard>
  );
};
