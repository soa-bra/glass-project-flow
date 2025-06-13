
import { useState, useCallback } from 'react';

export const useProjectSelection = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isPanelVisible, setIsPanelVisible] = useState(false);

  const closePanel = useCallback(() => {
    setIsPanelVisible(false);
    // تأخير إزالة المشروع المحدد للسماح بانتهاء الحركة
    setTimeout(() => {
      setSelectedProjectId(null);
    }, 300);
  }, []);

  const selectProject = useCallback((projectId: string) => {
    console.log('تحديد المشروع:', projectId);
    setSelectedProjectId(projectId);
    setIsPanelVisible(true);
  }, []);

  const toggleProject = useCallback((projectId: string) => {
    console.log('تبديل المشروع:', projectId, 'المحدد حالياً:', selectedProjectId);
    if (selectedProjectId === projectId) {
      // إلغاء التحديد إذا كان المشروع محدد بالفعل
      console.log('إلغاء تحديد المشروع');
      closePanel();
    } else {
      // تحديد مشروع جديد
      console.log('تحديد مشروع جديد');
      selectProject(projectId);
    }
  }, [selectedProjectId, selectProject, closePanel]);

  return {
    selectedProjectId,
    isPanelVisible,
    selectProject,
    toggleProject,
    closePanel
  };
};
