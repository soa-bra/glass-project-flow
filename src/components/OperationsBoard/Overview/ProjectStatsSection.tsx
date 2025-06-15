
import React from 'react';

interface ProjectStats {
  expectedRevenue: number;
  complaints: number;
  delayedProjects: number;
}

interface ProjectStatsSectionProps {
  stats: ProjectStats;
}

export const ProjectStatsSection: React.FC<ProjectStatsSectionProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-3 gap-6 mb-6">
      {/* الإيرادات المتوقعة */}
      <div className="text-center p-6">
        <div className="mb-2">
          <span className="text-sm text-gray-600 font-arabic">الإيرادات المتوقعة</span>
        </div>
        <div className="text-3xl font-bold text-gray-800 mb-1 font-arabic">
          {stats.expectedRevenue}
        </div>
        <div className="text-xs text-gray-500 font-arabic">ألف ريال سعودي</div>
      </div>

      {/* الشكاوى */}
      <div className="text-center p-6">
        <div className="mb-2">
          <span className="text-sm text-gray-600 font-arabic">الشكاوى</span>
        </div>
        <div className="text-3xl font-bold text-gray-800 mb-1 font-arabic">
          {String(stats.complaints).padStart(2, '0')}
        </div>
        <div className="text-xs text-gray-500 font-arabic">شكاوى</div>
      </div>

      {/* المشاريع المتأخرة */}
      <div className="text-center p-6">
        <div className="mb-2">
          <span className="text-sm text-gray-600 font-arabic">المشاريع المتأخرة</span>
        </div>
        <div className="text-3xl font-bold text-gray-800 mb-1 font-arabic">
          {String(stats.delayedProjects).padStart(2, '0')}
        </div>
        <div className="text-xs text-gray-500 font-arabic">مشاريع</div>
      </div>
    </div>
  );
};
