import React from 'react';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

export interface KPIStat {
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
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const, delay: i * 0.05 },
  }),
};

/**
 * مكون موحد لعرض مؤشرات الأداء الأساسية في النظرة العامة.
 * يحافظ على كثافة معلومات عالية بدون بطاقات متداخلة أو ظلال ثقيلة.
 */
export const KPIStatsSection: React.FC<KPIStatsSectionProps> = ({
  stats,
  className = '',
}) => {
  if (!stats || stats.length === 0) {
    return (
      <div className={cn('grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4', className)}>
        <div className="col-span-full rounded-lg border border-dashed border-[#DADCE0] bg-white/55 py-8 text-center text-sm text-[rgba(11,15,18,0.45)] font-arabic">
          جارٍ تحميل الإحصائيات...
        </div>
      </div>
    );
  }

  return (
    <div className={cn('grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4', className)}>
      {stats.map((stat, index) => (
        <motion.div
          key={`${stat.title}-${index}`}
          custom={index}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="flex min-h-[128px] min-w-0 flex-col justify-between rounded-lg border border-[#DADCE0] bg-white/72 p-4 shadow-[0_10px_24px_rgba(11,15,18,0.04)] backdrop-blur-sm"
        >
          <div className="flex min-w-0 items-start justify-between gap-3">
            <span className="min-w-0 text-xs font-semibold leading-5 text-[rgba(11,15,18,0.58)] font-arabic">
              {stat.title}
            </span>
            <span className="h-2 w-2 flex-shrink-0 rounded-full bg-[#3DBE8B]" aria-hidden="true" />
          </div>

          <div className="mt-5 min-w-0">
            <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
              <motion.span
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: 0.12 + index * 0.05, ease: [0.22, 1, 0.36, 1] as const }}
                className="max-w-full break-words text-[34px] font-bold leading-none text-[#0B0F12]"
              >
                {stat.value}
              </motion.span>
              {stat.unit && (
                <span className="text-xs font-medium leading-5 text-[rgba(11,15,18,0.48)] font-arabic">
                  {stat.unit}
                </span>
              )}
            </div>
            {stat.description && (
              <p className="mt-2 text-[11px] leading-5 text-[rgba(11,15,18,0.48)] font-arabic">
                {stat.description}
              </p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
