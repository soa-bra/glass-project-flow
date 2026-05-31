import React from 'react';
import { NumericStatCard } from '@/components/shared/visual-data';

export const ExtraBoxFive: React.FC = () => {
  return (
    <NumericStatCard
      title="تحذير"
      value={12}
      unit="مهمة"
      description="المهام المتأخرة"
      accentColor="var(--visual-data-secondary-2)"
      size="sm"
      className="h-[180px]"
    />
  );
};
