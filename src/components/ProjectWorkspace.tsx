
import React from 'react';
import ProjectsColumn from '@/components/ProjectsColumn';
import OperationsBoard from '@/components/OperationsBoard';
import ProjectPanel from '@/components/ProjectPanel';
import { mockProjects } from '@/data/mockProjects';
import { useProjectPanelAnimation } from '@/hooks/useProjectPanelAnimation';

interface ProjectWorkspaceProps {
  isSidebarCollapsed: boolean;
}

const ProjectWorkspace: React.FC<ProjectWorkspaceProps> = ({ isSidebarCollapsed }) => {
  const {
    selectedProjectId,
    isPanelFullyOpen,
    operationsBoardClass,
    projectPanelClass,
    projectsColumnClass,
    handleProjectSelect,
    closePanel,
  } = useProjectPanelAnimation();

  const selectedProject = selectedProjectId
    ? mockProjects.find((p) => p.id === selectedProjectId)
    : null;

  return (
    <>
      {/* Projects Column */}
      <div
        className={`fixed h-[calc(100vh-var(--sidebar-top-offset))] ${isSidebarCollapsed ? 'projects-layout-collapsed' : 'projects-layout-expanded'} ${projectsColumnClass}`}
        style={{
          top: 'var(--sidebar-top-offset)',
          transition: 'all var(--animation-duration-main) var(--animation-easing)',
        }}
      >
        <div
          style={{ transition: 'all var(--animation-duration-main) var(--animation-easing)' }}
          className="w-full h-full p-2 py-0 mx-0 px-[5px]"
        >
          <ProjectsColumn
            projects={mockProjects}
            selectedProjectId={selectedProjectId}
            onProjectSelect={handleProjectSelect}
          />
        </div>
      </div>
      {/* Operations Board */}
      <div
        style={{ transition: 'all var(--animation-duration-main) var(--animation-easing)' }}
        className={`mx-0 ${operationsBoardClass ?? ''}`}
      >
        <OperationsBoard isSidebarCollapsed={isSidebarCollapsed} />
      </div>
      {/* Project Panel Animated */}
      {!!selectedProject && (
        <ProjectPanel
          frameClass={projectPanelClass}
          project={selectedProject}
          showFull={isPanelFullyOpen}
          onClose={closePanel}
        />
      )}
    </>
  );
};
export default ProjectWorkspace;
