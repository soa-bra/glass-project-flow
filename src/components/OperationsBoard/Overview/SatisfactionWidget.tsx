
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { GenericCard } from '@/components/ui/GenericCard';

interface SatisfactionWidgetProps {
  satisfaction: number;
  className?: string;
}

export const SatisfactionWidget: React.FC<SatisfactionWidgetProps> = ({
  satisfaction,
  className = '',
}) => {
  const getSatisfactionColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'crimson';
  };

  const getSatisfactionText = (score: number) => {
    if (score >= 80) return 'ممتاز';
    if (score >= 60) return 'جيد';
    return 'يحتاج تحسين';
  };

  // ألوان موحدة للوحة الإدارة
  const colorProgress = {
    success: 'bg-[#29936c] rounded-full',
    warning: 'bg-[#eab308] rounded-full',
    crimson: 'bg-[#f87171] rounded-full'
  };

  const colorType = getSatisfactionColor(satisfaction);

  return (
    <GenericCard
      adminBoardStyle
      color={colorType as 'success' | 'warning' | 'crimson'}
      padding="md"
      className={`h-full w-full min-h-[180px] flex flex-col justify-between ${className}`}
    >
      <div className="flex-1 flex flex-col w-full justify-between items-center text-center">
        <h3 className="text-lg font-arabic font-bold text-gray-800 mb-1 w-full leading-tight mt-1 text-right">
          رضا العملاء
        </h3>
        <div className="text-3xl font-bold text-gray-900 mb-2 w-full text-right">
          {satisfaction}%
        </div>
        <div className="text-base text-gray-600 mb-2 w-full text-right">
          {getSatisfactionText(satisfaction)}
        </div>
        <Progress
          value={satisfaction}
          className="w-full h-3 bg-gray-200/30 rounded-full mt-1"
          indicatorClassName={colorProgress[colorType]}
        />
      </div>
    </GenericCard>
  );
};
