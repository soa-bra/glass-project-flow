
import { useCallback } from 'react';
import { CanvasElement } from '../types';

export const useCanvasFileActions = (
  projectId: string,
  userId: string,
  elements: CanvasElement[]
) => {
  const saveCanvas = useCallback(() => {
    const canvasData = {
      projectId,
      userId,
      elements,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(`canvas_${projectId}`, JSON.stringify(canvasData));
  }, [projectId, userId, elements]);

  const exportCanvas = useCallback(() => {
    const dataStr = JSON.stringify(elements, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `canvas_${projectId}_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [projectId, elements]);

  return {
    saveCanvas,
    exportCanvas
  };
};
