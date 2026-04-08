import React from 'react';
import { cn } from '@/lib/utils';

interface MetricHeroCardProps {
  title: string;
  value: string | number;
  unit?: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * MetricHeroCard - بطاقة القيمة الرئيسية
 * الرقم هو البطل البصري - كبير جداً وواضح
 */
export const MetricHeroCard: React.FC<MetricHeroCardProps> = ({
  title,
  value,
  unit,
  description,
  className,
  children,
}) => {
  return (
    <div
      className={cn(
        'rounded-[24px] bg-white border border-[#DADCE0] p-6 flex flex-col justify-between min-h-[160px]',
        className
      )}
    >
      <span className="text-xs font-medium text-[rgba(11,15,18,0.50)] font-arabic tracking-wide uppercase">
        {title}
      </span>

      <div className="mt-auto">
        <div className="flex items-baseline gap-1.5">
          <span className="text-[44px] leading-none font-bold text-[#0B0F12] font-arabic">
            {value}
          </span>
          {unit && (
            <span className="text-sm font-semibold text-[rgba(11,15,18,0.40)] font-arabic">
              {unit}
            </span>
          )}
        </div>
        {description && (
          <p className="text-[11px] text-[rgba(11,15,18,0.35)] font-arabic mt-1.5">
            {description}
          </p>
        )}
      </div>

      {children && <div className="mt-3">{children}</div>}
    </div>
  );
};
