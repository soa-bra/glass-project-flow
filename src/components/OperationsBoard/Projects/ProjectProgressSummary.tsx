import React from 'react';
import { KPIStatsSection } from '@/components/shared/KPIStatsSection';
interface ProjectSummary {
  totalProjects: number;
  onTrack: number;
  atRisk: number;
  delayed: number;
  completionRate: number;
}
interface ProjectProgressSummaryProps {
  summary: ProjectSummary;
}
export const ProjectProgressSummary: React.FC<ProjectProgressSummaryProps> = ({
  summary
}) => {
  const onTrackPercentage = Math.round((summary.onTrack / summary.totalProjects) * 100);
  const atRiskPercentage = Math.round((summary.atRisk / summary.totalProjects) * 100);
  const delayedPercentage = Math.round((summary.delayed / summary.totalProjects) * 100);

  const statsData = [
    {
      title: 'إجمالي المشاريع',
      value: String(summary.totalProjects).padStart(2, '0'),
      unit: 'مشروع',
      description: 'العدد الإجمالي للمشاريع الجارية'
    },
    {
      title: 'في المسار',
      value: String(summary.onTrack).padStart(2, '0'),
      unit: 'مشروع',
      description: `${onTrackPercentage}% من إجمالي المشاريع`
    },
    {
      title: 'في خطر',
      value: String(summary.atRisk).padStart(2, '0'),
      unit: 'مشروع',
      description: `${atRiskPercentage}% تحتاج إلى متابعة`
    },
    {
      title: 'متأخرة',
      value: String(summary.delayed).padStart(2, '0'),
      unit: 'مشروع',
      description: `${delayedPercentage}% تحتاج إلى تدخل عاجل`
    }
  ];

  return <KPIStatsSection stats={statsData} />;
};