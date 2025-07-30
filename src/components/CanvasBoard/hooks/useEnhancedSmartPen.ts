import { useState, useCallback, useRef } from 'react';
import { Point, useSmartPenTool } from './useSmartPenTool';
import { handleCanvasOperation } from '../utils/errorHandling';
import { throttle } from '../utils/performance';

export interface EnhancedSmartPenController {
  isDrawing: boolean;
  currentPath: Point[];
  completedPaths: { path: Point[]; style: any }[];
  strokeCount: number;
  totalPoints: number;
  smoothPath: (path: Point[]) => Point[];
  startDrawing: (e: React.MouseEvent) => void;
  continueDrawing: (e: React.MouseEvent) => void;
  endDrawing: () => void;
  clearPath: () => void;
  clearAllPaths: () => void;
  undoLastStroke: () => void;
  getPathBounds: (path: Point[]) => { minX: number; minY: number; maxX: number; maxY: number };
}

export const useEnhancedSmartPen = (
  zoom: number,
  canvasPosition: { x: number; y: number },
  lineWidth: number,
  lineStyle: string,
  penMode: string,
  onPathComplete: (path: Point[], style: any) => void
): EnhancedSmartPenController => {
  const [completedPaths, setCompletedPaths] = useState<{ path: Point[]; style: any }[]>([]);
  
  const smoothingRef = useRef<Point[]>([]);
  const pathHistoryRef = useRef<{ path: Point[]; style: any }[]>([]);

  // Enhanced path completion with style information
  const handlePathComplete = useCallback((path: Point[]) => {
    return handleCanvasOperation(async () => {
      const style = {
        stroke: getPenColor(penMode),
        strokeWidth: lineWidth,
        strokeStyle: lineStyle,
        opacity: penMode === 'highlighter' ? 0.3 : 1
      };

      const smoothedPath = smoothPath(path);
      const pathData = { path: smoothedPath, style };
      
      setCompletedPaths(prev => {
        const newPaths = [...prev, pathData];
        pathHistoryRef.current = newPaths;
        return newPaths;
      });
      
      onPathComplete(smoothedPath, style);
    }, 'PATH_COMPLETION_ERROR');
  }, [lineWidth, lineStyle, penMode, onPathComplete]);

  const basePenTool = useSmartPenTool(zoom, canvasPosition, handlePathComplete);

  // Throttled drawing for performance
  const throttledContinueDrawing = useCallback(
    throttle((e: React.MouseEvent) => {
      basePenTool.continueDrawing(e);
    }, 16), // ~60fps
    [basePenTool]
  );

  const smoothPath = useCallback((path: Point[]): Point[] => {
    if (path.length <= 2) return path;

    const smoothed: Point[] = [path[0]];
    
    for (let i = 1; i < path.length - 1; i++) {
      const prev = path[i - 1];
      const curr = path[i];
      const next = path[i + 1];
      
      // Apply simple smoothing
      const smoothX = (prev.x + curr.x + next.x) / 3;
      const smoothY = (prev.y + curr.y + next.y) / 3;
      
      smoothed.push({ x: smoothX, y: smoothY });
    }
    
    smoothed.push(path[path.length - 1]);
    return smoothed;
  }, []);

  const getPathBounds = useCallback((path: Point[]) => {
    if (path.length === 0) {
      return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
    }

    let minX = path[0].x;
    let minY = path[0].y;
    let maxX = path[0].x;
    let maxY = path[0].y;

    for (const point of path) {
      minX = Math.min(minX, point.x);
      minY = Math.min(minY, point.y);
      maxX = Math.max(maxX, point.x);
      maxY = Math.max(maxY, point.y);
    }

    return { minX, minY, maxX, maxY };
  }, []);

  const clearAllPaths = useCallback(() => {
    setCompletedPaths([]);
    pathHistoryRef.current = [];
    basePenTool.clearPath();
  }, [basePenTool]);

  const undoLastStroke = useCallback(() => {
    setCompletedPaths(prev => {
      const newPaths = prev.slice(0, -1);
      pathHistoryRef.current = newPaths;
      return newPaths;
    });
  }, []);

  const totalPoints = basePenTool.currentPath.length + 
    completedPaths.reduce((total, pathData) => total + pathData.path.length, 0);

  return {
    isDrawing: basePenTool.isDrawing,
    currentPath: basePenTool.currentPath,
    completedPaths,
    strokeCount: completedPaths.length,
    totalPoints,
    smoothPath,
    startDrawing: basePenTool.startDrawing,
    continueDrawing: throttledContinueDrawing,
    endDrawing: basePenTool.endDrawing,
    clearPath: basePenTool.clearPath,
    clearAllPaths,
    undoLastStroke,
    getPathBounds
  };
};

const getPenColor = (penMode: string): string => {
  switch (penMode) {
    case 'highlighter':
      return '#ffff00';
    case 'marker':
      return '#ff0000';
    case 'pencil':
      return '#666666';
    default:
      return '#000000';
  }
};