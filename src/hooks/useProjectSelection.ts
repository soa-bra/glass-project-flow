
import { useState, useCallback } from 'react';

export const useProjectSelection = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isPanelVisible, setIsPanelVisible] = useState(false);

  const selectProject = useCallback((projectId: string) => {
    setSelectedProjectId(projectId);
    setIsPanelVisible(true);
  }, []);

  const closePanel = useCallback(() => {
    setIsPanelVisible(false);
    // تأخير إزالة المشروع المحدد للسماح بانتهاء الحركة
    setTimeout(() => {
      setSelectedProjectId(null);
    }, 300);
  }, []);

  return {
    selectedProjectId,
    isPanelVisible,
    selectProject,
    closePanel
  };
};
