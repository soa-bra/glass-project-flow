import React from 'react';
import { RadialProgressCard } from '@/components/shared/visual-data';

export interface SatisfactionBoxProps {
  satisfaction: number;
  className?: string;
}

export const SatisfactionBox: React.FC<SatisfactionBoxProps> = ({
  satisfaction,
  className = '',
}) => {
  const getColor = (score: number) => {
    if (score >= 80) return 'var(--visual-data-secondary-1)';
    if (score >= 60) return 'var(--visual-data-secondary-5)';
    return 'var(--visual-data-secondary-2)';
  };

  const getLabel = (score: number) => {
    if (score >= 80) return 'ممتاز';
    if (score >= 60) return 'جيد';
    return 'يحتاج تحسين';
  };

  return (
    <RadialProgressCard
      title="رضا العملاء"
      value={satisfaction}
      displayValue={`${satisfaction}%`}
      subtitle={getLabel(satisfaction)}
      color={getColor(satisfaction)}
      className={className}
    />
  );
};
