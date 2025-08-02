import React from 'react';
import { ResourceHeatMap, SkillGapRadar, WorkloadBalance } from './HR/ResourceHeatMap';
import { KPIStatsSection } from '@/components/shared/KPIStatsSection';

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

  // إعداد البيانات لمكون KPI الموحد
  const formatKPIData = () => {
    return [
      {
        title: 'أعضاء نشطين',
        value: data.stats.active,
        description: 'يعملون حالياً في المشاريع'
      },
      {
        title: 'في إجازة',
        value: data.stats.onLeave,
        description: 'في إجازة رسمية أو مرضية'
      },
      {
        title: 'شواغر',
        value: data.stats.vacancies,
        description: 'مناصب مطلوب شغلها'
      },
      {
        title: 'معدل الأداء',
        value: data.stats.performanceScore,
        unit: '%',
        description: 'متوسط تقييم الأداء العام'
      }
    ];
  };

  return (
    <div className="font-arabic px-[15px] py-0">
      {/* قسم المؤشرات الرئيسية */}
      <div className="mb-6 py-0 px-0 my-0">
        <KPIStatsSection stats={formatKPIData()} />
      </div>
      
      {/* الرسوم البيانية الأساسية */}
      <div className="mb-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ResourceHeatMap resourceData={data.resourceUtilization} />
          <SkillGapRadar skillGaps={data.skillGaps} />
        </div>
      </div>
      
      {/* توازن أعباء العمل */}
      <div className="mb-6">
        <WorkloadBalance workloadData={data.workloadBalance} />
      </div>
    </div>
  );
};

export default HRTab;