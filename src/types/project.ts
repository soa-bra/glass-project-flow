
export type Project = {
  id: string;
  title: string;
  description: string;
  daysLeft: number;
  tasksCount: number;
  status: 'info' | 'success' | 'warning' | 'error';
  date: string;
  owner: string;
  value: string;
  isOverBudget: boolean;
  hasOverdueTasks: boolean;
  team?: { name: string; avatar?: string }[];
  progress?: number;
  links?: { label: string; url: string }[];
  milestones?: { key: string; label?: string; percent: number }[];
};
