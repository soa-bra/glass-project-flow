
import { useState } from 'react';

export const useProjectPanelAnimation = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isPanelFullyOpen, setIsPanelFullyOpen] = useState(false);
  const [projectPanelStage, setProjectPanelStage] = useState<0 | 1>(0); // 0: مغلق, 1: مفتوح
  const [isContentVisible, setIsContentVisible] = useState(false);

  const handleProjectSelect = (projectId: string) => {
    // الحالة 1: إغلاق اللوحة عند الضغط على المشروع المفتوح حالياً
    if (selectedProjectId === projectId) {
      closePanel();
      return;
    }

    // الحالة 2: تبديل المحتوى إذا كانت اللوحة مفتوحة بالفعل لمشروع آخر
    if (selectedProjectId && selectedProjectId !== projectId) {
      setIsContentVisible(false);
      setTimeout(() => {
        setSelectedProjectId(projectId);
        setIsContentVisible(true);
      }, 300); // يتوافق مع مدة تلاشي المحتوى
      return;
    }

    // الحالة 3: فتح اللوحة إذا كانت مغلقة
    setSelectedProjectId(projectId);
    setProjectPanelStage(1);
    setIsPanelFullyOpen(true);
    // يتلاشى المحتوى للظهور بعد انزلاق اللوحة
    setTimeout(() => {
      setIsContentVisible(true);
    }, 500); // تأخير يطابق مدة حركة اللوحة
  };

  const closePanel = () => {
    setIsContentVisible(false);
    setIsPanelFullyOpen(false);
    setProjectPanelStage(0);
    setTimeout(() => {
      setSelectedProjectId(null);
    }, 500); // يطابق مدة الحركة
  };

  let operationsBoardClass = '';
  let projectPanelClass = '';
  const projectsColumnClass = ''; // لم يعد ضرورياً

  if (projectPanelStage === 1) { // اللوحة مفتوحة أو قيد الفتح
    operationsBoardClass = 'opacity-0 -translate-x-full pointer-events-none';
    projectPanelClass = 'project-panel-visible';
  } else { // اللوحة مغلقة أو قيد الإغلاق
    operationsBoardClass = 'opacity-100 translate-x-0';
    projectPanelClass = 'project-panel-hidden';
  }

  // تطبيق حركة انتقالية سلسة على لوحة العمليات
  operationsBoardClass += ' sync-transition';

  return {
    selectedProjectId,
    isPanelFullyOpen,
    isContentVisible, // قيمة جديدة مُرجعة
    operationsBoardClass,
    projectPanelClass,
    projectsColumnClass,
    handleProjectSelect,
    closePanel,
  };
};
