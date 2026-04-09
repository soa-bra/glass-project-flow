import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface DataCardFrameProps {
  title: string;
  subtitle?: string;
  heroValue?: string | number;
  heroUnit?: string;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

/**
 * DataCardFrame — standard card container for inline chart content
 * Provides consistent rounded-[24px] shell, title zone, and framer-motion reveal
 */
export const DataCardFrame: React.FC<DataCardFrameProps> = ({
  title, subtitle, heroValue, heroUnit, icon, className, children,
}) => {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className={cn('rounded-[24px] bg-white border border-[#DADCE0] p-6 flex flex-col', className)}
    >
      {/* Header zone */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[rgba(11,15,18,0.50)] font-arabic uppercase tracking-wide">
          {title}
        </span>
        {icon && <div className="text-[rgba(11,15,18,0.30)]">{icon}</div>}
      </div>
      {subtitle && (
        <p className="text-[10px] text-[rgba(11,15,18,0.30)] font-arabic mt-0.5">{subtitle}</p>
      )}

      {/* Hero value zone */}
      {heroValue !== undefined && (
        <div className="flex items-baseline gap-1.5 mt-1 mb-2">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[36px] font-bold text-[#0B0F12] leading-none"
          >
            {heroValue}
          </motion.span>
          {heroUnit && (
            <span className="text-sm text-[rgba(11,15,18,0.40)] font-arabic">{heroUnit}</span>
          )}
        </div>
      )}

      {/* Chart / content zone */}
      <div className="mt-auto pt-2 flex-1">
        {children}
      </div>
    </motion.div>
  );
};
