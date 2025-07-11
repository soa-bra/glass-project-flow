
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Canvas as FabricCanvas, Circle, Rect, Textbox, Line, Path, FabricObject, Point } from 'fabric';
import { toast } from 'sonner';
import { CanvasElement, Tool } from '../types/index';

interface PerformanceOptimizedCanvasProps {
  selectedTool: string;
  selectedElementIds: string[];
  onElementSelect: (elementId: string) => void;
  onElementsChange: (elements: CanvasElement[]) => void;
  zoom: number;
  canvasPosition: { x: number; y: number };
  showGrid: boolean;
  snapEnabled: boolean;
  onCanvasReady?: (canvas: FabricCanvas) => void;
  theme: any;
}

const PerformanceOptimizedCanvas: React.FC<PerformanceOptimizedCanvasProps> = ({
  selectedTool,
  selectedElementIds,
  onElementSelect,
  onElementsChange,
  zoom,
  canvasPosition,
  showGrid,
  snapEnabled,
  onCanvasReady,
  theme
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeColor, setActiveColor] = useState('#000000');
  const [brushWidth, setBrushWidth] = useState(2);
  const [isInitialized, setIsInitialized] = useState(false);

  // Memoized canvas dimensions for performance
  const canvasDimensions = useMemo(() => ({
    width: Math.max(window.innerWidth - 100, 800),
    height: Math.max(window.innerHeight - 200, 600)
  }), []);

  // Initialize Fabric.js canvas with enhanced performance settings
  const initializeCanvas = useCallback(() => {
    if (!canvasRef.current || isInitialized) return null;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: canvasDimensions.width,
      height: canvasDimensions.height,
      backgroundColor: theme?.colors?.background || '#ffffff',
      selection: true,
      preserveObjectStacking: true,
      renderOnAddRemove: false, // Performance optimization
      skipTargetFind: false,
      imageSmoothingEnabled: true,
    });

    // Enhanced brush initialization with error handling
    try {
      canvas.isDrawingMode = true;
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = activeColor;
        canvas.freeDrawingBrush.width = brushWidth;
      }
      canvas.isDrawingMode = false;
    } catch (error) {
      console.warn('Brush initialization failed, using fallback:', error);
    }

    // Performance optimizations
    canvas.enableRetinaScaling = true;
    canvas.skipOffscreen = true;

    setIsInitialized(true);
    return canvas;
  }, [canvasDimensions, theme, activeColor, brushWidth, isInitialized]);

  useEffect(() => {
    const canvas = initializeCanvas();
    if (!canvas) return;

    // Add grid if enabled
    if (showGrid) {
      addGridToCanvas(canvas);
    }

    // Enhanced object selection events with debouncing
    let selectionTimeout: NodeJS.Timeout;
    
    canvas.on('selection:created', (e) => {
      clearTimeout(selectionTimeout);
      selectionTimeout = setTimeout(() => {
        if (e.selected && e.selected.length > 0) {
          const selectedObject = e.selected[0];
          const objectId = (selectedObject as any).objectId || `object-${Date.now()}`;
          onElementSelect(objectId);
        }
      }, 50);
    });

    canvas.on('selection:updated', (e) => {
      clearTimeout(selectionTimeout);
      selectionTimeout = setTimeout(() => {
        if (e.selected && e.selected.length > 0) {
          const selectedObject = e.selected[0];
          const objectId = (selectedObject as any).objectId || `object-${Date.now()}`;
          onElementSelect(objectId);
        }
      }, 50);
    });

    setFabricCanvas(canvas);
    onCanvasReady?.(canvas);
    toast.success('Canvas ready with enhanced performance!');

    // Optimized resize handler with debouncing
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const newWidth = Math.max(window.innerWidth - 100, 800);
        const newHeight = Math.max(window.innerHeight - 200, 600);
        canvas.setDimensions({ width: newWidth, height: newHeight });
        canvas.renderAll();
      }, 100);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(selectionTimeout);
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
      canvas.dispose();
      setIsInitialized(false);
    };
  }, [initializeCanvas, showGrid, onElementSelect, onCanvasReady]);

  // Optimized tool switching with performance considerations
  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = false;
    fabricCanvas.selection = true;

    switch (selectedTool) {
      case 'pen':
      case 'draw':
        fabricCanvas.isDrawingMode = true;
        if (fabricCanvas.freeDrawingBrush) {
          fabricCanvas.freeDrawingBrush.color = activeColor;
          fabricCanvas.freeDrawingBrush.width = brushWidth;
        }
        break;
      case 'select':
        fabricCanvas.selection = true;
        break;
      case 'hand':
        fabricCanvas.selection = false;
        break;
    }
  }, [selectedTool, fabricCanvas, activeColor, brushWidth]);

  // Optimized zoom handling with requestAnimationFrame
  useEffect(() => {
    if (!fabricCanvas) return;
    
    const zoomLevel = zoom / 100;
    requestAnimationFrame(() => {
      fabricCanvas.setZoom(zoomLevel);
      fabricCanvas.renderAll();
    });
  }, [zoom, fabricCanvas]);

  // Optimized pan handling
  useEffect(() => {
    if (!fabricCanvas) return;
    
    requestAnimationFrame(() => {
      const point = new Point(canvasPosition.x, canvasPosition.y);
      fabricCanvas.absolutePan(point);
    });
  }, [canvasPosition, fabricCanvas]);

  // Optimized grid rendering with caching
  const addGridToCanvas = useCallback((canvas: FabricCanvas) => {
    const gridSize = 20;
    const canvasWidth = canvas.width || canvasDimensions.width;
    const canvasHeight = canvas.height || canvasDimensions.height;

    // Remove existing grid efficiently
    const existingGrid = canvas.getObjects().filter(obj => (obj as any).isGrid === true);
    canvas.remove(...existingGrid);

    // Batch grid creation for performance
    const gridLines: Line[] = [];

    // Vertical lines
    for (let i = 0; i <= canvasWidth; i += gridSize) {
      const line = new Line([i, 0, i, canvasHeight], {
        stroke: 'hsl(var(--muted))',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        excludeFromExport: true,
      });
      (line as any).isGrid = true;
      gridLines.push(line);
    }

    // Horizontal lines
    for (let i = 0; i <= canvasHeight; i += gridSize) {
      const line = new Line([0, i, canvasWidth, i], {
        stroke: 'hsl(var(--muted))',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        excludeFromExport: true,
      });
      (line as any).isGrid = true;
      gridLines.push(line);
    }

    // Add all grid lines at once for better performance
    canvas.add(...gridLines);
    canvas.renderAll();
  }, [canvasDimensions]);

  // Handle grid visibility with performance optimization
  useEffect(() => {
    if (!fabricCanvas) return;

    if (showGrid) {
      addGridToCanvas(fabricCanvas);
    } else {
      const gridLines = fabricCanvas.getObjects().filter(obj => (obj as any).isGrid === true);
      if (gridLines.length > 0) {
        fabricCanvas.remove(...gridLines);
        fabricCanvas.renderAll();
      }
    }
  }, [showGrid, fabricCanvas, addGridToCanvas]);

  return (
    <div className="relative w-full h-full bg-background rounded-lg overflow-hidden shadow-lg animate-fade-in">
      <canvas
        ref={canvasRef}
        className="block transition-all duration-200"
        style={{
          cursor: selectedTool === 'hand' ? 'grab' : selectedTool === 'pen' ? 'crosshair' : 'default'
        }}
      />
      
      {/* Enhanced status overlay with animations */}
      <div className="absolute top-4 left-4 bg-background/95 backdrop-blur-sm rounded-md p-3 shadow-sm animate-slide-in-right">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span>Active</span>
          </div>
          <span>•</span>
          <span>Zoom: {Math.round(zoom)}%</span>
          <span>•</span>
          <span>Tool: {selectedTool}</span>
          {fabricCanvas && (
            <>
              <span>•</span>
              <span>Objects: {fabricCanvas.getObjects().filter(obj => !(obj as any).isGrid).length}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerformanceOptimizedCanvas;
