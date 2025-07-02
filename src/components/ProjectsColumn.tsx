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
  onProjectAdded
}) => {
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const handleProjectAdded = (newProject: ProjectData) => {
    onProjectAdded(newProject);
    setShowAddProjectModal(false);
  };
  return <>
      

      <AddProjectModal isOpen={showAddProjectModal} onClose={() => setShowAddProjectModal(false)} onProjectAdded={handleProjectAdded} />
    </>;
};
export default ProjectsColumn;