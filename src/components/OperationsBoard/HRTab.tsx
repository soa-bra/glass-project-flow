import React from 'react';
import { ResourceHeatMap, SkillGapRadar, WorkloadBalance } from './HR/ResourceHeatMap';
import { HRStatsCards } from './HR/HRStatsCards';

interface ResourceUtilization {
  employeeId: string;
  name: string;
  department: string;
  utilization: number;
  capacity: number;
  projects: string[];
  skills: string[];
  performance: number;
}

interface SkillGap {
  skill: string;
  current: number;
  required: number;
  gap: number;
  priority: 'high' | 'medium' | 'low';
}

interface HRStats {
  totalEmployees: number;
  activeProjects: number;
  avgUtilization: number;
  skillGaps: number;
  performanceScore: number;
  retentionRate: number;
  active: number;
  onLeave: number;
  vacancies: number;
}

interface WorkloadData {
  department: string;
  current: number;
  capacity: number;
  efficiency: number;
}

export interface HRData {
  resourceUtilization: ResourceUtilization[];
  skillGaps: SkillGap[];
  stats: HRStats;
  workloadBalance: WorkloadData[];
}

interface HRTabProps {
  data?: HRData;
  loading: boolean;
}

const HRTab: React.FC<HRTabProps> = ({ data, loading }) => {
  if (loading || !data) {
    return <div className="h-full flex items-center justify-center text-gray-600 font-arabic">جارٍ التحميل...</div>;
  }

  return (
    <div className="space-y-4 h-full overflow-auto bg-transparent">
      {/* العنوان و KPI في نفس السطر */}
      <div className="flex justify-between items-start px-6 pt-6">
        <div className="text-right">
          <h2 className="text-lg font-semibold text-black font-arabic mb-1">الموارد البشرية</h2>
          <p className="text-xs font-normal text-gray-400 font-arabic">موازنة الحمل وتحديد النقص في المهارات</p>
        </div>
        <div className="flex-1 max-w-2xl">
          <HRStatsCards stats={data.stats} />
        </div>
      </div>
      
      {/* الرسوم البيانية الأساسية */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 px-6">
        <ResourceHeatMap resourceData={data.resourceUtilization} />
        <SkillGapRadar skillGaps={data.skillGaps} />
      </div>
      
      {/* توازن أعباء العمل */}
      <div className="px-6">
        <WorkloadBalance workloadData={data.workloadBalance} />
      </div>
    </div>
  );
};

export default HRTab;