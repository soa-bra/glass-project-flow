import React from 'react';
import { ResourceHeatMap, SkillGapRadar, WorkloadBalance } from './HR/ResourceHeatMap';
import { BaseOperationsTabLayout } from './BaseOperationsTabLayout';

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
  // تحويل البيانات إلى تنسيق KPI
  const kpiStats = data ? [{
    title: 'أعضاء نشطين',
    value: String(data.stats.active),
    unit: 'عضو',
    description: 'يعملون حالياً في المشاريع'
  }, {
    title: 'في إجازة',
    value: String(data.stats.onLeave),
    unit: 'عضو',
    description: 'في إجازة رسمية أو مرضية'
  }, {
    title: 'شواغر',
    value: String(data.stats.vacancies),
    unit: 'منصب',
    description: 'مناصب مطلوب شغلها'
  }, {
    title: 'معدل الأداء',
    value: data.stats.performanceScore.toFixed(1),
    unit: '%',
    description: 'متوسط تقييم الأداء العام'
  }] : [];

  return (
    <BaseOperationsTabLayout
      value="hr"
      kpiStats={kpiStats}
      loading={loading}
      error={!data && !loading ? "لا توجد بيانات موارد بشرية متاحة" : undefined}
    >
      {data && (
        <div className="space-y-6">
          {/* الرسوم البيانية الأساسية */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <ResourceHeatMap resourceData={data.resourceUtilization} />
            <SkillGapRadar skillGaps={data.skillGaps} />
          </div>
          
          {/* توازن أعباء العمل */}
          <WorkloadBalance workloadData={data.workloadBalance} />
        </div>
      )}
    </BaseOperationsTabLayout>
  );
};

export default HRTab;