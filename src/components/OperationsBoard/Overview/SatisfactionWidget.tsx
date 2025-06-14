
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { BaseCard } from '@/components/ui/BaseCard';

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
  const colorClasses = {
    success: 'border-[#bdeed3]/50',
    warning: 'border-[#f9e2a9]/50',
    crimson: 'border-[#fcd8ce]/50'
  };

  const colorProgress = {
    success: 'bg-[#29936c] rounded-full',
    warning: 'bg-[#eab308] rounded-full',
    crimson: 'bg-[#f87171] rounded-full'
  };

  const colorType = getSatisfactionColor(satisfaction);

  return (
    <BaseCard
      variant="glass"
      color={colorType}
      adminBoardStyle
      size="md"
      className={`${className} h-full w-full ${colorClasses[colorType]} border`}
      header={
        <h3 className="text-lg font-arabic font-bold text-gray-800 mb-1">
          رضا العملاء
        </h3>
      }
    >
      <div className="flex-1 flex flex-col justify-center items-center text-center">
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {satisfaction}%
        </div>
        <div className="text-base text-gray-600 mb-2">
          {getSatisfactionText(satisfaction)}
        </div>
        <Progress
          value={satisfaction}
          className="w-full h-3 bg-gray-200/30 rounded-full"
          indicatorClassName={colorProgress[colorType]}
        />
      </div>
    </BaseCard>
  );
};
