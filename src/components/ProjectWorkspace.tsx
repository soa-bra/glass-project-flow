
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
    panelStage,
    selectedProjectId,
    displayedProjectId,
    operationsBoardClass,
    projectsColumnClass,
    projectPanelStyle,
    handleProjectSelect,
    closePanel,
  } = useProjectPanelAnimation();

  // الحسابات نفسها لكن ننقل right/width فقط لـ لوحة التشغيل وعمود المشاريع
  const projectsColumnRight = isSidebarCollapsed ? 'var(--projects-right-collapsed)' : 'var(--projects-right-expanded)';
  const projectsColumnWidth = 'var(--projects-width)';
  const operationsBoardRight = isSidebarCollapsed ? 'var(--operations-right-collapsed)' : 'var(--operations-right-expanded)';
  const operationsBoardWidth = isSidebarCollapsed ? 'var(--operations-width-collapsed)' : 'var(--operations-width-expanded)';

  const shownProject = displayedProjectId
    ? mockProjects.find((p) => p.id === displayedProjectId)
    : null;

  return (
    <>
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

      {/* Operations Board */}
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

      {/* Project Panel */}
      <ProjectPanel
        frameClass=""
        project={shownProject}
        showFull={panelStage === "open" || panelStage === "changing-content"}
        crossfade={panelStage === "changing-content"}
        onClose={closePanel}
        style={{
          ...projectPanelStyle,
          // الموضع الرأسي والارتفاع والـzIndex أساسي
          right: 'var(--operations-right-expanded)',
          top: "var(--sidebar-top-offset)",
          width: 'var(--operations-width-expanded)',
          height: "calc(100vh - var(--sidebar-top-offset))",
          zIndex: 1200
        }}
      />
    </>
  );
};
export default ProjectWorkspace;
