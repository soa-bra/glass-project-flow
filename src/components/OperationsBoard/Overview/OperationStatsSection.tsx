
import React from 'react';
interface ProjectStats {
  expectedRevenue: number;
  complaints: number;
  delayedProjects: number;
}
interface OperationStatsSectionProps {
  stats: ProjectStats;
}

/**
 * مكون عرض الإحصائيات الرئيسية للعمليات
 * يعرض الإيرادات المتوقعة، الشكاوى، والمشاريع المتأخرة
 */
export const OperationStatsSection: React.FC<OperationStatsSectionProps> = ({
  stats
}) => {
  // إضافة حماية ضد البيانات غير المعرّفة
  if (!stats) {
    console.log('OperationStatsSection: stats is undefined');
    return <div className="grid grid-cols-3 gap-6 mb-6 my-0 px-[4px] mx-[10px]">
        <div className="text-center py-8 text-gray-400 font-arabic text-xs font-normal">
          جارٍ تحميل الإحصائيات...
        </div>
      </div>;
  }
  console.log('OperationStatsSection received stats:', stats);
  return <div className="grid grid-cols-3 gap-6 mb-6 my-0 px-0 mx-[5px]">
      {/* الإيرادات المتوقعة */}
      <div className="bg-[#f2ffff] rounded-3xl p-6 text-right">
        <div className="mb-2">
          <span className="text-lg font-semibold text-black font-arabic">الإيرادات المتوقعة</span>
        </div>
        <div className="flex items-baseline gap-2 mb-1 px-0 mx-0">
          <div className="text-2xl font-bold text-black font-arabic">
            {stats.expectedRevenue || 0}
          </div>
          <div className="text-sm font-bold text-black font-arabic">الف</div>
        </div>
        <div className="text-xs font-normal text-gray-400 font-arabic">ريال سعودي عن الربع الأول</div>
      </div>

      {/* الشكاوى */}
      <div className="bg-[#f2ffff] rounded-3xl p-6 text-right">
        <div className="mb-2">
          <span className="text-lg font-semibold text-black font-arabic">الشكاوى</span>
        </div>
        <div className="flex items-baseline gap-2 mb-1 px-0 mx-0">
          <div className="text-2xl font-bold text-black font-arabic">
            {String(stats.complaints || 0).padStart(2, '0')}
          </div>
          <div className="text-sm font-bold text-black font-arabic">شكاوى</div>
        </div>
        <div className="text-xs font-normal text-gray-400 font-arabic">الشكاوى والملاحظات التي المكررة</div>
      </div>

      {/* المشاريع المتأخرة */}
      <div className="bg-[#f2ffff] rounded-3xl p-6 text-right">
        <div className="mb-2">
          <span className="text-lg font-semibold text-black font-arabic">المشاريع المتأخرة</span>
        </div>
        <div className="flex items-baseline gap-2 mb-1 px-0 mx-0">
          <div className="text-2xl font-bold text-black font-arabic">
            {String(stats.delayedProjects || 0).padStart(2, '0')}
          </div>
          <div className="text-sm font-bold text-black font-arabic">مشاريع</div>
        </div>
        <div className="text-xs font-normal text-gray-400 font-arabic">تحتاج إلى تدخل ومعالجة</div>
      </div>
    </div>;
};
