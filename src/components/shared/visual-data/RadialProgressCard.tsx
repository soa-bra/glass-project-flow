import React from 'react';
import { cn } from '@/lib/utils';

interface RadialProgressCardProps {
  title: string;
  value: number;          // 0-100
  displayValue?: string;
  subtitle?: string;
  color?: string;
  trackColor?: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

/**
 * RadialProgressCard - حلقة تقدم واحدة كبيرة
 * مستوحى من بطاقة Visits 12,563 مع الدائرة الملونة
 */
export const RadialProgressCard: React.FC<RadialProgressCardProps> = ({
  title,
  value,
  displayValue,
  subtitle,
  color = 'var(--visual-data-secondary-4)',
  trackColor = 'rgba(11,15,18,0.06)',
  size = 140,
  strokeWidth = 14,
  className,
}) => {
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - value / 100);

  return (
    <div
      className={cn(
        'rounded-[24px] bg-white border border-[#DADCE0] p-6 flex flex-col items-center justify-center',
        className
      )}
    >
      <span className="text-xs font-semibold text-[rgba(11,15,18,0.50)] font-arabic uppercase tracking-wide self-stretch text-right mb-3">
        {title}
      </span>

      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={trackColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform={`rotate(-90 ${center} ${center})`}
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[28px] font-bold text-[#0B0F12] leading-none">
            {displayValue ?? `${value}%`}
          </span>
          {subtitle && (
            <span className="text-[10px] text-[rgba(11,15,18,0.40)] font-arabic mt-1">
              {subtitle}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
