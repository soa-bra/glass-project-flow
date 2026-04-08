import React from 'react';
import { cn } from '@/lib/utils';

interface BarDataPoint {
  label: string;
  value: number;
  target?: number;
}

interface CapsuleBarChartProps {
  title: string;
  heroValue?: string | number;
  heroUnit?: string;
  data: BarDataPoint[];
  color?: string;
  trackColor?: string;
  className?: string;
  orientation?: 'vertical' | 'horizontal';
  showLabels?: boolean;
  showValues?: boolean;
  barWidth?: number;
}

/**
 * CapsuleBarChart - أعمدة مستديرة كبسولية سميكة
 * مستوحى من بطاقة ANALYTICS 5K+ في الصور المرجعية
 */
export const CapsuleBarChart: React.FC<CapsuleBarChartProps> = ({
  title,
  heroValue,
  heroUnit,
  data,
  color = 'var(--visual-data-primary)',
  trackColor = 'rgba(11,15,18,0.08)',
  className,
  orientation = 'vertical',
  showLabels = true,
  showValues = false,
  barWidth = 24,
}) => {
  const maxVal = Math.max(...data.map(d => Math.max(d.value, d.target ?? 0)), 1);

  return (
    <div
      className={cn(
        'rounded-[24px] bg-white border border-[#DADCE0] p-6 flex flex-col',
        className
      )}
    >
      {/* Header */}
      <span className="text-xs font-semibold text-[rgba(11,15,18,0.50)] font-arabic uppercase tracking-wide">
        {title}
      </span>
      {heroValue !== undefined && (
        <div className="flex items-baseline gap-1 mt-1 mb-4">
          <span className="text-[36px] font-bold text-[#0B0F12] leading-none">{heroValue}</span>
          {heroUnit && (
            <span className="text-sm text-[rgba(11,15,18,0.40)] font-arabic">{heroUnit}</span>
          )}
        </div>
      )}

      {/* Bars */}
      {orientation === 'vertical' ? (
        <div className="flex-1 flex items-end justify-around gap-2 mt-2" style={{ minHeight: 140 }}>
          {data.map((d, i) => {
            const height = (d.value / maxVal) * 100;
            const targetHeight = d.target ? (d.target / maxVal) * 100 : undefined;
            return (
              <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
                <div className="relative w-full flex justify-center" style={{ height: 120 }}>
                  {/* Track */}
                  <div
                    className="absolute bottom-0 rounded-full"
                    style={{
                      width: barWidth,
                      height: targetHeight ? `${targetHeight}%` : '100%',
                      backgroundColor: trackColor,
                    }}
                  />
                  {/* Value */}
                  <div
                    className="absolute bottom-0 rounded-full"
                    style={{
                      width: barWidth,
                      height: `${height}%`,
                      backgroundColor: color,
                      transition: 'height 0.6s ease',
                    }}
                  />
                </div>
                {showLabels && (
                  <span className="text-[10px] text-[rgba(11,15,18,0.40)] font-arabic">
                    {d.label}
                  </span>
                )}
                {showValues && (
                  <span className="text-[10px] font-semibold text-[#0B0F12]">{d.value}</span>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-center gap-3 mt-2">
          {data.map((d, i) => {
            const width = (d.value / maxVal) * 100;
            return (
              <div key={i} className="flex items-center gap-3">
                {showLabels && (
                  <span className="text-xs text-[rgba(11,15,18,0.60)] font-arabic w-16 text-right shrink-0">
                    {d.label}
                  </span>
                )}
                <div className="flex-1 relative h-5 rounded-full" style={{ backgroundColor: trackColor }}>
                  <div
                    className="absolute inset-y-0 right-0 rounded-full"
                    style={{
                      width: `${width}%`,
                      backgroundColor: color,
                      transition: 'width 0.6s ease',
                    }}
                  />
                </div>
                {showValues && (
                  <span className="text-xs font-semibold text-[#0B0F12] w-10">{d.value}</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
