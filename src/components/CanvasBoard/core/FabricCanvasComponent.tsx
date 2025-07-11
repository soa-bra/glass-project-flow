import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas as FabricCanvas, Circle, Rect, Textbox, Line, Path, FabricObject, Point } from 'fabric';
import { toast } from 'sonner';
import { CanvasElement, Tool } from '../types/index';

interface FabricCanvasComponentProps {
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

const FabricCanvasComponent: React.FC<FabricCanvasComponentProps> = ({
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
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [brushWidth, setBrushWidth] = useState(2);

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 1200,
      height: 800,
      backgroundColor: theme?.colors?.background || '#ffffff',
      selection: true,
    });

    // Configure drawing brush
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = currentColor;
      canvas.freeDrawingBrush.width = brushWidth;
    }

    // Add grid if enabled
    if (showGrid) {
      addGridToCanvas(canvas);
    }

    setFabricCanvas(canvas);
    onCanvasReady?.(canvas);
    toast.success('Canvas ready!');

    return () => {
      canvas.dispose();
    };
  }, []);

  // Handle tool changes
  useEffect(() => {
    if (!fabricCanvas) return;

    // Reset drawing mode
    fabricCanvas.isDrawingMode = false;
    fabricCanvas.selection = true;

    switch (selectedTool) {
      case 'smart-pen':
      case 'draw':
        fabricCanvas.isDrawingMode = true;
        if (fabricCanvas.freeDrawingBrush) {
          fabricCanvas.freeDrawingBrush.color = currentColor;
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
  }, [selectedTool, fabricCanvas, currentColor, brushWidth]);

  // Handle zoom changes
  useEffect(() => {
    if (!fabricCanvas) return;
    
    const zoomLevel = zoom / 100;
    fabricCanvas.setZoom(zoomLevel);
    fabricCanvas.renderAll();
  }, [zoom, fabricCanvas]);

  // Handle canvas position changes
  useEffect(() => {
    if (!fabricCanvas) return;
    
    const point = new Point(canvasPosition.x, canvasPosition.y);
    fabricCanvas.absolutePan(point);
  }, [canvasPosition, fabricCanvas]);

  // Add grid to canvas
  const addGridToCanvas = useCallback((canvas: FabricCanvas) => {
    const gridSize = 20;
    const canvasWidth = canvas.width || 1200;
    const canvasHeight = canvas.height || 800;

    // Remove existing grid
    const existingGrid = canvas.getObjects().filter(obj => 
      (obj as any).isGrid === true
    );
    existingGrid.forEach(line => canvas.remove(line));

    // Add vertical lines
    for (let i = 0; i <= canvasWidth; i += gridSize) {
      const line = new Line([i, 0, i, canvasHeight], {
        stroke: '#e0e0e0',
        strokeWidth: 1,
        selectable: false,
        evented: false,
      });
      (line as any).isGrid = true;
      canvas.add(line);
    }

    // Add horizontal lines
    for (let i = 0; i <= canvasHeight; i += gridSize) {
      const line = new Line([0, i, canvasWidth, i], {
        stroke: '#e0e0e0',
        strokeWidth: 1,
        selectable: false,
        evented: false,
      });
      (line as any).isGrid = true;
      canvas.add(line);
    }

    canvas.renderAll();
  }, []);

  // Handle grid visibility
  useEffect(() => {
    if (!fabricCanvas) return;

    if (showGrid) {
      addGridToCanvas(fabricCanvas);
    } else {
      const gridLines = fabricCanvas.getObjects().filter(obj => (obj as any).isGrid === true);
      gridLines.forEach(line => fabricCanvas.remove(line));
      fabricCanvas.renderAll();
    }
  }, [showGrid, fabricCanvas, addGridToCanvas]);

  // Add shape based on selected tool
  const addShape = useCallback((pointer: { x: number; y: number }) => {
    if (!fabricCanvas) return;

    switch (selectedTool) {
      case 'shape':
      case 'rectangle':
        const rect = new Rect({
          left: pointer.x,
          top: pointer.y,
          fill: currentColor,
          width: 100,
          height: 80,
          stroke: '#000000',
          strokeWidth: 1,
        });
        fabricCanvas.add(rect);
        break;

      case 'circle':
        const circle = new Circle({
          left: pointer.x,
          top: pointer.y,
          fill: currentColor,
          radius: 50,
          stroke: '#000000',
          strokeWidth: 1,
        });
        fabricCanvas.add(circle);
        break;

      case 'text':
        const text = new Textbox('اكتب هنا...', {
          left: pointer.x,
          top: pointer.y,
          fill: currentColor,
          fontSize: 16,
          fontFamily: 'Arial',
          width: 200,
        });
        fabricCanvas.add(text);
        break;

      case 'sticky':
        const stickyNote = new Rect({
          left: pointer.x,
          top: pointer.y,
          fill: '#ffeb3b',
          width: 150,
          height: 100,
          stroke: '#fbc02d',
          strokeWidth: 2,
          rx: 5,
          ry: 5,
        });
        const stickyText = new Textbox('ملاحظة...', {
          left: pointer.x + 10,
          top: pointer.y + 10,
          fill: '#333333',
          fontSize: 12,
          fontFamily: 'Arial',
          width: 130,
        });
        fabricCanvas.add(stickyNote);
        fabricCanvas.add(stickyText);
        break;
    }

    fabricCanvas.renderAll();
  }, [selectedTool, fabricCanvas, currentColor]);

  // Handle canvas events
  useEffect(() => {
    if (!fabricCanvas) return;

    let isDragging = false;
    let lastPosX = 0;
    let lastPosY = 0;

    const handleMouseDown = (event: any) => {
      if (selectedTool === 'hand') {
        isDragging = true;
        fabricCanvas.selection = false;
        lastPosX = event.e.clientX;
        lastPosY = event.e.clientY;
      } else if (['shape', 'rectangle', 'circle', 'text', 'sticky'].includes(selectedTool)) {
        const pointer = fabricCanvas.getPointer(event.e);
        addShape(pointer);
      }
    };

    const handleMouseMove = (event: any) => {
      if (isDragging && selectedTool === 'hand') {
        const vpt = fabricCanvas.viewportTransform;
        if (vpt) {
          vpt[4] += event.e.clientX - lastPosX;
          vpt[5] += event.e.clientY - lastPosY;
          fabricCanvas.requestRenderAll();
          lastPosX = event.e.clientX;
          lastPosY = event.e.clientY;
        }
      }
    };

    const handleMouseUp = () => {
      if (selectedTool === 'hand') {
        fabricCanvas.setViewportTransform(fabricCanvas.viewportTransform);
        isDragging = false;
        fabricCanvas.selection = true;
      }
    };

    const handleObjectSelection = (event: any) => {
      if (event.selected && event.selected.length > 0) {
        const selectedObject = event.selected[0];
        const objectId = (selectedObject as any).objectId || `object-${Date.now()}`;
        onElementSelect(objectId);
      }
    };

    const handlePathCreated = (event: any) => {
      if (selectedTool === 'smart-pen') {
        // Smart pen logic - could implement shape recognition here
        const path = event.path;
        if (path) {
          // Simple shape recognition based on path complexity
          const pathData = path.path;
          if (isCircleLike(pathData)) {
            fabricCanvas.remove(path);
            const bounds = path.getBoundingRect();
            const circle = new Circle({
              left: bounds.left,
              top: bounds.top,
              radius: Math.min(bounds.width, bounds.height) / 2,
              fill: 'transparent',
              stroke: currentColor,
              strokeWidth: brushWidth,
            });
            fabricCanvas.add(circle);
            toast.success('تم تحويل الرسم إلى دائرة!');
          } else if (isRectangleLike(pathData)) {
            fabricCanvas.remove(path);
            const bounds = path.getBoundingRect();
            const rect = new Rect({
              left: bounds.left,
              top: bounds.top,
              width: bounds.width,
              height: bounds.height,
              fill: 'transparent',
              stroke: currentColor,
              strokeWidth: brushWidth,
            });
            fabricCanvas.add(rect);
            toast.success('تم تحويل الرسم إلى مستطيل!');
          }
        }
      }
    };

    // Add event listeners
    fabricCanvas.on('mouse:down', handleMouseDown);
    fabricCanvas.on('mouse:move', handleMouseMove);
    fabricCanvas.on('mouse:up', handleMouseUp);
    fabricCanvas.on('selection:created', handleObjectSelection);
    fabricCanvas.on('selection:updated', handleObjectSelection);
    fabricCanvas.on('path:created', handlePathCreated);

    return () => {
      fabricCanvas.off('mouse:down', handleMouseDown);
      fabricCanvas.off('mouse:move', handleMouseMove);
      fabricCanvas.off('mouse:up', handleMouseUp);
      fabricCanvas.off('selection:created', handleObjectSelection);
      fabricCanvas.off('selection:updated', handleObjectSelection);
      fabricCanvas.off('path:created', handlePathCreated);
    };
  }, [fabricCanvas, selectedTool, addShape, onElementSelect, currentColor, brushWidth]);

  // Simple shape recognition functions
  const isCircleLike = (pathData: any[]): boolean => {
    // Simple heuristic for circle detection
    return pathData.length > 10 && pathData.length < 50;
  };

  const isRectangleLike = (pathData: any[]): boolean => {
    // Simple heuristic for rectangle detection
    return pathData.length >= 4 && pathData.length <= 20;
  };

  // Export canvas data
  const exportCanvas = useCallback(() => {
    if (!fabricCanvas) return null;
    
    const objects = fabricCanvas.getObjects().filter(obj => !(obj as any).isGrid);
    const elements: CanvasElement[] = objects.map((obj, index) => ({
      id: (obj as any).objectId || `element-${index}`,
      type: getElementType(obj),
      position: { x: obj.left || 0, y: obj.top || 0 },
      size: { width: obj.width || 0, height: obj.height || 0 },
      style: {
        fill: obj.fill,
        stroke: obj.stroke,
        strokeWidth: obj.strokeWidth,
        opacity: obj.opacity,
      }
    }));

    onElementsChange(elements);
    return elements;
  }, [fabricCanvas, onElementsChange]);

  const getElementType = (obj: FabricObject): CanvasElement['type'] => {
    if (obj instanceof Rect) return 'shape';
    if (obj instanceof Circle) return 'shape';
    if (obj instanceof Textbox) return 'text';
    if (obj instanceof Path) return 'line';
    return 'smart';
  };

  // Cleanup and export on unmount
  useEffect(() => {
    return () => {
      exportCanvas();
    };
  }, [exportCanvas]);

  return (
    <div className="relative w-full h-full bg-background rounded-lg overflow-hidden shadow-lg">
      <canvas
        ref={canvasRef}
        className="block"
        style={{
          cursor: selectedTool === 'hand' ? 'grab' : 'crosshair'
        }}
      />
      
      {/* Canvas overlay for additional UI elements */}
      <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-md p-2 shadow-sm">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Zoom: {zoom}%</span>
          <span>•</span>
          <span>Tool: {selectedTool}</span>
        </div>
      </div>
    </div>
  );
};

export default FabricCanvasComponent;