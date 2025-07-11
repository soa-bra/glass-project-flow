import { useCallback } from 'react';

interface CanvasEventHandlersProps {
  selectedElementId: string | null;
  setSelectedSmartElement: (element: any) => void;
  setShowDefaultView: (show: boolean) => void;
  setSelectedTool: (tool: string) => void;
  deleteElement: (elementId: string) => void;
}

export const useCanvasEventHandlers = ({
  selectedElementId,
  setSelectedSmartElement,
  setShowDefaultView,
  setSelectedTool,
  deleteElement
}: CanvasEventHandlersProps) => {
  
  const handleStartCanvas = useCallback(() => {
    setShowDefaultView(false);
    setSelectedTool('select');
  }, [setShowDefaultView, setSelectedTool]);
  
  const handleSmartElementSelect = useCallback((element: any) => {
    setSelectedSmartElement(element);
  }, [setSelectedSmartElement]);
  
  const handleDeleteSelected = useCallback(() => {
    if (selectedElementId) {
      deleteElement(selectedElementId);
    }
  }, [selectedElementId, deleteElement]);
  
  const handleSettings = useCallback(() => {
    console.log('فتح الإعدادات');
  }, []);
  
  return {
    handleStartCanvas,
    handleSmartElementSelect,
    handleDeleteSelected,
    handleSettings
  };
};