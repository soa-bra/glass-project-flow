import React from 'react';
import { NumericStatCard, MinimalLineChart, CapsuleBarChart } from '@/components/shared/visual-data';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis } from 'recharts';

const chartData = [
  { label: 'Jan', value: 30 },
  { label: 'Feb', value: 45 },
  { label: 'Mar', value: 35 },
  { label: 'Apr', value: 50 },
  { label: 'May', value: 40 },
  { label: 'Jun', value: 60 },
];

export const DataVisualizationBox: React.FC = () => {
  return (
    <MinimalLineChart
      title="التحليل البياني"
      heroValue="46"
      heroUnit="مليار"
      data={chartData}
      color="#a4e2f6"
      className="h-full"
    />
  );
};
