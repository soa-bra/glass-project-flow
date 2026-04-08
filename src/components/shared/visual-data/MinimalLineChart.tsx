import React from 'react';
import { cn } from '@/lib/utils';
import { ResponsiveContainer, LineChart, Line, Area, AreaChart, Tooltip, XAxis } from 'recharts';

interface DataPoint {
  label: string;
  value: number;
  [key: string]: any;
}

interface MinimalLineChartProps {
  title: string;
  heroValue?: string | number;
  heroUnit?: string;
  data: DataPoint[];
  dataKey?: string;
  color?: string;
  fillOpacity?: number;
  showArea?: boolean;
  height?: number;
  className?: string;
  tooltipFormatter?: (value: number) => string;
}

const CustomTooltip = ({ active, payload, formatter }: any) => {
  if (!active || !payload?.[0]) return null;
  const val = payload[0].value;
  return (
    <div className="bg-[#0B0F12] text-white px-3 py-2 rounded-[10px] shadow-[0_8px_24px_rgba(0,0,0,0.24)]">
      <span className="text-[14px] font-bold">{formatter ? formatter(val) : val}</span>
    </div>
  );
};

/**
 * MinimalLineChart - خط بياني بسيط مع مساحة
 * مستوحى من بطاقة Active users 2,345 في الصور المرجعية
 */
export const MinimalLineChart: React.FC<MinimalLineChartProps> = ({
  title,
  heroValue,
  heroUnit,
  data,
  dataKey = 'value',
  color = 'var(--visual-data-secondary-3)',
  fillOpacity = 0.15,
  showArea = true,
  height = 120,
  className,
  tooltipFormatter,
}) => {
  // Resolve CSS variable to hex for recharts
  const resolvedColor = color.startsWith('var(')
    ? getComputedStyle(document.documentElement).getPropertyValue(color.slice(4, -1)).trim() || '#d9d2fd'
    : color;

  return (
    <div
      className={cn(
        'rounded-[24px] bg-white border border-[#DADCE0] p-6 flex flex-col',
        className
      )}
    >
      <span className="text-xs font-semibold text-[rgba(11,15,18,0.50)] font-arabic uppercase tracking-wide">
        {title}
      </span>

      {heroValue !== undefined && (
        <div className="flex items-baseline gap-1.5 mt-1">
          <span className="text-[36px] font-bold text-[#0B0F12] leading-none">{heroValue}</span>
          {heroUnit && (
            <span className="text-sm text-[rgba(11,15,18,0.40)] font-arabic">{heroUnit}</span>
          )}
        </div>
      )}

      <div className="mt-auto pt-3" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          {showArea ? (
            <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`fill-${resolvedColor.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={resolvedColor} stopOpacity={fillOpacity} />
                  <stop offset="100%" stopColor={resolvedColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="label" hide />
              <Tooltip content={<CustomTooltip formatter={tooltipFormatter} />} />
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke={resolvedColor}
                strokeWidth={2.5}
                fill={`url(#fill-${resolvedColor.replace('#', '')})`}
                dot={false}
                activeDot={{ r: 5, fill: resolvedColor, stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          ) : (
            <LineChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <XAxis dataKey="label" hide />
              <Tooltip content={<CustomTooltip formatter={tooltipFormatter} />} />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={resolvedColor}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: resolvedColor, stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
