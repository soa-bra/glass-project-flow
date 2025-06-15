
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { Progress } from '@/components/ui/progress';

interface ProjectStats {
  budget: number;
  team: number;
  deliveryDate: string;
}

interface ProjectStatsSectionProps {
  stats: ProjectStats;
}

export const ProjectStatsSection: React.FC<ProjectStatsSectionProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-3 gap-6 mb-6">
      {/* الميزانية */}
      <BaseCard variant="glass" className="text-center p-6">
        <div className="mb-2">
          <span className="text-sm text-gray-600 font-arabic">الميزانية</span>
        </div>
        <div className="text-3xl font-bold text-gray-800 mb-1 font-arabic">
          {stats.budget}
        </div>
        <div className="text-xs text-gray-500 font-arabic">ريال</div>
      </BaseCard>

      {/* الفريق */}
      <BaseCard variant="glass" className="text-center p-6">
        <div className="mb-2">
          <span className="text-sm text-gray-600 font-arabic">الفريق</span>
        </div>
        <div className="text-3xl font-bold text-gray-800 mb-1 font-arabic">
          {String(stats.team).padStart(2, '0')}
        </div>
        <div className="text-xs text-gray-500 font-arabic">أعضاء</div>
      </BaseCard>

      {/* التسليم */}
      <BaseCard variant="glass" className="text-center p-6">
        <div className="mb-2">
          <span className="text-sm text-gray-600 font-arabic">التسليم</span>
        </div>
        <div className="text-3xl font-bold text-gray-800 mb-1 font-arabic">
          {String(new Date(stats.deliveryDate).getDate()).padStart(2, '0')}
        </div>
        <div className="text-xs text-gray-500 font-arabic">يوم</div>
      </BaseCard>
    </div>
  );
};
