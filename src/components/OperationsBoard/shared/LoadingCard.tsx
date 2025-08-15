import React from 'react';
import { BaseCard } from '@/components/shared/BaseCard';
import { COLORS, TYPOGRAPHY } from '@/components/shared/design-system/constants';

interface LoadingCardProps {
  title?: string;
  height?: string;
}

export const LoadingCard: React.FC<LoadingCardProps> = ({
  title = "جارٍ التحميل...",
  height = "h-32"
}) => {
  return (
    <BaseCard>
      <div className={`${height} flex flex-col items-center justify-center space-y-3`}>
        <div className="animate-pulse">
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-bounce"></div>
        </div>
        <p className={`${COLORS.SECONDARY_TEXT} ${TYPOGRAPHY.ARABIC_FONT} text-sm`}>
          {title}
        </p>
      </div>
    </BaseCard>
  );
};