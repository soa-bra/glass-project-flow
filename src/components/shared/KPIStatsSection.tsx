import React from 'react';
import { ArrowUp } from 'lucide-react';

interface KPIStat {
  title: string;
  value: string | number;
  unit?: string;
  description?: string;
  trend?: 'up' | 'down' | 'neutral'; // إضافة خاصية الاتجاه
  trendValue?: string; // قيمة التغيير (مثل +12% أو -5%)
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
        <div className="col-span-4 text-center py-8 text-gray-500 font-arabic">
          جارٍ تحميل الإحصائيات...
        </div>
      </div>
    );
  }

  const getTrendRotation = (trend?: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return 'rotate-[-45deg]'; // الساعة 2 (بين 12 و 3)
      case 'down':
        return 'rotate-[135deg]'; // الساعة 8 (بين 6 و 9)
      case 'neutral':
        return 'rotate-[90deg]'; // الساعة 3 (مستقيم أفقي)
      default:
        return 'rotate-0';
    }
  };

  return (
    <div className={`grid grid-cols-4 gap-6 mb-6 my-0 px-0 mx-[5px] ${className}`}>
      {stats.map((stat, index) => (
        <div key={index} className="text-right p-6 py-0 my-[15px]">
          <div className="mb-2">
            <span className="text-sm text-black font-arabic font-medium">{stat.title}</span>
          </div>
          <div className="flex items-baseline gap-2 mb-1 px-0 mx-0 relative">
            <div className="text-5xl font-normal text-gray-900 font-arabic">
              {typeof stat.value === 'number' ? 
                String(stat.value).padStart(2, '0') : 
                stat.value
              }
            </div>
            {stat.unit && (
              <div className="text-xs text-black font-arabic font-bold">{stat.unit}</div>
            )}
            {/* مؤشر الاتجاه - سهم مستقيم يتحرك مع أو عكس عقارب الساعة */}
            {stat.trend && (
              <div 
                className="absolute left-0 top-1/2 transform -translate-y-1/2 w-[40px] h-[40px] rounded-full border-2 border-black bg-transparent flex items-center justify-center transition-all duration-300 group"
                style={{ marginRight: '5px' }}
              >
                <ArrowUp 
                  className={`w-5 h-5 text-black transition-transform duration-300 ${getTrendRotation(stat.trend)}`}
                />
                {stat.trendValue && (
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-arabic text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    {stat.trendValue}
                  </div>
                )}
              </div>
            )}
          </div>
          {stat.description && (
            <div className="text-xs font-Regular text-black font-arabic">{stat.description}</div>
          )}
        </div>
      ))}
    </div>
  );
};
