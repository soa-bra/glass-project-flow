import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface RingLayer {
  value: number;
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

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

export const RingMetricCard: React.FC<RingMetricCardProps> = ({
  title, subtitle, layers, centerValue, centerUnit, size = 180, strokeWidth = 12, className,
}) => {
  const center = size / 2;

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className={cn('rounded-[24px] bg-white border border-[#DADCE0] p-6 flex flex-col items-center', className)}
    >
      <div className="self-stretch text-right mb-4">
        <span className="text-xs font-semibold text-[rgba(11,15,18,0.50)] font-arabic uppercase tracking-wide">{title}</span>
        {subtitle && <p className="text-[11px] text-[rgba(11,15,18,0.30)] font-arabic">{subtitle}</p>}
      </div>

      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {layers.map((layer, i) => {
            const gap = (strokeWidth + 6) * i;
            const radius = center - strokeWidth / 2 - gap;
            const circumference = 2 * Math.PI * radius;
            const dashOffset = circumference * (1 - layer.value / 100);

            return (
              <g key={i}>
                <circle cx={center} cy={center} r={radius} fill="none" stroke="rgba(11,15,18,0.06)" strokeWidth={strokeWidth} strokeLinecap="round" />
                <motion.circle
                  cx={center} cy={center} r={radius} fill="none"
                  stroke={layer.color} strokeWidth={strokeWidth} strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  whileInView={{ strokeDashoffset: dashOffset }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] as const }}
                  transform={`rotate(-90 ${center} ${center})`}
                />
              </g>
            );
          })}
        </svg>

        {centerValue !== undefined && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <span className="text-[32px] font-bold text-[#0B0F12] leading-none">{centerValue}</span>
            {centerUnit && <span className="text-xs text-[rgba(11,15,18,0.40)] mt-0.5">{centerUnit}</span>}
          </motion.div>
        )}
      </div>

      {layers.some(l => l.label) && (
        <div className="w-full mt-4 space-y-1.5">
          {layers.map((layer, i) =>
            layer.label ? (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.08 }}
                className="flex items-center justify-between text-xs font-arabic"
              >
                <div className="flex items-center gap-2">
                  <span className="w-3 h-1.5 rounded-full" style={{ backgroundColor: layer.color }} />
                  <span className="text-[rgba(11,15,18,0.60)]">{layer.label}</span>
                </div>
                <span className="font-semibold text-[#0B0F12]">{layer.value}%</span>
              </motion.div>
            ) : null
          )}
        </div>
      )}
    </motion.div>
  );
};
