
import { useCallback, useEffect, useState } from "react";

export type ProjectPanelStage = "closed" | "sliding-in" | "open" | "sliding-out" | "changing-content";

export const useProjectPanelAnimation = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [stage, setStage] = useState<ProjectPanelStage>("closed");
  const [displayedProjectId, setDisplayedProjectId] = useState<string | null>(null);

  // للتحكم في موضع اللوحة بشكل أكثر سلاسة (transform وليس فقط right)
  const [panelTranslateX, setPanelTranslateX] = useState(100); // 100 = خارج الشاشة, 0 = ظاهر بالكامل

  // تابعة مع stage لتحديث الترانسليت حسب الحالة
  useEffect(() => {
    if (stage === "sliding-in" || stage === "changing-content") {
      setPanelTranslateX(0); // إدخال اللوحة
    } else if (stage === "open") {
      setPanelTranslateX(0);
    } else if (stage === "sliding-out") {
      setPanelTranslateX(100); // إخراج اللوحة
    } else if (stage === "closed") {
      setPanelTranslateX(100);
    }
  }, [stage]);

  // فتح مشروع
  const handleProjectSelect = useCallback((projectId: string) => {
    if (stage === "closed" || !selectedProjectId) {
      setSelectedProjectId(projectId);
      setDisplayedProjectId(projectId);
      setStage("sliding-in");
      setTimeout(() => setStage("open"), 500);
    } else if (stage === "open" && displayedProjectId && displayedProjectId !== projectId) {
      setStage("changing-content");
      setTimeout(() => {
        setDisplayedProjectId(projectId);
        setSelectedProjectId(projectId);
        setStage("open");
      }, 350);
    } else if (selectedProjectId === projectId) {
      closePanel();
    }
  }, [stage, selectedProjectId, displayedProjectId]);

  // إغلاق اللوحة
  const closePanel = useCallback(() => {
    setStage("sliding-out");
    setTimeout(() => {
      setStage("closed");
      setSelectedProjectId(null);
      setDisplayedProjectId(null);
    }, 500);
  }, []);

  // كلاس وtransform لحركة اللوحة
  const projectPanelStyle: React.CSSProperties = {
    transform: `translateX(${panelTranslateX}vw)`,
    // سيكون 0vw = ظاهر / 100vw = خارج الشاشة تماما
    transition: "transform var(--animation-duration-main) var(--animation-easing)",
    willChange: "transform, opacity",
  };

  // الإدراجات الأخرى تبقى كما هي!
  let operationsBoardClass = "";
  let projectsColumnClass = "";
  let slidePanel = stage === "sliding-in" || stage === "open" || stage === "changing-content";
  let slideOutPanel = stage === "sliding-out";

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
    projectPanelStyle,
    handleProjectSelect,
    closePanel,
  };
};
