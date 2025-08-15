import React from 'react';
import { cn } from '@/lib/utils';
import { COLORS, LAYOUT, TYPOGRAPHY, SPACING } from './design-system/constants';

interface StatItem {
  title: string;
  value: string | number;
  description?: string;
}

interface UnifiedStatsCardProps {
  stats: StatItem[];
  columns?: 2 | 4;
  className?: string;
}

export const UnifiedStatsCard: React.FC<UnifiedStatsCardProps> = ({
  stats,
  columns = 2,
  className = '',
}) => {
  const gridCols = columns === 4 ? 'grid-cols-2' : 'grid-cols-2';
  
  return (
    <div className={cn(`grid ${gridCols} ${SPACING.GRID_GAP}`, className)}>
      {stats.map((stat, index) => (
        <div key={index} className={`text-center p-4 ${COLORS.TRANSPARENT_BACKGROUND} ${COLORS.BORDER_COLOR} ${LAYOUT.CARD_ROUNDED}`}>
          <div className={`text-2xl font-bold ${COLORS.PRIMARY_TEXT} ${TYPOGRAPHY.ARABIC_FONT}`}>
            {stat.value}
          </div>
          <div className={`${TYPOGRAPHY.BODY_TEXT} ${COLORS.PRIMARY_TEXT} ${TYPOGRAPHY.ARABIC_FONT}`}>
            {stat.title}
          </div>
          {stat.description && (
            <div className={`text-xs ${COLORS.PRIMARY_TEXT} ${TYPOGRAPHY.ARABIC_FONT} mt-1`}>
              {stat.description}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};