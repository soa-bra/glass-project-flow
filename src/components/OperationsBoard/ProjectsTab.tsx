import React from 'react';
import { MiniGanttChart } from './Projects/MiniGanttChart';
import { DelayedMilestones } from './Projects/DelayedMilestones';
import { ProjectProgressSummary } from './Projects/ProjectProgressSummary';
import { AIDelayAdvisor } from './Projects/AIDelayAdvisor';

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
  if (loading || !data) {
    return <div className="h-full flex items-center justify-center text-sm font-normal text-black font-arabic">جارٍ التحميل...</div>;
  }

  return (
    <div className="space-y-6 h-full overflow-auto px-4">
      <div className="text-right">
        <h2 className="text-large font-semibold text-black font-arabic mb-1">إدارة المشاريع</h2>
        <p className="text-sm font-normal text-black font-arabic">تتبع التقدم الإجمالي ومعالجة الانحرافات</p>
      </div>
      
      {/* ملخص التقدم الإجمالي */}
      <ProjectProgressSummary summary={data.summary} />
      
      {/* الرسوم البيانية الأساسية */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <MiniGanttChart criticalProjects={data.criticalProjects} />
        <DelayedMilestones delayedMilestones={data.delayedMilestones} />
      </div>
      
      {/* مستشار التأخير بالذكاء الاصطناعي */}
      <AIDelayAdvisor aiAdvice={data.aiAdvice} />
    </div>
  );
};
