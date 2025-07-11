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
  const [activeColor, setActiveColor] = useState('#000000');
  const [brushWidth, setBrushWidth] = useState(2);

  // Initialize Fabric.js canvas with v6 API
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: window.innerWidth - 100,
      height: window.innerHeight - 200,
      backgroundColor: theme?.colors?.background || '#ffffff',
      selection: true,
    });

    // Initialize the freeDrawingBrush right after canvas creation (v6 requirement)
    canvas.freeDrawingBrush.color = activeColor;
    canvas.freeDrawingBrush.width = brushWidth;

    // Add grid if enabled
    if (showGrid) {
      addGridToCanvas(canvas);
    }

    // Handle object selection events
    canvas.on('selection:created', (e) => {
      if (e.selected && e.selected.length > 0) {
        const selectedObject = e.selected[0];
        const objectId = (selectedObject as any).objectId || `object-${Date.now()}`;
        onElementSelect(objectId);
      }
    });

    canvas.on('selection:updated', (e) => {
      if (e.selected && e.selected.length > 0) {
        const selectedObject = e.selected[0];
        const objectId = (selectedObject as any).objectId || `object-${Date.now()}`;
        onElementSelect(objectId);
      }
    });

    setFabricCanvas(canvas);
    onCanvasReady?.(canvas);
    toast.success('Canvas ready! Start creating!');

    // Handle window resize
    const handleResize = () => {
      canvas.setDimensions({
        width: window.innerWidth - 100,
        height: window.innerHeight - 200
      });
      canvas.renderAll();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.dispose();
    };
  }, []);

  // Handle tool changes with proper v6 API
  useEffect(() => {
    if (!fabricCanvas) return;

    // Reset drawing mode
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

  // Enhanced tool handlers
  const handleToolClick = useCallback((tool: string) => {
    if (!fabricCanvas) return;

    const pointer = fabricCanvas.getCenter();

    switch (tool) {
      case 'rectangle':
        const rect = new Rect({
          left: pointer.left - 50,
          top: pointer.top - 40,
          fill: activeColor,
          width: 100,
          height: 80,
          stroke: '#000000',
          strokeWidth: 1,
        });
        (rect as any).objectId = `rect-${Date.now()}`;
        fabricCanvas.add(rect);
        break;

      case 'circle':
        const circle = new Circle({
          left: pointer.left - 50,
          top: pointer.top - 50,
          fill: activeColor,
          radius: 50,
          stroke: '#000000',
          strokeWidth: 1,
        });
        (circle as any).objectId = `circle-${Date.now()}`;
        fabricCanvas.add(circle);
        break;

      case 'text':
        const text = new Textbox('اكتب هنا...', {
          left: pointer.left - 100,
          top: pointer.top - 10,
          fill: activeColor,
          fontSize: 16,
          fontFamily: 'Arial',
          width: 200,
          textAlign: 'right', // RTL support
        });
        (text as any).objectId = `text-${Date.now()}`;
        fabricCanvas.add(text);
        break;

      case 'sticky':
        const stickyNote = new Rect({
          left: pointer.left - 75,
          top: pointer.top - 50,
          fill: '#ffeb3b',
          width: 150,
          height: 100,
          stroke: '#fbc02d',
          strokeWidth: 2,
          rx: 5,
          ry: 5,
        });
        const stickyText = new Textbox('ملاحظة...', {
          left: pointer.left - 65,
          top: pointer.top - 40,
          fill: '#333333',
          fontSize: 12,
          fontFamily: 'Arial',
          width: 130,
          textAlign: 'right',
        });
        (stickyNote as any).objectId = `sticky-${Date.now()}`;
        (stickyText as any).objectId = `sticky-text-${Date.now()}`;
        fabricCanvas.add(stickyNote);
        fabricCanvas.add(stickyText);
        break;
    }

    fabricCanvas.renderAll();
    toast.success(`تم إضافة ${tool === 'rectangle' ? 'مستطيل' : tool === 'circle' ? 'دائرة' : tool === 'text' ? 'نص' : 'ملصق'}`);
  }, [fabricCanvas, activeColor]);

  // Handle canvas mouse events
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
      } else if (['rectangle', 'circle', 'text', 'sticky'].includes(selectedTool)) {
        handleToolClick(selectedTool);
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

    // Add event listeners
    fabricCanvas.on('mouse:down', handleMouseDown);
    fabricCanvas.on('mouse:move', handleMouseMove);
    fabricCanvas.on('mouse:up', handleMouseUp);

    return () => {
      fabricCanvas.off('mouse:down', handleMouseDown);
      fabricCanvas.off('mouse:move', handleMouseMove);
      fabricCanvas.off('mouse:up', handleMouseUp);
    };
  }, [fabricCanvas, selectedTool, handleToolClick]);

  // Handle clear canvas
  const handleClear = useCallback(() => {
    if (!fabricCanvas) return;
    
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = theme?.colors?.background || '#ffffff';
    
    if (showGrid) {
      addGridToCanvas(fabricCanvas);
    }
    
    fabricCanvas.renderAll();
    toast.success('تم مسح اللوحة!');
  }, [fabricCanvas, theme, showGrid, addGridToCanvas]);

  // Enhanced export functionality
  const exportCanvas = useCallback(() => {
    if (!fabricCanvas) return null;
    
    const objects = fabricCanvas.getObjects().filter(obj => !(obj as any).isGrid);
    const elements: CanvasElement[] = objects.map((obj, index) => ({
      id: (obj as any).objectId || `element-${index}`,
      type: getElementType(obj),
      position: { x: obj.left || 0, y: obj.top || 0 },
      size: { width: obj.width || 0, height: obj.height || 0 },
      style: {
        fill: obj.fill as string,
        stroke: obj.stroke as string,
        strokeWidth: obj.strokeWidth || 1,
        opacity: obj.opacity || 1,
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

  // Export JSON data
  const exportJSON = useCallback(() => {
    if (!fabricCanvas) return null;
    return fabricCanvas.toJSON();
  }, [fabricCanvas]);

  // Import JSON data
  const importJSON = useCallback((jsonData: any) => {
    if (!fabricCanvas) return;
    
    fabricCanvas.loadFromJSON(jsonData, () => {
      fabricCanvas.renderAll();
      toast.success('تم استيراد البيانات بنجاح!');
    });
  }, [fabricCanvas]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      exportCanvas();
    };
  }, [exportCanvas]);

  // Expose canvas methods globally for external control
  useEffect(() => {
    if (fabricCanvas) {
      (window as any).canvasMethods = {
        clear: handleClear,
        export: exportCanvas,
        exportJSON,
        importJSON,
        setColor: setActiveColor,
        setBrushWidth,
      };
    }
  }, [fabricCanvas, handleClear, exportCanvas, exportJSON, importJSON]);

  return (
    <div className="relative w-full h-full bg-background rounded-lg overflow-hidden shadow-lg">
      <canvas
        ref={canvasRef}
        className="block"
        style={{
          cursor: selectedTool === 'hand' ? 'grab' : selectedTool === 'pen' ? 'crosshair' : 'default'
        }}
      />
      
      {/* Canvas overlay for status */}
      <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-md p-2 shadow-sm animate-fade-in">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
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

      {/* Quick actions */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={handleClear}
          className="px-3 py-1 bg-destructive text-destructive-foreground rounded text-xs hover:bg-destructive/90 transition-colors"
        >
          مسح
        </button>
        <button
          onClick={() => {
            const json = exportJSON();
            if (json) {
              navigator.clipboard.writeText(JSON.stringify(json));
              toast.success('تم نسخ البيانات!');
            }
          }}
          className="px-3 py-1 bg-primary text-primary-foreground rounded text-xs hover:bg-primary/90 transition-colors"
        >
          نسخ
        </button>
      </div>
    </div>
  );
};

export default FabricCanvasComponent;