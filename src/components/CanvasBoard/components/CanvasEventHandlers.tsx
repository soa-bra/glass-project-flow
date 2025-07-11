
import { useCallback } from 'react';

interface CanvasEventHandlersProps {
  selectedElementId: string | null;
  setSelectedSmartElement: (elementId: string) => void;
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
  const handleSmartElementSelect = useCallback((elementId: string) => {
    setSelectedSmartElement(elementId);
  }, [setSelectedSmartElement]);

  const handleStartCanvas = useCallback(() => {
    setShowDefaultView(false);
    setSelectedTool('select');
  }, [setShowDefaultView, setSelectedTool]);

  const handleSettings = useCallback(() => {
    // Settings functionality can be added here
  }, []);

  const handleDeleteSelected = useCallback(() => {
    if (selectedElementId) {
      deleteElement(selectedElementId);
    }
  }, [selectedElementId, deleteElement]);

  return {
    handleSmartElementSelect,
    handleStartCanvas,
    handleSettings,
    handleDeleteSelected
  };
};
