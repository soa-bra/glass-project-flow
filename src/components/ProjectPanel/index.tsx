
import React, { useEffect, useState } from "react";
import { ProjectManagementBoardBox } from "@/components/ProjectManagement";
import { Project } from "@/types/project";

interface ProjectPanelProps {
  frameClass?: string;
  project: Project | null;
  showFull?: boolean;
  crossfade?: boolean;
  onClose: () => void;
  style?: React.CSSProperties;
}

const FADE_DURATION = 350;

const ProjectPanel: React.FC<ProjectPanelProps> = ({
  frameClass = "",
  project,
  showFull,
  crossfade,
  onClose,
  style,
}) => {
  // محليًّا لإدارة تبديل تلاشي المحتوى
  const [fadeVisible, setFadeVisible] = useState(true);
  const [renderedProject, setRenderedProject] = useState<Project | null>(project);

  // Crossfade effect when switching projects inside open panel
  useEffect(() => {
    // Only fade if crossfade requested and new project is different
    if (crossfade && renderedProject && project && renderedProject.id !== project.id) {
      setFadeVisible(false);
      // After fade out
      const timer = setTimeout(() => {
        setRenderedProject(project);
        setFadeVisible(true);
      }, FADE_DURATION);
      return () => clearTimeout(timer);
    } else if (project && (!renderedProject || renderedProject.id !== project.id)) {
      setRenderedProject(project);
      setFadeVisible(true);
    }
  }, [project, crossfade, renderedProject]);

  // When fully closed, don't render panel at all unless animating out
  if (!project && !renderedProject) return null;

  // Use ProjectManagementBoardBox instead of old content
  return renderedProject ? (
    <ProjectManagementBoardBox
      project={renderedProject}
      isVisible={showFull && fadeVisible}
      onClose={onClose}
      isSidebarCollapsed={false} // This will be passed properly from parent
    />
  ) : null;
};

export default ProjectPanel;
