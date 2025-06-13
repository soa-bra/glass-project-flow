
import React from 'react';
import { HRStatsCards } from './HR/HRStatsCards';
import { TeamFillProgress } from './HR/TeamFillProgress';
import { ProjectDistribution } from './HR/ProjectDistribution';
import { AddMemberButton } from './HR/AddMemberButton';

interface HRStats {
  active: number;
  onLeave: number;
  vacancies: number;
}

interface ProjectDistribution {
  project: string;
  members: number;
}

interface HRData {
  stats: HRStats;
  distribution: ProjectDistribution[];
}

interface HRTabProps {
  data?: HRData;
  loading: boolean;
}

const HRTab: React.FC<HRTabProps> = React.memo(({ data, loading }) => {
  const fillProgressStats = React.useMemo(() => {
    if (!data) return { active: 0, vacancies: 0 };
    return {
      active: data.stats.active,
      vacancies: data.stats.vacancies
    };
  }, [data]);

  if (loading || !data) {
    return (
      <div className="h-full flex items-center justify-center text-gray-600 font-arabic">
        جارٍ التحميل...
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full px-0">
      <div className="text-right">
        <h2 className="text-2xl font-arabic font-semibold text-gray-800 mb-1">
          الموارد البشرية
        </h2>
        <p className="text-gray-600 text-sm">إدارة الفريق والموظفين</p>
      </div>
      
      <HRStatsCards stats={data.stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TeamFillProgress stats={fillProgressStats} />
        <div className="lg:col-span-1">
          <ProjectDistribution distribution={data.distribution} />
        </div>
      </div>
      
      <AddMemberButton />
    </div>
  );
});

HRTab.displayName = 'HRTab';

export { HRTab };
export default HRTab;
