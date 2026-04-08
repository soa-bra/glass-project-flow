import React from 'react';
import { Stagger } from './motion';

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

/**
 * مكون موحد لعرض مؤشرات الأداء الأساسية
 * تصميم جريء - الرقم هو البطل البصري
 */
export const KPIStatsSection: React.FC<KPIStatsSectionProps> = ({
  stats,
  className = ""
}) => {
  if (!stats || stats.length === 0) {
    return (
      <div className={`grid grid-cols-4 gap-4 ${className}`}>
        <div className="col-span-4 text-center py-8 text-[rgba(11,15,18,0.40)] font-arabic">
          جارٍ تحميل الإحصائيات...
        </div>
      </div>
    );
  }

  return (
    <Stagger
      delay={0.15}
      gap={0.1}
      className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}
    >
      {stats.map((stat, index) => (
        <Stagger.Item
          key={index}
          className="rounded-[24px] bg-white border border-[#DADCE0] p-5 flex flex-col justify-between min-h-[130px]"
        >
          {/* العنوان - صغير وخفيف */}
          <span className="text-[11px] font-medium text-[rgba(11,15,18,0.45)] font-arabic uppercase tracking-wide">
            {stat.title}
          </span>

          {/* الرقم - كبير وجريء */}
          <div className="mt-auto">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[40px] leading-none font-bold text-[#0B0F12] font-arabic">
                {typeof stat.value === 'number'
                  ? String(stat.value).padStart(2, '0')
                  : stat.value}
              </span>
              {stat.unit && (
                <span className="text-[12px] font-semibold text-[rgba(11,15,18,0.35)] font-arabic">
                  {stat.unit}
                </span>
              )}
            </div>
            {stat.description && (
              <p className="text-[10px] text-[rgba(11,15,18,0.30)] font-arabic mt-1">
                {stat.description}
              </p>
            )}
          </div>
        </Stagger.Item>
      ))}
    </Stagger>
  );
};
