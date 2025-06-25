
import { useCallback, useState } from "react";

export type ProjectPanelStage = "closed" | "sliding-in" | "open" | "sliding-out" | "changing-content";

export const useProjectPanelAnimation = () => {
  // Track which project is currently animating in the panel
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  // Stage of the panel animation
  const [stage, setStage] = useState<ProjectPanelStage>("closed");
  // To support crossfade when switching between projects while panel open
  const [displayedProjectId, setDisplayedProjectId] = useState<string | null>(null);

  // To close with slide-out
  const closePanel = useCallback(() => {
    setStage("sliding-out");
    setTimeout(() => {
      setStage("closed");
      setSelectedProjectId(null);
      setDisplayedProjectId(null);
    }, 600); // increased duration for smoother animation
  }, []);

  // When the panel is opened for a project
  const handleProjectSelect = useCallback(
    (projectId: string) => {
    // If panel is closed, start slide-in for the project
    if (stage === "closed" || !selectedProjectId) {
      setSelectedProjectId(projectId);
      setDisplayedProjectId(projectId);
      setStage("sliding-in");
      setTimeout(() => setStage("open"), 600); // increased duration for smoother animation
    } else if (stage === "open" && displayedProjectId && displayedProjectId !== projectId) {
      // If panel is open and user selects a new project, use crossfade effect ("changing-content")
      setStage("changing-content");
      setTimeout(() => {
        setDisplayedProjectId(projectId);
        setSelectedProjectId(projectId);
      }, 200); // quick transition for content change
      setTimeout(() => {
        setStage("open");
      }, 500); // total crossfade duration
    } else if (selectedProjectId === projectId) {
      // Clicking the same project closes the panel
      closePanel();
    }
  }, [stage, selectedProjectId, displayedProjectId, closePanel]);

  // Animation classes with enhanced transitions
  let operationsBoardClass = "";
  let projectsColumnClass = "";
  const slidePanel =
    stage === "sliding-in" || stage === "open" || stage === "changing-content";
  const slideOutPanel = stage === "sliding-out";

  // Operations board, projects column transitions based on open/collapsed/sidebar
  if (slidePanel) {
    operationsBoardClass = "sync-transition operations-board-slid transform transition-all duration-500 ease-out";
    projectsColumnClass = "sync-transition projects-column-slid transform transition-all duration-500 ease-out";
  } else if (slideOutPanel) {
    operationsBoardClass = "sync-transition transform transition-all duration-500 ease-out";
    projectsColumnClass = "sync-transition transform transition-all duration-500 ease-out";
  } else {
    operationsBoardClass = "sync-transition transform transition-all duration-300 ease-out";
    projectsColumnClass = "sync-transition transform transition-all duration-300 ease-out";
  }

  return {
    panelStage: stage,
    selectedProjectId,
    displayedProjectId,
    operationsBoardClass,
    projectsColumnClass,
    handleProjectSelect,
    closePanel,
  };
};
