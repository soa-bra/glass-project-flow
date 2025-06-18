import React from 'react';
interface ProjectStats {
  expectedRevenue: number;
  complaints: number;
  delayedProjects: number;
}
interface ProjectStatsSectionProps {
  stats: ProjectStats;
}
export const ProjectStatsSection: React.FC<ProjectStatsSectionProps> = ({
  stats
}) => {
  return <div className="grid grid-cols-3 gap-6 mb-6">
      {/* الإيرادات المتوقعة */}
      <div className="text-right p-6">
        <div className="mb-2">
          <span className="text-sm text-gray-600 font-arabic font-medium">الإيرادات المتوقعة</span>
        </div>
        <div className="flex items-baseline justify-end gap-2 mb-1">
          <div className="text-5xl font-normal text-gray-900 font-arabic">
            {stats.expectedRevenue}
          </div>
          <div className="text-xs text-gray-400 font-arabic font-bold">K SAR</div>
        </div>
        <div className="text-xs text-gray-500 font-arabic font-light">ألف ريال سعودي</div>
      </div>

      {/* الشكاوى */}
      <div className="text-right p-6">
        <div className="mb-2">
          <span className="text-sm text-gray-600 font-arabic font-medium">الشكاوى</span>
        </div>
        <div className="flex items-baseline justify-end gap-2 mb-1">
          <div className="text-5xl font-normal text-gray-900 font-arabic">
            {String(stats.complaints).padStart(2, '0')}
          </div>
          <div className="text-xs text-gray-400 font-arabic font-bold">شكاوى</div>
        </div>
        <div className="text-xs text-gray-500 font-arabic font-light">الشكاوى والملاحظات التي كرروها</div>
      </div>

      {/* المشاريع المتأخرة */}
      <div className="text-right p-6">
        <div className="mb-2">
          <span className="text-sm text-black font-arabic font-medium">المشاريع المتأخرة</span>
        </div>
        <div className="flex items-baseline justify-end gap-2 mb-1">
          <div className="text-5xl font-normal text-gray-900 font-arabic">
            {String(stats.delayedProjects).padStart(2, '0')}
          </div>
          <div className="text-xs text-black font-arabic font-bold">مشاريع</div>
        </div>
        <div className="text-xs  font-Regular text-black font-arabic">تحتاج إلى تدخل ومعالجة</div>
      </div>
    </div>;
};