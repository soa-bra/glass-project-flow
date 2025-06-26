
import React from 'react';
import ProjectsColumn from '@/components/ProjectsColumn';
import OperationsBoard from '@/components/OperationsBoard';
import ProjectPanel from '@/components/ProjectPanel';
import { ProjectManagementBoard } from '@/components/ProjectManagement';
import { mockProjects } from '@/data/mockProjects';
import { useProjectPanelAnimation } from '@/hooks/useProjectPanelAnimation';

interface ProjectWorkspaceProps {
  isSidebarCollapsed: boolean;
}

const ProjectWorkspace: React.FC<ProjectWorkspaceProps> = ({ isSidebarCollapsed }) => {
  const {
    panelStage,
    selectedProjectId,
    displayedProjectId,
    operationsBoardClass,
    projectsColumnClass,
    handleProjectSelect,
    closePanel,
  } = useProjectPanelAnimation();

  // Dynamically set right offsets depending on collapsed state
  const projectsColumnRight = isSidebarCollapsed ? 'var(--projects-right-collapsed)' : 'var(--projects-right-expanded)';
  const projectsColumnWidth = 'var(--projects-width)';
  const operationsBoardRight = isSidebarCollapsed ? 'var(--operations-right-collapsed)' : 'var(--operations-right-expanded)';
  const operationsBoardWidth = isSidebarCollapsed ? 'var(--operations-width-collapsed)' : 'var(--operations-width-expanded)';

  // panel content switches: always mount ProjectPanel but swap inner content with fade
  const shownProject = displayedProjectId
    ? mockProjects.find((p) => p.id === displayedProjectId)
    : null;

  return (
    <div className="animate-fade-in">
      {/* Projects Column: shifts left when panel slides in */}
      <div
        className={`fixed h-[calc(100vh-var(--sidebar-top-offset))] ${projectsColumnClass}`}
        style={{
          top: 'var(--sidebar-top-offset)',
          right: projectsColumnRight,
          width: projectsColumnWidth,
          transition: 'all var(--animation-duration-main) var(--animation-easing)',
          zIndex: 110,
        }}
      >
        <div
          style={{
            transition: 'all var(--animation-duration-main) var(--animation-easing)'
          }}
          className="w-full h-full p-2 py-0 mx-0 px-[5px]"
        >
          <ProjectsColumn
            projects={mockProjects}
            selectedProjectId={selectedProjectId}
            onProjectSelect={handleProjectSelect}
          />
        </div>
      </div>

      {/* Operations Board: slides out when panel slides in */}
      <div
        style={{
          right: operationsBoardRight,
          width: operationsBoardWidth,
          transition: 'all var(--animation-duration-main) var(--animation-easing)'
        }}
        className={`fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] mx-0 ${operationsBoardClass}`}
      >
        <OperationsBoard isSidebarCollapsed={isSidebarCollapsed} />
      </div>

      {/* Project Management Board: slides in/out and crossfades content */}
      {shownProject && (
        <ProjectManagementBoard
          project={shownProject}
          isVisible={panelStage === "open" || panelStage === "changing-content"}
          onClose={closePanel}
          isSidebarCollapsed={isSidebarCollapsed}
        />
      )}
    </div>
  );
};

export default ProjectWorkspace;
