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

export const ComparisonMetricCard: React.FC<ComparisonMetricCardProps> = ({
  title, value, unit, changeValue, changeDirection, changeLabel, accentColor, className,
}) => {
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
        <div className="flex items-baseline gap-1.5">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[36px] font-bold leading-none"
            style={{ color: accentColor || '#0B0F12' }}
          >
            {changeValue}
          </motion.span>
        </div>
        {changeLabel && <p className="text-[11px] text-[rgba(11,15,18,0.40)] font-arabic mt-1">{changeLabel}</p>}
      </div>
    </motion.div>
  );
};
