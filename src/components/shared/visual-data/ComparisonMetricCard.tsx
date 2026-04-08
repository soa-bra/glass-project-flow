import React from 'react';
import { cn } from '@/lib/utils';

interface ComparisonMetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  changeValue: string;
  changeDirection: 'up' | 'down' | 'neutral';
  changeLabel?: string;
  accentColor?: string;
  className?: string;
}

/**
 * ComparisonMetricCard - بطاقة مقارنة مع تغيير
 * مستوحى من بطاقة Engagement +17.43% في الصور المرجعية
 */
export const ComparisonMetricCard: React.FC<ComparisonMetricCardProps> = ({
  title,
  value,
  unit,
  changeValue,
  changeDirection,
  changeLabel,
  accentColor,
  className,
}) => {
  const changeColor =
    changeDirection === 'up'
      ? 'text-[var(--visual-data-secondary-1)]'
      : changeDirection === 'down'
      ? 'text-[var(--visual-data-secondary-2)]'
      : 'text-[rgba(11,15,18,0.50)]';

  return (
    <div
      className={cn(
        'rounded-[24px] bg-white border border-[#DADCE0] p-6 flex flex-col justify-between min-h-[140px]',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[rgba(11,15,18,0.50)] font-arabic uppercase tracking-wide px-2.5 py-1 rounded-full border border-[#DADCE0]">
          {title}
        </span>
      </div>

      <div className="mt-auto">
        <div className="flex items-baseline gap-1.5">
          <span
            className="text-[36px] font-bold leading-none"
            style={{ color: accentColor || '#0B0F12' }}
          >
            {changeValue}
          </span>
        </div>
        {changeLabel && (
          <p className="text-[11px] text-[rgba(11,15,18,0.40)] font-arabic mt-1">
            {changeLabel}
          </p>
        )}
      </div>
    </div>
  );
};
