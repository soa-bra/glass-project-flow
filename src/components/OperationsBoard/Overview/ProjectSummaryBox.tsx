import React from 'react';
import { BaseBox } from '@/components/ui/BaseBox';
import { ChartTooltipShell } from '@/components/shared/visual-data';
import { BarChart, Bar, XAxis } from 'recharts';
import { ChartWrapper } from '@/components/shared/charts/ChartWrapper';
import { Tooltip } from 'recharts';

const projectData = [
  { name: '1', value: 20 },
  { name: '2', value: 35 },
  { name: '3', value: 25 },
  { name: '4', value: 80 },
  { name: '5', value: 30 },
  { name: '6', value: 15 },
];

export const ProjectSummaryBox: React.FC = () => {
  return (
    <BaseBox
      variant="standard"
      size="sm"
      className="h-full min-h-0 w-full"
      header={
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[hsl(var(--ink))] font-arabic">ملخص للمشاريع</h3>
          <div className="flex gap-2">
            <button className="w-8 h-8 border border-[hsl(var(--ink))]/20 rounded-full flex items-center justify-center hover:bg-[hsl(var(--ink))]/10 transition-colors">
              <span className="text-sm text-[hsl(var(--ink))]">←</span>
            </button>
            <button className="w-8 h-8 border border-[hsl(var(--ink))]/20 rounded-full flex items-center justify-center hover:bg-[hsl(var(--ink))]/10 transition-colors">
              <span className="text-sm text-[hsl(var(--ink))]">⋯</span>
            </button>
          </div>
        </div>
      }
    >
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-hidden md:grid-cols-[minmax(0,1fr)_minmax(120px,180px)]">
        <div className="flex min-h-0 flex-col justify-center gap-4 overflow-hidden text-right">
          <div>
            <div className="text-[32px] sm:text-[36px] font-bold text-[hsl(var(--ink))] font-arabic leading-none tracking-tight">140</div>
            <div className="text-xs font-normal text-[hsl(var(--ink-60))] font-arabic">هذا النص مثال</div>
          </div>
          <div>
            <div className="text-[32px] sm:text-[36px] font-bold text-[hsl(var(--ink))] font-arabic leading-none tracking-tight">50</div>
            <div className="text-xs font-normal text-[hsl(var(--ink-60))] font-arabic">هذا النص مثال</div>
          </div>
        </div>

        <div className="flex min-h-[120px] min-w-0 items-center justify-center overflow-hidden">
          <div className="h-full w-full max-w-[180px]">
            <ChartWrapper
              config={{
                main: { label: "الرئيسي", color: "#000000" },
                others: { label: "الآخرين", color: "#ffffff" },
              }}
              className="h-full w-full"
              minHeight={120}
              minWidth={120}
              aspectRatio="6/5"
            >
              <BarChart data={projectData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: 'rgba(11,15,18,0.35)' }} />
                <Tooltip content={<ChartTooltipShell />} cursor={false} />
                <Bar dataKey="value" fill="#bdeed3" radius={[999, 999, 999, 999]} barSize={14} activeBar={false} />
              </BarChart>
            </ChartWrapper>
          </div>
        </div>
      </div>
    </BaseBox>
  );
};
