import React from 'react';
import { cn } from '@/lib/utils';

interface RingLayer {
  value: number;       // 0-100
  color: string;
  label?: string;
}

interface RingMetricCardProps {
  title: string;
  subtitle?: string;
  layers: RingLayer[];
  centerValue?: string | number;
  centerUnit?: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

/**
 * RingMetricCard - حلقات تقدم متعددة الطبقات
 * مستوحى من مؤشر Skill Rate في الصورة المرجعية
 */
export const RingMetricCard: React.FC<RingMetricCardProps> = ({
  title,
  subtitle,
  layers,
  centerValue,
  centerUnit,
  size = 180,
  strokeWidth = 12,
  className,
}) => {
  const center = size / 2;

  return (
    <div
      className={cn(
        'rounded-[24px] bg-white border border-[#DADCE0] p-6 flex flex-col items-center',
        className
      )}
    >
      <div className="self-stretch text-right mb-4">
        <span className="text-xs font-semibold text-[rgba(11,15,18,0.50)] font-arabic uppercase tracking-wide">
          {title}
        </span>
        {subtitle && (
          <p className="text-[11px] text-[rgba(11,15,18,0.30)] font-arabic">{subtitle}</p>
        )}
      </div>

      {/* SVG Rings */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {layers.map((layer, i) => {
            const gap = (strokeWidth + 6) * i;
            const radius = center - strokeWidth / 2 - gap;
            const circumference = 2 * Math.PI * radius;
            const dashOffset = circumference * (1 - layer.value / 100);

            return (
              <g key={i}>
                {/* Track */}
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke="rgba(11,15,18,0.06)"
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                />
                {/* Fill */}
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke={layer.color}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  transform={`rotate(-90 ${center} ${center})`}
                  style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                />
              </g>
            );
          })}
        </svg>

        {/* Center value */}
        {centerValue !== undefined && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[32px] font-bold text-[#0B0F12] leading-none">
              {centerValue}
            </span>
            {centerUnit && (
              <span className="text-xs text-[rgba(11,15,18,0.40)] mt-0.5">{centerUnit}</span>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      {layers.some(l => l.label) && (
        <div className="w-full mt-4 space-y-1.5">
          {layers.map((layer, i) =>
            layer.label ? (
              <div key={i} className="flex items-center justify-between text-xs font-arabic">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-1.5 rounded-full"
                    style={{ backgroundColor: layer.color }}
                  />
                  <span className="text-[rgba(11,15,18,0.60)]">{layer.label}</span>
                </div>
                <span className="font-semibold text-[#0B0F12]">{layer.value}%</span>
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  );
};
