import React, { useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useCanvasStore } from '../../store/canvas.store';
import { Minimize2, Maximize2 } from 'lucide-react';

interface MiniMapProps {
  className?: string;
}

export const MiniMap: React.FC<MiniMapProps> = ({ className }) => {
  const { viewport, setViewport } = useCanvasStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const miniMapRef = useRef<HTMLDivElement>(null);

  // MiniMap dimensions
  const MINIMAP_WIDTH = 200;
  const MINIMAP_HEIGHT = 150;
  const WORLD_SIZE = 4000; // Virtual world size for minimap

  const handleMiniMapClick = useCallback((e: React.MouseEvent) => {
    if (!miniMapRef.current) return;

    const rect = miniMapRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Convert minimap coordinates to world coordinates
    const worldX = (clickX / MINIMAP_WIDTH) * WORLD_SIZE - WORLD_SIZE / 2;
    const worldY = (clickY / MINIMAP_HEIGHT) * WORLD_SIZE - WORLD_SIZE / 2;

    // Calculate new viewport position to center the clicked point
    const newX = -worldX * viewport.zoom + (window.innerWidth / 2);
    const newY = -worldY * viewport.zoom + (window.innerHeight / 2);

    setViewport({
      ...viewport,
      x: newX,
      y: newY
    });
  }, [viewport, setViewport]);

  const handleViewportDrag = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !miniMapRef.current) return;

    const rect = miniMapRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Convert minimap coordinates to world coordinates
    const worldX = (clickX / MINIMAP_WIDTH) * WORLD_SIZE - WORLD_SIZE / 2;
    const worldY = (clickY / MINIMAP_HEIGHT) * WORLD_SIZE - WORLD_SIZE / 2;

    const newX = -worldX * viewport.zoom + (window.innerWidth / 2);
    const newY = -worldY * viewport.zoom + (window.innerHeight / 2);

    setViewport({
      ...viewport,
      x: newX,
      y: newY
    });
  }, [isDragging, viewport, setViewport]);

  // Calculate viewport rectangle position in minimap
  const getViewportRect = () => {
    // Convert viewport position to world coordinates
    const worldCenterX = (-viewport.x + window.innerWidth / 2) / viewport.zoom;
    const worldCenterY = (-viewport.y + window.innerHeight / 2) / viewport.zoom;

    // Convert world coordinates to minimap coordinates
    const minimapX = ((worldCenterX + WORLD_SIZE / 2) / WORLD_SIZE) * MINIMAP_WIDTH;
    const minimapY = ((worldCenterY + WORLD_SIZE / 2) / WORLD_SIZE) * MINIMAP_HEIGHT;

    // Calculate viewport size in minimap
    const viewportWidthInMinimap = (window.innerWidth / viewport.zoom / WORLD_SIZE) * MINIMAP_WIDTH;
    const viewportHeightInMinimap = (window.innerHeight / viewport.zoom / WORLD_SIZE) * MINIMAP_HEIGHT;

    return {
      x: minimapX - viewportWidthInMinimap / 2,
      y: minimapY - viewportHeightInMinimap / 2,
      width: viewportWidthInMinimap,
      height: viewportHeightInMinimap
    };
  };

  const viewportRect = getViewportRect();

  if (isCollapsed) {
    return (
      <div className={cn(
        "fixed bottom-4 right-4 z-50",
        className
      )}>
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-2 bg-white border border-sb-border rounded-lg shadow-sm hover:shadow-md transition-shadow"
          title="إظهار الخريطة المصغرة"
        >
          <Maximize2 size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className={cn(
      "fixed bottom-4 right-4 z-50 bg-white border border-sb-border rounded-lg shadow-lg overflow-hidden",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-2 bg-sb-panel-bg/30 border-b border-sb-border">
        <span className="text-xs font-medium">الخريطة المصغرة</span>
        <div className="flex items-center gap-1">
          <span className="text-xs text-sb-color-text-light">
            {Math.round(viewport.zoom * 100)}%
          </span>
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1 hover:bg-white/50 rounded"
            title="إخفاء الخريطة المصغرة"
          >
            <Minimize2 size={12} />
          </button>
        </div>
      </div>

      {/* MiniMap Canvas */}
      <div
        ref={miniMapRef}
        className="relative bg-sb-panel-bg/10 cursor-crosshair"
        style={{ width: MINIMAP_WIDTH, height: MINIMAP_HEIGHT }}
        onClick={handleMiniMapClick}
        onMouseDown={() => setIsDragging(true)}
        onMouseMove={handleViewportDrag}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
      >
        {/* Grid Background */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox={`0 0 ${MINIMAP_WIDTH} ${MINIMAP_HEIGHT}`}
        >
          <defs>
            <pattern
              id="minimap-grid"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-sb-border/30"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#minimap-grid)" />
        </svg>

        {/* Elements (simplified representation) */}
        <div className="absolute inset-0">
          {/* TODO: Render simplified elements */}
          <div className="absolute top-1/4 left-1/4 w-8 h-6 bg-blue-200 border border-blue-400 rounded-sm opacity-70" />
          <div className="absolute top-1/2 right-1/3 w-12 h-4 bg-green-200 border border-green-400 rounded-sm opacity-70" />
          <div className="absolute bottom-1/3 left-1/2 w-6 h-8 bg-yellow-200 border border-yellow-400 rounded-sm opacity-70" />
        </div>

        {/* Viewport Rectangle */}
        <div
          className="absolute border-2 border-primary bg-primary/10 pointer-events-none"
          style={{
            left: Math.max(0, Math.min(MINIMAP_WIDTH - viewportRect.width, viewportRect.x)),
            top: Math.max(0, Math.min(MINIMAP_HEIGHT - viewportRect.height, viewportRect.y)),
            width: Math.min(MINIMAP_WIDTH, Math.max(10, viewportRect.width)),
            height: Math.min(MINIMAP_HEIGHT, Math.max(8, viewportRect.height))
          }}
        />

        {/* Center Cross */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-px h-4 bg-sb-color-text-light/30" />
          <div className="w-4 h-px bg-sb-color-text-light/30 absolute" />
        </div>
      </div>

      {/* Controls */}
      <div className="p-2 bg-sb-panel-bg/30 border-t border-sb-border">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewport({ ...viewport, zoom: Math.min(5, viewport.zoom * 1.2) })}
              className="px-2 py-1 bg-white hover:bg-sb-panel-bg/50 rounded text-xs border border-sb-border"
            >
              +
            </button>
            <button
              onClick={() => setViewport({ ...viewport, zoom: Math.max(0.1, viewport.zoom * 0.8) })}
              className="px-2 py-1 bg-white hover:bg-sb-panel-bg/50 rounded text-xs border border-sb-border"
            >
              -
            </button>
          </div>
          
          <button
            onClick={() => setViewport({ ...viewport, x: 0, y: 0, zoom: 1 })}
            className="text-xs text-sb-color-text-light hover:text-primary"
            title="إعادة تعيين العرض"
          >
            إعادة تعيين
          </button>
        </div>
      </div>
    </div>
  );
};