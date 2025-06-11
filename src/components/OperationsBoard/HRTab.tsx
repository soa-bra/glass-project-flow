
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

const HRTab: React.FC<HRTabProps> = ({ data, loading }) => {
  if (loading || !data) {
    return <div className="h-full flex items-center justify-center">جارٍ التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-arabic font-medium text-right">الموارد البشرية</h2>
      
      <HRStatsCards stats={data.stats} />
      <TeamFillProgress stats={{ active: data.stats.active, vacancies: data.stats.vacancies }} />
      <ProjectDistribution distribution={data.distribution} />
      <AddMemberButton />
    </div>
  );
};

export default HRTab;
