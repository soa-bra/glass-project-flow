import React from 'react';
import { RadialProgressCard } from '@/components/shared/visual-data';

export const ExtraBoxTwo: React.FC = () => {
  return (
    <RadialProgressCard
      title="معدل الإنجاز"
      value={78}
      color="#3DBE8B"
      className="h-[180px]"
    />
  );
};
