
import React from 'react';
import ProjectsToolbar from './ProjectsToolbar';
import ProjectCard from './ProjectCard';
import { ScrollArea } from '@/components/ui/scroll-area';

const mockProjects = [{
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
  hasOverdueTasks: false
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
  hasOverdueTasks: false
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
  hasOverdueTasks: true
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
  hasOverdueTasks: false
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
  hasOverdueTasks: false
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
  hasOverdueTasks: false
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
  hasOverdueTasks: true
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
  hasOverdueTasks: false
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
  hasOverdueTasks: false
}];

interface ProjectsColumnProps {
  onProjectSelect: (projectId: string) => void;
}

const ProjectsColumn = React.memo<ProjectsColumnProps>(({ onProjectSelect }) => {
  console.log('ProjectsColumn render with onProjectSelect callback');

  return (
    <div className="w-full h-full flex flex-col overflow-hidden rounded-t-3xl bg-soabra-projects-bg mx-0">
      {/* شريط الأدوات ثابت في الأعلى */}
      <div className="flex-shrink-0 px-4 pt-4">
        <ProjectsToolbar />
      </div>
      
      {/* منطقة التمرير للمشاريع مع تأثير النافذة الدائرية */}
      <div className="flex-1 overflow-hidden rounded-t-3xl">
        <ScrollArea className="h-full w-full">
          <div className="space-y-2 pb-4 px-0 rounded-full mx-[10px]">
            {mockProjects.map(project => (
              <ProjectCard
                key={project.id}
                {...project}
                onProjectSelect={onProjectSelect}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
});

ProjectsColumn.displayName = 'ProjectsColumn';

export default ProjectsColumn;
