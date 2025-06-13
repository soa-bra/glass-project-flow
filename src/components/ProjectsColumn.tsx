import React, { useState, useEffect } from 'react';
import ProjectCard from './ProjectCard';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarDays, Search, Plus } from 'lucide-react';
import { ProjectCardProps } from './ProjectCard/types';

interface ProjectsColumnProps {
  onProjectSelect?: () => void;
}

const MOCK_PROJECTS: ProjectCardProps[] = [
  {
    id: '1',
    title: 'تطوير الواجهة الأمامية',
    description: 'تصميم وتطوير واجهة مستخدم حديثة لتطبيق ويب.',
    daysLeft: 15,
    tasksCount: 28,
    status: 'success',
    date: '2024-05-10',
    owner: 'أحمد محمد',
    value: '80,000 ر.س'
  },
  {
    id: '2',
    title: 'حملة تسويق رقمي',
    description: 'إطلاق حملة تسويقية شاملة لزيادة الوعي بالعلامة التجارية.',
    daysLeft: 30,
    tasksCount: 12,
    status: 'warning',
    date: '2024-06-15',
    owner: 'ليلى خالد',
    value: '50,000 ر.س'
  },
  {
    id: '3',
    title: 'تحديث البنية التحتية للشبكة',
    description: 'تحسين أداء الشبكة وزيادة الأمان.',
    daysLeft: 60,
    tasksCount: 45,
    status: 'error',
    date: '2024-07-20',
    owner: 'عمر علي',
    value: '120,000 ر.س'
  },
  {
    id: '4',
    title: 'تطبيق إدارة المشاريع',
    description: 'تطوير تطبيق ويب لإدارة المشاريع بكفاءة.',
    daysLeft: 90,
    tasksCount: 62,
    status: 'success',
    date: '2024-08-25',
    owner: 'فاطمة سالم',
    value: '150,000 ر.س'
  },
  {
    id: '5',
    title: 'تحسين تجربة المستخدم',
    description: 'إجراء تحسينات شاملة لتجربة المستخدم على تطبيق الهاتف.',
    daysLeft: 120,
    tasksCount: 35,
    status: 'warning',
    date: '2024-09-30',
    owner: 'خالد يوسف',
    value: '90,000 ر.س'
  },
];

const CONST_TOOLBAR_HEIGHT = 'h-[60px]';

const ProjectsColumn = ({ onProjectSelect }: ProjectsColumnProps) => {
  const [projects, setProjects] = useState<ProjectCardProps[]>(MOCK_PROJECTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    // Filter projects based on search query
    const filteredProjects = MOCK_PROJECTS.filter(project =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setProjects(filteredProjects);
  }, [searchQuery]);

  const handleProjectClick = (projectId: string) => {
    console.log('تم اختيار المشروع:', projectId);
    if (onProjectSelect) {
      onProjectSelect();
    }
  };

  return (
    <div className="h-full flex flex-col bg-soabra-projects-bg rounded-[20px] overflow-hidden">
      {/* Header */}
      <div className={`${CONST_TOOLBAR_HEIGHT} flex items-center justify-between px-4`}>
        <h2 className="font-medium text-[#2A3437] font-arabic text-3xl">
          المشاريع
        </h2>
        <Button variant="outline" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Toolbar */}
      <div className={`${CONST_TOOLBAR_HEIGHT} flex items-center gap-2 px-3`}>
        <Input
          type="text"
          placeholder="ابحث عن مشروع..."
          className="w-full max-w-[160px]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button variant="outline" size="icon">
          <Search className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <CalendarDays className="h-4 w-4" />
        </Button>
      </div>

      {/* Project Cards */}
      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-2">
        {projects.map((project) => (
          <div key={project.id} onClick={() => handleProjectClick(project.id)}>
            <ProjectCard
              id={project.id}
              title={project.title}
              description={project.description}
              daysLeft={project.daysLeft}
              tasksCount={project.tasksCount}
              status={project.status}
              date={project.date}
              owner={project.owner}
              value={project.value}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsColumn;
