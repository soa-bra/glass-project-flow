
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
    <div 
      className="w-full h-full flex flex-col overflow-hidden rounded-t-3xl mx-0"
      style={{
        background: 'var(--backgrounds-project-column-bg)'
      }}
    >
      {/* شريط الأدوات ثابت في الأعلى */}
      <div className="flex-shrink-0 px-4 pt-4">
        <ProjectsToolbar />
      </div>
      {/* منطقة التمرير للمشاريع مع تأثير النافذة الدائرية */}
      <div className="flex-1 overflow-hidden rounded-t-3xl">
        <ScrollArea className="h-full w-full">
          <div className="space-y-2 pb-4 px-0 rounded-full mx-[10px]">
            {projects.map(project => (
              <ProjectCard
                key={project.id}
                {...project}
                isSelected={selectedProjectId === project.id}
                isOtherSelected={selectedProjectId !== undefined && selectedProjectId !== null && selectedProjectId !== project.id}
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
