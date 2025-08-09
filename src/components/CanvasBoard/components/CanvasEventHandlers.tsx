import React from 'react';

interface CanvasEventHandlersProps {
  selectedElementId: string | null;
  setSelectedSmartElement: (elementId: string) => void;
  setShowDefaultView: (show: boolean) => void;
  setSelectedTool: (tool: string) => void;
  deleteElement: (elementId: string) => void;
}

export const useCanvasUIActions = ({
  selectedElementId,
  setSelectedSmartElement,
  setShowDefaultView,
  setSelectedTool,
  deleteElement
}: CanvasEventHandlersProps) => {
  const handleSmartElementSelect = (elementId: string) => {
    setSelectedSmartElement(elementId);
  };

  const handleCopy = () => {
    if (selectedElementId) {
      // Copy functionality
    }
  };

  const handleCut = () => {
    if (selectedElementId) {
      // Cut functionality
    }
  };

  const handlePaste = () => {
    // Paste functionality
  };

  const handleStartCanvas = () => {
    setShowDefaultView(false);
    setSelectedTool('select');
  };

  const handleSettings = () => {
    // Open settings
  };

  const handleDeleteSelected = () => {
    if (selectedElementId) {
      deleteElement(selectedElementId);
    }
  };

  return {
    handleSmartElementSelect,
    handleCopy,
    handleCut,
    handlePaste,
    handleStartCanvas,
    handleSettings,
    handleDeleteSelected
  };
};