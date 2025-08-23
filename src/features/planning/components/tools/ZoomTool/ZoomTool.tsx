import React, { useCallback } from 'react';
import { useCanvasStore } from '../../../store/canvas.store';
import { useToolsStore } from '../../../store/tools.store';

export const ZoomTool: React.FC = () => {
  const { zoom, setZoom, pan, setPan } = useCanvasStore();
  const { activeTool } = useToolsStore();

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (activeTool !== 'zoom' && !e.ctrlKey && !e.metaKey) return;
    
    e.preventDefault();
    
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const delta = -e.deltaY * 0.01;
    const newZoom = Math.max(0.1, Math.min(5, zoom * (1 + delta)));
    
    // Zoom towards mouse position
    const zoomRatio = newZoom / zoom;
    const newPan = {
      x: mouseX - (mouseX - pan.x) * zoomRatio,
      y: mouseY - (mouseY - pan.y) * zoomRatio
    };
    
    setZoom(newZoom);
    setPan(newPan);
  }, [activeTool, zoom, pan, setZoom, setPan]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (activeTool !== 'zoom') return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Zoom in on left click, zoom out on right click or Alt+click
    const zoomIn = !e.altKey && e.button !== 2;
    const zoomFactor = zoomIn ? 1.5 : 1 / 1.5;
    const newZoom = Math.max(0.1, Math.min(5, zoom * zoomFactor));
    
    // Zoom towards mouse position
    const zoomRatio = newZoom / zoom;
    const newPan = {
      x: mouseX - (mouseX - pan.x) * zoomRatio,
      y: mouseY - (mouseY - pan.y) * zoomRatio
    };
    
    setZoom(newZoom);
    setPan(newPan);
  }, [activeTool, zoom, pan, setZoom, setPan]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!e.ctrlKey && !e.metaKey) return;
    
    switch (e.key) {
      case '0':
        // Fit to screen
        setZoom(1);
        setPan({ x: 0, y: 0 });
        e.preventDefault();
        break;
      case '1':
        // Actual size
        setZoom(1);
        e.preventDefault();
        break;
      case '+':
      case '=':
        // Zoom in
        setZoom(Math.min(5, zoom * 1.2));
        e.preventDefault();
        break;
      case '-':
        // Zoom out
        setZoom(Math.max(0.1, zoom / 1.2));
        e.preventDefault();
        break;
    }
  }, [zoom, setZoom, setPan]);

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-auto"
      onWheel={handleWheel}
      onClick={handleClick}
      onContextMenu={(e) => e.preventDefault()}
      style={{ 
        cursor: activeTool === 'zoom' ? 'zoom-in' : 'auto'
      }}
    />
  );
};