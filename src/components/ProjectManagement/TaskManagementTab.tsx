import React, { useState } from 'react';
import { KanbanBoard } from './TaskManagement/KanbanBoard';
import { TaskDetails } from './TaskManagement/TaskDetails';
import { AITaskAssistant } from './TaskManagement/AITaskAssistant';
import { Project } from '@/types/project';
import { useUnifiedTasks } from '@/hooks/useUnifiedTasks';
import { TaskFilters as UnifiedTaskFilters } from '@/types/task';
import { cn } from '@/lib/utils';
import TaskBoard from './TaskManagement/TaskBoard';
interface TaskManagementTabProps {
  project: Project;
  className?: string;
}
export const TaskManagementTab: React.FC<TaskManagementTabProps> = ({
  project,
  className = ""
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'details'>('kanban');
  const [filters, setFilters] = useState<UnifiedTaskFilters>({
    assignee: '',
    priority: '',
    status: '',
    search: ''
  });
  const {
    tasks
  } = useUnifiedTasks(project.id);
  return (
    <div className={cn("h-full min-h-0 flex overflow-hidden", className)}>
      {/* تمرير أفقي للأعمدة */}
      <div className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden">
        <TaskBoard />
      </div>
    </div>
  );
};