import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

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

const directionColors = {
  up: '#3DBE8B',
  down: '#E5564D',
  neutral: 'rgba(11,15,18,0.40)',
} as const;

const directionArrows = {
  up: '↑',
  down: '↓',
  neutral: '',
} as const;

export const ComparisonMetricCard: React.FC<ComparisonMetricCardProps> = ({
  title, value, unit, changeValue, changeDirection, changeLabel, accentColor, className,
}) => {
  const changeColor = directionColors[changeDirection];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
      className={cn('rounded-[24px] bg-white border border-[#DADCE0] p-6 flex flex-col justify-between min-h-[140px]', className)}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[rgba(11,15,18,0.50)] font-arabic uppercase tracking-wide px-2.5 py-1 rounded-full border border-[#DADCE0]">{title}</span>
      </div>

      <div className="mt-auto">
        {/* Primary metric — dominant */}
        <div className="flex items-baseline gap-1.5">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[32px] sm:text-[36px] md:text-[40px] font-bold leading-none tracking-tight"
            style={{ color: accentColor || '#0B0F12' }}
          >
            {value}
          </motion.span>
          {unit && <span className="text-sm text-[rgba(11,15,18,0.35)] font-arabic">{unit}</span>}
        </div>

        {/* Change indicator — secondary with directional color */}
        <div className="flex items-center gap-1.5 mt-2">
          <span
            className="text-sm font-bold font-arabic"
            style={{ color: changeColor }}
          >
            {directionArrows[changeDirection]} {changeValue}
          </span>
          {changeLabel && (
            <span className="text-[11px] text-[rgba(11,15,18,0.40)] font-arabic">{changeLabel}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
