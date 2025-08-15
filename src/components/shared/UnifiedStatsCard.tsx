import React from 'react';
import { cn } from '@/lib/utils';
import { SoaCard, SoaTypography } from '@/components/ui';
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
        <SoaCard key={index} className="text-center">
          <SoaTypography variant="display-m" className="text-soabra-ink mb-2">
            {stat.value}
          </SoaTypography>
          <SoaTypography variant="subtitle" className="text-soabra-ink">
            {stat.title}
          </SoaTypography>
          {stat.description && (
            <SoaTypography variant="label" className="text-soabra-ink-60 mt-1">
              {stat.description}
            </SoaTypography>
          )}
        </SoaCard>
      ))}
    </div>
  );
};