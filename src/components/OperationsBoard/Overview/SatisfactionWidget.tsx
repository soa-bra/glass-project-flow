
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { BaseCard } from '@/components/ui/BaseCard';

interface SatisfactionWidgetProps {
  satisfaction: number;
}

export const SatisfactionWidget: React.FC<SatisfactionWidgetProps> = ({ satisfaction }) => {
  const getSatisfactionColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getSatisfactionText = (score: number) => {
    if (score >= 80) return 'ممتاز';
    if (score >= 60) return 'جيد';
    return 'يحتاج تحسين';
  };

  return (
    <BaseCard 
      size="md"
      variant="glass"
      neonRing={getSatisfactionColor(satisfaction)}
      header={
        <h3 className="text-sm font-arabic font-bold text-gray-800">
          رضا العملاء
        </h3>
      }
      className="h-[180px]"
    >
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {satisfaction}%
        </div>
        
        <div className="text-sm text-gray-600 mb-4">
          {getSatisfactionText(satisfaction)}
        </div>

        <Progress 
          value={satisfaction} 
          className="w-full h-2 bg-gray-200"
          indicatorClassName={
            satisfaction >= 80 ? 'bg-green-500' : 
            satisfaction >= 60 ? 'bg-yellow-500' : 
            'bg-red-500'
          }
        />
      </div>
    </BaseCard>
  );
};
