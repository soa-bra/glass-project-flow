import { useCallback } from 'react';
import { CanvasElement } from '../types';
import { toast } from 'sonner';

export const useCanvasActions = (projectId: string, userId: string) => {
  const saveCanvas = useCallback((elements: CanvasElement[]) => {
    const canvasData = {
      projectId,
      userId,
      elements,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(`canvas_${projectId}`, JSON.stringify(canvasData));
    toast.success('تم حفظ اللوحة');
  }, [projectId, userId]);

  const exportCanvas = useCallback((elements: CanvasElement[]) => {
    const dataStr = JSON.stringify(elements, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `canvas_${projectId}_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    toast.success('تم تصدير اللوحة');
  }, [projectId]);

  const convertToProject = useCallback((elements: CanvasElement[]) => {
    if (elements.length === 0) {
      toast.error('لا توجد عناصر للتحويل');
      return;
    }
    
    const projectData = {
      name: `مشروع من اللوحة ${new Date().toLocaleDateString('ar')}`,
      elements: elements.filter(el => el.type !== 'shape'),
      createdAt: new Date().toISOString()
    };
    
    console.log('تحويل العناصر إلى مشروع:', projectData);
    toast.success('تم تحويل العناصر إلى مشروع');
  }, []);

  return {
    saveCanvas,
    exportCanvas,
    convertToProject
  };
};