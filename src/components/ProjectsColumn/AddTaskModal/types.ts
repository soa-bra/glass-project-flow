
export interface TaskFormData {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  assignee: string;
  priority: 'high' | 'medium' | 'low';
  stage: 'planning' | 'development' | 'testing' | 'review' | 'completed';
  attachments: string[];
}

export const teamMembers = [
  'أحمد محمد',
  'فاطمة علي',
  'خالد الأحمد',
  'نورا السالم',
  'محمد العتيبي',
  'سارة النجار'
];

export const priorities = [
  { value: 'high', label: 'عالية' },
  { value: 'medium', label: 'متوسطة' },
  { value: 'low', label: 'منخفضة' }
];

export const stages = [
  { value: 'planning', label: 'التخطيط' },
  { value: 'development', label: 'التطوير' },
  { value: 'testing', label: 'الاختبار' },
  { value: 'review', label: 'المراجعة' },
  { value: 'completed', label: 'مكتملة' }
];
