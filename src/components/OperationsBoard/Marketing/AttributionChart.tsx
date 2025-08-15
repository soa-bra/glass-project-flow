import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
interface Attribution {
  touchpoint: string;
  conversions: number;
  revenue: number;
  percentage: number;
}
interface AttributionChartProps {
  attribution: Attribution[];
}
const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(220, 14%, 80%)', 'hsl(220, 14%, 60%)'];
export const AttributionChart: React.FC<AttributionChartProps> = ({
  attribution
}) => {
  const chartConfig = {
    touchpoint: {
      label: "نقطة التواصل"
    },
    percentage: {
      label: "النسبة المئوية"
    }
  };
  return <div className="rounded-[40px] bg-[#ffffff] border-[#DADCE0]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-black font-arabic">تحليل نقاط التواصل</h3>
      </div>
      
      <ChartContainer config={chartConfig}>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={attribution} cx="50%" cy="50%" labelLine={false} label={({
            percentage
          }) => `${percentage}%`} outerRadius={80} fill="#8884d8" dataKey="percentage">
              {attribution.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
            <Tooltip content={<ChartTooltipContent />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
      
      <div className="mt-4 space-y-3">
        {attribution.map((item, index) => <div key={index} className="flex items-center justify-between p-3 bg-white/60 border border-black/5 rounded-3xl">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full" style={{
            backgroundColor: COLORS[index % COLORS.length]
          }} />
              <span className="font-medium text-sm text-black font-arabic">{item.touchpoint}</span>
            </div>
            <div className="text-right">
              <p className="font-bold text-black font-arabic">{item.percentage}%</p>
              <p className="text-xs text-black/60 font-arabic">{item.conversions} تحويل</p>
              <p className="text-xs text-black/60 font-arabic">{item.revenue.toLocaleString()} ر.س</p>
            </div>
          </div>)}
      </div>
    </div>;
};