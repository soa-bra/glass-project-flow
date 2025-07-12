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
    <div className="space-y-6 h-full overflow-auto">
      <div className="text-right">
        <h2 className="text-2xl font-arabic font-semibold text-gray-800 mb-1">إدارة المشاريع</h2>
        <p className="text-gray-600 text-sm">تتبع التقدم الإجمالي ومعالجة الانحرافات</p>
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