import React from 'react';
import { FolderKanban, CheckCircle2, Clock, Users, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ProjectCardData {
  projectName?: string;
  status?: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  totalTasks?: number;
  completedTasks?: number;
  totalPhases?: number;
  completedPhases?: number;
  budget?: number;
  startDate?: string;
  endDate?: string;
  teamSize?: number;
  estimatedHours?: number;
  actualHours?: number;
}

interface ProjectCardProps {
  data: ProjectCardData;
  onUpdate: (data: Partial<ProjectCardData>) => void;
}

const STATUS_CONFIG = {
  planning: { label: 'تخطيط', color: 'bg-blue-500', textColor: 'text-blue-600' },
  active: { label: 'نشط', color: 'bg-green-500', textColor: 'text-green-600' },
  on_hold: { label: 'معلق', color: 'bg-yellow-500', textColor: 'text-yellow-600' },
  completed: { label: 'مكتمل', color: 'bg-emerald-500', textColor: 'text-emerald-600' },
  cancelled: { label: 'ملغي', color: 'bg-red-500', textColor: 'text-red-600' },
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ data }) => {
  const projectName = data.projectName || 'مشروع جديد';
  const status = data.status || 'planning';
  const totalTasks = data.totalTasks || 0;
  const completedTasks = data.completedTasks || 0;
  const totalPhases = data.totalPhases || 0;
  const completedPhases = data.completedPhases || 0;
  const budget = data.budget || 0;
  const teamSize = data.teamSize || 0;
  const estimatedHours = data.estimatedHours || 0;
  const actualHours = data.actualHours || 0;

  const taskProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const phaseProgress = totalPhases > 0 ? (completedPhases / totalPhases) * 100 : 0;
  const hoursEfficiency = estimatedHours > 0 ? ((estimatedHours - actualHours) / estimatedHours) * 100 : 0;

  const statusConfig = STATUS_CONFIG[status];

  return (
    <div className="w-full h-full flex flex-col bg-background rounded-lg border border-border overflow-hidden" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-panel">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <FolderKanban className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">{projectName}</h3>
            <div className="flex items-center gap-1">
              <span className={cn("w-2 h-2 rounded-full", statusConfig.color)} />
              <span className={cn("text-xs", statusConfig.textColor)}>{statusConfig.label}</span>
            </div>
          </div>
        </div>
        
        {budget > 0 && (
          <div className="text-left">
            <p className="text-xs text-muted-foreground">الميزانية</p>
            <p className="font-bold text-sm">{budget.toLocaleString('ar-SA')} ﷼</p>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 p-3">
        {/* Tasks Progress */}
        <div className="bg-muted/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span className="text-xs text-muted-foreground">المهام</span>
          </div>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-2xl font-bold">{completedTasks}</span>
            <span className="text-sm text-muted-foreground">/ {totalTasks}</span>
          </div>
          <Progress value={taskProgress} className="h-1.5" />
          <p className="text-xs text-muted-foreground mt-1">{taskProgress.toFixed(0)}% مكتمل</p>
        </div>

        {/* Phases Progress */}
        <div className="bg-muted/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            <span className="text-xs text-muted-foreground">المراحل</span>
          </div>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-2xl font-bold">{completedPhases}</span>
            <span className="text-sm text-muted-foreground">/ {totalPhases}</span>
          </div>
          <Progress value={phaseProgress} className="h-1.5" />
          <p className="text-xs text-muted-foreground mt-1">{phaseProgress.toFixed(0)}% مكتمل</p>
        </div>

        {/* Team Size */}
        <div className="bg-muted/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-purple-500" />
            <span className="text-xs text-muted-foreground">الفريق</span>
          </div>
          <span className="text-2xl font-bold">{teamSize}</span>
          <p className="text-xs text-muted-foreground">عضو</p>
        </div>

        {/* Hours */}
        <div className="bg-muted/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-orange-500" />
            <span className="text-xs text-muted-foreground">الساعات</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold">{actualHours}</span>
            <span className="text-sm text-muted-foreground">/ {estimatedHours}</span>
          </div>
          <p className={cn(
            "text-xs",
            hoursEfficiency >= 0 ? "text-green-600" : "text-red-600"
          )}>
            {hoursEfficiency >= 0 ? 'توفير' : 'تجاوز'} {Math.abs(hoursEfficiency).toFixed(0)}%
          </p>
        </div>
      </div>

      {/* Timeline */}
      {(data.startDate || data.endDate) && (
        <div className="px-3 pb-3">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>البداية: {data.startDate || '-'}</span>
            <span>النهاية: {data.endDate || '-'}</span>
          </div>
        </div>
      )}
    </div>
  );
};
