import React from 'react';
import { RingMetricCard } from '@/components/shared/visual-data';
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
  const totalConversions = attribution.reduce((s, a) => s + a.conversions, 0);

  return (
    <DataCardFrame title="تحليل نقاط التواصل">
      <div className="flex flex-col items-center">
        <RingMetricCard
          title=""
          centerValue={totalConversions}
          centerUnit="تحويل"
          layers={attribution.map((item, i) => ({
            value: item.percentage,
            color: COLORS[i % COLORS.length],
            label: item.touchpoint,
          }))}
          className="border-0 shadow-none bg-transparent p-0"
        />
      </div>
    </DataCardFrame>
  );
};
