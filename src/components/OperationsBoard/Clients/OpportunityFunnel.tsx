import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FunnelChart, Funnel, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
interface FunnelStage {
  stage: string;
  count: number;
  value: number;
  conversionRate?: number;
}
interface OpportunityFunnelProps {
  funnelData: FunnelStage[];
}
const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(220, 14%, 80%)', 'hsl(220, 14%, 60%)'];
export const OpportunityFunnel: React.FC<OpportunityFunnelProps> = ({
  funnelData
}) => {
  const chartConfig = {
    count: {
      label: "العدد"
    },
    value: {
      label: "القيمة"
    }
  };
  return <Card className="glass-enhanced rounded-[40px] bg-[#f3ffff]">
      <CardHeader>
        <CardTitle className="text-right font-arabic">قمع الفرص التجارية</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {funnelData.map((stage, index) => {
          const width = stage.count / funnelData[0].count * 100;
          return <div key={index} className="relative">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">{stage.stage}</span>
                  <span className="text-sm text-gray-600">{stage.conversionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-8 relative overflow-hidden">
                  <div className="h-8 rounded-full transition-all duration-300 flex items-center justify-center text-white text-sm font-medium" style={{
                width: `${width}%`,
                backgroundColor: COLORS[index % COLORS.length]
              }}>
                    {stage.count} ({(stage.value / 1000).toFixed(0)}k ر.س)
                  </div>
                </div>
              </div>;
        })}
        </div>
      </CardContent>
    </Card>;
};