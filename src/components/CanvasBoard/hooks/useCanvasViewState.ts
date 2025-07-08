import { useState } from 'react';

export const useCanvasViewState = () => {
  const [zoom, setZoom] = useState<number>(100);
  const [canvasPosition, setCanvasPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [snapEnabled, setSnapEnabled] = useState<boolean>(true);
  const [gridSize, setGridSize] = useState<number>(20);

  return {
    zoom,
    setZoom,
    canvasPosition,
    setCanvasPosition,
    showGrid,
    setShowGrid,
    snapEnabled,
    setSnapEnabled,
    gridSize,
    setGridSize,
  };
};