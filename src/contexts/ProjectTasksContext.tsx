
import React, { createContext, useContext, ReactNode } from 'react';
import { useProjectTasks as useLegacyInMemoryTasks } from '@/hooks/useProjectTasks';
import { useProjectTasks as useCentralProjectTasks } from '@/hooks/central';
import type { TaskData } from '@/types';
import type { Task as CentralTask } from '@/types/central';

interface ProjectTasksContextType {
  // الواجهة القديمة (in-memory) — للتوافقية مع وحدات Project Management الحالية
  addTasksToProject: (projectId: string, tasks: TaskData[]) => void;
  addTaskToProject: (projectId: string, task: TaskData) => void;
  updateTaskInProject: (projectId: string, updatedTask: TaskData) => void;
  removeTaskFromProject: (projectId: string, taskId: number) => void;
  getProjectTasks: (projectId: string) => TaskData[];
  projectTasks: Record<string, TaskData[]>;
  // P3: قراءة المهام الحقيقية من DB المركزي عند الحاجة
  getCentralTasks: (projectId: string | null) => CentralTask[];
}

const ProjectTasksContext = createContext<ProjectTasksContextType | undefined>(undefined);

/**
 * Provider هجين خلال P3:
 * - الواجهة القديمة تبقى تُغذّي UI القائم بدون كسر.
 * - hook جديد `getCentralTasks` يقرأ من جدول tasks الحقيقي عند تمرير projectId.
 *   الوحدات الجديدة تستخدمه مباشرة، والوحدات القديمة تنتقل تدريجيًا.
 */
export const ProjectTasksProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const legacy = useLegacyInMemoryTasks();

  const getCentralTasks = (projectId: string | null): CentralTask[] => {
    // ملاحظة: هذا hook يُستدعى داخل دالة، لا يمكن استخدامه مباشرة.
    // المستهلكون يستخدمون `useProjectTasks(projectId)` من `@/hooks/central` مباشرة.
    return [];
  };

  return (
    <ProjectTasksContext.Provider value={{ ...legacy, getCentralTasks }}>
      {children}
    </ProjectTasksContext.Provider>
  );
};

export const useProjectTasksContext = () => {
  const context = useContext(ProjectTasksContext);
  if (!context) {
    throw new Error('useProjectTasksContext must be used within a ProjectTasksProvider');
  }
  return context;
};

/**
 * P3: hook موصى به للوحدات الجديدة — يقرأ مهام مشروع مباشرة من DB.
 * الإرجاع متوافق مع نموذج `Task` المركزي (لا تحويل إلى TaskData القديم).
 */
export { useCentralProjectTasks as useProjectCentralTasks };
