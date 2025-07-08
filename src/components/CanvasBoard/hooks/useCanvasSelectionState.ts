import { useState } from 'react';

export const useCanvasSelectionState = () => {
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [selectedElements, setSelectedElements] = useState<string[]>([]);

  const updateSelectedElements = (elementId: string | null) => {
    if (elementId) {
      setSelectedElements([elementId]);
    } else {
      setSelectedElements([]);
    }
    setSelectedElementId(elementId);
  };

  return {
    selectedElementId,
    setSelectedElementId: updateSelectedElements,
    selectedElements,
    setSelectedElements,
  };
};