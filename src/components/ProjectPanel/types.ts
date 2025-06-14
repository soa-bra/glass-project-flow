
export type ProjectTab =
  | 'dashboard'
  | 'tasks'
  | 'finance'
  | 'legal'
  | 'client'
  | 'reports'
  | 'calendar'
  | 'notifications';

export const PROJECT_TABS = [
  { label: 'لوحة التحكم', value: 'dashboard' as ProjectTab },
  { label: 'المهام', value: 'tasks' as ProjectTab },
  { label: 'المالية', value: 'finance' as ProjectTab },
  { label: 'القانونية', value: 'legal' as ProjectTab },
  { label: 'العميل', value: 'client' as ProjectTab },
  { label: 'التقارير', value: 'reports' as ProjectTab },
  { label: 'التقويم', value: 'calendar' as ProjectTab },
  { label: 'الإشعارات', value: 'notifications' as ProjectTab },
];

export interface ProjectData {
  id: string;
  title: string;
  description: string;
  status: 'success' | 'warning' | 'error' | 'info';
  budget: {
    total: number;
    spent: number;
    remaining: number;
  };
  tasks: TaskData[];
  client: {
    name: string;
    company: string;
    email: string;
    phone: string;
    satisfaction: number;
  };
  legal: {
    contractExpiry: string;
    ndaSigned: boolean;
  };
  documents: DocumentData[];
  timeline: TimelineEvent[];
}

export interface TaskData {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  assignedTo: string;
  assignee: string;
  priority: 'low' | 'medium' | 'high';
}

export interface DocumentData {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadDate: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  type: 'task' | 'meeting' | 'deadline';
}

export interface ProjectPanelProps {
  projectId: string;
  isVisible: boolean;
  onClose: () => void;
}
