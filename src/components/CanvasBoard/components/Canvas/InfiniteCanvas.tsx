import React, { useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';

export interface InfiniteCanvasProps {
  zoom: number;
  canvasPosition: { x: number; y: number };
  showGrid: boolean;
  snapEnabled: boolean;
  gridSize?: number;
  gridType?: 'dots' | 'lines' | 'isometric' | 'hex';
  onZoomChange?: (zoom: number) => void;
  onPositionChange?: (position: { x: number; y: number }) => void;
  onCanvasClick?: (e: React.MouseEvent) => void;
  onCanvasMouseDown?: (e: React.MouseEvent) => void;
  onCanvasMouseMove?: (e: React.MouseEvent) => void;
  onCanvasMouseUp?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface InfiniteCanvasRef {
  getCanvasCoordinates: (clientX: number, clientY: number) => { x: number; y: number };
  redraw: () => void;
}

const InfiniteCanvas = forwardRef<InfiniteCanvasRef, InfiniteCanvasProps>(({
  zoom,
  canvasPosition,
  showGrid,
  snapEnabled,
  gridSize = 24,
  gridType = 'dots',
  onZoomChange,
  onPositionChange,
  onCanvasClick,
  onCanvasMouseDown,
  onCanvasMouseMove,
  onCanvasMouseUp,
  children,
  className = '',
  style = {}
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  // Convert zoom percentage to scale factor
  const scale = zoom / 100;

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    getCanvasCoordinates: (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      
      const rect = canvas.getBoundingClientRect();
      const x = (clientX - rect.left) / scale - canvasPosition.x;
      const y = (clientY - rect.top) / scale - canvasPosition.y;
      
      return { x, y };
    },
    redraw: () => {
      drawGrid();
    }
  }), [scale, canvasPosition]);

  // Draw background grid
  const drawGrid = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !showGrid) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    
    ctx.save();
    ctx.clearRect(0, 0, width, height);
    
    // Set background color
    ctx.fillStyle = 'hsl(var(--background))';
    ctx.fillRect(0, 0, width, height);

    const scaledGridSize = gridSize * scale;
    ctx.strokeStyle = 'hsl(var(--border))';
    ctx.fillStyle = 'hsl(var(--muted-foreground))';
    ctx.lineWidth = 1;

    // Apply canvas transformation
    ctx.translate(canvasPosition.x * scale, canvasPosition.y * scale);

    if (gridType === 'dots') {
      const step = scaledGridSize;
      for (let x = -(canvasPosition.x * scale) % step; x < width; x += step) {
        for (let y = -(canvasPosition.y * scale) % step; y < height; y += step) {
          ctx.beginPath();
          ctx.arc(x, y, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (gridType === 'lines') {
      const step = scaledGridSize;
      ctx.beginPath();
      
      // Vertical lines
      for (let x = -(canvasPosition.x * scale) % step; x < width; x += step) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      
      // Horizontal lines
      for (let y = -(canvasPosition.y * scale) % step; y < height; y += step) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      
      ctx.stroke();
    } else {
      // Fallback to dots for other grid types
      const step = scaledGridSize;
      for (let x = -(canvasPosition.x * scale) % step; x < width; x += step) {
        for (let y = -(canvasPosition.y * scale) % step; y < height; y += step) {
          ctx.beginPath();
          ctx.arc(x, y, 1.0, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    
    ctx.restore();
  }, [showGrid, gridType, gridSize, scale, canvasPosition]);

  // Resize canvas to fill container
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    
    const { clientWidth, clientHeight } = container;
    canvas.width = clientWidth;
    canvas.height = clientHeight;
    drawGrid();
  }, [drawGrid]);

  // Initialize canvas and handle resize
  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  // Redraw grid when dependencies change
  useEffect(() => {
    drawGrid();
  }, [drawGrid]);

  // Mouse wheel handler for zoom
  const handleWheel = useCallback((event: React.WheelEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    
    if (!onZoomChange) return;
    
    const delta = -event.deltaY;
    const zoomFactor = delta > 0 ? 1.1 : 0.9;
    const newZoom = Math.min(Math.max(zoom * zoomFactor, 10), 500);
    
    if (onPositionChange) {
      // Zoom around mouse position
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = (event.clientX - rect.left) / (zoom / 100) - canvasPosition.x;
        const mouseY = (event.clientY - rect.top) / (zoom / 100) - canvasPosition.y;
        
        const newScale = newZoom / 100;
        const oldScale = zoom / 100;
        
        const newOffsetX = event.clientX - rect.left - mouseX * newScale;
        const newOffsetY = event.clientY - rect.top - mouseY * newScale;
        
        onPositionChange({ 
          x: newOffsetX / newScale, 
          y: newOffsetY / newScale 
        });
      }
    }
    
    onZoomChange(newZoom);
  }, [zoom, canvasPosition, onZoomChange, onPositionChange]);

  // Mouse down handler
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    // Call parent handler first
    onCanvasMouseDown?.(e);
    
    // Start panning if middle mouse button or if no tool is intercepting
    if (e.button === 1 || (!e.defaultPrevented && e.button === 0)) {
      isDragging.current = true;
      lastPos.current = { x: e.clientX, y: e.clientY };
      e.preventDefault();
    }
  }, [onCanvasMouseDown]);

  // Mouse move handler
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    // Call parent handler first
    onCanvasMouseMove?.(e);
    
    // Handle panning
    if (isDragging.current && onPositionChange) {
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      
      onPositionChange({
        x: canvasPosition.x + dx / scale,
        y: canvasPosition.y + dy / scale
      });
      
      lastPos.current = { x: e.clientX, y: e.clientY };
    }
  }, [onCanvasMouseMove, canvasPosition, scale, onPositionChange]);

  // Mouse up handler
  const handleMouseUp = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    onCanvasMouseUp?.(e);
    isDragging.current = false;
  }, [onCanvasMouseUp]);

  // Click handler
  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    onCanvasClick?.(e);
  }, [onCanvasClick]);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={style}
    >
      {/* Canvas layer */}
      <canvas
        ref={canvasRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleClick}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const files = e.dataTransfer.files;
          if (files.length > 0) {
            const rect = canvasRef.current?.getBoundingClientRect();
            if (rect) {
              const x = (e.clientX - rect.left) / scale - canvasPosition.x;
              const y = (e.clientY - rect.top) / scale - canvasPosition.y;
              // This would need to be connected to file upload handler
              // Handle file drop at position
            }
          }
        }}
        className={`absolute inset-0 w-full h-full ${isDragging.current ? 'cursor-grabbing' : 'cursor-grab'}`}
      />
      
      {/* Content layer with transformation */}
      <div
        className={`absolute inset-0 pointer-events-none origin-top-left scale-[${scale}]`}
        style={{ 
          transform: `translate(${canvasPosition.x}px, ${canvasPosition.y}px)`
        }}
      >
        <div className="pointer-events-auto">
          {children}
        </div>
      </div>
    </div>
  );
});

InfiniteCanvas.displayName = 'InfiniteCanvas';

export { InfiniteCanvas };