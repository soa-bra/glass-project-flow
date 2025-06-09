
import { Project } from '@/types/project';

export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'تطوير الموقع الإلكتروني',
    assignee: 'أحمد محمد',
    value: '15000',
    status: 'success',
    phase: 'التطوير',
    phaseColor: '#3B82F6'
  },
  {
    id: '2',
    title: 'حملة التعريف بسوبرا وخدماتها',
    assignee: 'سارة أحمد',
    value: '8000',
    status: 'warning',
    phase: 'التخطيط',
    phaseColor: '#F59E0B'
  },
  {
    id: '3',
    title: 'صفحات التواصل الاجتماعي',
    assignee: 'محمد علي',
    value: '12000',
    status: 'success',
    phase: 'النشر',
    phaseColor: '#10B981'
  },
  {
    id: '4',
    title: 'المؤتمرات الثقافية للمهيل',
    assignee: 'فاطمة خالد',
    value: '25000',
    status: 'error',
    phase: 'متأخر',
    phaseColor: '#EF4444'
  },
  {
    id: '5',
    title: 'العلامة الثقافية للمهيل',
    assignee: 'عبدالله سعد',
    value: '18000',
    status: 'neutral',
    phase: 'دراسة',
    phaseColor: '#6B7280'
  },
  {
    id: '6',
    title: 'تطوير تطبيق الجوال',
    assignee: 'نورا حسن',
    value: '22000',
    status: 'success',
    phase: 'التطوير',
    phaseColor: '#8B5CF6'
  }
];
