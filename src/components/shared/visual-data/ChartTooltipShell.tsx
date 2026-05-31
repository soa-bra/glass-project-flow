import React from 'react';
import { cn } from '@/lib/utils';

export interface ChartTooltipShellProps {
  /** Is tooltip currently active/visible */
  active?: boolean;
  /** Recharts payload array */
  payload?: Array<{ value?: number | string; name?: string; color?: string; dataKey?: string }>;
  /** X-axis label */
  label?: string;
  /** Custom value formatter */
  formatValue?: (value: number | string) => string;
  /** Custom label formatter */
  formatLabel?: (label: string) => string;
  /** Additional CSS classes */
  className?: string;
  /** Show color dot next to each entry */
  showDot?: boolean;
}

/**
 * ChartTooltipShell — unified dark tooltip for all Recharts charts
 *
 * Spec:
 * - Background: #0B0F12 (ink)
 * - Text: #FFFFFF
 * - Muted: rgba(255,255,255,0.7)
 * - Radius: 10px
 * - Shadow: 0 8px 24px rgba(0,0,0,0.24)
 * - Font: IBM Plex Sans Arabic
 *
 * Usage with Recharts:
 * ```tsx
 * <Tooltip content={<ChartTooltipShell />} />
 * ```
 */
export const ChartTooltipShell: React.FC<ChartTooltipShellProps> = ({
  active,
  payload,
  label,
  formatValue,
  formatLabel,
  className,
  showDot = true,
}) => {
  if (!active || !payload || payload.length === 0) return null;

  const displayLabel = label ? (formatLabel ? formatLabel(String(label)) : String(label)) : undefined;

  return (
    <div
      className={cn(
        'rounded-[10px] px-3 py-2 font-arabic pointer-events-none',
        'shadow-[0_8px_24px_rgba(0,0,0,0.24)]',
        className
      )}
      style={{
        backgroundColor: '#0B0F12',
        zIndex: 10000,
        direction: 'rtl',
      }}
    >
      {/* Label */}
      {displayLabel && (
        <p
          className="text-[12px] font-medium mb-1"
          style={{ color: 'rgba(255,255,255,0.7)' }}
        >
          {displayLabel}
        </p>
      )}

      {/* Entries */}
      {payload.map((entry, idx) => {
        const val = entry.value ?? '';
        const displayValue = formatValue ? formatValue(val) : String(val);

        return (
          <div key={idx} className="flex items-center gap-2">
            {showDot && entry.color && (
              <span
                className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: entry.color }}
              />
            )}
            <span className="text-[16px] font-bold text-white leading-tight">
              {displayValue}
            </span>
            {entry.name && (
              <span
                className="text-[12px] font-normal"
                style={{ color: 'rgba(255,255,255,0.7)' }}
              >
                {entry.name}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

/**
 * Shared cursor line style for Recharts charts
 * Use with: <Tooltip cursor={CHART_CURSOR_STYLE} />
 */
export const CHART_CURSOR_STYLE = {
  stroke: 'rgba(11,15,18,0.45)',
  strokeWidth: 2,
  strokeDasharray: '2 4',
} as const;
