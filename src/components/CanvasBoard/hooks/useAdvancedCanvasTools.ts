import { useState, useCallback, useRef } from 'react';
import { CanvasElement } from '@/types/canvas';

export interface AdvancedCanvasToolsController {
  // Hand tool (panning)
  handTool: {
    isPanning: boolean;
    startPan: (e: React.MouseEvent) => void;
    updatePan: (e: React.MouseEvent) => void;
    endPan: () => void;
  };
  
  // Zoom tool
  zoomTool: {
    zoomIn: (point?: { x: number; y: number }) => void;
    zoomOut: (point?: { x: number; y: number }) => void;
    zoomToFit: () => void;
    handleWheelZoom: (e: React.WheelEvent) => void;
    handleDoubleClick: (e: React.MouseEvent) => void;
  };
  
  // Smart pen tool with drawing
  smartPen: {
    isDrawing: boolean;
    currentPath: Array<{ x: number; y: number }>;
    completedPaths: Array<Array<{ x: number; y: number }>>;
    startDrawing: (e: React.MouseEvent) => void;
    continueDrawing: (e: React.MouseEvent) => void;
    endDrawing: () => void;
    recognizeShape: () => CanvasElement | null;
  };
  
  // Text tool with editing
  textTool: {
    isEditing: boolean;
    editingElementId: string | null;
    startTextEdit: (elementId: string) => void;
    endTextEdit: () => void;
    updateText: (content: string) => void;
  };
  
  // Comment tool
  commentTool: {
    isPlacing: boolean;
    startCommentPlacement: (e: React.MouseEvent) => void;
    endCommentPlacement: (content: string) => void;
  };
  
  // File upload tool
  fileUploadTool: {
    isUploading: boolean;
    handleFileUpload: (file: File, position: { x: number; y: number }) => void;
    smartInsert: (file: File, position: { x: number; y: number }) => void;
  };
}

export const useAdvancedCanvasTools = (
  zoom: number,
  canvasPosition: { x: number; y: number },
  onZoomChange: (zoom: number) => void,
  onPositionChange: (position: { x: number; y: number }) => void,
  onElementAdd: (element: CanvasElement) => void,
  onElementUpdate: (elementId: string, updates: Partial<CanvasElement>) => void
): AdvancedCanvasToolsController => {
  // Hand tool state
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef<{ x: number; y: number; startPos: { x: number; y: number } } | null>(null);

  // Smart pen state
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<Array<{ x: number; y: number }>>([]);
  const [completedPaths, setCompletedPaths] = useState<Array<Array<{ x: number; y: number }>>>([]);

  // Text tool state
  const [isEditing, setIsEditing] = useState(false);
  const [editingElementId, setEditingElementId] = useState<string | null>(null);

  // Comment tool state
  const [isPlacing, setIsPlacing] = useState(false);
  const [commentPosition, setCommentPosition] = useState<{ x: number; y: number } | null>(null);

  // File upload state
  const [isUploading, setIsUploading] = useState(false);

  // Hand tool functions
  const startPan = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsPanning(true);
    panStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startPos: { ...canvasPosition }
    };
  }, [canvasPosition]);

  const updatePan = useCallback((e: React.MouseEvent) => {
    if (!isPanning || !panStartRef.current) return;

    const deltaX = e.clientX - panStartRef.current.x;
    const deltaY = e.clientY - panStartRef.current.y;

    const newPosition = {
      x: panStartRef.current.startPos.x + deltaX / (zoom / 100),
      y: panStartRef.current.startPos.y + deltaY / (zoom / 100)
    };

    onPositionChange(newPosition);
  }, [isPanning, zoom, onPositionChange]);

  const endPan = useCallback(() => {
    setIsPanning(false);
    panStartRef.current = null;
  }, []);

  // Zoom tool functions
  const zoomIn = useCallback((point?: { x: number; y: number }) => {
    const newZoom = Math.min(zoom * 1.2, 500);
    onZoomChange(newZoom);
  }, [zoom, onZoomChange]);

  const zoomOut = useCallback((point?: { x: number; y: number }) => {
    const newZoom = Math.max(zoom * 0.8, 10);
    onZoomChange(newZoom);
  }, [zoom, onZoomChange]);

  const zoomToFit = useCallback(() => {
    onZoomChange(100);
    onPositionChange({ x: 0, y: 0 });
  }, [onZoomChange, onPositionChange]);

  const handleWheelZoom = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.min(Math.max(zoom * delta, 10), 500);
      onZoomChange(newZoom);
    }
  }, [zoom, onZoomChange]);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    zoomIn();
  }, [zoomIn]);

  // Smart pen functions
  const getCanvasPoint = useCallback((e: React.MouseEvent): { x: number; y: number } => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    return {
      x: (e.clientX - rect.left - canvasPosition.x * (zoom / 100)) / (zoom / 100),
      y: (e.clientY - rect.top - canvasPosition.y * (zoom / 100)) / (zoom / 100)
    };
  }, [zoom, canvasPosition]);

  const startDrawing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const point = getCanvasPoint(e);
    setIsDrawing(true);
    setCurrentPath([point]);
  }, [getCanvasPoint]);

  const continueDrawing = useCallback((e: React.MouseEvent) => {
    if (!isDrawing) return;
    const point = getCanvasPoint(e);
    setCurrentPath(prev => [...prev, point]);
  }, [isDrawing, getCanvasPoint]);

  const endDrawing = useCallback(() => {
    if (!isDrawing || currentPath.length === 0) {
      setIsDrawing(false);
      setCurrentPath([]);
      return;
    }

    // Try to recognize shape first
    const recognizedShape = recognizeShape();
    if (recognizedShape) {
      onElementAdd(recognizedShape);
    } else {
      // Add as line element
      const bounds = currentPath.reduce((acc, point) => ({
        minX: Math.min(acc.minX, point.x),
        minY: Math.min(acc.minY, point.y),
        maxX: Math.max(acc.maxX, point.x),
        maxY: Math.max(acc.maxY, point.y)
      }), { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity });

      const lineElement: CanvasElement = {
        id: `line-${Date.now()}`,
        type: 'line',
        position: { x: bounds.minX, y: bounds.minY },
        size: { 
          width: Math.max(bounds.maxX - bounds.minX, 10), 
          height: Math.max(bounds.maxY - bounds.minY, 10) 
        },
        data: { path: currentPath },
        style: {
          stroke: '#000000',
          strokeWidth: 2,
          fill: 'none'
        }
      };
      onElementAdd(lineElement);
    }

    setCompletedPaths(prev => [...prev, currentPath]);
    setCurrentPath([]);
    setIsDrawing(false);
  }, [isDrawing, currentPath, onElementAdd]);

  const recognizeShape = useCallback((): CanvasElement | null => {
    if (currentPath.length < 3) return null;

    const bounds = currentPath.reduce((acc, point) => ({
      minX: Math.min(acc.minX, point.x),
      minY: Math.min(acc.minY, point.y),
      maxX: Math.max(acc.maxX, point.x),
      maxY: Math.max(acc.maxY, point.y)
    }), { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity });

    const width = bounds.maxX - bounds.minX;
    const height = bounds.maxY - bounds.minY;
    const aspectRatio = width / height;

    // Simple shape recognition
    if (aspectRatio > 0.7 && aspectRatio < 1.3) {
      // Possibly a circle or square
      const center = { x: bounds.minX + width / 2, y: bounds.minY + height / 2 };
      const avgDistance = currentPath.reduce((sum, point) => {
        const dx = point.x - center.x;
        const dy = point.y - center.y;
        return sum + Math.sqrt(dx * dx + dy * dy);
      }, 0) / currentPath.length;

      const variance = currentPath.reduce((sum, point) => {
        const dx = point.x - center.x;
        const dy = point.y - center.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return sum + Math.pow(distance - avgDistance, 2);
      }, 0) / currentPath.length;

      if (variance < avgDistance * 0.2) {
        // It's a circle
        return {
          id: `circle-${Date.now()}`,
          type: 'shape',
          position: { x: bounds.minX, y: bounds.minY },
          size: { width, height },
          style: {
            borderRadius: '50%',
            backgroundColor: 'transparent',
            borderColor: '#000000',
            borderWidth: 2
          }
        };
      }
    }

    // Check for rectangle (path forms roughly rectangular shape)
    if (currentPath.length > 4) {
      const corners = [
        { x: bounds.minX, y: bounds.minY },
        { x: bounds.maxX, y: bounds.minY },
        { x: bounds.maxX, y: bounds.maxY },
        { x: bounds.minX, y: bounds.maxY }
      ];

      let totalDistance = 0;
      corners.forEach(corner => {
        const closest = currentPath.reduce((min, point) => {
          const dx = point.x - corner.x;
          const dy = point.y - corner.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          return distance < min ? distance : min;
        }, Infinity);
        totalDistance += closest;
      });

      if (totalDistance < (width + height) * 0.1) {
        // It's a rectangle
        return {
          id: `rectangle-${Date.now()}`,
          type: 'shape',
          position: { x: bounds.minX, y: bounds.minY },
          size: { width, height },
          style: {
            backgroundColor: 'transparent',
            borderColor: '#000000',
            borderWidth: 2
          }
        };
      }
    }

    return null;
  }, [currentPath]);

  // Text tool functions
  const startTextEdit = useCallback((elementId: string) => {
    setIsEditing(true);
    setEditingElementId(elementId);
  }, []);

  const endTextEdit = useCallback(() => {
    setIsEditing(false);
    setEditingElementId(null);
  }, []);

  const updateText = useCallback((content: string) => {
    if (editingElementId) {
      onElementUpdate(editingElementId, { content });
    }
  }, [editingElementId, onElementUpdate]);

  // Comment tool functions
  const startCommentPlacement = useCallback((e: React.MouseEvent) => {
    const point = getCanvasPoint(e);
    setIsPlacing(true);
    setCommentPosition(point);
  }, [getCanvasPoint]);

  const endCommentPlacement = useCallback((content: string) => {
    if (commentPosition && content.trim()) {
      const commentElement: CanvasElement = {
        id: `comment-${Date.now()}`,
        type: 'comment',
        position: commentPosition,
        size: { width: 200, height: 60 },
        content: content,
        style: {
          backgroundColor: '#fff3cd',
          borderColor: '#ffc107',
          borderWidth: 1,
          padding: '8px',
          borderRadius: '8px'
        }
      };
      onElementAdd(commentElement);
    }
    setIsPlacing(false);
    setCommentPosition(null);
  }, [commentPosition, onElementAdd]);

  // File upload functions
  const handleFileUpload = useCallback((file: File, position: { x: number; y: number }) => {
    setIsUploading(true);
    
    // Create URL for file
    const fileUrl = URL.createObjectURL(file);
    
    const uploadElement: CanvasElement = {
      id: `upload-${Date.now()}`,
      type: 'upload',
      position,
      size: { width: 150, height: 100 },
      content: file.name,
      data: { 
        file: fileUrl, 
        fileName: file.name,
        fileType: file.type 
      },
      style: {
        backgroundColor: '#f8f9fa',
        borderColor: '#dee2e6',
        borderWidth: 2,
        borderRadius: '8px',
        padding: '16px'
      }
    };
    
    onElementAdd(uploadElement);
    setIsUploading(false);
  }, [onElementAdd]);

  const smartInsert = useCallback((file: File, position: { x: number; y: number }) => {
    // Enhanced file processing based on type
    if (file.type.startsWith('image/')) {
      const img = new Image();
      img.onload = () => {
        const imageElement: CanvasElement = {
          id: `image-${Date.now()}`,
          type: 'image',
          position,
          size: { 
            width: Math.min(img.naturalWidth, 300), 
            height: Math.min(img.naturalHeight, 200) 
          },
          data: { src: URL.createObjectURL(file) },
          style: {
            borderRadius: '4px'
          }
        };
        onElementAdd(imageElement);
      };
      img.src = URL.createObjectURL(file);
    } else {
      handleFileUpload(file, position);
    }
  }, [handleFileUpload, onElementAdd]);

  return {
    handTool: {
      isPanning,
      startPan,
      updatePan,
      endPan
    },
    zoomTool: {
      zoomIn,
      zoomOut,
      zoomToFit,
      handleWheelZoom,
      handleDoubleClick
    },
    smartPen: {
      isDrawing,
      currentPath,
      completedPaths,
      startDrawing,
      continueDrawing,
      endDrawing,
      recognizeShape
    },
    textTool: {
      isEditing,
      editingElementId,
      startTextEdit,
      endTextEdit,
      updateText
    },
    commentTool: {
      isPlacing,
      startCommentPlacement,
      endCommentPlacement
    },
    fileUploadTool: {
      isUploading,
      handleFileUpload,
      smartInsert
    }
  };
};