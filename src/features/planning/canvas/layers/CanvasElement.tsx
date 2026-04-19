import React, { useRef, useCallback, useEffect, useState, useMemo } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import { useInteractionStore } from '@/stores/interactionStore';
import type { CanvasElement as CanvasElementType } from '@/types/canvas';
import { SmartElementRenderer } from '@/features/planning/elements/smart/SmartElementRenderer';
import { ResizeHandle } from '@/features/planning/canvas/selection/ResizeHandle';
import { TextEditor } from '@/features/planning/elements/text/TextEditor';
import { StickyNoteEditor } from '@/features/planning/elements/text/StickyNoteEditor';
import { ShapeRenderer } from '@/features/planning/elements/diagram/ShapeRenderer';
import { TextRenderer } from '@/features/planning/elements/text/TextRenderer';
import { ArrowControlPoints } from '@/features/planning/elements/diagram/ArrowControlPoints';
import { ArrowLabels } from '@/features/planning/elements/diagram/ArrowLabels';
import { FrameDropZone } from '@/features/planning/canvas/gestures/FrameDropZone';
import MindMapNode from '@/features/planning/elements/mindmap/MindMapNode';
import MindMapConnector from '@/features/planning/elements/mindmap/MindMapConnector';

import type { CanvasSmartElement } from '@/types/canvas-elements';
import { eventPipeline } from '@/engine/canvas/events/eventPipeline';
import { canvasKernel } from '@/engine/canvas/kernel/canvasKernel';
import { isAncestorCollapsed } from '@/utils/mindmap-layout';
import { isTypedSmartCanvasElementType } from '@/features/planning/elements/smart/factories/createTypedSmartElement';

const isArrowShape = (shapeType: string | undefined): boolean => {
  if (!shapeType) return false;
  return shapeType.startsWith('arrow_');
};

const isElementArrow = (element: CanvasElementType): boolean => {
  if (element.type !== 'shape') return false;
  const shapeType = element.shapeType || element.data?.shapeType;
  return isArrowShape(shapeType);
};

interface CanvasElementProps {
  element: CanvasElementType;
  isSelected: boolean;
  onSelect: (multiSelect: boolean) => void;
  snapToGrid?: (x: number, y: number) => { x: number; y: number };
  activeTool: string;
  onStartConnection?: (nodeId: string, anchor: 'top' | 'bottom' | 'left' | 'right', position: { x: number; y: number }) => void;
  onEndConnection?: (nodeId: string, anchor: 'top' | 'bottom' | 'left' | 'right') => void;
  isConnecting?: boolean;
  nearestAnchor?: { nodeId: string; anchor: string; position: { x: number; y: number } } | null;
}

const CanvasElementInner: React.FC<CanvasElementProps> = ({
  element,
  isSelected,
  onSelect,
  snapToGrid,
  activeTool,
  onStartConnection,
  onEndConnection,
  isConnecting = false,
  nearestAnchor = null,
}) => {
  const elements = useCanvasStore((state) => state.elements);

  const isHiddenByCollapse = useMemo(() => {
    if (element.type !== 'mindmap_node') return false;
    return isAncestorCollapsed(element.id, elements);
  }, [element.type, element.id, elements]);

  if (element.type === 'mindmap_node') {
    if (isHiddenByCollapse) return null;

    return (
      <MindMapNode
        element={element}
        isSelected={isSelected}
        onSelect={onSelect}
        onStartConnection={onStartConnection || (() => {})}
        isConnecting={isConnecting}
        nearestAnchor={nearestAnchor as any}
        activeTool={activeTool}
      />
    );
  }

  if (element.type === 'mindmap_connector') {
    return <MindMapConnector element={element} isSelected={isSelected} onSelect={onSelect} />;
  }

  if (element.type === 'visual_node') {
    const { isVisualAncestorCollapsed } = require('@/utils/visual-diagram-layout');
    if (isVisualAncestorCollapsed(element.id, elements)) return null;
    const VisualNode = require('./VisualNode').default;
    return (
      <VisualNode
        element={element}
        isSelected={isSelected}
        onSelect={onSelect}
        onStartConnection={onStartConnection || (() => {})}
        onEndConnection={onEndConnection || (() => {})}
        isConnecting={isConnecting}
        nearestAnchor={nearestAnchor as any}
        activeTool={activeTool}
      />
    );
  }

  if (element.type === 'visual_connector') {
    const VisualConnector = require('./VisualConnector').default;
    return <VisualConnector element={element} isSelected={isSelected} onSelect={onSelect} />;
  }

  const {
    updateElement,
    viewport,
    updateFrameTitle,
    editingTextId,
    startEditingText,
    stopEditingText,
    updateTextContent,
    moveElements,
    moveFrame,
    findFrameAtPoint,
    addChildToFrame,
    removeChildFromFrame,
  } = useCanvasStore();

  const elementRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, elementX: 0, elementY: 0 });
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const titleInputRef = useRef<HTMLInputElement>(null);

  const isEditingThisText = element.type === 'text' && editingTextId === element.id;

  const layers = useCanvasStore((state) => state.layers);
  const elementLayer = layers.find((layer) => layer.id === element.layerId);
  const isVisible = element.visible !== false && elementLayer?.visible !== false;
  const isLocked = element.locked || elementLayer?.locked;
  const smartRenderableType = useMemo(() => {
    if (element.type === 'smart') {
      return (element as any).smartType || element.data?.smartType || element.metadata?.smartType || null;
    }
    return isTypedSmartCanvasElementType(element.type) ? element.type : null;
  }, [element]);

  const getGroupElementIds = useCallback((): string[] => {
    const groupId = element.metadata?.groupId;
    if (!groupId) return [element.id];
    return elements.filter((entry) => entry.metadata?.groupId === groupId).map((entry) => entry.id);
  }, [element.id, element.metadata?.groupId, elements]);

  if (!isVisible) return null;

  const handleMouseMoveRef = useRef<(e: MouseEvent) => void>();
  const handleMouseUpRef = useRef<() => void>();

  handleMouseMoveRef.current = (e: MouseEvent) => {
    if (!isDraggingRef.current || isLocked || useInteractionStore.getState().isInternalDrag()) return;

    const worldDelta = canvasKernel.screenDeltaToWorld(
      e.clientX - dragStartRef.current.x,
      e.clientY - dragStartRef.current.y,
      viewport.zoom,
    );
    const deltaX = worldDelta.x;
    const deltaY = worldDelta.y;

    let newX = dragStartRef.current.elementX + deltaX;
    let newY = dragStartRef.current.elementY + deltaY;

    if (snapToGrid) {
      const snapped = snapToGrid(newX, newY);
      newX = snapped.x;
      newY = snapped.y;
    }

    const groupIds = getGroupElementIds();
    if (groupIds.length > 1) {
      const finalDeltaX = newX - element.position.x;
      const finalDeltaY = newY - element.position.y;
      if (finalDeltaX !== 0 || finalDeltaY !== 0) {
        moveElements(groupIds, finalDeltaX, finalDeltaY);
      }
    } else {
      const finalDeltaX = newX - element.position.x;
      const finalDeltaY = newY - element.position.y;
      if (finalDeltaX !== 0 || finalDeltaY !== 0) {
        if (element.type === 'frame') {
          moveFrame(element.id, finalDeltaX, finalDeltaY);
        } else {
          updateElement(element.id, { position: { x: newX, y: newY } });
        }
      }
    }
  };

  handleMouseUpRef.current = () => {
    if (isDraggingRef.current) {
      if (element.type !== 'frame') {
        const elementCenterX = element.position.x + element.size.width / 2;
        const elementCenterY = element.position.y + element.size.height / 2;
        const frameUnderElement = findFrameAtPoint(elementCenterX, elementCenterY, [element.id]);
        const frames = elements.filter((entry) => entry.type === 'frame');
        frames.forEach((frame) => {
          const children = (frame as any).children || [];
          if (children.includes(element.id) && frame.id !== frameUnderElement?.id) {
            removeChildFromFrame(frame.id, element.id);
          }
        });
        if (frameUnderElement) {
          const children = (frameUnderElement as any).children || [];
          if (!children.includes(element.id)) {
            addChildToFrame(frameUnderElement.id, element.id);
          }
        }
      }
      isDraggingRef.current = false;
    }
  };

  const stableMouseMove = useCallback((e: MouseEvent) => {
    handleMouseMoveRef.current?.(e);
  }, []);

  const stableMouseUp = useCallback(() => {
    handleMouseUpRef.current?.();
    window.removeEventListener('mousemove', stableMouseMove);
    window.removeEventListener('mouseup', stableMouseUp);
  }, [stableMouseMove]);

  const startDrag = useCallback((e: React.MouseEvent) => {
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      elementX: element.position.x,
      elementY: element.position.y,
    };
    window.addEventListener('mousemove', stableMouseMove);
    window.addEventListener('mouseup', stableMouseUp);
  }, [element.position.x, element.position.y, stableMouseMove, stableMouseUp]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isLocked) return;
    const target = e.target as HTMLElement;
    if (target.classList.contains('resize-handle') || target.hasAttribute('data-resize-handle')) return;
    if (activeTool !== 'selection_tool') return;
    e.stopPropagation();

    const multiSelect = e.shiftKey || e.ctrlKey || e.metaKey;
    if (isSelected) {
      if (multiSelect) {
        const currentSelection = useCanvasStore.getState().selectedElementIds;
        const newSelection = currentSelection.filter((id) => id !== element.id);
        useCanvasStore.getState().selectElements(newSelection);
      }
      return;
    }

    onSelect(multiSelect);
    if (isEditingThisText) return;
    startDrag(e);
  }, [activeTool, element.id, isEditingThisText, isLocked, isSelected, onSelect, startDrag]);

  const handleTitleDoubleClick = useCallback((e: React.MouseEvent) => {
    if (element.type === 'frame' && !isLocked) {
      e.stopPropagation();
      setIsEditingTitle(true);
      setEditedTitle((element as any).title || '');
    }
  }, [element, isLocked]);

  const handleTextDoubleClick = useCallback((e: React.MouseEvent) => {
    if (element.type === 'text' && !isLocked) {
      e.stopPropagation();
      const { setActiveTool } = useCanvasStore.getState();
      setActiveTool('text_tool');
      startEditingText(element.id);
    }
  }, [element, isLocked, startEditingText]);

  const handleStickyDoubleClick = useCallback((e: React.MouseEvent) => {
    const shapeType = element.shapeType || element.data?.shapeType;
    if (element.type === 'shape' && shapeType === 'sticky' && !isLocked) {
      e.stopPropagation();
      startEditingText(element.id);
    }
  }, [element, isLocked, startEditingText]);

  const isEditingStickyNote = element.type === 'shape' && (element.shapeType === 'sticky' || element.data?.shapeType === 'sticky') && editingTextId === element.id;

  const handleTitleSave = useCallback(() => {
    if (element.type === 'frame') {
      updateFrameTitle(element.id, editedTitle);
      setIsEditingTitle(false);
    }
  }, [editedTitle, element, updateFrameTitle]);

  const handleTitleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleTitleSave();
    if (e.key === 'Escape') setIsEditingTitle(false);
  }, [handleTitleSave]);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  useEffect(() => {
    return () => {
      if (isDraggingRef.current) {
        window.removeEventListener('mousemove', stableMouseMove);
        window.removeEventListener('mouseup', stableMouseUp);
        isDraggingRef.current = false;
      }
    };
  }, [stableMouseMove, stableMouseUp]);

  const shouldShowSelectionOutline = isSelected && !(element.type === 'text' && isEditingThisText) && !isElementArrow(element);

  return (
    <div
      ref={elementRef}
      data-canvas-element="true"
      data-element-id={element.id}
      onMouseDown={handleMouseDown}
      className={`absolute select-none ${
        isLocked ? 'cursor-not-allowed' : activeTool === 'selection_tool' ? 'cursor-move' : 'cursor-default'
      } ${isElementArrow(element) ? 'arrow-element' : ''}`}
      style={{
        left: element.position.x,
        top: element.position.y,
        width: element.size.width,
        height: element.size.height,
        border: shouldShowSelectionOutline ? '2px solid hsl(var(--accent-green))' : 'none',
        borderRadius: '0',
        padding: '0',
        backgroundColor: 'transparent',
        boxShadow: shouldShowSelectionOutline ? '0 0 0 2px rgba(61, 190, 139, 0.2)' : 'none',
        outline: 'none',
        opacity: isLocked ? 0.6 : 1,
        pointerEvents: isLocked ? 'none' : 'auto',
      }}
    >
      {element.type === 'text' && (
        <>
          {isEditingThisText ? (
            <TextEditor
              element={element}
              onUpdate={(content) => updateTextContent(element.id, content)}
              onClose={() => stopEditingText(element.id)}
              onDoubleClick={handleTextDoubleClick}
            />
          ) : (
            <TextRenderer element={element} width={element.size.width} height={element.size.height} onDoubleClick={handleTextDoubleClick} />
          )}
        </>
      )}

      {element.type === 'sticky' && (
        <div className="text-[13px] text-[hsl(var(--ink))] leading-relaxed">{element.content || 'ملاحظة لاصقة'}</div>
      )}

      {element.type === 'image' && element.src && (
        <img src={element.src} alt={element.alt || 'صورة'} className="w-full h-full object-cover rounded-lg" />
      )}

      {element.type === 'shape' && (
        <div onDoubleClick={handleStickyDoubleClick} className="w-full h-full">
          {isEditingStickyNote ? (
            <StickyNoteEditor
              element={element}
              onUpdate={(text) =>
                updateElement(element.id, {
                  stickyText: text,
                  data: { ...element.data, stickyText: text },
                })
              }
              onUpdateSize={(newHeight) => {
                if (newHeight > element.size.height) {
                  updateElement(element.id, {
                    size: { ...element.size, height: newHeight },
                  });
                }
              }}
              onClose={() => stopEditingText(element.id)}
            />
          ) : null}
          <ShapeRenderer
            shapeType={element.shapeType || element.data?.shapeType || 'rectangle'}
            width={element.size.width}
            height={element.size.height}
            fillColor={element.style?.backgroundColor || element.data?.fillColor || '#3DBE8B'}
            strokeColor={element.strokeColor || element.data?.strokeColor || '#000000'}
            strokeWidth={element.strokeWidth || element.data?.strokeWidth || 2}
            opacity={element.style?.opacity || 1}
            borderRadius={element.style?.borderRadius || 0}
            iconName={element.iconName || element.data?.iconName}
            stickyText={isEditingStickyNote ? '' : element.stickyText || element.data?.stickyText}
            arrowData={element.data?.arrowData}
          />
          {isElementArrow(element) && element.data?.arrowData && <ArrowLabels arrowData={element.data.arrowData} />}
        </div>
      )}

      {element.type === 'frame' && (
        <FrameDropZone
          frameId={element.id}
          title={(element as any).title}
          childrenCount={(element as any).children?.length || 0}
          onTitleDoubleClick={handleTitleDoubleClick}
          isEditingTitle={isEditingTitle}
          editedTitle={editedTitle}
          onTitleChange={(value) => setEditedTitle(value)}
          onTitleSave={handleTitleSave}
          onTitleKeyDown={handleTitleKeyDown}
          titleInputRef={titleInputRef}
        />
      )}

      {element.type === 'file' && (
        <div className="flex flex-col items-center justify-center gap-2 p-4">
          <div className="w-12 h-12 rounded-lg bg-[hsl(var(--panel))] flex items-center justify-center">
            {element.fileType?.startsWith('image/') ? (
              <span className="text-2xl">🖼️</span>
            ) : element.fileType?.includes('pdf') ? (
              <span className="text-2xl">📄</span>
            ) : (
              <span className="text-2xl">📁</span>
            )}
          </div>
          <div className="text-center">
            <p className="text-[11px] font-medium text-[hsl(var(--ink))] truncate max-w-[180px]">{element.fileName}</p>
            {element.fileSize && <p className="text-[9px] text-[hsl(var(--ink-60))]">{(element.fileSize / 1024).toFixed(1)} KB</p>}
          </div>
        </div>
      )}

      {element.type === 'pen_path' && element.data?.path && (
        <svg className="w-full h-full" viewBox={`0 0 ${element.size.width} ${element.size.height}`} style={{ overflow: 'visible' }}>
          <path
            d={element.data.path}
            stroke={element.data.strokeColor || '#000000'}
            strokeWidth={element.data.strokeWidth || 2}
            strokeDasharray={
              element.data.strokeStyle === 'dashed' ? '5,5' : element.data.strokeStyle === 'dotted' ? '2,2' : undefined
            }
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}

      {smartRenderableType && (
        <SmartElementRenderer
          element={{ ...(element as CanvasSmartElement), smartType: smartRenderableType } as CanvasSmartElement}
          onUpdate={(data) =>
            updateElement(element.id, {
              smartType: smartRenderableType,
              data: { ...element.data, ...data, smartType: smartRenderableType },
            })
          }
        />
      )}

      {isSelected && !isLocked && element.type !== 'text' && (
        <>
          {element.type === 'shape' && isArrowShape(element.shapeType || element.data?.shapeType) ? (
            <ArrowControlPoints element={element} viewport={viewport} />
          ) : (
            <>
              <ResizeHandle position="nw" elementId={element.id} />
              <ResizeHandle position="ne" elementId={element.id} />
              <ResizeHandle position="sw" elementId={element.id} />
              <ResizeHandle position="se" elementId={element.id} />
              <ResizeHandle position="n" elementId={element.id} />
              <ResizeHandle position="s" elementId={element.id} />
              <ResizeHandle position="w" elementId={element.id} />
              <ResizeHandle position="e" elementId={element.id} />
            </>
          )}
        </>
      )}
    </div>
  );
};

const CanvasElement = React.memo(CanvasElementInner, (prevProps, nextProps) => {
  if (prevProps.isSelected !== nextProps.isSelected) return false;
  if (prevProps.activeTool !== nextProps.activeTool) return false;
  if (prevProps.isConnecting !== nextProps.isConnecting) return false;

  const prevEl = prevProps.element;
  const nextEl = nextProps.element;

  if (prevEl.id !== nextEl.id) return false;
  if (prevEl.type !== nextEl.type) return false;
  if (prevEl.position.x !== nextEl.position.x) return false;
  if (prevEl.position.y !== nextEl.position.y) return false;
  if (prevEl.size.width !== nextEl.size.width) return false;
  if (prevEl.size.height !== nextEl.size.height) return false;
  if (prevEl.rotation !== nextEl.rotation) return false;
  if (prevEl.visible !== nextEl.visible) return false;
  if (prevEl.locked !== nextEl.locked) return false;
  if (prevEl.content !== nextEl.content) return false;
  if (prevEl.style !== nextEl.style) return false;
  if (prevEl.data !== nextEl.data) return false;
  if (prevEl.metadata !== nextEl.metadata) return false;

  if (prevProps.nearestAnchor?.nodeId !== nextProps.nearestAnchor?.nodeId) return false;
  if (prevProps.nearestAnchor?.anchor !== nextProps.nearestAnchor?.anchor) return false;

  return true;
});

CanvasElement.displayName = 'CanvasElement';

export default CanvasElement;
