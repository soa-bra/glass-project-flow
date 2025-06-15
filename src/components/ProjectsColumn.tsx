
import ProjectsToolbar from './ProjectsToolbar';
import ProjectCard from './ProjectCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react';
import { Project } from '@/types/project';

type ProjectsColumnProps = {
  projects: Project[];
  selectedProjectId?: string | null;
  onProjectSelect?: (projectId: string) => void;
};

const ProjectsColumn: React.FC<ProjectsColumnProps> = ({
  projects,
  selectedProjectId,
  onProjectSelect,
}) => {
  return (
    <div className="w-full h-full flex flex-col overflow-hidden rounded-t-3xl"
      style={{
        background: 'rgba(255,255,255,0.40)',
        backdropFilter: 'blur(20px) saturate(135%)',
        WebkitBackdropFilter: 'blur(20px) saturate(135%)',
        border: '1.5px solid rgba(255,255,255,0.17)',
        fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
        boxShadow: '0 8px 28px rgba(31,38,135,0.10)'
      }}
    >
      {/* شريط الأدوات ثابت في الأعلى */}
      <div className="flex-shrink-0 px-2 pt-3">
        <ProjectsToolbar />
      </div>
      {/* منطقة التمرير للمشاريع مع تأثير الزجاج */}
      <div className="flex-1 overflow-hidden rounded-t-3xl">
        <ScrollArea className="h-full w-full">
          <div className="space-y-2 pb-4 px-[2px] rounded-full">
            {projects.map(project => (
              <ProjectCard
                key={project.id}
                {...project}
                isSelected={selectedProjectId === project.id}
                isOtherSelected={
                  selectedProjectId !== undefined &&
                  selectedProjectId !== null &&
                  selectedProjectId !== project.id
                }
                onProjectSelect={onProjectSelect}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
export default ProjectsColumn;
