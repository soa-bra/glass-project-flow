import { useState, useRef, useCallback, useEffect } from 'react';
import { CanvasElement, CanvasLayer, CanvasTheme } from '../types/index';
import { CANVAS_THEMES } from '../constants/index';

interface EnhancedCanvasState {
  // Basic state
  showDefaultView: boolean;
  setShowDefaultView: (show: boolean) => void;
  
  // Selection state
  selectedElementId: string | null;
  setSelectedElementId: (id: string | null) => void;
  selectedElementIds: string[];
  selectedSmartElement: any;
  setSelectedSmartElement: (element: any) => void;
  
  // Tool state
  selectedTool: string;
  setSelectedTool: (tool: string) => void;
  selectedPenMode: string;
  setSelectedPenMode: (mode: string) => void;
  
  // Canvas state
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
  snapEnabled: boolean;
  setSnapEnabled: (enabled: boolean) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  canvasPosition: { x: number; y: number } | null;
  setCanvasPosition: (position: { x: number; y: number }) => void;
  panSpeed: number;
  setPanSpeed: (speed: number) => void;
  
  // Drawing state
  isDrawing: boolean;
  drawStart: { x: number; y: number } | null;
  drawEnd: { x: number; y: number } | null;
  isDragging: boolean;
  isResizing: boolean;
  isSelecting: boolean;
  selectionBox: any;
  lineWidth: number;
  setLineWidth: (width: number) => void;
  lineStyle: string;
  setLineStyle: (style: string) => void;
  
  // Grid state
  gridSize: number;
  handleGridSizeChange: (size: number) => void;
  handleAlignToGrid: () => void;
  
  // Elements and layers
  elements: CanvasElement[];
  layers: CanvasLayer[];
  selectedLayerId: string;
  
  // Canvas ref
  canvasRef: React.RefObject<HTMLCanvasElement>;
  
  // History
  history: any[];
  historyIndex: number;
  undo: () => void;
  redo: () => void;
  
  // Event handlers
  handleCanvasClick: (e: React.MouseEvent) => void;
  handleCanvasMouseDown: (e: React.MouseEvent) => void;
  handleCanvasMouseMove: (e: React.MouseEvent) => void;
  handleCanvasMouseUp: (e: React.MouseEvent) => void;
  handleElementMouseDown: (e: React.MouseEvent, elementId: string) => void;
  handleElementMouseMove: (e: React.MouseEvent) => void;
  handleElementMouseUp: (e: React.MouseEvent) => void;
  handleResizeMouseDown: (e: React.MouseEvent) => void;
  handleResizeMouseMove: (e: React.MouseEvent) => void;
  
  // Layer operations
  handleLayerUpdate: (layerId: string, updates: Partial<CanvasLayer>) => void;
  handleLayerSelect: (layerId: string) => void;
  
  // Element operations
  updateElement: (elementId: string, updates: Partial<CanvasElement>) => void;
  deleteElement: (elementId: string) => void;
  handleCopy: () => void;
  handleCut: () => void;
  handlePaste: () => void;
  handleGroup: () => void;
  handleUngroup: () => void;
  handleLock: () => void;
  handleUnlock: () => void;
  
  // Canvas operations
  saveCanvas: () => void;
  exportCanvas: () => void;
}

export const useEnhancedCanvasState = (projectId: string, userId: string): EnhancedCanvasState => {
  // Basic state
  const [showDefaultView, setShowDefaultView] = useState(true);
  
  // Selection state
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [selectedElementIds, setSelectedElementIds] = useState<string[]>([]);
  const [selectedSmartElement, setSelectedSmartElement] = useState<any>(null);
  
  // Tool state
  const [selectedTool, setSelectedTool] = useState('select');
  const [selectedPenMode, setSelectedPenMode] = useState('pen');
  
  // Canvas state
  const [showGrid, setShowGrid] = useState(false);
  const [snapEnabled, setSnapEnabled] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [canvasPosition, setCanvasPosition] = useState<{ x: number; y: number } | null>({ x: 0, y: 0 });
  const [panSpeed, setPanSpeed] = useState(1);
  
  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [drawEnd, setDrawEnd] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionBox, setSelectionBox] = useState<any>(null);
  const [lineWidth, setLineWidth] = useState(2);
  const [lineStyle, setLineStyle] = useState('solid');
  
  // Grid state
  const [gridSize, setGridSize] = useState(20);
  
  // Elements and layers
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [layers, setLayers] = useState<CanvasLayer[]>([
    {
      id: 'layer-1',
      name: 'الطبقة الأساسية',
      visible: true,
      locked: false,
      opacity: 1,
      elements: [],
      order: 1
    }
  ]);
  const [selectedLayerId, setSelectedLayerId] = useState('layer-1');
  
  // Canvas ref
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // History
  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Update selected element IDs when single selection changes
  useEffect(() => {
    if (selectedElementId) {
      setSelectedElementIds([selectedElementId]);
    } else {
      setSelectedElementIds([]);
    }
  }, [selectedElementId]);
  
  // Event handlers
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (selectedTool === 'select') {
      setSelectedElementId(null);
    }
  }, [selectedTool]);
  
  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (selectedTool === 'select') {
      setIsSelecting(true);
    }
  }, [selectedTool]);
  
  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    // Handle canvas mouse move
  }, []);
  
  const handleCanvasMouseUp = useCallback((e: React.MouseEvent) => {
    setIsDrawing(false);
    setIsDragging(false);
    setIsResizing(false);
    setIsSelecting(false);
  }, []);
  
  const handleElementMouseDown = useCallback((e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    setSelectedElementId(elementId);
    setIsDragging(true);
  }, []);
  
  const handleElementMouseMove = useCallback((e: React.MouseEvent) => {
    // Handle element mouse move
  }, []);
  
  const handleElementMouseUp = useCallback((e: React.MouseEvent) => {
    setIsDragging(false);
  }, []);
  
  const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
  }, []);
  
  const handleResizeMouseMove = useCallback((e: React.MouseEvent) => {
    // Handle resize mouse move
  }, []);
  
  // Grid operations
  const handleGridSizeChange = useCallback((size: number) => {
    setGridSize(size);
  }, []);
  
  const handleAlignToGrid = useCallback(() => {
    // Implement align to grid logic
  }, []);
  
  // Layer operations
  const handleLayerUpdate = useCallback((layerId: string, updates: Partial<CanvasLayer>) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, ...updates } : layer
    ));
  }, []);
  
  const handleLayerSelect = useCallback((layerId: string) => {
    setSelectedLayerId(layerId);
  }, []);
  
  // Element operations
  const updateElement = useCallback((elementId: string, updates: Partial<CanvasElement>) => {
    setElements(prev => prev.map(element => 
      element.id === elementId ? { ...element, ...updates } : element
    ));
  }, []);
  
  const deleteElement = useCallback((elementId: string) => {
    setElements(prev => prev.filter(element => element.id !== elementId));
    if (selectedElementId === elementId) {
      setSelectedElementId(null);
    }
  }, [selectedElementId]);
  
  const handleCopy = useCallback(() => {
    // Implement copy logic
  }, []);
  
  const handleCut = useCallback(() => {
    // Implement cut logic
  }, []);
  
  const handlePaste = useCallback(() => {
    // Implement paste logic
  }, []);
  
  const handleGroup = useCallback(() => {
    // Implement group logic
  }, []);
  
  const handleUngroup = useCallback(() => {
    // Implement ungroup logic
  }, []);
  
  const handleLock = useCallback(() => {
    // Implement lock logic
  }, []);
  
  const handleUnlock = useCallback(() => {
    // Implement unlock logic
  }, []);
  
  // History operations
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
    }
  }, [historyIndex]);
  
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
    }
  }, [historyIndex, history.length]);
  
  // Canvas operations
  const saveCanvas = useCallback(() => {
    // Implement save logic
    console.log('حفظ الكانفاس');
  }, []);
  
  const exportCanvas = useCallback(() => {
    // Implement export logic
    console.log('تصدير الكانفاس');
  }, []);
  
  return {
    // Basic state
    showDefaultView,
    setShowDefaultView,
    
    // Selection state
    selectedElementId,
    setSelectedElementId,
    selectedElementIds,
    selectedSmartElement,
    setSelectedSmartElement,
    
    // Tool state
    selectedTool,
    setSelectedTool,
    selectedPenMode,
    setSelectedPenMode,
    
    // Canvas state
    showGrid,
    setShowGrid,
    snapEnabled,
    setSnapEnabled,
    zoom,
    setZoom,
    canvasPosition,
    setCanvasPosition,
    panSpeed,
    setPanSpeed,
    
    // Drawing state
    isDrawing,
    drawStart,
    drawEnd,
    isDragging,
    isResizing,
    isSelecting,
    selectionBox,
    lineWidth,
    setLineWidth,
    lineStyle,
    setLineStyle,
    
    // Grid state
    gridSize,
    handleGridSizeChange,
    handleAlignToGrid,
    
    // Elements and layers
    elements,
    layers,
    selectedLayerId,
    
    // Canvas ref
    canvasRef,
    
    // History
    history,
    historyIndex,
    undo,
    redo,
    
    // Event handlers
    handleCanvasClick,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    handleElementMouseDown,
    handleElementMouseMove,
    handleElementMouseUp,
    handleResizeMouseDown,
    handleResizeMouseMove,
    
    // Layer operations
    handleLayerUpdate,
    handleLayerSelect,
    
    // Element operations
    updateElement,
    deleteElement,
    handleCopy,
    handleCut,
    handlePaste,
    handleGroup,
    handleUngroup,
    handleLock,
    handleUnlock,
    
    // Canvas operations
    saveCanvas,
    exportCanvas
  };
};