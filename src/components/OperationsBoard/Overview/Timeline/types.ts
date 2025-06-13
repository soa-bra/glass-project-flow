
import type { TimelineEvent } from '@/types';

// إعادة تصدير من الملف المركزي
export type { TimelineEvent };

export interface TimelineWidgetProps {
  timeline: TimelineEvent[];
  className?: string;
}
