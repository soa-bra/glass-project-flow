
export interface TaskFormData {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  assignee: string;
  priority: 'urgent-important' | 'urgent-not-important' | 'not-urgent-important' | 'not-urgent-not-important';
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
  { value: 'urgent-important', label: 'عاجل مهم' },
  { value: 'urgent-not-important', label: 'عاجل غير مهم' },
  { value: 'not-urgent-important', label: 'غير عاجل مهم' },
  { value: 'not-urgent-not-important', label: 'غير عاجل غير مهم' }
];
