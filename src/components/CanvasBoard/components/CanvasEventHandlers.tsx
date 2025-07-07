import React from 'react';

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
  const handleSmartElementSelect = (elementId: string) => {
    console.log('🎯 Smart element selected:', elementId);
    setSelectedSmartElement(elementId);
    // العنصر الذكي محدد، سيتم استخدامه عند النقر على الكانفاس
  };

  const handleCopy = () => {
    if (selectedElementId) {
      console.log('نسخ العنصر:', selectedElementId);
    }
  };

  const handleCut = () => {
    if (selectedElementId) {
      console.log('قص العنصر:', selectedElementId);
    }
  };

  const handlePaste = () => {
    console.log('لصق العنصر');
  };

  const handleStartCanvas = () => {
    setShowDefaultView(false);
    setSelectedTool('select');
  };

  const handleSettings = () => {
    console.log('فتح الإعدادات');
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