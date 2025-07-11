
import { useCallback } from 'react';

interface UseCanvasEventHandlersProps {
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
}: UseCanvasEventHandlersProps) => {
  
  const handleStartCanvas = useCallback(() => {
    setShowDefaultView(false);
    setSelectedTool('select');
  }, [setShowDefaultView, setSelectedTool]);

  const handleElementSelect = useCallback((elementId: string) => {
    // Handle element selection logic
    console.log('Selected element:', elementId);
  }, []);

  const handleToolChange = useCallback((tool: string) => {
    setSelectedTool(tool);
  }, [setSelectedTool]);

  const handleDeleteElement = useCallback(() => {
    if (selectedElementId) {
      deleteElement(selectedElementId);
    }
  }, [selectedElementId, deleteElement]);

  return {
    handleStartCanvas,
    handleElementSelect,
    handleToolChange,
    handleDeleteElement
  };
};
