
import { Project } from '@/pages/Index';

export const projectsData: Project[] = [
  {
    id: '1',
    title: 'تطوير الموقع الإلكتروني',
    assignee: 'د. أحمد محمد',
    value: '15000',
    status: 'success',
    phase: 'التطوير',
    phaseColor: '#4ECDC4',
    daysLeft: 15,
    tasksCount: 12,
    description: 'تطوير موقع سوبرا الإلكتروني مع التركيز على تجربة المستخدم'
  },
  {
    id: '2',
    title: 'حملة التعريف بالعلامة',
    assignee: 'د. فاطمة علي',
    value: '8000',
    status: 'warning',
    phase: 'التخطيط',
    phaseColor: '#FFEAA7',
    daysLeft: 8,
    tasksCount: 15,
    description: 'حملة شاملة للتعريف بسوبرا وخدماتها المتميزة'
  },
  {
    id: '3',
    title: 'صفحات التواصل الاجتماعي',
    assignee: 'د. محمد سالم',
    value: '12000',
    status: 'success',
    phase: 'النشر',
    phaseColor: '#81ECEC',
    daysLeft: 22,
    tasksCount: 8,
    description: 'تطوير وإدارة صفحات سوبرا على منصات التواصل الاجتماعي'
  },
  {
    id: '4',
    title: 'المؤتمرات الثقافية',
    assignee: 'د. نورا أحمد',
    value: '25000',
    status: 'error',
    phase: 'متأخر',
    phaseColor: '#FF7675',
    daysLeft: 3,
    tasksCount: 20,
    description: 'تنظيم مؤتمرات سوبرا لقياس الجودة الثقافية للعلامة التجارية'
  },
  {
    id: '5',
    title: 'العلامة الثقافية المتطورة',
    assignee: 'د. خالد سعد',
    value: '18000',
    status: 'neutral',
    phase: 'دراسة',
    phaseColor: '#A29BFE',
    daysLeft: 30,
    tasksCount: 5,
    description: 'تطوير هوية ثقافية متميزة للعلامة التجارية'
  }
];
