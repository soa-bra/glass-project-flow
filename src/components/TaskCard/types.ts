
export type Priority = 'high' | 'medium' | 'low';

export interface TaskCardProps {
  id: number;
  title: string;
  description: string;
  status: string;
  statusColor: string;
  date: string;
  assignee: string;
  members: string;
  daysLeft: number;
  priority: Priority;
}
