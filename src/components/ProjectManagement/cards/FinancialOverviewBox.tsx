
import React from 'react';
import { RingMetricCard } from '@/components/shared/visual-data';

const financialData = [
  { name: 'الأرباح', value: 78, color: '#0B0F12' },
  { name: 'المصاريف', value: 14, color: '#aec2cf' },
  { name: 'الاحتياطي', value: 8, color: 'rgba(174,194,207,0.3)' }
];

export const FinancialOverviewBox: React.FC = () => {
  return (
    <RingMetricCard
      title="النظرة المالية"
      centerValue="78M"
      centerUnit="أرباح"
      layers={financialData.map(d => ({
        value: d.value,
        color: d.color,
        label: d.name,
      }))}
      className="h-full bg-[#96D8D0]"
    />
  );
};
