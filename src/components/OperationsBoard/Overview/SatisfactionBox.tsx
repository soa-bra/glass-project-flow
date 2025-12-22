import React from 'react';
import { Progress } from '@/components/ui/progress';
import { BaseBox } from '@/components/ui/BaseBox';

export interface SatisfactionBoxProps {
  satisfaction: number;
  className?: string;
}

export const SatisfactionBox: React.FC<SatisfactionBoxProps> = ({ 
  satisfaction, 
  className = '' 
}) => {
  const getSatisfactionColor = (score: number): 'success' | 'warning' | 'error' => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getSatisfactionText = (score: number) => {
    if (score >= 80) return 'ممتاز';
    if (score >= 60) return 'جيد';
    return 'يحتاج تحسين';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-[var(--visual-data-secondary-1)]';
    if (score >= 60) return 'bg-[var(--visual-data-secondary-5)]';
    return 'bg-[var(--visual-data-secondary-2)]';
  };

  return (
    <BaseBox 
      title="رضا العملاء"
      variant="glass"
      size="sm"
      rounded="lg"
      neonRing={getSatisfactionColor(satisfaction)}
      className={`flex flex-col justify-between ${className}`}
    >
      <div className="flex-1 flex flex-col justify-center items-center text-center">
        <div className="text-3xl font-bold text-[hsl(var(--ink))] mb-2">
          {satisfaction}%
        </div>
        
        <div className="text-sm text-[hsl(var(--ink-60))] mb-5">
          {getSatisfactionText(satisfaction)}
        </div>

        <Progress 
          value={satisfaction} 
          className="w-full h-2.5 bg-[hsl(var(--ink))]/10 rounded-full"
          indicatorClassName={`${getProgressColor(satisfaction)} rounded-full`}
        />
      </div>
    </BaseBox>
  );
};
