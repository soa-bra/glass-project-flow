
import { useState, useCallback } from 'react';

export const useProjectSelection = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isPanelVisible, setIsPanelVisible] = useState(false);

  const closePanel = useCallback(() => {
    console.log('إغلاق اللوحة - isPanelVisible:', true, '-> false');
    setIsPanelVisible(false);
    // تأخير إزالة المشروع المحدد للسماح بانتهاء الحركة
    setTimeout(() => {
      console.log('إزالة المشروع المحدد بعد التأخير');
      setSelectedProjectId(null);
    }, 300);
  }, []);

  const selectProject = useCallback((projectId: string) => {
    console.log('تحديد المشروع:', projectId);
    setSelectedProjectId(projectId);
    // إضافة تأخير صغير لضمان عرض اللوحة بعد تحديد المشروع
    setTimeout(() => {
      console.log('عرض اللوحة - isPanelVisible:', false, '-> true');
      setIsPanelVisible(true);
    }, 50);
  }, []);

  const toggleProject = useCallback((projectId: string) => {
    console.log('تبديل المشروع:', projectId, 'المحدد حالياً:', selectedProjectId, 'مرئية:', isPanelVisible);
    
    if (selectedProjectId === projectId && isPanelVisible) {
      // إلغاء التحديد إذا كان المشروع محدد ومرئي بالفعل
      console.log('إلغاء تحديد المشروع');
      closePanel();
    } else {
      // تحديد مشروع جديد أو إعادة فتح نفس المشروع
      console.log('تحديد مشروع جديد أو إعادة فتح');
      selectProject(projectId);
    }
  }, [selectedProjectId, isPanelVisible, selectProject, closePanel]);

  console.log('useProjectSelection state - selectedProjectId:', selectedProjectId, 'isPanelVisible:', isPanelVisible);

  return {
    selectedProjectId,
    isPanelVisible,
    selectProject,
    toggleProject,
    closePanel
  };
};
