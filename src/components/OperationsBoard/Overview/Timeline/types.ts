
// إعادة تصدير من الملف المركزي
export type { TimelineEvent } from '@/types';

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  type: 'meeting' | 'deadline' | 'milestone' | 'event';
  priority: 'high' | 'medium' | 'low';
  status: 'upcoming' | 'in-progress' | 'completed' | 'overdue';
}

export interface TimelineWidgetProps {
  timeline: TimelineEvent[];
  className?: string;
}
