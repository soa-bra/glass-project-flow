import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartTooltipShell, CHART_CURSOR_STYLE } from '@/components/shared/visual-data';
import { DataCardFrame } from '@/components/shared/visual-data/DataCardFrame';

interface Attribution {
  touchpoint: string;
  conversions: number;
  revenue: number;
  percentage: number;
}
interface AttributionChartProps {
  attribution: Attribution[];
}

const COLORS = ['#3DA8F5', '#3DBE8B', '#F6C445', '#E5564D', 'rgba(11,15,18,0.20)'];

export const AttributionChart: React.FC<AttributionChartProps> = ({ attribution }) => {
  return (
    <DataCardFrame title="تحليل نقاط التواصل">
      <div style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={attribution}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              dataKey="percentage"
              strokeWidth={0}
              label={({ percentage }) => `${percentage}%`}
            >
              {attribution.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltipShell />} cursor={CHART_CURSOR_STYLE} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 space-y-2.5">
        {attribution.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-[rgba(11,15,18,0.02)] border border-[#DADCE0] rounded-[18px]">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
              <span className="font-medium text-sm text-[#0B0F12] font-arabic">{item.touchpoint}</span>
            </div>
            <div className="text-right">
              <p className="font-bold text-[#0B0F12] font-arabic">{item.percentage}%</p>
              <p className="text-xs text-[rgba(11,15,18,0.40)] font-arabic">{item.conversions} تحويل</p>
            </div>
          </div>
        ))}
      </div>
    </DataCardFrame>
  );
};
