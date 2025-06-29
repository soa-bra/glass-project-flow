
import { useCallback, useState } from "react";

export type DepartmentPanelStage = "closed" | "sliding-in" | "open" | "sliding-out" | "changing-content";

export const useDepartmentPanelAnimation = () => {
  // Track which department is currently animating in the panel
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);
  // Stage of the panel animation
  const [stage, setStage] = useState<DepartmentPanelStage>("closed");
  // To support crossfade when switching between departments while panel open
  const [displayedDepartmentId, setDisplayedDepartmentId] = useState<string | null>(null);

  // To close with slide-out
  const closePanel = useCallback(() => {
    setStage("sliding-out");
    setTimeout(() => {
      setStage("closed");
      setSelectedDepartmentId(null);
      setDisplayedDepartmentId(null);
    }, 500); // match animation duration
  }, []);

  // When the panel is opened for a department
  const handleDepartmentSelect = useCallback(
    (departmentId: string) => {
    // If panel is closed, start slide-in for the department
    if (stage === "closed" || !selectedDepartmentId) {
      setSelectedDepartmentId(departmentId);
      setDisplayedDepartmentId(departmentId);
      setStage("sliding-in");
      setTimeout(() => setStage("open"), 500); // match animation duration in css
    } else if (stage === "open" && displayedDepartmentId && displayedDepartmentId !== departmentId) {
      // If panel is open and user selects a new department, use crossfade effect ("changing-content")
      setStage("changing-content");
      setTimeout(() => {
        setDisplayedDepartmentId(departmentId);
        setSelectedDepartmentId(departmentId);
        setStage("open");
      }, 350); // crossfade duration
    } else if (selectedDepartmentId === departmentId) {
      // Clicking the same department closes the panel
      closePanel();
    }
  }, [stage, selectedDepartmentId, displayedDepartmentId, closePanel]);

  // Animation classes
  let operationsBoardClass = "";
  let departmentsColumnClass = "";
  const slidePanel =
    stage === "sliding-in" || stage === "open" || stage === "changing-content";
  const slideOutPanel = stage === "sliding-out";

  // Operations board, departments column transitions based on open/collapsed/sidebar
  if (slidePanel) {
    operationsBoardClass = "sync-transition operations-board-slid";
    departmentsColumnClass = "sync-transition departments-column-slid";
  } else if (slideOutPanel) {
    operationsBoardClass = "sync-transition";
    departmentsColumnClass = "sync-transition";
  } else {
    operationsBoardClass = "sync-transition";
    departmentsColumnClass = "sync-transition";
  }

  return {
    panelStage: stage,
    selectedDepartmentId,
    displayedDepartmentId,
    operationsBoardClass,
    departmentsColumnClass,
    handleDepartmentSelect,
    closePanel,
  };
};
