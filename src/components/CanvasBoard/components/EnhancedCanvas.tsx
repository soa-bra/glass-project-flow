import React, { useRef, useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { CanvasGrid } from './CanvasGrid';
import { CanvasElement } from './CanvasElement';
import { CanvasStatusBar } from './CanvasStatusBar';
import { MiniMap } from './MiniMap';
import { SelectionBoundingBox } from './SelectionBoundingBox';
import type { EnhancedCanvasElement, EnhancedCanvasState, InfiniteCanvasConfig } from '../types/enhanced';

interface EnhancedCanvasProps {
  config: InfiniteCanvasConfig;
  elements: EnhancedCanvasElement[];
  selectedElementIds: string[];
  selectedTool: string;
  zoom: number;
  canvasPosition: { x: number; y: number };
  showGrid: boolean;
  snapEnabled: boolean;
  showMiniMap: boolean;
  isDrawing: boolean;
  drawStart: { x: number; y: number } | null;
  drawEnd: { x: number; y: number } | null;
  selectionBox: { start: { x: number; y: number }; end: { x: number; y: number } } | null;
  
  onCanvasMouseDown: (e: React.MouseEvent) => void;
  onCanvasMouseMove: (e: React.MouseEvent) => void;
  onCanvasMouseUp: () => void;
  onCanvasClick: (e: React.MouseEvent) => void;
  onElementSelect: (id: string) => void;
  onUpdateElement?: (elementId: string, updates: Partial<EnhancedCanvasElement>) => void;
  onWheel?: (e: React.WheelEvent) => void;
}

export const EnhancedCanvas: React.FC<EnhancedCanvasProps> = ({
  config,
  elements,
  selectedElementIds,
  selectedTool,
  zoom,
  canvasPosition,
  showGrid,
  snapEnabled,
  showMiniMap,
  isDrawing,
  drawStart,
  drawEnd,
  selectionBox,
  onCanvasMouseDown,
  onCanvasMouseMove,
  onCanvasMouseUp,
  onCanvasClick,
  onElementSelect,
  onUpdateElement,
  onWheel
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);

  // Calculate viewport bounds for optimization
  const viewportBounds = {
    left: -canvasPosition.x / (zoom / 100),
    top: -canvasPosition.y / (zoom / 100),
    right: (-canvasPosition.x + (canvasRef.current?.clientWidth || 0)) / (zoom / 100),
    bottom: (-canvasPosition.y + (canvasRef.current?.clientHeight || 0)) / (zoom / 100)
  };

  // Filter visible elements for performance
  const visibleElements = elements.filter(element => {
    const elementRight = element.position.x + element.size.width;
    const elementBottom = element.position.y + element.size.height;
    
    return !(
      element.position.x > viewportBounds.right ||
      elementRight < viewportBounds.left ||
      element.position.y > viewportBounds.bottom ||
      elementBottom < viewportBounds.top
    );
  });

  const getCursorStyle = useCallback(() => {
    if (isDragging) return 'grabbing';
    
    switch (selectedTool) {
      case 'hand':
        return 'grab';
      case 'zoom':
        return 'zoom-in';
      case 'smart-pen':
        return 'crosshair';
      case 'text':
        return 'text';
      default:
        return 'default';
    }
  }, [selectedTool, isDragging]);

  // Handle pan gestures
  const handlePanStart = useCallback((e: React.MouseEvent) => {
    if (selectedTool === 'hand' || e.metaKey || e.ctrlKey) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      e.preventDefault();
    }
  }, [selectedTool]);

  const handlePanMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && dragStart) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      // This would typically update canvas position
      // onCanvasMove?.(deltaX, deltaY);
      
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  }, [isDragging, dragStart]);

  const handlePanEnd = useCallback(() => {
    setIsDragging(false);
    setDragStart(null);
  }, []);

  // Combine mouse handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    handlePanStart(e);
    onCanvasMouseDown(e);
  }, [handlePanStart, onCanvasMouseDown]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    handlePanMove(e);
    onCanvasMouseMove(e);
  }, [handlePanMove, onCanvasMouseMove]);

  const handleMouseUp = useCallback(() => {
    handlePanEnd();
    onCanvasMouseUp();
  }, [handlePanEnd, onCanvasMouseUp]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-white">
      {/* Main Canvas */}
      <div
        ref={canvasRef}
        className={cn(
          "relative w-full h-full",
          `cursor-${getCursorStyle()}`
        )}
        style={{
          transform: `translate(${canvasPosition.x}px, ${canvasPosition.y}px) scale(${zoom / 100})`,
          transformOrigin: '0 0'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={onCanvasClick}
        onWheel={onWheel}
      >
        {/* Grid */}
        {showGrid && (
          <CanvasGrid
            size={config.features.grid.size}
            type={config.features.grid.default}
            zoom={zoom}
            position={canvasPosition}
          />
        )}

        {/* Elements */}
        {visibleElements.map((element) => (
          <CanvasElement
            key={element.id}
            element={element}
            isSelected={selectedElementIds.includes(element.id)}
            onSelect={() => onElementSelect(element.id)}
            onUpdate={onUpdateElement ? (updates) => onUpdateElement(element.id, updates) : undefined}
            zoom={zoom}
            snapEnabled={snapEnabled}
            gridSize={config.features.grid.size}
          />
        ))}

        {/* Selection Box */}
        {selectionBox && (
          <SelectionBoundingBox
            box={selectionBox}
            zoom={zoom}
          />
        )}

        {/* Drawing Preview */}
        {isDrawing && drawStart && drawEnd && selectedTool === 'smart-pen' && (
          <svg
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ overflow: 'visible' }}
          >
            <line
              x1={drawStart.x}
              y1={drawStart.y}
              x2={drawEnd.x}
              y2={drawEnd.y}
              stroke="currentColor"
              strokeWidth={2 / (zoom / 100)}
              className="text-blue-500"
            />
          </svg>
        )}
      </div>

      {/* Mini Map */}
      {showMiniMap && (
        <div className="absolute bottom-4 right-4 z-40">
          <MiniMap
            elements={elements}
            viewportBounds={viewportBounds}
            zoom={zoom}
            canvasPosition={canvasPosition}
            onViewportChange={(position) => {
              // Handle minimap navigation
              console.log('Minimap navigation:', position);
            }}
          />
        </div>
      )}

      {/* Status Bar */}
      <div className="absolute bottom-4 left-4 z-40">
        <CanvasStatusBar
          zoom={zoom}
          position={canvasPosition}
          selectedCount={selectedElementIds.length}
          totalElements={elements.length}
          gridEnabled={showGrid}
          snapEnabled={snapEnabled}
        />
      </div>

      {/* Infinite Canvas Indicators */}
      <div className="absolute top-2 left-2 z-30 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded">
        {config.renderEngine} • Infinite Canvas
      </div>
    </div>
  );
};