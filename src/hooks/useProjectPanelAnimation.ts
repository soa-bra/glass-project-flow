
import { useState } from 'react';

export const useProjectPanelAnimation = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isPanelFullyOpen, setIsPanelFullyOpen] = useState(false);
  const [projectPanelStage, setProjectPanelStage] = useState<0 | 1 | 2 | 3 | 4 | 5 | 6>(0);

  const handleProjectSelect = (projectId: string) => {
    if (selectedProjectId === projectId) {
      setProjectPanelStage(0);
      setTimeout(() => {
        setSelectedProjectId(null);
        setIsPanelFullyOpen(false);
      }, 700);
      return;
    }
    setSelectedProjectId(projectId);
    setProjectPanelStage(1);
    setTimeout(() => setProjectPanelStage(2), 90);
    setTimeout(() => setProjectPanelStage(3), 210);
    setTimeout(() => setProjectPanelStage(4), 320);
    setTimeout(() => setProjectPanelStage(5), 490);
    setTimeout(() => { setProjectPanelStage(6); setIsPanelFullyOpen(true); }, 650);
  };

  const closePanel = () => {
    setProjectPanelStage(0);
    setTimeout(() => {
      setSelectedProjectId(null);
      setIsPanelFullyOpen(false);
    }, 700);
  };

  let operationsBoardClass = '';
  let projectPanelClass = '';
  let projectsColumnClass = '';

  if (selectedProjectId) {
    if (projectPanelStage === 1) {
      operationsBoardClass = 'z-30 sync-transition translate-x-0 scale-x-100 opacity-100';
      projectPanelClass = 'project-panel-frame1';
    } else if (projectPanelStage === 2) {
      operationsBoardClass = 'z-30 sync-transition translate-x-0 scale-x-100 opacity-100';
      projectPanelClass = 'project-panel-frame2';
    } else if (projectPanelStage === 3) {
      operationsBoardClass = 'z-30 sync-transition translate-x-[22vw] scale-x-95 opacity-95';
      projectPanelClass = 'project-panel-frame3';
    } else if (projectPanelStage === 4) {
      operationsBoardClass = 'z-30 sync-transition translate-x-[34vw] scale-x-75 opacity-65';
      projectPanelClass = 'project-panel-frame4';
    } else if (projectPanelStage === 5) {
      operationsBoardClass = 'z-30 sync-transition translate-x-[46vw] scale-x-35 opacity-40';
      projectPanelClass = 'project-panel-frame5';
    } else if (projectPanelStage === 6) {
      operationsBoardClass = 'z-10 sync-transition opacity-0 pointer-events-none';
      projectPanelClass = 'project-panel-frame6';
    }
  }

  return {
    selectedProjectId,
    isPanelFullyOpen,
    operationsBoardClass,
    projectPanelClass,
    projectsColumnClass,
    handleProjectSelect,
    closePanel,
  };
};
