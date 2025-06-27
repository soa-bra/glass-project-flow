
export interface ProjectCardProps {
  id: number;
  name: string;
  description: string;
  owner: string;
  deadline: string;
  team: string[];
  status: string;
  budget: number;
  tasksCount: number;
  daysLeft: number;
  value: string;
  isSelected?: boolean;
  isOtherSelected?: boolean;
  onProjectSelect?: () => void;
  onEdit?: (projectId: number) => void;
  onArchive?: (projectId: number) => void;
  onDelete?: (projectId: number) => void;
}
