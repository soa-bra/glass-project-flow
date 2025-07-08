import { useState } from 'react';

export const useCanvasToolState = () => {
  const [selectedTool, setSelectedTool] = useState<string>('select');
  const [selectedSmartElement, setSelectedSmartElement] = useState<string>('brainstorm');
  const [showDefaultView, setShowDefaultView] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  return {
    selectedTool,
    setSelectedTool,
    selectedSmartElement,
    setSelectedSmartElement,
    showDefaultView,
    setShowDefaultView,
    searchQuery,
    setSearchQuery,
  };
};