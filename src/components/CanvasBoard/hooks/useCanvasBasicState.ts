import { useState, useCallback, useRef } from 'react';

export const useCanvasBasicState = () => {
  // Canvas ref - centralized here to avoid conflicts
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const [selectedTool, setSelectedTool] = useState<string>('select');
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [snapEnabled, setSnapEnabled] = useState<boolean>(true);
  const [gridSize, setGridSize] = useState<number>(20);
  const [showDefaultView, setShowDefaultView] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [zoom, setZoom] = useState<number>(100);
  const [canvasPosition, setCanvasPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [selectedSmartElement, setSelectedSmartElement] = useState<string>('brainstorm');

  // Layers state
  const [layers, setLayers] = useState([
    { id: 'layer-1', name: 'الطبقة الأساسية', visible: true, locked: false, elements: [] }
  ]);
  const [selectedLayerId, setSelectedLayerId] = useState<string>('layer-1');

  // Update selectedElements when selectedElementId changes
  const updateSelectedElements = useCallback((elementId: string | null) => {
    if (elementId) {
      setSelectedElements([elementId]);
    } else {
      setSelectedElements([]);
    }
    setSelectedElementId(elementId);
  }, []);

  return {
    // Canvas ref
    canvasRef,
    
    // State
    selectedTool,
    selectedElementId,
    selectedElements,
    showGrid,
    snapEnabled,
    gridSize,
    showDefaultView,
    searchQuery,
    zoom,
    canvasPosition,
    selectedSmartElement,
    layers,
    selectedLayerId,

    // Setters
    setSelectedTool,
    setSelectedElementId: updateSelectedElements,
    setSelectedElements,
    setShowGrid,
    setSnapEnabled,
    setGridSize,
    setShowDefaultView,
    setSearchQuery,
    setZoom,
    setCanvasPosition,
    setSelectedSmartElement,
    setLayers,
    setSelectedLayerId,

    // Helper functions
    handleGridSizeChange: (size: number) => setGridSize(size),
    handleLayerUpdate: (newLayers: any[]) => setLayers(newLayers),
    handleLayerSelect: (layerId: string) => setSelectedLayerId(layerId),
  };
};