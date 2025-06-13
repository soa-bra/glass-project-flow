
// إعادة تصدير من الملف المركزي
export type { TimelineEvent } from '@/types';

export interface TimelineWidgetProps {
  timeline: TimelineEvent[];
  className?: string;
}
