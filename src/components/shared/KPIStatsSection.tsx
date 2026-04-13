import React from 'react';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

interface KPIStat {
  title: string;
  value: string | number;
  unit?: string;
  description?: string;
}

interface KPIStatsSectionProps {
  stats: KPIStat[];
  className?: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const, delay: i * 0.08 },
  }),
};

/**
 * مكون موحد لعرض مؤشرات الأداء الأساسية
 * تصميم مطابق للمرجع: خلفية panel، أيقونة اتجاه دائرية، أرقام ضخمة
 */
export const KPIStatsSection: React.FC<KPIStatsSectionProps> = ({
  stats,
  className = "",
}) => {
  if (!stats || stats.length === 0) {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
        <div className="col-span-full text-center py-8 text-[rgba(11,15,18,0.40)] font-arabic">
          جارٍ تحميل الإحصائيات...
        </div>
      </div>
    );
  }

  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-4', className)}>
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          custom={index}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="rounded-[24px] p-5 flex flex-col justify-between min-h-[150px]"
        >
          {/* Title */}
          <span className="text-[13px] font-bold text-[rgba(11,15,18,0.75)] font-arabic">
            {stat.title}
          </span>

          {/* Value + unit */}
          <div className="mt-auto">
            <div className="flex items-baseline gap-1.5">
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.08, ease: [0.22, 1, 0.36, 1] as const }}
                className="text-[44px] font-bold leading-none text-[#0B0F12] tracking-tight"
              >
                {stat.value}
              </motion.span>
              {stat.unit && (
                <span className="text-[13px] font-medium text-[rgba(11,15,18,0.45)] font-arabic">
                  {stat.unit}
                </span>
              )}
            </div>
            {stat.description && (
              <p className="text-[11px] text-[rgba(11,15,18,0.40)] font-arabic mt-1 leading-snug">
                {stat.description}
              </p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
