import React from 'react';
import { MinimalLineChart } from '@/components/shared/visual-data/MinimalLineChart';
import { CapsuleBarChart } from '@/components/shared/visual-data/CapsuleBarChart';
import { NumericStatCard } from '@/components/shared/visual-data/NumericStatCard';

export interface StatisticsBoxProps {
  title: string;
  value: string;
  unit: string;
  description: string;
  chartType?: 'line' | 'bar' | 'simple';
  chartData?: Array<{ name: string; value: number }>;
}

const sampleLineData = [
  { label: 'Jan', value: 30 },
  { label: 'Feb', value: 45 },
  { label: 'Mar', value: 35 },
  { label: 'Apr', value: 50 },
  { label: 'May', value: 40 },
];

const sampleBarData = [
  { label: 'A', value: 20 },
  { label: 'B', value: 35 },
  { label: 'C', value: 25 },
  { label: 'D', value: 15 },
];

export const StatisticsBox: React.FC<StatisticsBoxProps> = ({
  title,
  value,
  unit,
  description,
  chartType = 'simple',
  chartData,
}) => {
  if (chartType === 'line') {
    const lineData = chartData
      ? chartData.map(d => ({ label: d.name, value: d.value }))
      : sampleLineData;

    return (
      <MinimalLineChart
        title={title}
        heroValue={value}
        heroUnit={unit}
        data={lineData}
        color="#d9d2fd"
        className="h-full"
      />
    );
  }

  if (chartType === 'bar') {
    const barData = chartData
      ? chartData.map(d => ({ label: d.name, value: d.value }))
      : sampleBarData;

    return (
      <CapsuleBarChart
        title={title}
        heroValue={value}
        heroUnit={unit}
        data={barData}
        color="#bdeed3"
        className="h-full"
        barWidth={20}
      />
    );
  }

  return (
    <NumericStatCard
      title={title}
      value={value}
      unit={unit}
      description={description}
      className="h-full"
    />
  );
};
