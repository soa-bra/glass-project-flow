// ثوابت المهام المشتركة
export const TASK_STATUS_COLORS = {
  completed: '#bdeed3',
  'in-progress': '#a4e2f6',
  todo: '#dfecf2',
  stopped: '#f1b5b9',
  treating: '#d9d2fd',
  late: '#fbe2aa'
} as const;

export const TASK_STATUS_TEXT = {
  completed: 'منجزة',
  'in-progress': 'قيد التنفيذ',
  todo: 'لم تبدأ',
  stopped: 'متوقفة',
  treating: 'تحت المعالجة',
  late: 'متأخرة'
} as const;

export const PRIORITY_COLORS = {
  low: '#94a3b8',
  medium: '#f59e0b',
  high: '#ef4444',
  urgent: '#dc2626'
} as const;

export const PRIORITY_TEXT = {
  low: 'غير مهم وغير عاجل',
  medium: 'غير مهم وعاجل',
  high: 'مهم وغير عاجل',
  urgent: 'مهم وعاجل'
} as const;

// أنواع TypeScript للثوابت
export type TaskStatus = keyof typeof TASK_STATUS_COLORS;
export type TaskPriority = keyof typeof PRIORITY_COLORS;