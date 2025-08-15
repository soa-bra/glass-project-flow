import React from 'react';
import { BaseCard } from './BaseCard';
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
 * يعرض 4 مؤشرات في الصف الواحد، وإذا كان هناك أكثر من 4 يقسمها على صفين
 */
export const KPIStatsSection: React.FC<KPIStatsSectionProps> = ({
  stats,
  className = ""
}) => {
  // حماية ضد البيانات غير المعرّفة
  if (!stats || stats.length === 0) {
    return <div className={`grid grid-cols-4 gap-6 mb-6 my-0 px-[4px] mx-[10px] ${className}`}>
        <div className="col-span-4 text-center py-8 text-gray-500 font-arabic">
          جارٍ تحميل الإحصائيات...
        </div>
      </div>;
  }
  return (
    <Stagger delay={0.2} gap={0.15} className={`grid grid-cols-4 gap-6 mb-6 ${className}`}>
      {stats.map((stat, index) => (
        <Stagger.Item key={index}>
          <BaseCard className="text-right">
            <div className="mb-2">
              <span className="text-base text-black font-arabic font-medium">{stat.title}</span>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <div className="text-5xl font-bold text-black font-arabic">
                {typeof stat.value === 'number' ? String(stat.value).padStart(2, '0') : stat.value}
              </div>
              {stat.unit && <div className="text-sm text-black font-arabic font-bold">{stat.unit}</div>}
            </div>
            {stat.description && <div className="text-sm font-normal text-black font-arabic">{stat.description}</div>}
          </BaseCard>
        </Stagger.Item>
      ))}
    </Stagger>
  );
};