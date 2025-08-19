import { useState, useCallback, useRef } from 'react';

export interface Point {
  x: number;
  y: number;
}

export interface SmartPenController {
  isDrawing: boolean;
  currentPath: Point[];
  startDrawing: (e: React.MouseEvent) => void;
  continueDrawing: (e: React.MouseEvent) => void;
  endDrawing: () => void;
  clearPath: () => void;
}

export const useSmartPenTool = (
  zoom: number,
  canvasPosition: { x: number; y: number },
  onPathComplete: (path: Point[]) => void
): SmartPenController => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const lastPointRef = useRef<Point | null>(null);

  const getCanvasPoint = useCallback((e: React.MouseEvent): Point => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    return {
      x: (e.clientX - rect.left - canvasPosition.x) / zoom,
      y: (e.clientY - rect.top - canvasPosition.y) / zoom
    };
  }, [zoom, canvasPosition]);

  const startDrawing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const point = getCanvasPoint(e);
    
    setIsDrawing(true);
    setCurrentPath([point]);
    lastPointRef.current = point;
  }, [getCanvasPoint]);

  const continueDrawing = useCallback((e: React.MouseEvent) => {
    if (!isDrawing) return;

    const point = getCanvasPoint(e);
    
    // Optimize path by only adding points that are far enough apart
    if (lastPointRef.current) {
      const distance = Math.sqrt(
        Math.pow(point.x - lastPointRef.current.x, 2) + 
        Math.pow(point.y - lastPointRef.current.y, 2)
      );
      
      // Only add point if it's far enough from the last point
      if (distance < 2) return;
    }

    setCurrentPath(prev => [...prev, point]);
    lastPointRef.current = point;
  }, [isDrawing, getCanvasPoint]);

  const endDrawing = useCallback(() => {
    if (!isDrawing) {
      setIsDrawing(false);
      setCurrentPath([]);
      return;
    }

    // Allow single point for dots/marks
    if (currentPath.length >= 1) {
      setIsDrawing(false);
      onPathComplete([...currentPath]);
      setCurrentPath([]);
      lastPointRef.current = null;
    } else {
      setIsDrawing(false);
      setCurrentPath([]);
    }
  }, [isDrawing, currentPath, onPathComplete]);

  const clearPath = useCallback(() => {
    setCurrentPath([]);
    setIsDrawing(false);
    lastPointRef.current = null;
  }, []);

  return {
    isDrawing,
    currentPath,
    startDrawing,
    continueDrawing,
    endDrawing,
    clearPath
  };
};