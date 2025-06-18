
import ProjectsToolbar from './ProjectsToolbar';
import ProjectCard from './ProjectCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import React, { useState } from 'react';
import { Project } from '@/types/project';
import { AddProjectModal } from './ProjectsColumn/AddProjectModal';
import { Plus } from 'lucide-react';

type ProjectsColumnProps = {
  projects: Project[];
  selectedProjectId?: string | null;
  onProjectSelect?: (projectId: string) => void;
};

const ProjectsColumn: React.FC<ProjectsColumnProps> = ({
  projects: initialProjects,
  selectedProjectId,
  onProjectSelect,
}) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);

  const handleProjectAdded = (newProject: Project) => {
    setProjects(prev => [newProject, ...prev]);
  };

  return (
    <>
      <div 
        className="w-full h-full flex flex-col overflow-hidden rounded-t-3xl mx-0"
        style={{
          background: 'var(--backgrounds-project-column-bg)'
        }}
      >
        {/* شريط الأدوات ثابت في الأعلى */}
        <div className="flex-shrink-0 px-4 pt-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowAddProjectModal(true)}
              className="rounded-full bg-white/70 hover:bg-white/90 shadow-lg border border-white/30 w-[36px] h-[36px] flex items-center justify-center transition-all duration-200"
              title="إضافة مشروع جديد"
            >
              <Plus className="text-gray-700" size={20} />
            </button>
            <div className="flex-1">
              <ProjectsToolbar />
            </div>
          </div>
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

      <AddProjectModal
        isOpen={showAddProjectModal}
        onClose={() => setShowAddProjectModal(false)}
        onProjectAdded={handleProjectAdded}
      />
    </>
  );
};

export default ProjectsColumn;
