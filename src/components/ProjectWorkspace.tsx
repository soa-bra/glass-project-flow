
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
    isContentVisible,
    operationsBoardClass,
    projectPanelClass,
    handleProjectSelect,
    closePanel,
  } = useProjectPanelAnimation();

  const selectedProject = selectedProjectId
    ? mockProjects.find((p) => p.id === selectedProjectId)
    : null;

  // إصلاح النقطة الأولى: جعل عامود المشاريع يستجيب دائماً لحالة القائمة الجانبية
  const projectsLayoutClass = isSidebarCollapsed ? 'projects-layout-collapsed' : 'projects-layout-expanded';

  return (
    <>
      {/* Projects Column */}
      <div
        className={`fixed h-[calc(100vh-var(--sidebar-top-offset))] ${projectsLayoutClass}`}
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
        <OperationsBoard isSidebarCollapsed={!!selectedProjectId ? false : isSidebarCollapsed} />
      </div>
      {/* Project Panel Animated */}
      {!!selectedProject && (
        <ProjectPanel
          isSidebarCollapsed={isSidebarCollapsed}
          frameClass={projectPanelClass}
          project={selectedProject}
          showFull={isPanelFullyOpen}
          isContentVisible={isContentVisible}
          onClose={closePanel}
        />
      )}
    </>
  );
};
export default ProjectWorkspace;
