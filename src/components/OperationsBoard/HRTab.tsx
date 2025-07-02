import React from 'react';
import { ResourceHeatMap } from './HR/ResourceHeatMap';
import { SkillGapRadar } from './HR/SkillGapRadar';
import { HRStatsCards } from './HR/HRStatsCards';
import { WorkloadBalance } from './HR/WorkloadBalance';

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
    <div className="space-y-6 h-full overflow-auto">
      <div className="text-right">
        <h2 className="text-2xl font-arabic font-semibold text-gray-800 mb-1">الموارد البشرية</h2>
        <p className="text-gray-600 text-sm">موازنة الحمل وتحديد النقص في المهارات</p>
      </div>
      
      {/* إحصائيات الموارد البشرية */}
      <HRStatsCards stats={data.stats} />
      
      {/* الرسوم البيانية الأساسية */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ResourceHeatMap resourceData={data.resourceUtilization} />
        <SkillGapRadar skillGaps={data.skillGaps} />
      </div>
      
      {/* توازن أعباء العمل */}
      <WorkloadBalance workloadData={data.workloadBalance} />
    </div>
  );
};

export default HRTab;