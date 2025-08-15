import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis } from 'recharts';
import { ChartWrapper } from '@/components/shared/charts/ChartWrapper';
const projectData = [{
  name: '1',
  value: 20
}, {
  name: '2',
  value: 35
}, {
  name: '3',
  value: 25
}, {
  name: '4',
  value: 80
}, {
  name: '5',
  value: 30
}, {
  name: '6',
  value: 15
}];
export const ProjectSummaryCard: React.FC = () => {
  return <BaseCard variant="glass" size="sm" className="h-full min-h-0 w-full border-[#DADCE0]" style={{
      backgroundColor: '#ffffff'
  }} header={<div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-black font-arabic">ملخص للمشاريع</h3>
          <div className="flex gap-2">
            <button className="w-8 h-8 border border-black/20 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors">
              <span className="text-sm text-black">←</span>
            </button>
            <button className="w-8 h-8 border border-black/20 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors">
              <span className="text-sm text-black">⋯</span>
            </button>
          </div>
        </div>}>
      <div className="overflow-y-hidden">
        {/* النصوص والأرقام - النصف الأول */}
        <div className="bottom-0 flex-col justify-center gap-1 overflow-hidden mx-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-black font-arabic">140</div>
            <div className="text-xs font-normal text-gray-400 font-arabic">هذا النص مثال</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-black font-arabic">50</div>
            <div className="text-xs font-normal text-gray-400 font-arabic">هذا النص مثال</div>
          </div>
        </div>

        {/* الرسم البياني - النصف الثاني بنسبة6/10  */}
        <div className="bottom-1 h-180 overflow-hidden">
          <div className="w-full max-w-[120px]" style={{
          aspectRatio: '6/10'
        }}>
            <ChartWrapper 
              config={{
                main: {
                  label: "الرئيسي",
                  color: "#000000"
                },
                others: {
                  label: "الآخرين",
                  color: "#ffffff"
                }
              }}
              className="w-full h-full"
              minHeight={100}
              minWidth={120}
              aspectRatio="6/10"
            >
              <BarChart 
                data={projectData} 
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 8, fill: '#666' }} 
                />
                <Bar dataKey="value" fill="#bdeed3" radius={[2, 2, 0, 0]} />
                <ChartTooltip content={<ChartTooltipContent />} />
              </BarChart>
            </ChartWrapper>
          </div>
        </div>
      </div>
    </BaseCard>;
};