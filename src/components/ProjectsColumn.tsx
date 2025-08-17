
import ProjectsToolbar from './ProjectsToolbar';
import ProjectCard from './ProjectCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import React, { useState } from 'react';
import { Project } from '@/types/project';
import { ProjectData } from '@/types';
import { AddProjectModal } from './ProjectsColumn/AddProjectModal';

type ProjectsColumnProps = {
  projects: Project[];
  selectedProjectId?: string | null;
  onProjectSelect?: (projectId: string) => void;
  onProjectAdded: (newProject: ProjectData) => void;
};

const ProjectsColumn: React.FC<ProjectsColumnProps> = ({
  projects,
  selectedProjectId,
  onProjectSelect,
  onProjectAdded,
}) => {
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);

  const handleProjectAdded = (newProject: ProjectData) => {
    onProjectAdded(newProject);
    setShowAddProjectModal(false);
  };

  return (
    <>
      <div 
        className="w-full h-full flex flex-col overflow-hidden rounded-t-3xl mx-0"
        style={{
          background: '#ebeff2'
        }}
      >
        {/* شريط الأدوات ثابت في الأعلى */}
        <div className="flex-shrink-0 px-4 pt-4">
          <div className="mb-4">
            <ProjectsToolbar onAddProject={() => setShowAddProjectModal(true)} />
          </div>
        </div>
        
        {/* منطقة التمرير للمشاريع مع تأثير النافذة الدائرية */}
        <div className="flex-1 overflow-hidden rounded-t-3xl">
          <ScrollArea className="h-full w-full">
            <div className="space-y-2 pb-4 px-0 rounded-full mx-[10px]">
              {projects.map(project => (
                <ProjectCard
                  key={project.id}
                  id={Number(project.id)}
                  name={project.title}
                  description={project.description}
                  owner={project.owner}
                  deadline={project.date}
                  team={project.team?.map(t => t.name) || []}
                  status={project.status}
                  budget={Number(project.value)}
                  tasksCount={project.tasksCount}
                  daysLeft={project.daysLeft}
                  value={project.value}
                  isSelected={selectedProjectId === project.id}
                  isOtherSelected={selectedProjectId !== undefined && selectedProjectId !== null && selectedProjectId !== project.id}
                  onProjectSelect={onProjectSelect ? () => onProjectSelect(project.id) : undefined}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      <AddProjectModal
        isOpen={showAddProjectModal}
        onClose={() => setShowAddProjectModal(false)}
        onProjectAdded={handleProjectAdded}
      />
    </>
  );
};

export default ProjectsColumn;
