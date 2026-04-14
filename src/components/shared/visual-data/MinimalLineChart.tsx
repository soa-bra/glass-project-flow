import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ResponsiveContainer, Line, Area, AreaChart, Tooltip, XAxis, LineChart } from 'recharts';
import { ChartTooltipShell, CHART_CURSOR_STYLE } from './ChartTooltipShell';

export const MinimalLineChart: React.FC<MinimalLineChartProps> = ({
  title, heroValue, heroUnit, data, dataKey = 'value',
  color = 'var(--visual-data-secondary-3)', fillOpacity = 0.15,
  showArea = true, height = 120, className, tooltipFormatter,
}) => {
  const resolvedColor = color.startsWith('var(')
    ? getComputedStyle(document.documentElement).getPropertyValue(color.slice(4, -1)).trim() || '#d9d2fd'
    : color;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
      className={cn('rounded-[24px] bg-white border border-[#DADCE0] p-6 flex flex-col', className)}
    >
      <span className="text-xs font-semibold text-[rgba(11,15,18,0.50)] font-arabic uppercase tracking-wide">{title}</span>

      {heroValue !== undefined && (
        <div className="flex items-baseline gap-1.5 mt-1">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[36px] font-bold text-[#0B0F12] leading-none"
          >
            {heroValue}
          </motion.span>
          {heroUnit && <span className="text-sm text-[rgba(11,15,18,0.40)] font-arabic">{heroUnit}</span>}
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
              <Tooltip content={<ChartTooltipShell formatValue={tooltipFormatter ? (v) => tooltipFormatter(Number(v)) : undefined} />} cursor={CHART_CURSOR_STYLE} />
              <Area type="monotone" dataKey={dataKey} stroke={resolvedColor} strokeWidth={2.5} fill={`url(#fill-${resolvedColor.replace('#', '')})`} dot={false} activeDot={{ r: 5, fill: resolvedColor, stroke: '#fff', strokeWidth: 2 }} />
            </AreaChart>
          ) : (
            <LineChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <XAxis dataKey="label" hide />
              <Tooltip content={<ChartTooltipShell formatValue={tooltipFormatter ? (v) => tooltipFormatter(Number(v)) : undefined} />} cursor={CHART_CURSOR_STYLE} />
              <Line type="monotone" dataKey={dataKey} stroke={resolvedColor} strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: resolvedColor, stroke: '#fff', strokeWidth: 2 }} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
