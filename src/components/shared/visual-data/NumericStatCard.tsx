import React from 'react';
import { cn } from '@/lib/utils';

interface NumericStatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  description?: string;
  icon?: React.ReactNode;
  accentColor?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * NumericStatCard - بطاقة رقمية بسيطة
 * مستوحى من بطاقة PERFORMANCE 98.9k في الصور المرجعية
 */
export const NumericStatCard: React.FC<NumericStatCardProps> = ({
  title,
  value,
  unit,
  description,
  icon,
  accentColor,
  size = 'md',
  className,
}) => {
  const sizeClasses = {
    sm: 'p-4 min-h-[100px]',
    md: 'p-6 min-h-[140px]',
    lg: 'p-8 min-h-[180px]',
  };

  const valueSizes = {
    sm: 'text-[28px]',
    md: 'text-[40px]',
    lg: 'text-[52px]',
  };

  return (
    <div
      className={cn(
        'rounded-[24px] bg-white border border-[#DADCE0] flex flex-col justify-between',
        sizeClasses[size],
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[rgba(11,15,18,0.50)] font-arabic uppercase tracking-wide">
          {title}
        </span>
        {icon && <div className="text-[rgba(11,15,18,0.30)]">{icon}</div>}
      </div>

      <div className="mt-auto">
        <div className="flex items-baseline gap-1">
          <span
            className={cn(valueSizes[size], 'font-bold leading-none')}
            style={{ color: accentColor || '#0B0F12' }}
          >
            {value}
          </span>
          {unit && (
            <span className="text-sm text-[rgba(11,15,18,0.35)] font-arabic">{unit}</span>
          )}
        </div>
        {description && (
          <p className="text-[11px] text-[rgba(11,15,18,0.30)] font-arabic mt-1">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};
