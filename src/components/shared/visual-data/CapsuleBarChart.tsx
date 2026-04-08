import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

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

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export const CapsuleBarChart: React.FC<CapsuleBarChartProps> = ({
  title, heroValue, heroUnit, data, color = 'var(--visual-data-primary)',
  trackColor = 'rgba(11,15,18,0.08)', className, orientation = 'vertical',
  showLabels = true, showValues = false, barWidth = 24,
}) => {
  const maxVal = Math.max(...data.map(d => Math.max(d.value, d.target ?? 0)), 1);

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className={cn('rounded-[24px] bg-white border border-[#DADCE0] p-6 flex flex-col', className)}
    >
      <span className="text-xs font-semibold text-[rgba(11,15,18,0.50)] font-arabic uppercase tracking-wide">{title}</span>
      {heroValue !== undefined && (
        <div className="flex items-baseline gap-1 mt-1 mb-4">
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

      {orientation === 'vertical' ? (
        <div className="flex-1 flex items-end justify-around gap-2 mt-2" style={{ minHeight: 140 }}>
          {data.map((d, i) => {
            const height = (d.value / maxVal) * 100;
            const targetHeight = d.target ? (d.target / maxVal) * 100 : undefined;
            return (
              <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
                <div className="relative w-full flex justify-center" style={{ height: 120 }}>
                  <div className="absolute bottom-0 rounded-full" style={{ width: barWidth, height: targetHeight ? `${targetHeight}%` : '100%', backgroundColor: trackColor }} />
                  <motion.div
                    className="absolute bottom-0 rounded-full"
                    style={{ width: barWidth, backgroundColor: color }}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${height}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
                {showLabels && <span className="text-[10px] text-[rgba(11,15,18,0.40)] font-arabic">{d.label}</span>}
                {showValues && <span className="text-[10px] font-semibold text-[#0B0F12]">{d.value}</span>}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-center gap-3 mt-2">
          {data.map((d, i) => {
            const width = (d.value / maxVal) * 100;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex items-center gap-3"
              >
                {showLabels && <span className="text-xs text-[rgba(11,15,18,0.60)] font-arabic w-16 text-right shrink-0">{d.label}</span>}
                <div className="flex-1 relative h-5 rounded-full" style={{ backgroundColor: trackColor }}>
                  <motion.div
                    className="absolute inset-y-0 right-0 rounded-full"
                    style={{ backgroundColor: color }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${width}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
                {showValues && <span className="text-xs font-semibold text-[#0B0F12] w-10">{d.value}</span>}
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};
