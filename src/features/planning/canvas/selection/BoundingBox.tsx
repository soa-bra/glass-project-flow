import React, { useCallback, useRef, useState, useEffect, useMemo } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import { useInteractionStore } from '@/stores/interactionStore';
import { eventPipeline } from '@/engine/canvas/events/eventPipeline';
import { canvasKernel, type Bounds, type Point } from '@/engine/canvas/kernel/canvasKernel';
import { snapEngine, type SnapLine } from '@/engine/canvas/interaction/snapEngine';
import { selectionCoordinator } from '@/engine/canvas/interaction/selectionCoordinator';

const isArrowShape = (shapeType: string | undefined): boolean => {
  if (!shapeType) return false;
  return shapeType.startsWith('arrow_');
};

interface BoundingBoxProps {
  onGuidesChange?: (guides: SnapLine[]) => void;
}

export const BoundingBox: React.FC<BoundingBoxProps> = ({ onGuidesChange }) => {
  const { 
    selectedElementIds, 
    elements, 
    viewport, 
    settings,
    moveElements, 
    resizeElements, 
    duplicateElement, 
    resizeFrame, 
    activeTool,
    setHoveredFrame,
    setDraggedElements,
    findFrameAtPoint,
    addChildToFrame,
    removeChildFromFrame
  } = useCanvasStore();
  
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const dragStart = useRef<Point>({ x: 0, y: 0 });
  const elementStartPos = useRef<Point>({ x: 0, y: 0 });
  const lastAppliedPos = useRef<Point>({ x: 0, y: 0 });
  const hasDuplicated = useRef(false);
  
  const getGroupElementIds = useCallback((elementIds: string[]): string[] => {
    const result = new Set<string>(elementIds);
    const groupIds = new Set<string>();
    elementIds.forEach(id => {
      const element = elements.find(el => el.id === id);
      if (element?.metadata?.groupId) {
        groupIds.add(element.metadata.groupId);
      }
    });
    if (groupIds.size > 0) {
      elements.forEach(el => {
        if (el.metadata?.groupId && groupIds.has(el.metadata.groupId)) {
          result.add(el.id);
        }
      });
    }
    return Array.from(result);
  }, [elements]);
  
  const expandedSelectedIds = useMemo(() => getGroupElementIds(selectedElementIds), [selectedElementIds, getGroupElementIds]);
  const selectedElements = useMemo(() => elements.filter(el => expandedSelectedIds.includes(el.id) && el.type !== 'mindmap_connector'), [elements, expandedSelectedIds]);
  
  const displayCount = useMemo(() => {
    const frames = selectedElements.filter(el => el.type === 'frame');
    if (frames.length > 0) {
      const childIds = frames.flatMap(f => (f as any).children || []);
      const nonChildElements = selectedElements.filter(el => !childIds.includes(el.id));
      return nonChildElements.length;
    }
    return selectedElements.length;
  }, [selectedElements]);
  
  const bounds = useMemo((): Bounds & { centerX: number; centerY: number } => {
    if (selectedElements.length === 0) {
      return { x: 0, y: 0, width: 0, height: 0, centerX: 0, centerY: 0 };
    }
    return canvasKernel.calculateBounds(selectedElements);
  }, [selectedElements]);
  
  const getResizeOrigin = useCallback((handle: string): Point => {
    const { x, y, width, height, centerX, centerY } = bounds;
    const maxX = x + width;
    const maxY = y + height;
    const originMap: Record<string, Point> = {
      'nw': { x: maxX, y: maxY },
      'ne': { x, y: maxY },
      'sw': { x: maxX, y },
      'se': { x, y },
      'n': { x: centerX, y: maxY },
      's': { x: centerX, y },
      'w': { x: maxX, y: centerY },
      'e': { x, y: centerY }
    };
    return originMap[handle] || { x: centerX, y: centerY };
  }, [bounds]);
  
  useEffect(() => {
    snapEngine.updateConfig({
      gridEnabled: settings.snapToGrid,
      gridSize: settings.gridSize,
      elementSnapEnabled: settings.snapToGrid,
      snapThreshold: 8,
      centerSnapEnabled: settings.snapToGrid,
      edgeSnapEnabled: settings.snapToGrid
    });
    const validElements = elements.filter(el => el.visible !== false && el.locked !== true);
    snapEngine.updateTargets(validElements, selectedElementIds);
  }, [elements, selectedElementIds, settings.snapToGrid, settings.gridSize]);

  const activePointerIdRef = useRef<number | null>(null);
  const dragAreaRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (activePointerIdRef.current !== e.pointerId) return;
    if (useInteractionStore.getState().isInternalDrag()) return;
    
    if (isDragging) {
      if (e.metaKey && e.ctrlKey && !hasDuplicated.current) {
        expandedSelectedIds.forEach(id => duplicateElement(id));
        hasDuplicated.current = true;
      }
      
      const worldDelta = eventPipeline.screenDeltaToWorld(e.clientX - dragStart.current.x, e.clientY - dragStart.current.y, viewport.zoom);
      let newX = elementStartPos.current.x + worldDelta.x;
      let newY = elementStartPos.current.y + worldDelta.y;
      
      if (e.shiftKey) {
        const absX = Math.abs(worldDelta.x);
        const absY = Math.abs(worldDelta.y);
        if (absX > absY) newY = elementStartPos.current.y;
        else newX = elementStartPos.current.x;
      }
      
      let finalX = newX;
      let finalY = newY;
      
      if (settings.snapToGrid) {
        const snapResult = snapEngine.snapBounds({ x: newX, y: newY, width: bounds.width, height: bounds.height }, expandedSelectedIds);
        finalX = snapResult.snappedBounds.x;
        finalY = snapResult.snappedBounds.y;
        if (onGuidesChange) onGuidesChange(snapResult.guides);
      } else if (onGuidesChange) {
        onGuidesChange([]);
      }
      
      const finalDeltaX = finalX - lastAppliedPos.current.x;
      const finalDeltaY = finalY - lastAppliedPos.current.y;
      
      if (finalDeltaX !== 0 || finalDeltaY !== 0) {
        moveElements(expandedSelectedIds, finalDeltaX, finalDeltaY);
        lastAppliedPos.current = { x: finalX, y: finalY };
      }
      
      const centerX = finalX + bounds.width / 2;
      const centerY = finalY + bounds.height / 2;
      const frameUnderCursor = findFrameAtPoint(centerX, centerY, expandedSelectedIds);
      setHoveredFrame(frameUnderCursor?.id || null);
    } else if (isResizing) {
      const resizeDelta = eventPipeline.screenDeltaToWorld(e.clientX - dragStart.current.x, e.clientY - dragStart.current.y, viewport.zoom);
      const { width, height } = bounds;
      let scaleX = 1;
      let scaleY = 1;
      const origin = getResizeOrigin(isResizing);
      if (isResizing.includes('e')) scaleX = 1 + resizeDelta.x / width;
      if (isResizing.includes('w')) scaleX = 1 - resizeDelta.x / width;
      if (isResizing.includes('s')) scaleY = 1 + resizeDelta.y / height;
      if (isResizing.includes('n')) scaleY = 1 - resizeDelta.y / height;
      scaleX = Math.max(0.1, scaleX);
      scaleY = Math.max(0.1, scaleY);
      
      if (scaleX !== 1 || scaleY !== 1) {
        const isFrame = selectedElements.length === 1 && selectedElements[0].type === 'frame';
        if (isFrame) {
          const frameId = selectedElements[0].id;
          resizeFrame(frameId, {
            x: origin.x - (origin.x - bounds.x) * scaleX,
            y: origin.y - (origin.y - bounds.y) * scaleY,
            width: width * scaleX,
            height: height * scaleY
          });
        } else {
          resizeElements(expandedSelectedIds, scaleX, scaleY, origin);
        }
        dragStart.current = { x: e.clientX, y: e.clientY };
      }
    }
  }, [isDragging, isResizing, viewport, moveElements, resizeElements, selectedElementIds, bounds, getResizeOrigin, selectedElements, duplicateElement, resizeFrame, onGuidesChange, settings.snapToGrid, expandedSelectedIds, findFrameAtPoint, setHoveredFrame]);
  
  const handlePointerUp = useCallback((e: PointerEvent) => {
    if (activePointerIdRef.current !== e.pointerId) return;
    if (e.target instanceof Element && e.target.hasPointerCapture(e.pointerId)) {
      e.target.releasePointerCapture(e.pointerId);
    }
    activePointerIdRef.current = null;
    selectionCoordinator.releaseEvent();
    
    if (isDragging && selectedElements.length > 0) {
      const { hoveredFrameId } = useCanvasStore.getState();
      const frames = elements.filter(el => el.type === 'frame');
      selectedElements.forEach(selectedEl => {
        if (selectedEl.type === 'frame') return;
        frames.forEach(frame => {
          const children = (frame as any).children || [];
          if (children.includes(selectedEl.id) && frame.id !== hoveredFrameId) {
            removeChildFromFrame(frame.id, selectedEl.id);
          }
        });
        if (hoveredFrameId) {
          const frame = frames.find(f => f.id === hoveredFrameId);
          const children = (frame as any)?.children || [];
          if (!children.includes(selectedEl.id)) addChildToFrame(hoveredFrameId, selectedEl.id);
        }
      });
    }
    
    setDraggedElements([]);
    setHoveredFrame(null);
    setIsDragging(false);
    setIsResizing(null);
    hasDuplicated.current = false;
    if (onGuidesChange) onGuidesChange([]);
  }, [isDragging, selectedElements, elements, onGuidesChange, addChildToFrame, removeChildFromFrame, setDraggedElements, setHoveredFrame]);
  
  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };
    }
  }, [isDragging, isResizing, handlePointerMove, handlePointerUp]);
  
  const handleDragStart = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    selectionCoordinator.createSelectionEvent('bounding-box-drag', e);
    if (!selectionCoordinator.lockEvent('bounding-box-drag')) return;
    if (e.currentTarget instanceof Element) {
      e.currentTarget.setPointerCapture(e.pointerId);
      activePointerIdRef.current = e.pointerId;
    }
    setDraggedElements(expandedSelectedIds);
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    elementStartPos.current = { x: bounds.x, y: bounds.y };
    lastAppliedPos.current = { x: bounds.x, y: bounds.y };
  }, [bounds.x, bounds.y, expandedSelectedIds, setDraggedElements]);
  
  const handleResizeStart = useCallback((e: React.PointerEvent, corner: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (!selectionCoordinator.lockEvent('resize-start')) return;
    if (e.currentTarget instanceof Element) {
      e.currentTarget.setPointerCapture(e.pointerId);
      activePointerIdRef.current = e.pointerId;
    }
    setIsResizing(corner);
    dragStart.current = { x: e.clientX, y: e.clientY };
  }, []);
  
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    const worldPoint = eventPipeline.screenToWorld(e.clientX, e.clientY);
    const mindmapNodes = selectedElements.filter(el => el.type === 'mindmap_node');
    
    for (const node of mindmapNodes) {
      const isInside = worldPoint.x >= node.position.x && worldPoint.x <= node.position.x + node.size.width && worldPoint.y >= node.position.y && worldPoint.y <= node.position.y + node.size.height;
      if (isInside) {
        const { setActiveTool, selectElement, setLastSmartSelectedMindMapNode } = useCanvasStore.getState();
        setActiveTool('smart_element_tool');
        selectElement(node.id, false);
        setLastSmartSelectedMindMapNode(node.id);
        return;
      }
    }
  }, [selectedElements]);
  
  const isAllArrows = useMemo(() => selectedElements.every(el => el.type === 'shape' && isArrowShape(el.shapeType || el.data?.shapeType)), [selectedElements]);
  const isAllText = useMemo(() => selectedElements.length > 0 && selectedElements.every(el => el.type === 'text'), [selectedElements]);
  const isGrouped = useMemo(() => {
    if (selectedElements.length === 0) return false;
    const groupIds = new Set(selectedElements.map(el => el.metadata?.groupId).filter(Boolean));
    return groupIds.size > 0;
  }, [selectedElements]);
  
  if (activeTool !== 'selection_tool' || selectedElements.length === 0 || isAllArrows || isAllText) {
    return null;
  }
  
  const ResizeHandle = ({ position, cursor, onStart }: { position: string; cursor: string; onStart: (e: React.PointerEvent) => void }) => {
    const positionStyles: Record<string, React.CSSProperties> = {
      'nw': { top: -8, left: -8 },
      'ne': { top: -8, right: -8 },
      'sw': { bottom: -8, left: -8 },
      'se': { bottom: -8, right: -8 },
      'n': { top: -8, left: '50%', transform: 'translateX(-50%)' },
      's': { bottom: -8, left: '50%', transform: 'translateX(-50%)' },
      'w': { top: '50%', left: -8, transform: 'translateY(-50%)' },
      'e': { top: '50%', right: -8, transform: 'translateY(-50%)' }
    };
    return (
      <div className="absolute pointer-events-auto group touch-none" style={{ ...positionStyles[position], cursor, width: 16, height: 16 }} onPointerDown={onStart}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white border-[1.5px] border-[hsl(var(--accent-blue))] rounded-full group-hover:scale-150 transition-transform shadow-sm" />
      </div>
    );
  };
  
  return (
    <div
      className="absolute pointer-events-none bounding-box"
      style={{
        left: bounds.x,
        top: bounds.y,
        width: bounds.width,
        height: bounds.height,
        border: isGrouped ? '2px solid hsl(var(--accent-green) / 0.9)' : '2px dashed hsl(var(--accent-blue) / 0.8)',
        borderRadius: '4px',
        backgroundColor: isGrouped ? 'hsl(var(--accent-green) / 0.05)' : 'transparent',
        zIndex: 9998
      }}
    >
      {isGrouped && (
        <div className="absolute -top-7 right-0 px-2 py-0.5 text-xs font-medium rounded bg-[hsl(var(--accent-green))] text-white flex items-center gap-1" style={{ direction: 'rtl' }}>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          مجموعة
        </div>
      )}
      
      <ResizeHandle position="nw" cursor="nwse-resize" onStart={(e) => handleResizeStart(e, 'nw')} />
      <ResizeHandle position="ne" cursor="nesw-resize" onStart={(e) => handleResizeStart(e, 'ne')} />
      <ResizeHandle position="sw" cursor="nesw-resize" onStart={(e) => handleResizeStart(e, 'sw')} />
      <ResizeHandle position="se" cursor="nwse-resize" onStart={(e) => handleResizeStart(e, 'se')} />
      <ResizeHandle position="n" cursor="ns-resize" onStart={(e) => handleResizeStart(e, 'n')} />
      <ResizeHandle position="s" cursor="ns-resize" onStart={(e) => handleResizeStart(e, 's')} />
      <ResizeHandle position="w" cursor="ew-resize" onStart={(e) => handleResizeStart(e, 'w')} />
      <ResizeHandle position="e" cursor="ew-resize" onStart={(e) => handleResizeStart(e, 'e')} />
      
      <div ref={dragAreaRef} className="absolute inset-0 pointer-events-auto cursor-move touch-none" onPointerDown={handleDragStart} onDoubleClick={handleDoubleClick} />
      
      {displayCount > 1 && !isGrouped && (
        <div className="absolute -top-7 left-0 px-2 py-0.5 text-xs font-medium rounded bg-[hsl(var(--accent-blue))] text-white" style={{ direction: 'rtl' }}>
          {displayCount} عنصر
        </div>
      )}
    </div>
  );
};
