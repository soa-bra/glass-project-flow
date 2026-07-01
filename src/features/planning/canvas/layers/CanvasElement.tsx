import React, { useRef, useCallback, useEffect, useState, useMemo } from 'react';
import { Lock } from 'lucide-react';
import { useCanvasStore } from '@/stores/canvasStore';
import { useInteractionStore } from '@/stores/interactionStore';
import { useCollaborationStore } from '@/stores/collaborationStore';
import { getActiveElementLock, getElementLockExpiryDelayMs } from './elementLockState';
import type { CanvasElement as CanvasElementType } from '@/types/canvas';
import { SmartElementRenderer } from '@/features/planning/elements/smart/SmartElementRenderer';
import { TextEditor } from '@/features/planning/elements/text/TextEditor';
import { StickyNoteEditor } from '@/features/planning/elements/text/StickyNoteEditor';
import { ShapeRenderer } from '@/features/planning/elements/shared';
import { TextRenderer } from '@/features/planning/elements/text/TextRenderer';
import { ArrowControlPoints } from '@/features/planning/elements/diagram/ArrowControlPoints';
import { ArrowLabels } from '@/features/planning/elements/diagram/ArrowLabels';
import { FrameDropZone } from '@/features/planning/canvas/gestures/FrameDropZone';
import MindMapNode from '@/features/planning/elements/mindmap/MindMapNode';
import MindMapConnector from '@/features/planning/elements/mindmap/MindMapConnector';
import VisualNode from '@/features/planning/elements/diagram/VisualNode';
import VisualConnector from '@/features/planning/elements/diagram/VisualConnector';

import type { CanvasSmartElement } from '@/types/canvas-elements';
import { canvasKernel } from '@/engine/canvas/kernel/canvasKernel';
import { selectionCoordinator } from '@/engine/canvas/interaction/selectionCoordinator';
import { isAncestorCollapsed } from '@/utils/mindmap-layout';
import { isVisualAncestorCollapsed } from '@/utils/visual-diagram-layout';


export const isInteractiveCanvasTarget = (target: HTMLElement): boolean => {
  return Boolean(
    target.closest('button, input, textarea, select, [contenteditable="true"], [data-interactive-control]'),
  );
};

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
  requestElementLock?: (elementId: string) => Promise<boolean>;
  releaseElementLock?: () => Promise<void> | void;
  onStartConnection?: (nodeId: string, anchor: 'top' | 'bottom' | 'left' | 'right', position: { x: number; y: number }) => void;
  onEndConnection?: (nodeId: string, anchor: 'top' | 'bottom' | 'left' | 'right') => void;
  isConnecting?: boolean;
  nearestAnchor?: { nodeId: string; anchor: string; position: { x: number; y: number } } | null;
}

interface StandardCanvasElementProps extends CanvasElementProps {
  elements: CanvasElementType[];
}

const CanvasElementInner: React.FC<CanvasElementProps> = (props) => {
  const {
    element,
    isSelected,
    onSelect,
    activeTool,
    onStartConnection,
    onEndConnection,
    isConnecting = false,
    nearestAnchor = null,
  } = props;
  const elements = useCanvasStore((state) => state.elements);

  const isHiddenByCollapse = useMemo(() => {
    if (element.type !== 'mindmap_node') return false;
    return isAncestorCollapsed(element.id, elements);
  }, [element.type, element.id, elements]);

  const isHiddenVisualNode = useMemo(() => {
    if (element.type !== 'visual_node') return false;
    return isVisualAncestorCollapsed(element.id, elements);
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
    if (isHiddenVisualNode) return null;
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
    return <VisualConnector element={element} isSelected={isSelected} onSelect={onSelect} />;
  }

  return <StandardCanvasElement {...props} elements={elements} />;
};

const StandardCanvasElement: React.FC<StandardCanvasElementProps> = ({
  element,
  isSelected,
  onSelect,
  snapToGrid,
  activeTool,
  requestElementLock,
  releaseElementLock,
  elements,
}) => {
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
  const currentUserId = useCollaborationStore((state) => state.currentUserId);
  const participants = useCollaborationStore((state) => state.participants);
  const remoteLockedBy = (element as { lockedBy?: string | null }).lockedBy ?? null;
  const remoteLockedAt = (element as { lockedAt?: string | null }).lockedAt ?? null;
  const [lockClockMs, setLockClockMs] = useState(() => Date.now());
  const activeRemoteLock = useMemo(
    () => getActiveElementLock(remoteLockedBy, remoteLockedAt, lockClockMs),
    [lockClockMs, remoteLockedAt, remoteLockedBy],
  );

  useEffect(() => {
    const lock = getActiveElementLock(remoteLockedBy, remoteLockedAt);
    if (!lock) {
      setLockClockMs(Date.now());
      return;
    }

    const timeoutId = window.setTimeout(
      () => setLockClockMs(Date.now()),
      getElementLockExpiryDelayMs(lock) + 50,
    );
    return () => window.clearTimeout(timeoutId);
  }, [remoteLockedAt, remoteLockedBy]);

  const activeRemoteLockedBy = activeRemoteLock?.lockedBy ?? null;
  const hasActiveRemoteLock = !!activeRemoteLockedBy;
  const isLockedByOther = hasActiveRemoteLock && activeRemoteLockedBy !== currentUserId;
  const isLockedBySelf = hasActiveRemoteLock && activeRemoteLockedBy === currentUserId;
  const isLayerLocked = !!elementLayer?.locked;
  const isElementLocked = Boolean(
    element.locked ||
    element.data?.locked ||
    element.data?.isLocked ||
    element.metadata?.locked,
  );
  const isLocked = isElementLocked || isLayerLocked || isLockedByOther;
  const lockHolder = useMemo(() => {
    if (!activeRemoteLockedBy) return null;
    return participants.find((p) => p.id === activeRemoteLockedBy) ?? null;
  }, [activeRemoteLockedBy, participants]);
  const lockHolderName = lockHolder?.name ?? (activeRemoteLockedBy ? 'مستخدم آخر' : null);
  const lockHolderColor = lockHolder?.color ?? 'hsl(var(--accent-red))';
  const lockHolderAvatar = lockHolder?.avatar;
  const lockHolderInitial = (lockHolderName ?? '?').trim().charAt(0).toUpperCase() || '?';
  const smartRenderableType = useMemo(() => {
    if (element.type === 'smart') {
      return (element as any).smartType || element.data?.smartType || element.metadata?.smartType || null;
    }
    return null;
  }, [element]);

  const getGroupElementIds = useCallback((): string[] => {
    const groupId = element.metadata?.groupId;
    if (!groupId) return [element.id];
    return elements.filter((entry) => entry.metadata?.groupId === groupId).map((entry) => entry.id);
  }, [element.id, element.metadata?.groupId, elements]);

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
      void releaseElementLock?.();
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

  const startDrag = useCallback((clientX: number, clientY: number) => {
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: clientX,
      y: clientY,
      elementX: element.position.x,
      elementY: element.position.y,
    };
    window.addEventListener('mousemove', stableMouseMove);
    window.addEventListener('mouseup', stableMouseUp);
  }, [element.position.x, element.position.y, stableMouseMove, stableMouseUp]);

  const ensureEditLock = useCallback(async () => {
    if (isLockedBySelf) return true;
    return requestElementLock ? requestElementLock(element.id) : true;
  }, [element.id, isLockedBySelf, requestElementLock]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isLocked) {
      e.stopPropagation();
      e.preventDefault();
      return;
    }
    const target = e.target as HTMLElement;
    if (target.classList.contains('resize-handle') || target.hasAttribute('data-resize-handle')) return;
    if (isInteractiveCanvasTarget(target)) return;
    if (activeTool !== 'selection_tool') return;
    e.stopPropagation();

    const clientX = e.clientX;
    const clientY = e.clientY;
    // ✅ اللمس: touchMultiSelectMode يعمل كأن Shift مضغوط
    const touchMulti = useInteractionStore.getState().touchMultiSelectMode;
    const multiSelect = e.shiftKey || e.ctrlKey || e.metaKey || touchMulti;

    // ✅ توحيد multi-select عبر selectionCoordinator (يعالج toggle + add)
    if (multiSelect) {
      const { selectionCoordinator } = require('@/engine/canvas/interaction/selectionCoordinator');
      selectionCoordinator.handleElementSelect(element.id, isSelected, {
        shift: e.shiftKey || touchMulti,
        ctrl: e.ctrlKey,
        meta: e.metaKey,
      });
      return;
    }

    // ✅ إذا كان العنصر محدد بالفعل (بدون multi-select) — BoundingBox يتولى السحب، لا نبدأ drag هنا
    if (isSelected) {
      return;
    }

    // عنصر جديد — حدده وابدأ سحبه في نفس الحركة
    onSelect(false);

    if (isEditingThisText) return;

    void ensureEditLock().then((granted) => {
      if (!granted) return;
      startDrag(clientX, clientY);
    });
  }, [activeTool, element.id, ensureEditLock, isEditingThisText, isLocked, isSelected, onSelect, startDrag]);


  const handleTitleDoubleClick = useCallback((e: React.MouseEvent) => {
    if (element.type === 'frame' && !isLocked) {
      e.stopPropagation();
      void ensureEditLock().then((granted) => {
        if (!granted) return;
        setIsEditingTitle(true);
        setEditedTitle((element as any).title || '');
      });
    }
  }, [element, ensureEditLock, isLocked]);

  const handleTextDoubleClick = useCallback((e: React.MouseEvent) => {
    if (element.type === 'text' && !isLocked) {
      e.stopPropagation();
      void ensureEditLock().then((granted) => {
        if (!granted) return;
        const { setActiveTool } = useCanvasStore.getState();
        setActiveTool('text_tool');
        startEditingText(element.id);
      });
    }
  }, [element, ensureEditLock, isLocked, startEditingText]);

  const handleStickyDoubleClick = useCallback((e: React.MouseEvent) => {
    const shapeType = element.shapeType || element.data?.shapeType;
    if (element.type === 'shape' && shapeType === 'sticky' && !isLocked) {
      e.stopPropagation();
      void ensureEditLock().then((granted) => {
        if (granted) startEditingText(element.id);
      });
    }
  }, [element, ensureEditLock, isLocked, startEditingText]);

  const isEditingStickyNote = element.type === 'shape' && (element.shapeType === 'sticky' || element.data?.shapeType === 'sticky') && editingTextId === element.id;

  const handleTitleSave = useCallback(() => {
    if (element.type === 'frame') {
      updateFrameTitle(element.id, editedTitle);
      setIsEditingTitle(false);
      void releaseElementLock?.();
    }
  }, [editedTitle, element, releaseElementLock, updateFrameTitle]);

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

  const selectionAnchorProps = { 'data-selection-anchor-id': element.id } as const;
  const isPdfPreview = Boolean(
    element.type === 'file' &&
    element.fileUrl &&
    (element.metadata?.renderMode === 'pdf_preview' || element.fileType === 'application/pdf' || element.fileType?.includes('pdf')),
  );

  if (!isVisible) return null;

  return (
    <div
      ref={elementRef}
      data-canvas-element="true"
      data-element-id={element.id}
      onMouseDown={handleMouseDown}
      className={`absolute select-none ${isLocked ? 'cursor-not-allowed' : activeTool === 'selection_tool' ? 'cursor-move' : 'cursor-default'} ${isElementArrow(element) ? 'arrow-element' : ''}`}
      style={{
        left: element.position.x,
        top: element.position.y,
        width: element.size.width,
        height: element.size.height,
        border: 'none',
        borderRadius: '0',
        padding: '0',
        boxSizing: 'border-box',
        backgroundColor: 'transparent',
        boxShadow: 'none',
        outline: 'none',
        opacity: isLocked ? 0.6 : 1,
        pointerEvents: 'auto',
      }}
    >
      {isLockedByOther && (
        <div
          className="absolute inset-0 z-[9] cursor-not-allowed"
          aria-hidden
          onPointerDownCapture={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          onClickCapture={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          onDoubleClickCapture={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        />
      )}
      {hasActiveRemoteLock && (
        <div
          role="status"
          aria-live="polite"
          title={
            isLockedByOther
              ? `مقفل حاليًا — يحرّره ${lockHolderName}`
              : 'أنت تحرّر هذا العنصر'
          }
          className={`absolute -top-3 start-1 z-10 inline-flex items-center gap-1.5 rounded-full border ps-0.5 pe-2 py-0.5 text-[10px] font-medium shadow-sm pointer-events-auto backdrop-blur ${
            isLockedByOther
              ? 'bg-destructive/10 text-destructive border-destructive/30'
              : 'bg-primary/10 text-primary border-primary/30'
          }`}
          dir="rtl"
        >
          {isLockedByOther ? (
            lockHolderAvatar ? (
              <img
                src={lockHolderAvatar}
                alt=""
                className="h-4 w-4 rounded-full object-cover ring-1"
                style={{ borderColor: lockHolderColor, boxShadow: `0 0 0 1px ${lockHolderColor}` }}
              />
            ) : (
              <span
                aria-hidden
                className="h-4 w-4 rounded-full inline-flex items-center justify-center text-[9px] font-semibold text-white"
                style={{ backgroundColor: lockHolderColor }}
              >
                {lockHolderInitial}
              </span>
            )
          ) : (
            <Lock className="h-3 w-3 ms-1" aria-hidden />
          )}
          <span className="max-w-[140px] truncate">
            {isLockedByOther ? lockHolderName : 'أنت تحرّر'}
          </span>
          {isLockedByOther && <Lock className="h-2.5 w-2.5 opacity-70" aria-hidden />}
        </div>
      )}
      {element.type === 'text' && (
        <div {...selectionAnchorProps} className="w-full h-full">
          {isEditingThisText ? (
            <TextEditor
              element={element}
              onUpdate={(content) => updateTextContent(element.id, content)}
              onClose={() => {
                stopEditingText(element.id);
                void releaseElementLock?.();
              }}
              onDoubleClick={handleTextDoubleClick}
            />
          ) : (
            <TextRenderer element={element} width={element.size.width} height={element.size.height} onDoubleClick={handleTextDoubleClick} />
          )}
        </div>
      )}

      {element.type === 'sticky' && (
        <div {...selectionAnchorProps} className="text-[13px] text-[hsl(var(--ink))] leading-relaxed">{element.content || 'ملاحظة لاصقة'}</div>
      )}

      {element.type === 'image' && element.src && (
        <div {...selectionAnchorProps} className="w-full h-full">
          <img src={element.src} alt={element.alt || 'صورة'} className="w-full h-full object-cover rounded-lg" />
        </div>
      )}

      {element.type === 'shape' && (
        <div {...selectionAnchorProps} onDoubleClick={handleStickyDoubleClick} className="w-full h-full">
          {isEditingStickyNote ? (
            <StickyNoteEditor
              element={element}
              onUpdate={(text) => updateElement(element.id, { stickyText: text, data: { ...element.data, stickyText: text } })}
              onUpdateSize={(newHeight) => {
                if (newHeight > element.size.height) {
                  updateElement(element.id, { size: { ...element.size, height: newHeight } });
                }
              }}
              onClose={() => {
                stopEditingText(element.id);
                void releaseElementLock?.();
              }}
            />
          ) : null}
          <ShapeRenderer
            context="diagram"
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
        <div {...selectionAnchorProps} className="w-full h-full">
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
        </div>
      )}

      {element.type === 'file' && isPdfPreview && (
        <div {...selectionAnchorProps} className="flex h-full w-full flex-col overflow-hidden rounded-lg border border-border bg-white shadow-sm">
          <div className="flex h-9 shrink-0 items-center justify-between gap-2 border-b border-border bg-muted/60 px-3" dir="rtl">
            <span className="min-w-0 truncate text-[11px] font-medium text-foreground">{element.fileName}</span>
            {element.fileSize && <span className="shrink-0 text-[9px] text-muted-foreground">{(element.fileSize / 1024).toFixed(1)} KB</span>}
          </div>
          <iframe
            src={element.fileUrl}
            title={element.fileName || 'PDF preview'}
            className={`h-full w-full flex-1 bg-white ${isSelected ? '' : 'pointer-events-none'}`}
            loading="lazy"
          />
        </div>
      )}

      {element.type === 'file' && !isPdfPreview && (
        <div {...selectionAnchorProps} className="flex flex-col items-center justify-center gap-2 p-4 w-full h-full">
          <div className="w-12 h-12 rounded-lg bg-[hsl(var(--panel))] flex items-center justify-center">
            {element.fileType?.startsWith('image/') ? <span className="text-2xl">🖼️</span> : element.fileType?.includes('pdf') ? <span className="text-2xl">📄</span> : <span className="text-2xl">📁</span>}
          </div>
          <div className="text-center">
            <p className="text-[11px] font-medium text-[hsl(var(--ink))] truncate max-w-[180px]">{element.fileName}</p>
            {element.fileSize && <p className="text-[9px] text-[hsl(var(--ink-60))]">{(element.fileSize / 1024).toFixed(1)} KB</p>}
          </div>
        </div>
      )}

      {element.type === 'pen_path' && element.data?.path && (
        <div {...selectionAnchorProps} className="w-full h-full">
          <svg className="w-full h-full" viewBox={`0 0 ${element.size.width} ${element.size.height}`} style={{ overflow: 'visible' }}>
            <path
              d={element.data.path}
              stroke={element.data.strokeColor || '#000000'}
              strokeWidth={element.data.strokeWidth || 2}
              strokeDasharray={element.data.strokeStyle === 'dashed' ? '5,5' : element.data.strokeStyle === 'dotted' ? '2,2' : undefined}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}

      {smartRenderableType && (
        <div {...selectionAnchorProps} className="w-full h-full">
          <SmartElementRenderer
            element={{ ...(element as CanvasSmartElement), smartType: smartRenderableType } as CanvasSmartElement}
            onUpdate={(data) => updateElement(element.id, { smartType: smartRenderableType, data: { ...element.data, ...data, smartType: smartRenderableType } })}
          />
        </div>
      )}

      {isSelected && !isLocked && !(element.type === 'text' && isEditingThisText) &&
        element.type === 'shape' && isArrowShape(element.shapeType || element.data?.shapeType) && (
          <ArrowControlPoints element={element} viewport={viewport} />
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
  if ((prevEl as { lockedBy?: string | null }).lockedBy !== (nextEl as { lockedBy?: string | null }).lockedBy) return false;
  if ((prevEl as { lockedAt?: string | null }).lockedAt !== (nextEl as { lockedAt?: string | null }).lockedAt) return false;
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
