
import ProjectsToolbar from './ProjectsToolbar';
import ProjectCard from './ProjectCard';
import { useState } from 'react';

// بيانات تجريبية للمشاريع مطابقة للصور
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
}];

interface ProjectsColumnProps {
  onProjectSelect?: (projectId: string) => void;
}

const ProjectsColumn = ({
  onProjectSelect
}: ProjectsColumnProps) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  
  const handleProjectSelect = (projectId: string) => {
    const newSelectedId = selectedProjectId === projectId ? null : projectId;
    setSelectedProjectId(newSelectedId);
    onProjectSelect?.(projectId);
  };

  return (
    <div className="w-full h-full flex flex-col py-0 px-0 my-[66px] overflow-hidden">
      {/* شريط الأدوات */}
      <ProjectsToolbar />
      
      {/* قائمة المشاريع - تمتد حتى نهاية الصفحة */}
      <div className="flex-1 space-y-2 overflow-y-auto overflow-x-hidden mx-0 px-0 my-0 py-0 rounded-xl mt-6">
        {mockProjects.map(project => (
          <ProjectCard 
            key={project.id} 
            {...project} 
            onProjectSelect={handleProjectSelect} 
            isSelected={selectedProjectId === project.id} 
            isOtherSelected={selectedProjectId !== null && selectedProjectId !== project.id} 
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectsColumn;
