import React from 'react';
import { NumericStatCard } from './visual-data/NumericStatCard';

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
 * يستخدم NumericStatCard داخلياً للحصول على التصميم الجريء والحركة
 */
export const KPIStatsSection: React.FC<KPIStatsSectionProps> = ({
  stats,
  className = ""
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
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
      {stats.map((stat, index) => (
        <NumericStatCard
          key={index}
          title={stat.title}
          value={stat.value}
          unit={stat.unit}
          description={stat.description}
        />
      ))}
    </div>
  );
};
