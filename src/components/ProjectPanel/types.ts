
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
}

export interface TaskData {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
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

export type ProjectTab = 
  | 'tasks' 
  | 'finance' 
  | 'legal' 
  | 'client' 
  | 'reports' 
  | 'calendar'
  | 'notifications';

export const PROJECT_TABS: { value: ProjectTab; label: string }[] = [
  { value: 'tasks', label: 'قائمة المهام' },
  { value: 'finance', label: 'التفاصيل المالية' },
  { value: 'legal', label: 'الشؤون القانونية' },
  { value: 'client', label: 'معلومات العميل' },
  { value: 'reports', label: 'تقارير المشروع' },
  { value: 'calendar', label: 'تقويم المشروع' },
  { value: 'notifications', label: 'الإشعارات' },
];
