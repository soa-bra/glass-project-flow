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
    return <div className="h-full flex items-center justify-center text-gray-600 font-arabic">جارٍ التحميل...</div>;
  }

  return (
    <div className="space-y-4 h-full overflow-auto bg-transparent">
      {/* العنوان و KPI في نفس السطر */}
      <div className="flex justify-between items-start px-6 pt-6">
        <div className="text-right">
          <h2 className="text-lg font-semibold text-black font-arabic mb-1">إدارة المشاريع</h2>
          <p className="text-xs font-normal text-gray-400 font-arabic">تتبع التقدم الإجمالي ومعالجة الانحرافات</p>
        </div>
        <div className="flex-1 max-w-2xl">
          <ProjectProgressSummary summary={data.summary} />
        </div>
      </div>
      
      {/* الرسوم البيانية الأساسية */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 px-6">
        <MiniGanttChart criticalProjects={data.criticalProjects} />
        <DelayedMilestones delayedMilestones={data.delayedMilestones} />
      </div>
      
      {/* مستشار التأخير بالذكاء الاصطناعي */}
      <div className="px-6">
        <AIDelayAdvisor aiAdvice={data.aiAdvice} />
      </div>
    </div>
  );
};