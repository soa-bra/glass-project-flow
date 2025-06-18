
import { useCallback, useEffect, useRef, useState } from "react";

export type ProjectPanelStage = "closed" | "sliding-in" | "open" | "sliding-out" | "changing-content";

export const useProjectPanelAnimation = () => {
  // Track which project is currently animating in the panel
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  // Stage of the panel animation
  const [stage, setStage] = useState<ProjectPanelStage>("closed");
  // To support crossfade when switching between projects while panel open
  const [displayedProjectId, setDisplayedProjectId] = useState<string | null>(null);

  // When the panel is opened for a project
  const handleProjectSelect = useCallback((projectId: string) => {
    // If panel is closed, start slide-in for the project
    if (stage === "closed" || !selectedProjectId) {
      setSelectedProjectId(projectId);
      setDisplayedProjectId(projectId);
      setStage("sliding-in");
      setTimeout(() => setStage("open"), 500); // match animation duration in css
    } else if (stage === "open" && displayedProjectId && displayedProjectId !== projectId) {
      // If panel is open and user selects a new project, use crossfade effect ("changing-content")
      setStage("changing-content");
      setTimeout(() => {
        setDisplayedProjectId(projectId);
        setSelectedProjectId(projectId);
        setStage("open");
      }, 350); // crossfade duration
    } else if (selectedProjectId === projectId) {
      // Clicking the same project closes the panel
      closePanel();
    }
  }, [stage, selectedProjectId, displayedProjectId]);

  // To close with slide-out
  const closePanel = useCallback(() => {
    setStage("sliding-out");
    setTimeout(() => {
      setStage("closed");
      setSelectedProjectId(null);
      setDisplayedProjectId(null);
    }, 500); // match animation duration
  }, []);

  // Animation classes
  let operationsBoardClass = "";
  let projectsColumnClass = "";
  let slidePanel = stage === "sliding-in" || stage === "open" || stage === "changing-content";
  let slideOutPanel = stage === "sliding-out";

  // Operations board, projects column transitions based on open/collapsed/sidebar
  if (slidePanel) {
    operationsBoardClass = "sync-transition operations-board-slid";
    projectsColumnClass = "sync-transition projects-column-slid";
  } else if (slideOutPanel) {
    operationsBoardClass = "sync-transition";
    projectsColumnClass = "sync-transition";
  } else {
    operationsBoardClass = "sync-transition";
    projectsColumnClass = "sync-transition";
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
