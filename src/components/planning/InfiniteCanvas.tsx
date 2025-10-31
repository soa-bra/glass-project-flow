import React, { forwardRef, useRef, useState, useEffect } from 'react';
import { useGridGuide } from '@/hooks/useGridGuide';
import { useTooling } from './ToolState';
import type { CanvasElement } from './types';

interface InfiniteCanvasProps {
  selectedElements: string[];
  onSelectElements: (ids: string[]) => void;
}

const InfiniteCanvas = forwardRef<HTMLDivElement, InfiniteCanvasProps>(
  ({ selectedElements, onSelectElements }, ref) => {
    const { grid, activeTool } = useTooling();
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [elements, setElements] = useState<CanvasElement[]>([]);
    const lastPanPoint = useRef({ x: 0, y: 0 });
    const canvasRef = useRef<HTMLDivElement>(null);

    const { gridLines, showGuides } = useGridGuide({
      enabled: grid.visible,
      canvasRef: canvasRef,
      gridSize: grid.size,
    });

    // Pan handling
    const handleMouseDown = (e: React.MouseEvent) => {
      if (activeTool === 'selection_tool' && e.button === 1) { // Middle mouse button
        setIsPanning(true);
        lastPanPoint.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
      if (isPanning) {
        const deltaX = e.clientX - lastPanPoint.current.x;
        const deltaY = e.clientY - lastPanPoint.current.y;
        setPan(prev => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
        lastPanPoint.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseUp = () => {
      setIsPanning(false);
    };

    // Zoom handling
    const handleWheel = (e: React.WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        setZoom(prev => Math.max(0.1, Math.min(5, prev * delta)));
      }
    };

    return (
      <div
        ref={canvasRef}
        className="absolute inset-0 overflow-hidden bg-[hsl(var(--panel))]"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{ cursor: isPanning ? 'grabbing' : 'default' }}
      >
        {/* Canvas Transform Container */}
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
            width: '200%',
            height: '200%',
            position: 'relative',
          }}
        >
          {/* Grid Lines */}
          {showGuides && gridLines.map((lineStyle, idx) => (
            <div key={idx} style={lineStyle as React.CSSProperties} />
          ))}

          {/* Canvas Elements */}
          {elements.map(element => (
            <div
              key={element.id}
              className={`absolute ${selectedElements.includes(element.id) ? 'ring-2 ring-[hsl(var(--accent-green))]' : ''}`}
              style={{
                left: element.position.x,
                top: element.position.y,
                width: element.size.width,
                height: element.size.height,
                transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
                ...element.style,
              }}
            >
              {element.content}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

InfiniteCanvas.displayName = 'InfiniteCanvas';

export default InfiniteCanvas;
