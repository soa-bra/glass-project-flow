
export interface Project {
  id: string;
  title: string;
  description: string;
  daysLeft: number;
  tasksCount: number;
  status: 'success' | 'warning' | 'error' | 'info';
  date: string;
  owner: string;
  value: string;
  progress: number;
  budget: {
    total: number;
    spent: number;
  };
  timeline: Array<{
    id: string;
    date: string;
    title: string;
    department: string;
    status: 'completed' | 'pending' | 'overdue';
  }>;
  tasks: Array<{
    id: string;
    title: string;
    status: 'completed' | 'in-progress' | 'pending' | 'overdue';
    assignee: string;
    dueDate: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  team: Array<{
    id: string;
    name: string;
    role: string;
    avatar?: string;
    hoursAssigned: number;
  }>;
  contracts: Array<{
    id: string;
    name: string;
    status: 'active' | 'expired' | 'pending';
    expiryDate: string;
    value: number;
  }>;
}
