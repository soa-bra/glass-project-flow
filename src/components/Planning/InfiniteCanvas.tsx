import React, { useRef, useCallback, useEffect, useMemo, useState } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import CanvasElement from './CanvasElement';
import DrawingPreview from './DrawingPreview';
import SelectionBox from './SelectionBox';
import { useToolInteraction } from '@/hooks/useToolInteraction';

interface InfiniteCanvasProps {
  boardId: string;
}

const InfiniteCanvas: React.FC<InfiniteCanvasProps> = ({ boardId }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const {
    elements,
    viewport,
    settings,
    selectedElementIds,
    layers,
    activeTool,
    tempElement,
    setPan,
    setZoom,
    clearSelection,
    selectElement,
    undo,
    redo,
    toggleGrid,
    deleteElements,
    copyElements,
    pasteElements,
    cutElements
  } = useCanvasStore();
  
  const { handleCanvasMouseDown, handleCanvasMouseMove, handleCanvasMouseUp } = useToolInteraction(containerRef);
  
  // Pan State
  const isPanningRef = useRef(false);
  const lastPanPositionRef = useRef({ x: 0, y: 0 });
  
  // Selection Box State
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<{ x: number; y: number } | null>(null);
  const [selectionCurrent, setSelectionCurrent] = useState<{ x: number; y: number } | null>(null);
  
  // Viewport bounds for virtualization
  const viewportBounds = useMemo(() => ({
    x: -viewport.pan.x / viewport.zoom,
    y: -viewport.pan.y / viewport.zoom,
    width: (containerRef.current?.clientWidth || window.innerWidth) / viewport.zoom,
    height: (containerRef.current?.clientHeight || window.innerHeight) / viewport.zoom
  }), [viewport]);
  
  // Virtualized elements (only render visible ones)
  const visibleElements = useMemo(() => {
    const padding = 200;
    return elements.filter(el => {
      const layer = layers.find(l => l.id === el.layerId);
      if (!layer?.visible || !el.visible) return false;
      
      return (
        el.position.x + el.size.width >= viewportBounds.x - padding &&
        el.position.x <= viewportBounds.x + viewportBounds.width + padding &&
        el.position.y + el.size.height >= viewportBounds.y - padding &&
        el.position.y <= viewportBounds.y + viewportBounds.height + padding
      );
    });
  }, [elements, viewportBounds, layers]);
  
  // Grid Lines
  const gridLines = useMemo(() => {
    if (!settings.gridEnabled) return [];
    
    const lines: React.CSSProperties[] = [];
    const gridSize = settings.gridSize;
    const startX = Math.floor(viewportBounds.x / gridSize) * gridSize;
    const startY = Math.floor(viewportBounds.y / gridSize) * gridSize;
    const endX = Math.ceil((viewportBounds.x + viewportBounds.width) / gridSize) * gridSize;
    const endY = Math.ceil((viewportBounds.y + viewportBounds.height) / gridSize) * gridSize;
    
    // Vertical lines
    for (let x = startX; x <= endX; x += gridSize) {
      lines.push({
        position: 'absolute',
        left: `${x}px`,
        top: `${startY}px`,
        width: '1px',
        height: `${endY - startY}px`,
        backgroundColor: 'rgba(11, 15, 18, 0.08)',
        pointerEvents: 'none'
      });
    }
    
    // Horizontal lines
    for (let y = startY; y <= endY; y += gridSize) {
      lines.push({
        position: 'absolute',
        left: `${startX}px`,
        top: `${y}px`,
        width: `${endX - startX}px`,
        height: '1px',
        backgroundColor: 'rgba(11, 15, 18, 0.08)',
        pointerEvents: 'none'
      });
    }
    
    return lines;
  }, [settings.gridEnabled, settings.gridSize, viewportBounds]);
  
  // Snap to Grid Function
  const snapToGrid = useCallback((x: number, y: number) => {
    if (!settings.snapToGrid) return { x, y };
    const gridSize = settings.gridSize;
    return {
      x: Math.round(x / gridSize) * gridSize,
      y: Math.round(y / gridSize) * gridSize
    };
  }, [settings.snapToGrid, settings.gridSize]);
  
  // Handle Wheel (Zoom)
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    
    if (e.ctrlKey || e.metaKey) {
      // Zoom
      const delta = -e.deltaY * 0.001;
      const newZoom = viewport.zoom * (1 + delta);
      setZoom(newZoom);
    } else {
      // Pan
      setPan(
        viewport.pan.x - e.deltaX,
        viewport.pan.y - e.deltaY
      );
    }
  }, [viewport, setZoom, setPan]);
  
  // Handle Mouse Down (Start Pan or Selection)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      // Middle mouse or Alt+Click = Pan
      isPanningRef.current = true;
      lastPanPositionRef.current = { x: e.clientX, y: e.clientY };
      if (containerRef.current) {
        containerRef.current.style.cursor = 'grabbing';
      }
      e.preventDefault();
    } else if (e.button === 0 && activeTool === 'selection_tool' && e.target === canvasRef.current) {
      // Selection Box with selection tool on empty space
      if (!e.shiftKey) {
        clearSelection();
      }
      setIsSelecting(true);
      setSelectionStart({ x: e.clientX, y: e.clientY });
      setSelectionCurrent({ x: e.clientX, y: e.clientY });
    } else if (e.button === 0 && activeTool !== 'selection_tool') {
      // تفويض للأداة النشطة
      handleCanvasMouseDown(e);
    } else if (e.button === 0 && e.target === canvasRef.current && !e.shiftKey) {
      // Left click on empty space = Clear selection
      clearSelection();
    }
  }, [activeTool, handleCanvasMouseDown, clearSelection]);
  
  // Handle Mouse Move (Pan or Drawing or Selection)
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanningRef.current) {
      const deltaX = e.clientX - lastPanPositionRef.current.x;
      const deltaY = e.clientY - lastPanPositionRef.current.y;
      
      setPan(
        viewport.pan.x + deltaX,
        viewport.pan.y + deltaY
      );
      
      lastPanPositionRef.current = { x: e.clientX, y: e.clientY };
    } else if (isSelecting) {
      setSelectionCurrent({ x: e.clientX, y: e.clientY });
    } else {
      handleCanvasMouseMove(e);
    }
  }, [viewport, setPan, handleCanvasMouseMove, isSelecting]);
  
  // Handle Mouse Up (Stop Pan or Drawing or Selection)
  const handleMouseUp = useCallback(() => {
    isPanningRef.current = false;
    if (containerRef.current) {
      containerRef.current.style.cursor = 'default';
    }
    
    // Handle Selection Box completion
    if (isSelecting && selectionStart && selectionCurrent) {
      const minX = Math.min(selectionStart.x, selectionCurrent.x);
      const maxX = Math.max(selectionStart.x, selectionCurrent.x);
      const minY = Math.min(selectionStart.y, selectionCurrent.y);
      const maxY = Math.max(selectionStart.y, selectionCurrent.y);
      
      // Find elements within selection box
      const selectedIds: string[] = [];
      elements.forEach(el => {
        const elScreenPos = {
          x: el.position.x * viewport.zoom + viewport.pan.x,
          y: el.position.y * viewport.zoom + viewport.pan.y,
          width: el.size.width * viewport.zoom,
          height: el.size.height * viewport.zoom
        };
        
        // Check if element intersects with selection box
        if (
          elScreenPos.x < maxX &&
          elScreenPos.x + elScreenPos.width > minX &&
          elScreenPos.y < maxY &&
          elScreenPos.y + elScreenPos.height > minY
        ) {
          selectedIds.push(el.id);
        }
      });
      
      if (selectedIds.length > 0) {
        useCanvasStore.getState().selectElements(selectedIds);
      }
      
      setIsSelecting(false);
      setSelectionStart(null);
      setSelectionCurrent(null);
    }
    
    handleCanvasMouseUp();
  }, [handleCanvasMouseUp, isSelecting, selectionStart, selectionCurrent, elements, viewport]);
  
  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Zoom shortcuts
      if ((e.ctrlKey || e.metaKey) && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        useCanvasStore.getState().zoomIn();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '-') {
        e.preventDefault();
        useCanvasStore.getState().zoomOut();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        e.preventDefault();
        useCanvasStore.getState().resetViewport();
      }
      
      // Undo/Redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') {
        e.preventDefault();
        redo();
      }
      
      // Copy/Paste/Cut
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault();
        copyElements(selectedElementIds);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault();
        pasteElements();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'x') {
        e.preventDefault();
        cutElements(selectedElementIds);
      }
      
      // Delete
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedElementIds.length > 0) {
          e.preventDefault();
          deleteElements(selectedElementIds);
        }
      }
      
      // Grid toggle
      if (e.key === 'g' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        toggleGrid();
      }
      
      // Escape - Clear selection
      if (e.key === 'Escape') {
        clearSelection();
        useCanvasStore.getState().setActiveTool('selection_tool');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, toggleGrid, selectedElementIds, copyElements, pasteElements, cutElements, deleteElements, clearSelection]);
  
  // Wheel event listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);
  
  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ backgroundColor: settings.background }}
    >
      {/* Canvas Container */}
      <div
        ref={canvasRef}
        className="absolute inset-0 origin-top-left"
        style={{
          transform: `translate(${viewport.pan.x}px, ${viewport.pan.y}px) scale(${viewport.zoom})`,
          transition: isPanningRef.current ? 'none' : 'transform 0.1s ease-out'
        }}
      >
        {/* Grid Lines */}
        {settings.gridEnabled && (
          <div className="absolute" style={{ 
            left: viewportBounds.x - 200, 
            top: viewportBounds.y - 200,
            width: viewportBounds.width + 400,
            height: viewportBounds.height + 400
          }}>
            {gridLines.map((lineStyle, index) => (
              <div key={index} style={lineStyle} />
            ))}
          </div>
        )}
        
        {/* Canvas Elements */}
        {visibleElements.map(element => (
          <CanvasElement
            key={element.id}
            element={element}
            isSelected={selectedElementIds.includes(element.id)}
            onSelect={(multiSelect) => selectElement(element.id, multiSelect)}
            snapToGrid={settings.snapToGrid ? snapToGrid : undefined}
          />
        ))}
        
        {/* Drawing Preview */}
        {tempElement && <DrawingPreview element={tempElement} />}
      </div>
      
      {/* Selection Box */}
      {isSelecting && selectionStart && selectionCurrent && (
        <SelectionBox
          startX={selectionStart.x}
          startY={selectionStart.y}
          currentX={selectionCurrent.x}
          currentY={selectionCurrent.y}
        />
      )}
      
      {/* Zoom Indicator */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-[10px] px-3 py-2 shadow-[0_4px_12px_rgba(0,0,0,0.1)] text-[12px] font-medium text-[hsl(var(--ink))]">
        {Math.round(viewport.zoom * 100)}%
      </div>
      
      {/* Instructions */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-[10px] px-4 py-2 shadow-[0_4px_12px_rgba(0,0,0,0.1)] text-[11px] text-[hsl(var(--ink-60))]">
        <div>التكبير: Ctrl + عجلة الماوس</div>
        <div>التحريك: عجلة الماوس أو Alt + سحب</div>
        <div>الشبكة: اضغط G</div>
      </div>
    </div>
  );
};

export default InfiniteCanvas;
