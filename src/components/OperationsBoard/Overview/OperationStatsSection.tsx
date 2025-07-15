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
        <div className="text-center py-8 text-gray-500 font-arabic">
          جارٍ تحميل الإحصائيات...
        </div>
      </div>;
  }
  console.log('OperationStatsSection received stats:', stats);
  return <div className="grid grid-cols-3 gap-6 mb-6 my-0 px-0 mx-[5px]">
      {/* ميزانية المشروع */}
      <div className="text-right p-6 py-0 my-[15px]">
        <div className="mb-2">
          <span className="text-sm text-black font-arabic font-medium">ميزانية المشروع</span>
        </div>
        <div className="flex items-baseline gap-2 mb-1 px-0 mx-0">
          <div className="text-5xl font-normal text-gray-900 font-arabic">
            {stats.expectedRevenue || 0}
          </div>
          <div className="text-xs text-black font-arabic font-bold">الف</div>
        </div>
        <div className="text-xs font-Regular text-black font-arabic">ريال سعودي عن الربع الأول</div>
      </div>

      {/* عدد الأيام المتبقية */}
      <div className="text-right p-6 mx-0 px-[24px] py-0 my-[15px]">
        <div className="mb-2">
          <span className="text-sm text-black font-arabic font-medium">عدد الأيام المتبقية</span>
        </div>
        <div className="flex items-baseline gap-2 mb-1 px-0 mx-0">
          <div className="text-5xl font-normal text-gray-900 font-arabic">
            {String(stats.complaints || 0).padStart(2, '0')}
          </div>
          <div className="text-xs text-black font-arabic font-bold">يوم</div>
        </div>
        <div className="text-xs font-Regular text-black font-arabic">حتى انتهاء المشروع الحالي</div>
      </div>

      {/* المشاريع المتأخرة */}
      <div className="text-right p-6 py-0 my-[15px]">
        <div className="mb-2">
          <span className="text-sm text-black font-arabic font-medium">المشاريع المتأخرة</span>
        </div>
        <div className="flex items-baseline gap-2 mb-1 px-0 mx-0">
          <div className="text-5xl font-normal text-gray-900 font-arabic">
            {String(stats.delayedProjects || 0).padStart(2, '0')}
          </div>
          <div className="text-xs text-black font-arabic font-bold">مشاريع</div>
        </div>
        <div className="text-xs font-Regular text-black font-arabic">تحتاج إلى تدخل ومعالجة</div>
      </div>
    </div>;
};