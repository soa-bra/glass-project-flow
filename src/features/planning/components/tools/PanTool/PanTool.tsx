import React, { useRef, useState, useCallback } from 'react';
import { useCanvasStore } from '../../../store/canvas.store';
import { useToolsStore } from '../../../store/tools.store';

export const PanTool: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [lastPosition, setLastPosition] = useState<{ x: number; y: number } | null>(null);

  const { pan, setPan } = useCanvasStore();
  const { activeTool } = useToolsStore();

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (activeTool !== 'pan') return;
    
    setIsPanning(true);
    setLastPosition({ x: e.clientX, y: e.clientY });
    
    // Prevent default to avoid text selection
    e.preventDefault();
  }, [activeTool]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning || !lastPosition) return;
    
    const deltaX = e.clientX - lastPosition.x;
    const deltaY = e.clientY - lastPosition.y;
    
    setPan({
      x: pan.x + deltaX,
      y: pan.y + deltaY
    });
    
    setLastPosition({ x: e.clientX, y: e.clientY });
  }, [isPanning, lastPosition, pan, setPan]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    setLastPosition(null);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsPanning(false);
    setLastPosition(null);
  }, []);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space' && activeTool !== 'pan') {
      // Temporary pan mode with spacebar
      document.body.style.cursor = 'grab';
    }
  }, [activeTool]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space') {
      document.body.style.cursor = 'auto';
    }
  }, []);

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  if (activeTool !== 'pan') return null;

  return (
    <div
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      style={{ 
        cursor: isPanning ? 'grabbing' : 'grab'
      }}
    />
  );
};