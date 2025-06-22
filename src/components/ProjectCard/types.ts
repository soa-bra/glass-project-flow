
import type { ProjectData } from '@/types';

export interface ProjectCardProps extends ProjectData {
  daysLeft: number;
  value: string;
  isOverBudget?: boolean;
  hasOverdueTasks?: boolean;
}
