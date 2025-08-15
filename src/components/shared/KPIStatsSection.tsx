import React from 'react';
import { Stagger } from './motion';
import { SoaTypography } from '@/components/ui';
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
    return <div className={`grid grid-cols-4 gap-6 mb-6 my-0 px-1 mx-3 ${className}`}>
        <div className="col-span-4 text-center py-8">
          <SoaTypography variant="body" className="text-soabra-ink-60">
            جارٍ تحميل الإحصائيات...
          </SoaTypography>
        </div>
      </div>;
  }
  return (
    <Stagger delay={0.2} gap={0.15} className={`grid grid-cols-4 gap-6 mb-6 px-0 mx-0 ${className}`}>
      {stats.map((stat, index) => (
        <Stagger.Item key={index} className="text-right p-0 py-0 my-0 mx-0 px-6">
          <div className="mb-2">
            <SoaTypography variant="subtitle" className="text-soabra-ink">
              {stat.title}
            </SoaTypography>
          </div>
          <div className="flex items-baseline gap-2 mb-1 px-0 mx-0">
            <SoaTypography variant="display-l" className="text-soabra-ink">
              {typeof stat.value === 'number' ? String(stat.value).padStart(2, '0') : stat.value}
            </SoaTypography>
            {stat.unit && (
              <SoaTypography variant="body" className="text-soabra-ink font-semibold">
                {stat.unit}
              </SoaTypography>
            )}
          </div>
          {stat.description && (
            <SoaTypography variant="body" className="text-soabra-ink-80">
              {stat.description}
            </SoaTypography>
          )}
        </Stagger.Item>
      ))}
    </Stagger>
  );
};