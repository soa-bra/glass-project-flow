import React, { useRef, useState, useCallback } from 'react';
import { useCanvasStore } from '../../../store/canvas.store';
import { useToolsStore } from '../../../store/tools.store';
import { nanoid } from 'nanoid';

interface DrawingPath {
  id: string;
  points: { x: number; y: number }[];
  style: {
    strokeWidth: number;
    color: string;
    strokeStyle: string;
  };
}

export const SmartPenTool: React.FC = () => {
  const canvasRef = useRef<SVGSVGElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<DrawingPath | null>(null);

  const { addElement, zoom, pan } = useCanvasStore();
  const { activeTool, getSmartPenOptions } = useToolsStore();

  const screenToCanvas = useCallback((screenX: number, screenY: number) => {
    if (!canvasRef.current) return { x: screenX, y: screenY };
    
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (screenX - rect.left - pan.x) / zoom,
      y: (screenY - rect.top - pan.y) / zoom
    };
  }, [zoom, pan]);

  const createPathString = useCallback((points: { x: number; y: number }[]) => {
    if (points.length < 2) return '';
    
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }
    
    return path;
  }, []);

  const detectShape = useCallback((points: { x: number; y: number }[]) => {
    if (points.length < 10) return null;
    
    const options = getSmartPenOptions();
    if (!options.smartConversion) return null;
    
    // Simple shape detection logic
    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];
    const distance = Math.sqrt(
      Math.pow(lastPoint.x - firstPoint.x, 2) + 
      Math.pow(lastPoint.y - firstPoint.y, 2)
    );
    
    // If path is closed (start and end points are close), it might be a shape
    if (distance < 20) {
      // Detect if it's roughly a rectangle or circle
      const bounds = points.reduce(
        (acc, point) => ({
          minX: Math.min(acc.minX, point.x),
          maxX: Math.max(acc.maxX, point.x),
          minY: Math.min(acc.minY, point.y),
          maxY: Math.max(acc.maxY, point.y)
        }),
        { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity }
      );
      
      const width = bounds.maxX - bounds.minX;
      const height = bounds.maxY - bounds.minY;
      const aspectRatio = width / height;
      
      // If roughly square, convert to rectangle
      if (aspectRatio > 0.7 && aspectRatio < 1.3) {
        return {
          type: 'rectangle',
          position: { x: bounds.minX, y: bounds.minY },
          size: { width, height }
        };
      }
    }
    
    return null;
  }, [getSmartPenOptions]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (activeTool !== 'smart_pen') return;
    
    const canvasPoint = screenToCanvas(e.clientX, e.clientY);
    const options = getSmartPenOptions();
    
    const newPath: DrawingPath = {
      id: nanoid(),
      points: [canvasPoint],
      style: {
        strokeWidth: options.strokeWidth,
        color: options.color,
        strokeStyle: options.style
      }
    };
    
    setCurrentPath(newPath);
    setIsDrawing(true);
  }, [activeTool, screenToCanvas, getSmartPenOptions]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDrawing || !currentPath) return;
    
    const canvasPoint = screenToCanvas(e.clientX, e.clientY);
    
    setCurrentPath(prev => prev ? {
      ...prev,
      points: [...prev.points, canvasPoint]
    } : null);
  }, [isDrawing, currentPath, screenToCanvas]);

  const handleMouseUp = useCallback(() => {
    if (!isDrawing || !currentPath) return;
    
    // Detect if the drawn path should be converted to a shape
    const detectedShape = detectShape(currentPath.points);
    
    if (detectedShape) {
      // Convert to shape element
      addElement({
        id: nanoid(),
        type: 'shape',
        position: detectedShape.position,
        size: detectedShape.size,
        style: {
          fill: 'transparent',
          stroke: currentPath.style.color,
          strokeWidth: currentPath.style.strokeWidth,
          shapeType: detectedShape.type
        },
        createdBy: 'current_user',
        updatedAt: Date.now()
      });
    } else {
      // Add as drawing path
      const bounds = currentPath.points.reduce(
        (acc, point) => ({
          minX: Math.min(acc.minX, point.x),
          maxX: Math.max(acc.maxX, point.x),
          minY: Math.min(acc.minY, point.y),
          maxY: Math.max(acc.maxY, point.y)
        }),
        { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity }
      );
      
      addElement({
        id: nanoid(),
        type: 'drawing',
        position: { x: bounds.minX, y: bounds.minY },
        size: { 
          width: bounds.maxX - bounds.minX, 
          height: bounds.maxY - bounds.minY 
        },
        style: currentPath.style,
        data: {
          path: createPathString(currentPath.points),
          points: currentPath.points
        },
        createdBy: 'current_user',
        updatedAt: Date.now()
      });
    }
    
    setIsDrawing(false);
    setCurrentPath(null);
  }, [isDrawing, currentPath, detectShape, addElement, createPathString]);

  const renderCurrentPath = () => {
    if (!currentPath || currentPath.points.length < 2) return null;
    
    return (
      <path
        d={createPathString(currentPath.points)}
        fill="none"
        stroke={currentPath.style.color}
        strokeWidth={currentPath.style.strokeWidth / zoom}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={
          currentPath.style.strokeStyle === 'dashed' ? `${8 / zoom} ${4 / zoom}` :
          currentPath.style.strokeStyle === 'dotted' ? `${2 / zoom} ${4 / zoom}` :
          undefined
        }
      />
    );
  };

  if (activeTool !== 'smart_pen') return null;

  return (
    <svg
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ cursor: 'crosshair' }}
    >
      {renderCurrentPath()}
    </svg>
  );
};