
export interface ProjectPanelProps {
  projectId: string;
  isVisible: boolean;
  onClose: () => void;
}

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
  client: ClientData;
  documents: DocumentData[];
  timeline: TimelineData[];
  events: CalendarEvent[];
}

export interface TaskData {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  assignee: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
}

export interface ClientData {
  name: string;
  company: string;
  email: string;
  phone: string;
  satisfaction: number;
}

export interface DocumentData {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadDate: string;
}

export interface TimelineData {
  id: string;
  title: string;
  date: string;
  type: 'task' | 'meeting' | 'deadline';
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
}

export const PROJECT_TABS = [
  { value: 'dashboard' as ProjectTab, label: 'لوحة التحكم' },
  { value: 'tasks' as ProjectTab, label: 'المهام' },
  { value: 'finance' as ProjectTab, label: 'المالية' },
  { value: 'legal' as ProjectTab, label: 'القانونية' },
  { value: 'client' as ProjectTab, label: 'العميل' },
  { value: 'reports' as ProjectTab, label: 'التقارير' },
  { value: 'calendar' as ProjectTab, label: 'التقويم' },
  { value: 'notifications' as ProjectTab, label: 'الإشعارات' }
];

export type ProjectTab = 'dashboard' | 'tasks' | 'finance' | 'legal' | 'client' | 'reports' | 'calendar' | 'notifications';
