import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ArcGaugeCardProps {
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

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export const ArcGaugeCard: React.FC<ArcGaugeCardProps> = ({
  title, value, displayValue, subtitle, color = 'var(--visual-data-secondary-4)',
  trackColor = 'rgba(11,15,18,0.06)', size = 180, strokeWidth = 14, className,
}) => {
  const center = size / 2;
  const radius = center - strokeWidth / 2 - 4;
  const circumference = Math.PI * radius;
  const dashOffset = circumference * (1 - value / 100);

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className={cn('rounded-[24px] bg-white border border-[#DADCE0] p-6 flex flex-col items-center', className)}
    >
      <div className="self-stretch text-right mb-2">
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-[32px] font-bold text-[#0B0F12] leading-none font-arabic inline-block"
        >
          {displayValue ?? `${value}%`}
        </motion.span>
        <p className="text-xs text-[rgba(11,15,18,0.40)] font-arabic mt-1">{title}</p>
      </div>

      <div className="relative" style={{ width: size, height: size / 2 + 10 }}>
        <svg width={size} height={size / 2 + 10} viewBox={`0 0 ${size} ${size / 2 + 10}`}>
          <path
            d={`M ${strokeWidth / 2 + 4} ${center} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2 - 4} ${center}`}
            fill="none" stroke={trackColor} strokeWidth={strokeWidth} strokeLinecap="round"
          />
          <motion.path
            d={`M ${strokeWidth / 2 + 4} ${center} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2 - 4} ${center}`}
            fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset: dashOffset }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
          {value > 0 && (
            <motion.circle
              cx={center + radius * Math.cos(Math.PI - (value / 100) * Math.PI)}
              cy={center - radius * Math.sin((value / 100) * Math.PI)}
              r={strokeWidth / 2 + 2} fill={color} stroke="white" strokeWidth={3}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.8 }}
            />
          )}
        </svg>

        <motion.div
          className="absolute bottom-0 left-0 right-0 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <span className="text-[28px] font-bold text-[#0B0F12]">{value}%</span>
          {subtitle && <p className="text-[11px] text-[rgba(11,15,18,0.40)] font-arabic">{subtitle}</p>}
        </motion.div>
      </div>
    </motion.div>
  );
};
