
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
  return (
    <div className="col-span-3 grid grid-cols-3 gap-6">
      {/* الإيرادات المتوقعة */}
      <div className="operations-board-card text-right">
        <div className="mb-3">
          <span className="text-sm text-gray-700 font-arabic font-medium">الإيرادات المتوقعة</span>
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <div className="text-5xl font-normal text-gray-900 font-arabic">
            {stats.expectedRevenue}
          </div>
          <div className="text-sm text-gray-700 font-arabic font-bold">ألف</div>
        </div>
        <div className="text-xs text-gray-600 font-arabic">ريال سعودي عن الربع الأول</div>
      </div>

      {/* الشكاوى */}
      <div className="operations-board-card text-right">
        <div className="mb-3">
          <span className="text-sm text-gray-700 font-arabic font-medium">الشكاوى</span>
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <div className="text-5xl font-normal text-gray-900 font-arabic">
            {String(stats.complaints).padStart(2, '0')}
          </div>
          <div className="text-sm text-gray-700 font-arabic font-bold">شكاوى</div>
        </div>
        <div className="text-xs text-gray-600 font-arabic">الشكاوى والملاحظات التي تكررت</div>
      </div>

      {/* المشاريع المتأخرة */}
      <div className="operations-board-card text-right">
        <div className="mb-3">
          <span className="text-sm text-gray-700 font-arabic font-medium">المشاريع المتأخرة</span>
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <div className="text-5xl font-normal text-gray-900 font-arabic">
            {String(stats.delayedProjects).padStart(2, '0')}
          </div>
          <div className="text-sm text-gray-700 font-arabic font-bold">مشاريع</div>
        </div>
        <div className="text-xs text-gray-600 font-arabic">تحتاج إلى تدخل ومعالجة</div>
      </div>
    </div>
  );
};
