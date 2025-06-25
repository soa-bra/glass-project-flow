
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
  priority: 'urgent-important' | 'urgent-not-important' | 'not-urgent-important' | 'not-urgent-not-important';
}
