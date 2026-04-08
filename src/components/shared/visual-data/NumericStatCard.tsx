import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface NumericStatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  description?: string;
  icon?: React.ReactNode;
  accentColor?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

export const NumericStatCard: React.FC<NumericStatCardProps> = ({
  title, value, unit, description, icon, accentColor, size = 'md', className,
}) => {
  const sizeClasses = { sm: 'p-4 min-h-[100px]', md: 'p-6 min-h-[140px]', lg: 'p-8 min-h-[180px]' };
  const valueSizes = { sm: 'text-[28px]', md: 'text-[40px]', lg: 'text-[52px]' };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className={cn('rounded-[24px] bg-white border border-[#DADCE0] flex flex-col justify-between', sizeClasses[size], className)}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[rgba(11,15,18,0.50)] font-arabic uppercase tracking-wide">{title}</span>
        {icon && <div className="text-[rgba(11,15,18,0.30)]">{icon}</div>}
      </div>

      <div className="mt-auto">
        <div className="flex items-baseline gap-1">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] as const }}
            className={cn(valueSizes[size], 'font-bold leading-none')}
            style={{ color: accentColor || '#0B0F12' }}
          >
            {value}
          </motion.span>
          {unit && <span className="text-sm text-[rgba(11,15,18,0.35)] font-arabic">{unit}</span>}
        </div>
        {description && <p className="text-[11px] text-[rgba(11,15,18,0.30)] font-arabic mt-1">{description}</p>}
      </div>
    </motion.div>
  );
};
