
export interface TimelineEvent {
  id: number;
  date: string;
  title: string;
  department: string;
  color: string;
}

export interface TimelineWidgetProps {
  timeline: TimelineEvent[];
  className?: string;
}
