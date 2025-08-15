import React from 'react';
import { MiniGanttChart } from './Projects/MiniGanttChart';
import { DelayedMilestones } from './Projects/DelayedMilestones';
import { ProjectProgressSummary } from './Projects/ProjectProgressSummary';
import { AIDelayAdvisor } from './Projects/AIDelayAdvisor';
import { BaseOperationsTabLayout } from './BaseOperationsTabLayout';

interface CriticalProject {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: 'on-track' | 'at-risk' | 'delayed';
  priority: 'high' | 'medium' | 'low';
}

interface DelayedMilestone {
  id: string;
  projectName: string;
  milestone: string;
  originalDate: string;
  currentDate: string;
  delayDays: number;
  impact: 'high' | 'medium' | 'low';
}

interface ProjectSummary {
  totalProjects: number;
  onTrack: number;
  atRisk: number;
  delayed: number;
  completionRate: number;
}

interface AIAdvice {
  id: string;
  type: 'warning' | 'suggestion' | 'optimization';
  title: string;
  description: string;
  confidence: number;
  projectId?: string;
}

export interface ProjectsData {
  criticalProjects: CriticalProject[];
  delayedMilestones: DelayedMilestone[];
  summary: ProjectSummary;
  aiAdvice: AIAdvice[];
}

interface ProjectsTabProps {
  data?: ProjectsData;
  loading: boolean;
}

export const ProjectsTab: React.FC<ProjectsTabProps> = ({ data, loading }) => {
  // تحويل البيانات إلى تنسيق KPI
  const kpiStats = data ? [{
    title: 'إجمالي المشاريع',
    value: String(data.summary.totalProjects),
    unit: 'مشروع',
    description: 'مشاريع نشطة ومكتملة'
  }, {
    title: 'في الموعد',
    value: String(data.summary.onTrack),
    unit: 'مشروع',
    description: 'تسير وفق الجدول الزمني'
  }, {
    title: 'معرضة للخطر',
    value: String(data.summary.atRisk),
    unit: 'مشروع',
    description: 'تحتاج إلى متابعة'
  }, {
    title: 'متأخرة',
    value: String(data.summary.delayed),
    unit: 'مشروع',
    description: 'تجاوزت الموعد المحدد'
  }] : [];

  return (
    <BaseOperationsTabLayout
      value="projects"
      kpiStats={kpiStats}
      loading={loading}
      error={!data && !loading ? "لا توجد بيانات مشاريع متاحة" : undefined}
    >
      {data && (
        <div className="space-y-6">
          {/* الرسوم البيانية الأساسية */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <MiniGanttChart criticalProjects={data.criticalProjects} />
            <DelayedMilestones delayedMilestones={data.delayedMilestones} />
          </div>
          
          {/* مستشار التأخير بالذكاء الاصطناعي */}
          <AIDelayAdvisor aiAdvice={data.aiAdvice} />
        </div>
      )}
    </BaseOperationsTabLayout>
  );
};