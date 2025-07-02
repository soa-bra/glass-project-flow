
import React from 'react';

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
    return (
      <div className={`grid grid-cols-4 gap-6 mb-6 my-0 px-[4px] mx-[10px] ${className}`}>
        <div className="col-span-4 text-center py-8 text-gray-400 font-arabic text-xs font-normal">
          جارٍ تحميل الإحصائيات...
        </div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-4 gap-6 mb-6 my-0 px-0 mx-[5px] ${className}`}>
      {stats.map((stat, index) => (
        <div key={index} className="bg-[#f2ffff] rounded-3xl p-6 text-right">
          <div className="mb-2">
            <span className="text-lg font-semibold text-black font-arabic">{stat.title}</span>
          </div>
          <div className="flex items-baseline gap-2 mb-1 px-0 mx-0">
            <div className="text-2xl font-bold text-black font-arabic">
              {typeof stat.value === 'number' ? 
                String(stat.value).padStart(2, '0') : 
                stat.value
              }
            </div>
            {stat.unit && (
              <div className="text-sm font-bold text-black font-arabic">{stat.unit}</div>
            )}
          </div>
          {stat.description && (
            <div className="text-xs font-normal text-gray-400 font-arabic">{stat.description}</div>
          )}
        </div>
      ))}
    </div>
  );
};
