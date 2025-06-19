
import { Project } from '@/types/project';

export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'تطوير الموقع الإلكتروني',
    description: 'تطوير موقع سوبرا',
    daysLeft: 11,
    tasksCount: 3,
    status: 'info' as const,
    date: 'May 25',
    owner: 'د. أسامة',
    value: '15K',
    isOverBudget: false,
    hasOverdueTasks: false,
    progress: 65
  }, {
    id: '2',
    title: 'حملة التعريف',
    description: 'حملة التعريف بسوبرا وخدماتها',
    daysLeft: 20,
    tasksCount: 10,
    status: 'success' as const,
    date: 'Aug 11',
    owner: 'د. أسامة',
    value: '15K',
    isOverBudget: false,
    hasOverdueTasks: false,
    progress: 85
  }, {
    id: '3',
    title: 'صفحات التواصل',
    description: 'تطوير صفحات سوبرا بمنصات التواصل الاجتماعي',
    daysLeft: 30,
    tasksCount: 5,
    status: 'info' as const,
    date: 'Mar 07',
    owner: 'د. أسامة',
    value: '15K',
    isOverBudget: false,
    hasOverdueTasks: true,
    progress: 42
  }, {
    id: '4',
    title: 'المؤتمرات الثقافية',
    description: 'تطوير مؤتمرات سوبرا لقياس الجوانب الثقافية للعلامة',
    daysLeft: 25,
    tasksCount: 6,
    status: 'success' as const,
    date: 'Jul 15',
    owner: 'د. أسامة',
    value: '15K',
    isOverBudget: false,
    hasOverdueTasks: false,
    progress: 78
  }, {
    id: '5',
    title: 'العلامة الثقافية للعميل',
    description: 'تقديم خدمة تطوير العلامة الثقافية لصالح Velva',
    daysLeft: 18,
    tasksCount: 15,
    status: 'warning' as const,
    date: 'Jun 27',
    owner: 'د. أسامة',
    value: '15K',
    isOverBudget: true,
    hasOverdueTasks: false,
    progress: 30
  }, {
    id: '6',
    title: 'تطبيق الهاتف المحمول',
    description: 'تطوير تطبيق سوبرا للهواتف الذكية',
    daysLeft: 45,
    tasksCount: 8,
    status: 'info' as const,
    date: 'Dec 10',
    owner: 'م. سارة',
    value: '25K',
    isOverBudget: false,
    hasOverdueTasks: false,
    progress: 15
  }, {
    id: '7',
    title: 'نظام إدارة المحتوى',
    description: 'بناء نظام إدارة المحتوى الخاص بسوبرا',
    daysLeft: 7,
    tasksCount: 12,
    status: 'error' as const,
    date: 'Sep 03',
    owner: 'م. أحمد',
    value: '30K',
    isOverBudget: true,
    hasOverdueTasks: true,
    progress: 92
  }, {
    id: '8',
    title: 'استراتيجية التسويق الرقمي',
    description: 'وضع خطة شاملة للتسويق الرقمي والإعلانات',
    daysLeft: 35,
    tasksCount: 7,
    status: 'success' as const,
    date: 'Nov 18',
    owner: 'أ. فاطمة',
    value: '20K',
    isOverBudget: false,
    hasOverdueTasks: false,
    progress: 56
  }, {
    id: '9',
    title: 'تحليل البيانات والذكاء الاصطناعي',
    description: 'تطوير نظام تحليل البيانات باستخدام الذكاء الاصطناعي',
    daysLeft: 60,
    tasksCount: 20,
    status: 'warning' as const,
    date: 'Jan 15',
    owner: 'د. محمد',
    value: '50K',
    isOverBudget: false,
    hasOverdueTasks: false,
    progress: 25
  }
];
