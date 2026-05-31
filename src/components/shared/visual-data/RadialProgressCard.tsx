import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface RadialProgressCardProps {
  title: string;
  value: number;
  displayValue?: string;
  subtitle?: string;
  color?: string;
  trackColor?: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export const RadialProgressCard: React.FC<RadialProgressCardProps> = ({
  title, value, displayValue, subtitle, color = 'var(--visual-data-secondary-4)',
  trackColor = 'rgba(11,15,18,0.06)', size = 140, strokeWidth = 14, className,
}) => {
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - value / 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
      className={cn('rounded-[24px] bg-white border border-[#DADCE0] p-6 flex flex-col items-center justify-center', className)}
    >
      <span className="text-xs font-semibold text-[rgba(11,15,18,0.50)] font-arabic uppercase tracking-wide self-stretch text-right mb-3">{title}</span>

      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={center} cy={center} r={radius} fill="none" stroke={trackColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          <motion.circle
            cx={center} cy={center} r={radius} fill="none"
            stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset: dashOffset }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] as const }}
            transform={`rotate(-90 ${center} ${center})`}
          />
        </svg>
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <span className="text-[28px] font-bold text-[#0B0F12] leading-none">{displayValue ?? `${value}%`}</span>
          {subtitle && <span className="text-[10px] text-[rgba(11,15,18,0.40)] font-arabic mt-1">{subtitle}</span>}
        </motion.div>
      </div>
    </motion.div>
  );
};
