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
  status: 'success' | 'warning' | 'error' | 'info';
  budget: {
    total: number;
    spent: number;
  };
  tasks: TaskData[];
  client: {
    name: string;
    email: string;
    phone: string;
  };
  legal: {
    contractExpiry: string;
    ndaSigned: boolean;
  };
}

export interface TaskData {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  assignedTo: string;
}

export interface ProjectPanelProps {
  projectId: string;
  isVisible: boolean;
  onClose: () => void;
}
