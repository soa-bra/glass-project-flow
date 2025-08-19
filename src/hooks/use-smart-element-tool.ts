import { useState, useRef, useCallback } from 'react';
import { smartElementsRegistry } from '../lib/smart-elements/smart-elements-registry';

export interface SmartElementToolState {
  isActive: boolean;
  selectedElementType: string | null;
  isDragging: boolean;
  dragStart: { x: number; y: number } | null;
  dragCurrent: { x: number; y: number } | null;
  previewRect: { x: number; y: number; width: number; height: number } | null;
}

export interface UseSmartElementToolProps {
  onElementCreate?: (elementType: string, position: { x: number; y: number }, size: { width: number; height: number }) => void;
  canvasRef: React.RefObject<HTMLElement>;
}

export function useSmartElementTool({ onElementCreate, canvasRef }: UseSmartElementToolProps) {
  const [toolState, setToolState] = useState<SmartElementToolState>({
    isActive: false,
    selectedElementType: null,
    isDragging: false,
    dragStart: null,
    dragCurrent: null,
    previewRect: null
  });

  const longPressTimerRef = useRef<NodeJS.Timeout>();
  const isDragThresholdMetRef = useRef(false);

  // Activate tool with specific element type
  const activateTool = useCallback((elementType: string) => {
    const definition = smartElementsRegistry.getSmartElement(elementType);
    if (!definition) {
      console.error(`Smart element type '${elementType}' not found`);
      return;
    }

    setToolState(prev => ({
      ...prev,
      isActive: true,
      selectedElementType: elementType,
      isDragging: false,
      dragStart: null,
      dragCurrent: null,
      previewRect: null
    }));
  }, []);

  // Deactivate tool
  const deactivateTool = useCallback(() => {
    setToolState({
      isActive: false,
      selectedElementType: null,
      isDragging: false,
      dragStart: null,
      dragCurrent: null,
      previewRect: null
    });
    
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
  }, []);

  // Get canvas coordinates from screen coordinates
  const getCanvasCoordinates = useCallback((screenX: number, screenY: number) => {
    if (!canvasRef.current) return { x: screenX, y: screenY };
    
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: screenX - rect.left,
      y: screenY - rect.top
    };
  }, [canvasRef]);

  // Handle mouse/touch down - start long press detection
  const handlePointerDown = useCallback((event: PointerEvent) => {
    if (!toolState.isActive || !toolState.selectedElementType) return;

    const canvasPos = getCanvasCoordinates(event.clientX, event.clientY);
    isDragThresholdMetRef.current = false;
    
    // Start long press timer (500ms)
    longPressTimerRef.current = setTimeout(() => {
      setToolState(prev => ({
        ...prev,
        isDragging: true,
        dragStart: canvasPos,
        dragCurrent: canvasPos,
        previewRect: {
          x: canvasPos.x,
          y: canvasPos.y,
          width: 0,
          height: 0
        }
      }));
    }, 500);

    // Store initial position for drag threshold check
    setToolState(prev => ({
      ...prev,
      dragStart: canvasPos
    }));
  }, [toolState.isActive, toolState.selectedElementType, getCanvasCoordinates]);

  // Handle mouse/touch move - update preview or cancel long press
  const handlePointerMove = useCallback((event: PointerEvent) => {
    if (!toolState.isActive || !toolState.selectedElementType) return;

    const canvasPos = getCanvasCoordinates(event.clientX, event.clientY);

    // Check if we've moved beyond drag threshold (cancel long press if so)
    if (toolState.dragStart && !toolState.isDragging && !isDragThresholdMetRef.current) {
      const deltaX = Math.abs(canvasPos.x - toolState.dragStart.x);
      const deltaY = Math.abs(canvasPos.y - toolState.dragStart.y);
      
      if (deltaX > 5 || deltaY > 5) {
        isDragThresholdMetRef.current = true;
        if (longPressTimerRef.current) {
          clearTimeout(longPressTimerRef.current);
        }
        return;
      }
    }

    // Update drag preview if we're currently dragging
    if (toolState.isDragging && toolState.dragStart) {
      const startX = Math.min(toolState.dragStart.x, canvasPos.x);
      const startY = Math.min(toolState.dragStart.y, canvasPos.y);
      const width = Math.abs(canvasPos.x - toolState.dragStart.x);
      const height = Math.abs(canvasPos.y - toolState.dragStart.y);

      setToolState(prev => ({
        ...prev,
        dragCurrent: canvasPos,
        previewRect: {
          x: startX,
          y: startY,
          width: Math.max(width, 50), // Minimum size
          height: Math.max(height, 30)
        }
      }));
    }
  }, [toolState.isActive, toolState.selectedElementType, toolState.dragStart, toolState.isDragging, getCanvasCoordinates]);

  // Handle mouse/touch up - create element or cancel
  const handlePointerUp = useCallback((event: PointerEvent) => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }

    if (!toolState.isActive || !toolState.selectedElementType) return;

    // If we were dragging, create the element
    if (toolState.isDragging && toolState.previewRect && onElementCreate) {
      const rect = toolState.previewRect;
      
      // Ensure minimum size
      const finalWidth = Math.max(rect.width, 100);
      const finalHeight = Math.max(rect.height, 60);
      
      onElementCreate(
        toolState.selectedElementType,
        { x: rect.x, y: rect.y },
        { width: finalWidth, height: finalHeight }
      );
    }

    // Reset drag state but keep tool active for more placements
    setToolState(prev => ({
      ...prev,
      isDragging: false,
      dragStart: null,
      dragCurrent: null,
      previewRect: null
    }));
  }, [toolState.isActive, toolState.selectedElementType, toolState.isDragging, toolState.previewRect, onElementCreate]);

  // Handle escape key to deactivate tool
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      deactivateTool();
    }
  }, [deactivateTool]);

  // Keyboard shortcut (S key) to activate with last selected element
  const handleToolShortcut = useCallback((event: KeyboardEvent) => {
    if (event.key === 's' || event.key === 'S') {
      if (toolState.selectedElementType) {
        if (toolState.isActive) {
          deactivateTool();
        } else {
          activateTool(toolState.selectedElementType);
        }
      }
    }
  }, [toolState.isActive, toolState.selectedElementType, activateTool, deactivateTool]);

  return {
    toolState,
    activateTool,
    deactivateTool,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleKeyDown,
    handleToolShortcut,
    isToolActive: toolState.isActive,
    selectedElementType: toolState.selectedElementType,
    previewRect: toolState.previewRect
  };
}
