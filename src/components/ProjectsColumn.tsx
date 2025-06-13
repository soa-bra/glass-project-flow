
import React, { useState } from 'react';
import ProjectCard from './ProjectCard';
import ProjectsToolbar from './ProjectsToolbar';

// بيانات وهمية للمشاريع
const mockProjects = [
  {
    id: '1',
    title: 'تطوير الموقع الإلكتروني',
    description: 'تطوير موقع سوبرا',
    tasksCount: 25,
    status: 'info' as const,
    date: 'د. أسامة',
    owner: '20May25',
    value: '15K',
    daysLeft: 10
  },
  {
    id: '2',
    title: 'حملة التعريف',
    description: 'حملة التعريف بسوبرا ومنتجاتها',
    tasksCount: 10,
    status: 'success' as const,
    date: 'د. أسامة',
    owner: 'Aug 11',
    value: '15K',
    daysLeft: 10
  },
  {
    id: '3',
    title: 'صفحات التواصل',
    description: 'تطوير منصات التواصل الاجتماعي',
    tasksCount: 8,
    status: 'warning' as const,
    date: 'د. أسامة',
    owner: 'Mar 07',
    value: '15K',
    daysLeft: 6
  },
  {
    id: '4',
    title: 'ثلاث أسابيع',
    description: '',
    tasksCount: 6,
    status: 'success' as const,
    date: 'د. أسامة',
    owner: 'Mar 07',
    value: '15K',
    daysLeft: 6
  },
  {
    id: '5',
    title: 'المؤتمرات الثقافية',
    description: 'تطوير مؤتمرات سوبرا لقياس الحياة الثقافية للعاملة',
    tasksCount: 16,
    status: 'error' as const,
    date: 'د. أسامة',
    owner: 'Jul 15',
    value: '15K',
    daysLeft: 14
  },
  {
    id: '6',
    title: 'العلامة الثقافية للعميل',
    description: 'تقديم خدمة تطوير العلامة الثقافية لعملاء Veliva',
    tasksCount: 18,
    status: 'info' as const,
    date: 'د. أسامة',
    owner: 'Jan 27',
    value: '15K',
    daysLeft: 14
  }
];

interface ProjectsColumnProps {
  onProjectManagement?: (projectId: string) => void;
}

const ProjectsColumn: React.FC<ProjectsColumnProps> = ({ onProjectManagement }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(selectedProjectId === projectId ? null : projectId);
  };

  const handleProjectManagement = (projectId: string) => {
    if (onProjectManagement) {
      onProjectManagement(projectId);
    }
  };

  return (
    <div className="h-full flex flex-col bg-soabra-projects-bg rounded-[20px] overflow-hidden">
      <ProjectsToolbar />
      
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="space-y-3">
          {mockProjects.map((project) => (
            <ProjectCard
              key={project.id}
              {...project}
              isSelected={selectedProjectId === project.id}
              isOtherSelected={selectedProjectId !== null && selectedProjectId !== project.id}
              onProjectSelect={handleProjectSelect}
              onProjectManagement={handleProjectManagement}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsColumn;
