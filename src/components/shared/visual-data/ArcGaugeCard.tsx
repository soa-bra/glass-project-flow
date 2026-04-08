import React from 'react';
import { cn } from '@/lib/utils';

interface ArcGaugeCardProps {
  title: string;
  value: number;         // 0-100
  displayValue?: string;
  subtitle?: string;
  color?: string;
  trackColor?: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

/**
 * ArcGaugeCard - مؤشر قوسي نصف دائري
 * مستوحى من بطاقة $4,463 Left to goal / 72% Received
 */
export const ArcGaugeCard: React.FC<ArcGaugeCardProps> = ({
  title,
  value,
  displayValue,
  subtitle,
  color = 'var(--visual-data-secondary-4)',
  trackColor = 'rgba(11,15,18,0.06)',
  size = 180,
  strokeWidth = 14,
  className,
}) => {
  const center = size / 2;
  const radius = center - strokeWidth / 2 - 4;
  // Semi-circle arc: 180 degrees, going from left to right (bottom half hidden)
  const circumference = Math.PI * radius;
  const dashOffset = circumference * (1 - value / 100);

  return (
    <div
      className={cn(
        'rounded-[24px] bg-white border border-[#DADCE0] p-6 flex flex-col items-center',
        className
      )}
    >
      <div className="self-stretch text-right mb-2">
        <span className="text-[32px] font-bold text-[#0B0F12] leading-none font-arabic">
          {displayValue ?? `${value}%`}
        </span>
        <p className="text-xs text-[rgba(11,15,18,0.40)] font-arabic mt-1">{title}</p>
      </div>

      <div className="relative" style={{ width: size, height: size / 2 + 10 }}>
        <svg
          width={size}
          height={size / 2 + 10}
          viewBox={`0 0 ${size} ${size / 2 + 10}`}
        >
          {/* Track */}
          <path
            d={`M ${strokeWidth / 2 + 4} ${center} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2 - 4} ${center}`}
            fill="none"
            stroke={trackColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Fill */}
          <path
            d={`M ${strokeWidth / 2 + 4} ${center} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2 - 4} ${center}`}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
          {/* Dot at end */}
          {value > 0 && (
            <circle
              cx={
                center +
                radius * Math.cos(Math.PI - (value / 100) * Math.PI)
              }
              cy={
                center -
                radius * Math.sin((value / 100) * Math.PI)
              }
              r={strokeWidth / 2 + 2}
              fill={color}
              stroke="white"
              strokeWidth={3}
            />
          )}
        </svg>

        {/* Center text */}
        <div className="absolute bottom-0 left-0 right-0 text-center">
          <span className="text-[28px] font-bold text-[#0B0F12]">{value}%</span>
          {subtitle && (
            <p className="text-[11px] text-[rgba(11,15,18,0.40)] font-arabic">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
};
