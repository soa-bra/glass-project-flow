// InfiniteCanvas - v2 optimized connection handling
import React, { useRef, useCallback, useEffect, useState, useMemo } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import { useInteractionStore, selectBoxSelectData } from '@/stores/interactionStore';
import CanvasElement from '@/features/planning/canvas/layers/CanvasElement';
import DrawingPreview from '@/features/planning/canvas/viewport/DrawingPreview';
import SelectionBox, { useSelectionBox } from '@/features/planning/canvas/selection/SelectionBox';
import StrokesLayer from '@/features/planning/canvas/gestures/StrokesLayer';
import PenInputLayer from '@/features/planning/canvas/gestures/PenInputLayer';
import FrameInputLayer from '@/features/planning/canvas/gestures/FrameInputLayer';
import { BoundingBox } from '@/features/planning/canvas/selection/BoundingBox';
import { SnapGuides } from '@/features/planning/canvas';
import { useToolInteraction } from '@/hooks/useToolInteraction';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useTouchGestures } from '@/hooks/useTouchGestures';
import { useCanvasPaste } from '@/hooks/useCanvasPaste';
import { selectionCoordinator } from '@/engine/canvas/interaction/selectionCoordinator';
import { PenFloatingToolbar } from '@/components/ui/penToolbar';
import { CanvasGridLayer } from '@/features/planning/canvas/viewport/CanvasGridLayer';
import { PresenceCursors } from '@/features/planning/ui/collaboration';
import MindMapConnectionLine from '@/features/planning/elements/mindmap/MindMapConnectionLine';
import { SmartConnectorManager } from '@/features/planning/elements/smart/SmartConnectorManager';
import type { RootConnectorData } from '@/features/planning/elements/smart/RootConnector';
import type { ReadableConnectorElementForAI } from '@/features/planning/services/smartConnectorAI.service';
import { toPlanningConnectorLogicalRecords } from '@/features/planning/integration/connectors';
import {
  upsertSmartConnectors,
  deleteSmartConnectorByElementId,
} from '@/services/central/smartConnectors.service';
import type { PresencePeer } from '@/features/planning/hooks/usePlanningRealtime';
import type { SnapLine } from '@/engine/canvas/interaction/snapEngine';
import { useCanvasPointerTracking } from '@/features/planning/canvas/controllers/useCanvasPointerTracking';
import { useCanvasDropController } from '@/features/planning/canvas/controllers/useCanvasDropController';
import { useMindMapConnectionController } from '@/features/planning/canvas/controllers/useMindMapConnectionController';
import { useCanvasViewportController } from '@/features/planning/canvas/controllers/useCanvasViewportController';
import { useCanvasSelectionController } from '@/features/planning/canvas/controllers/useCanvasSelectionController';

interface InfiniteCanvasProps {
  boardId: string;
  peers?: PresencePeer[];
  broadcastCursor?: (x: number, y: number) => void;
  requestElementLock?: (elementId: string) => Promise<boolean>;
  releaseElementLock?: () => Promise<void> | void;
  canEdit?: boolean;
}

const EDITING_TOOL_SHORTCUTS = new Set(['t', 'r', 'p', 'f', 'u', 's', 'd', 'n', 'm', 'e']);
const MUTATING_MODIFIER_SHORTCUTS = new Set(['z', 'v', 'x', 'd', 'g', 'l']);
const ARROW_KEYS = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']);

function isTextEntryTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.closest('input, textarea, [contenteditable="true"], [role="textbox"]') !== null;
}

function isReadonlyEditingShortcut(e: KeyboardEvent, hasSelection: boolean): boolean {
  const key = e.key.toLowerCase();
  const hasModifier = e.ctrlKey || e.metaKey;

  if (!hasModifier && EDITING_TOOL_SHORTCUTS.has(key)) {
    return true;
  }

  if ((e.key === 'Delete' || e.key === 'Backspace') && hasSelection) {
    return true;
  }

  if (hasSelection && ARROW_KEYS.has(e.key)) {
    return true;
  }

  if (!hasModifier) {
    return false;
  }

  return MUTATING_MODIFIER_SHORTCUTS.has(key);
}

function readCanvasText(...values: unknown[]): string | null {
  for (const value of values) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }
  return null;
}

const InfiniteCanvas: React.FC<InfiniteCanvasProps> = ({
  boardId: _boardId,
  peers = [],
  broadcastCursor,
  requestElementLock,
  releaseElementLock,
  canEdit = true,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const elements = useCanvasStore((state) => state.elements);
  const viewport = useCanvasStore((state) => state.viewport);
  const settings = useCanvasStore((state) => state.settings);
  const selectedElementIds = useCanvasStore((state) => state.selectedElementIds);
  const layers = useCanvasStore((state) => state.layers);
  const activeTool = useCanvasStore((state) => state.activeTool);
  const tempElement = useCanvasStore((state) => state.tempElement);

  const panBy = useCanvasStore((state) => state.panBy);
  const zoomByWheel = useCanvasStore((state) => state.zoomByWheel);
  const setViewportHostSize = useCanvasStore((state) => state.setViewportHostSize);
  const clearSelection = useCanvasStore((state) => state.clearSelection);
  const selectElement = useCanvasStore((state) => state.selectElement);
  const addElement = useCanvasStore((state) => state.addElement);
  const updateElement = useCanvasStore((state) => state.updateElement);
  const deleteElements = useCanvasStore((state) => state.deleteElements);

  const {
    mode: interactionMode,
    startPanning,
    startBoxSelect,
    updateBoxSelect,
    resetToIdle,
    isMode,
  } = useInteractionStore();

  const boxSelectData = useInteractionStore(selectBoxSelectData);

  const { handleCanvasMouseDown, handleCanvasMouseMove, handleCanvasMouseUp } = useToolInteraction(containerRef);
  const { finishSelection } = useSelectionBox();

  useEffect(() => {
    if (canEdit) return;
    if (activeTool !== 'selection_tool') {
      useCanvasStore.getState().setActiveTool('selection_tool');
    }
  }, [activeTool, canEdit]);

  useEffect(() => {
    if (canEdit) return;

    const blockReadonlyEditingShortcuts = (e: KeyboardEvent) => {
      if (isTextEntryTarget(e.target)) return;
      if (!isReadonlyEditingShortcut(e, selectedElementIds.length > 0)) return;
      e.preventDefault();
      e.stopImmediatePropagation();
    };

    window.addEventListener('keydown', blockReadonlyEditingShortcuts, { capture: true });
    return () => window.removeEventListener('keydown', blockReadonlyEditingShortcuts, { capture: true });
  }, [canEdit, selectedElementIds.length]);

  useKeyboardShortcuts();

  const setTouchMultiSelectMode = useInteractionStore((s) => s.setTouchMultiSelectMode);

  // ✅ إطفاء وضع التحديد المتعدد اللمسي تلقائياً عند مسح التحديد أو تغيير الأداة
  useEffect(() => {
    if (activeTool !== 'selection_tool' || selectedElementIds.length === 0) {
      if (useInteractionStore.getState().touchMultiSelectMode) {
        setTouchMultiSelectMode(false);
      }
    }
  }, [activeTool, selectedElementIds.length, setTouchMultiSelectMode]);


  useTouchGestures({
    containerRef: containerRef as React.RefObject<HTMLElement>,
    // ✅ نعطّل tap/doubleTap الافتراضي — Pointer Events في InfiniteCanvas تتولى ذلك
    onTap: () => {},
    onDoubleTap: () => {},
    onTwoFingerTap: () => {},
    onLongPress: (_point, elementId) => {
      // ✅ long-press على عنصر يفعّل وضع التحديد المتعدد اللمسي
      if (elementId && activeTool === 'selection_tool') {
        setTouchMultiSelectMode(true);
        if ('vibrate' in navigator) navigator.vibrate([30, 20, 30]);
      }
    },
  });



  const [snapGuides, setSnapGuides] = useState<SnapLine[]>([]);
  const [hoveredConnectableElementId, setHoveredConnectableElementId] = useState<string | null>(null);
  // ✅ تحديد معلّق (Pending Marquee) — يمنع إنشاء boxSelect إلا بعد تجاوز عتبة السحب
  const pendingBoxSelectRef = useRef<{
    clientX: number;
    clientY: number;
    additive: boolean;
    pointerType: string;
    started: boolean;
  } | null>(null);
  const hoverRafRef = useRef<number | null>(null);


  const { lastPointerPositionRef, updatePointerFromClient } = useCanvasPointerTracking({
    containerRef,
    viewport,
  });

  const {
    connectionRef: mindMapConnectionRef,
    connectionUI: mindMapConnectionUI,
    handleStartConnection,
    handleEndConnection,
    updateConnectionPosition,
    cancelConnection,
  } = useMindMapConnectionController({
    elements,
    containerRef,
    viewport,
  });

  const { handleFileDrop, handleFileDragOver } = useCanvasDropController({
    containerRef,
    viewport,
  });

  const {
    viewportBounds,
    visibleElements,
    snapToGrid,
    handleWheel,
    getCursorStyle,
  } = useCanvasViewportController({
    containerRef,
    elements,
    layers,
    viewport,
    settings,
    activeTool,
    interactionMode,
    panBy,
    zoomByWheel,
    setViewportHostSize,
  });

  const {
    beginPanning,
    updatePan,
    beginBoxSelection,
    updateBoxSelectionFromClient,
    completeBoxSelection,
    selectionBoxData,
  } = useCanvasSelectionController({
    containerRef,
    viewport,
    boxSelectData,
    startPanning,
    startBoxSelect,
    updateBoxSelect,
    resetToIdle,
    finishSelection,
    clearSelection,
    updatePointerFromClient,
  });

  useCanvasPaste({
    lastPointerPosition: lastPointerPositionRef,
    viewportBounds,
    enabled: canEdit,
  });

  const rootConnectorElements = useMemo(
    () => elements.filter((element) => element.data?.smartType === 'root_connector'),
    [elements],
  );

  const rootConnectors = useMemo<RootConnectorData[]>(
    () => rootConnectorElements.map((element) => ({
      ...(element.data as RootConnectorData),
      id: element.id,
    })),
    [rootConnectorElements],
  );

  const connectableElements = useMemo(
    () =>
      visibleElements
        .filter((element) => element.data?.smartType !== 'root_connector')
        .map((element) => ({
          id: element.id,
          x: element.position.x,
          y: element.position.y,
          width: element.size.width,
          height: element.size.height,
          type: element.type === 'frame' ? 'frame' as const : element.type === 'smart' ? 'smart-element' as const : 'component' as const,
          smartType: typeof element.data?.smartType === 'string' ? element.data.smartType : null,
          entityType: typeof element.data?.entityType === 'string' ? element.data.entityType : null,
          locked: Boolean(element.locked || element.data?.locked || element.data?.isLocked || element.metadata?.locked),
          archived: element.data?.status === 'archived' || element.metadata?.status === 'archived' || element.metadata?.archived === true,
          canRead: element.visible !== false,
          canConnect: element.data?.canConnect !== false && element.metadata?.canConnect !== false,
          canCreateOperationalRelationship: element.data?.canCreateOperationalRelationship !== false && element.metadata?.canCreateOperationalRelationship !== false,
        })),
    [visibleElements],
  );

  const readableAIElements = useMemo<ReadableConnectorElementForAI[]>(
    () =>
      visibleElements
        .filter((element) => element.visible !== false && element.data?.smartType !== 'root_connector')
        .map((element) => ({
          id: element.id,
          type: element.type,
          smartType: typeof element.data?.smartType === 'string' ? element.data.smartType : null,
          title: readCanvasText(element.title, element.data?.title, element.metadata?.title, element.content),
          description: readCanvasText(element.description, element.data?.description, element.metadata?.description),
          position: element.position,
          size: element.size,
        })),
    [visibleElements],
  );

  const findHoveredConnectableElement = useCallback((x: number, y: number) => {
    const connectorHoverMargin = 28;
    const candidates = connectableElements.filter(
      (element) =>
        x >= element.x &&
        x <= element.x + element.width &&
        y >= element.y - connectorHoverMargin &&
        y <= element.y + element.height,
    );
    const nonFrame = [...candidates].reverse().find((element) => element.type !== 'frame');
    return nonFrame ?? candidates[candidates.length - 1] ?? null;
  }, [connectableElements]);

  const syncRootConnectors = useCallback(
    (nextConnectors: RootConnectorData[]) => {
      const previousIds = new Set(rootConnectorElements.map((element) => element.id));
      const nextIds = new Set(nextConnectors.map((connector) => connector.id));

      rootConnectorElements
        .filter((element) => !nextIds.has(element.id))
        .forEach((element) => {
          deleteElements([element.id]);
          void deleteSmartConnectorByElementId(element.id).catch((err) =>
            console.warn('[smart_connectors] delete failed', err),
          );
        });

      nextConnectors.forEach((connector) => {
        const position = {
          x: Math.min(connector.startPoint.x, connector.endPoint.x),
          y: Math.min(connector.startPoint.y, connector.endPoint.y),
        };
        const size = {
          width: Math.max(1, Math.abs(connector.endPoint.x - connector.startPoint.x)),
          height: Math.max(1, Math.abs(connector.endPoint.y - connector.startPoint.y)),
        };
        const data = {
          ...connector,
          smartType: 'root_connector',
          relationshipType: connector.relationshipType ?? connector.connectionType,
        };
        const metadata = {
          smartType: 'root_connector',
          relationshipType: connector.relationshipType ?? connector.connectionType,
          connectorMode: connector.connectorMode ?? 'semantic',
          status: connector.status ?? 'approved',
          direction: connector.direction ?? 'source_to_target',
          connectorPointType: connector.connectorPointType ?? 'anchor',
          branchMode: connector.branchMode ?? 'single',
          sourceSubAnchor: connector.sourceSubAnchor ?? connector.startPoint.anchorPoint,
          targetSubAnchor: connector.targetSubAnchor ?? connector.endPoint.anchorPoint,
          permissionScope: connector.permissionScope ?? 'board',
          source: connector.source ?? 'user',
          reason: connector.reason,
          aiConfidence: connector.aiConfidence,
          requiresReview: connector.requiresReview ?? false,
          isAIGenerated: connector.isAIGenerated ?? false,
          approvedByUser: connector.approvedByUser ?? true,
          smartActions: connector.smartActions ?? [],
          sourceElementId: connector.startPoint.elementId,
          targetElementId: connector.endPoint.elementId,
        };

        if (previousIds.has(connector.id)) {
          updateElement(connector.id, { position, size, data, metadata });
        } else {
          addElement({
            id: connector.id,
            type: 'smart',
            position,
            size,
            style: {},
            data,
            metadata,
          });
        }

        const isUnapprovedSuggestion = connector.status === 'suggested' || connector.requiresReview || connector.approvedByUser === false;
        if (isUnapprovedSuggestion) {
          void deleteSmartConnectorByElementId(connector.id).catch((err) =>
            console.warn('[smart_connectors] suggested connector cleanup failed', err),
          );
          return;
        }

        // Logical persistence (best-effort; visual planning element remains the client source of truth).
        const connectorRecords = toPlanningConnectorLogicalRecords({
          id: connector.id,
          type: 'smart',
          position,
          size,
          style: {},
          data,
          metadata,
        }, _boardId);
        if (connectorRecords.length > 0) {
          void upsertSmartConnectors(connectorRecords).catch((err) => console.warn('[smart_connectors] upsert failed', err));
        }
      });
    },
    [addElement, deleteElements, rootConnectorElements, updateElement, _boardId],
  );

  // 🧩 معالج لوحة اقتراحات الخطوة التالية (drop-on-empty)
  // - يُنشئ عنصرًا ذكيًا (أو فريمًا مع أبناء لعنصر مركّب) عند نقطة الإفلات.
  // - يوصّل المصدر بالعنصر الجديد تلقائيًا عبر RootConnector.
  const handleInsertNextStepSuggestion = useCallback(
    (
      suggestion: import('@/features/planning/elements/smart/RootConnector').AISuggestion,
      position: { x: number; y: number },
    ) => {
      const sourceId = (suggestion.data as { sourceElementId?: string } | undefined)?.sourceElementId;
      const preset = (suggestion.data as { preset?: string } | undefined)?.preset ?? 'task';
      const promptText = (suggestion.data as { prompt?: string } | undefined)?.prompt;
      const source = elements.find((el) => el.id === sourceId);
      if (!source || !sourceId) return;

      const now = new Date().toISOString();
      const newId = crypto.randomUUID();

      let newElementBounds: { x: number; y: number; width: number; height: number };
      const elementsToAdd: Array<Parameters<typeof addElement>[0]> = [];

      if (preset === 'framed_workflow') {
        // 🖼️ فريم واحد يحوي 3 عناصر ذكية كأداة مركّبة موحّدة
        const frameW = 520;
        const frameH = 300;
        const frameX = position.x;
        const frameY = position.y;
        newElementBounds = { x: frameX, y: frameY, width: frameW, height: frameH };

        const childIds = [crypto.randomUUID(), crypto.randomUUID(), crypto.randomUUID()];
        const childW = 140;
        const childH = 90;
        const gap = 16;
        const startX = frameX + gap;
        const childY = frameY + 60;

        elementsToAdd.push({
          id: newId,
          type: 'frame',
          position: { x: frameX, y: frameY },
          size: { width: frameW, height: frameH },
          style: {},
          data: { title: promptText?.slice(0, 60) || 'أداة مخصّصة', smartType: 'framed_workflow' },
          metadata: { generatedByAI: true, sourcePrompt: promptText, children: childIds, createdAt: now },
          children: childIds,
        } as Parameters<typeof addElement>[0]);

        childIds.forEach((cid, i) => {
          elementsToAdd.push({
            id: cid,
            type: 'smart',
            position: { x: startX + i * (childW + gap), y: childY },
            size: { width: childW, height: childH },
            style: {},
            data: { smartType: 'task_card', title: `خطوة ${i + 1}`, parentFrameId: newId },
            metadata: { parentFrameId: newId, generatedByAI: true, createdAt: now },
          } as Parameters<typeof addElement>[0]);
        });
      } else {
        // عنصر ذكي مفرد بحسب preset
        const w = 180;
        const h = 90;
        newElementBounds = { x: position.x, y: position.y, width: w, height: h };
        elementsToAdd.push({
          id: newId,
          type: 'smart',
          position: { x: position.x, y: position.y },
          size: { width: w, height: h },
          style: {},
          data: { smartType: preset, title: suggestion.title },
          metadata: { generatedByAI: false, createdAt: now },
        } as Parameters<typeof addElement>[0]);
      }

      elementsToAdd.forEach((el) => addElement(el));

      // 🔗 موصل تلقائي من المصدر إلى العنصر الجديد
      const startPoint = {
        elementId: sourceId,
        x: source.position.x + source.size.width,
        y: source.position.y + source.size.height * 0.25,
        anchorPoint: 'right' as const,
      };
      const endPoint = {
        elementId: newId,
        x: newElementBounds.x,
        y: newElementBounds.y + newElementBounds.height / 2,
        anchorPoint: 'left' as const,
      };
      const newConnector: RootConnectorData = {
        id: crypto.randomUUID(),
        startPoint,
        endPoint,
        status: 'approved',
        direction: 'source_to_target',
        connectorMode: 'semantic',
        source: 'user',
        approvedByUser: true,
        requiresReview: false,
        color: '#9CA3AF',
        strokeWidth: 1,
        style: 'solid',
        createdAt: now,
        updatedAt: now,
      };
      syncRootConnectors([...rootConnectors, newConnector]);
    },
    [addElement, elements, rootConnectors, syncRootConnectors],
  );

  const handleReadOnlyDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);


  const handleMouseDown = useCallback(
    (e: React.PointerEvent) => {
      const pointerType = e.pointerType || 'mouse';
      if (e.button === 1 || (e.button === 0 && e.altKey)) {
        beginPanning(e.clientX, e.clientY);
        if (containerRef.current) {
          containerRef.current.style.cursor = 'grabbing';
        }
        e.preventDefault();
        return;
      }

      const target = selectionCoordinator.identifyTarget(e.target as HTMLElement);

      if (e.button === 0 && activeTool === 'selection_tool' && target.type === 'canvas') {
        // ✅ لا نبدأ boxSelect فوراً — نخزّن حالة معلّقة حتى يتجاوز المؤشر عتبة السحب
        const touchMulti = useInteractionStore.getState().touchMultiSelectMode;
        pendingBoxSelectRef.current = {
          clientX: e.clientX,
          clientY: e.clientY,
          additive: e.shiftKey || e.ctrlKey || e.metaKey || touchMulti,
          pointerType,
          started: false,
        };
        return;
      }

      if (target.type === 'bounding-box' || target.type === 'resize-handle') {
        return;
      }

      if (e.button === 0 && activeTool === 'text_tool' && target.type === 'canvas') {
        const { editingTextId, stopEditingText } = useCanvasStore.getState();
        if (editingTextId) {
          stopEditingText();
          return;
        }
      }

      if (
        canEdit &&
        e.button === 0 &&
        (
          activeTool === 'file_uploader' ||
          activeTool === 'frame_tool' ||
          activeTool === 'smart_pen' ||
          activeTool === 'shapes_tool' ||
          activeTool === 'text_tool' ||
          activeTool === 'smart_element_tool' ||
          activeTool === 'sticky_tool' ||
          activeTool === 'mindmap_tool' ||
          activeTool === 'smart_doc_tool'
        )
      ) {
        handleCanvasMouseDown(e as unknown as React.MouseEvent);
        return;
      }

      if (e.button === 0 && target.type === 'canvas') {
        clearSelection();
      }
    },
    [activeTool, beginPanning, canEdit, clearSelection, handleCanvasMouseDown],
  );

  const handleMouseMove = useCallback(
    (e: React.PointerEvent) => {
      const pointerType = e.pointerType || 'mouse';
      const pointer = updatePointerFromClient(e.clientX, e.clientY);
      if (pointer) {
        broadcastCursor?.(pointer.x, pointer.y);
        // ✅ hover فقط للماوس، ومع throttle عبر rAF + مقارنة قيمة
        if (pointerType === 'mouse' && canEdit && activeTool === 'selection_tool') {
          if (hoverRafRef.current === null) {
            hoverRafRef.current = requestAnimationFrame(() => {
              hoverRafRef.current = null;
              const next = findHoveredConnectableElement(pointer.x, pointer.y)?.id ?? null;
              setHoveredConnectableElementId((prev) => (prev === next ? prev : next));
            });
          }
        } else if (hoveredConnectableElementId) {
          setHoveredConnectableElementId(null);
        }
      }

      // ✅ ترقية Pending Marquee إلى Box Select بعد تجاوز عتبة السحب (ماوس=6px, لمس/قلم=10px)
      const pending = pendingBoxSelectRef.current;
      if (pending && !pending.started) {
        const dx = e.clientX - pending.clientX;
        const dy = e.clientY - pending.clientY;
        const threshold = pending.pointerType === 'mouse' ? 6 : 10;
        if (Math.hypot(dx, dy) >= threshold) {
          pending.started = true;
          if (!pending.additive) {
            clearSelection();
          }
          beginBoxSelection(pending.clientX, pending.clientY, pending.additive);
        }
      }

      if (mindMapConnectionRef.current.isConnecting) {
        updateConnectionPosition(e.clientX, e.clientY);
      }

      if (isMode('panning')) {
        updatePan(e.clientX, e.clientY, panBy);
        return;
      }

      if (isMode('boxSelect') && boxSelectData) {
        updateBoxSelectionFromClient(e.clientX, e.clientY);
        return;
      }

      if (canEdit) {
        handleCanvasMouseMove(e as unknown as React.MouseEvent);
      }
    },
    [activeTool, beginBoxSelection, broadcastCursor, boxSelectData, canEdit, clearSelection, findHoveredConnectableElement, handleCanvasMouseMove, hoveredConnectableElementId, isMode, mindMapConnectionRef, panBy, updateBoxSelectionFromClient, updateConnectionPosition, updatePan, updatePointerFromClient],
  );


  const handleMouseUp = useCallback((e?: React.PointerEvent) => {
    // ✅ إلغاء pending marquee — إن كان معلّقاً ولم يبدأ فعلاً: نقرة قصيرة على فراغ
    const pending = pendingBoxSelectRef.current;
    pendingBoxSelectRef.current = null;
    if (pending && !pending.started && !pending.additive) {
      clearSelection();
    }

    setHoveredConnectableElementId(null);
    const conn = mindMapConnectionRef.current;
    if (conn.isConnecting && conn.sourceNodeId) {
      if (conn.nearestAnchor) {
        handleEndConnection(conn.nearestAnchor.nodeId, conn.nearestAnchor.anchor);
      } else {
        cancelConnection();
      }
    }

    if (isMode('panning')) {
      resetToIdle();
      if (containerRef.current) {
        containerRef.current.style.cursor = 'default';
      }
    }

    if (isMode('boxSelect') && boxSelectData) {
      completeBoxSelection();
    }

    if (canEdit) {
      handleCanvasMouseUp();
    }
  }, [boxSelectData, cancelConnection, canEdit, clearSelection, completeBoxSelection, handleCanvasMouseUp, handleEndConnection, isMode, mindMapConnectionRef, resetToIdle]);


  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  return (
    <div
      ref={containerRef}
      data-canvas-container="true"
      className={`relative w-full h-full overflow-hidden infinite-canvas-container ${activeTool === 'text_tool' ? 'text-tool-active' : ''}`}
      onPointerDown={handleMouseDown}
      onPointerMove={handleMouseMove}
      onPointerUp={handleMouseUp}
      onPointerCancel={handleMouseUp}
      onPointerLeave={handleMouseUp}
      onDrop={canEdit ? handleFileDrop : handleReadOnlyDrop}
      onDragOver={canEdit ? handleFileDragOver : handleReadOnlyDrop}
      onContextMenu={(e) => {
        // ✅ منع القائمة السياقية للنظام عند long-press باللمس
        if ((e.nativeEvent as PointerEvent).pointerType && (e.nativeEvent as PointerEvent).pointerType !== 'mouse') {
          e.preventDefault();
        }
      }}
      style={{
        backgroundColor: settings.background,
        cursor: getCursorStyle(),
        // ✅ منع تمرير المتصفح أثناء marquee على أداة التحديد؛ السماح بالتمرير الطبيعي للأدوات الأخرى
        touchAction: activeTool === 'selection_tool' ? 'none' : 'pan-x pan-y',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
      }}

    >
      <CanvasGridLayer />

      <div
        ref={canvasRef}
        className="absolute inset-0 origin-top-left"
        style={{
          transform: `translate(${viewport.pan.x}px, ${viewport.pan.y}px) scale(${viewport.zoom})`,
          transition: 'none',
          willChange: 'transform',
          pointerEvents: canEdit ? 'auto' : 'none',
        }}
      >
        <StrokesLayer />

        {visibleElements
          .filter((element) => element.data?.smartType !== 'root_connector')
          .map((element) => (
          <CanvasElement
            key={element.id}
            element={element}
            isSelected={selectedElementIds.includes(element.id)}
            onSelect={(multiSelect) => selectElement(element.id, multiSelect)}
            snapToGrid={settings.snapToGrid ? snapToGrid : undefined}
            activeTool={activeTool}
            requestElementLock={requestElementLock}
            releaseElementLock={releaseElementLock}
            onStartConnection={handleStartConnection}
            onEndConnection={handleEndConnection}
            isConnecting={mindMapConnectionUI.isConnecting}
            nearestAnchor={mindMapConnectionUI.nearestAnchor}
          />
        ))}

        <svg
          className="absolute left-0 top-0 overflow-visible"
          width="100000"
          height="100000"
          style={{ pointerEvents: 'none' }}
        >
          <SmartConnectorManager
            elements={connectableElements}
            boardId={_boardId}
            readableAIElements={readableAIElements}
            connectors={rootConnectors}
            onConnectorsChange={syncRootConnectors}
            selectedConnectorId={selectedElementIds.find((id) => rootConnectorElements.some((element) => element.id === id)) ?? undefined}
            onSelectConnector={(id) => {
              if (id) selectElement(id, false);
              else clearSelection();
            }}
            selectedElementIds={selectedElementIds}
            hoveredElementId={hoveredConnectableElementId}
            showAnchors={canEdit && activeTool === 'selection_tool' && (selectedElementIds.length > 0 || hoveredConnectableElementId !== null)}
            onInsertComponent={handleInsertNextStepSuggestion}
          />

        </svg>

        {mindMapConnectionUI.isConnecting && mindMapConnectionUI.startPosition && mindMapConnectionUI.currentPosition && (
          <MindMapConnectionLine
            startPosition={mindMapConnectionUI.startPosition}
            endPosition={mindMapConnectionUI.nearestAnchor?.position || mindMapConnectionUI.currentPosition}
            startAnchor={mindMapConnectionRef.current.sourceAnchor || 'right'}
            color={elements.find((el) => el.id === mindMapConnectionRef.current.sourceNodeId)?.data?.color}
            isSnapped={!!mindMapConnectionUI.nearestAnchor}
          />
        )}

        {canEdit && <BoundingBox onGuidesChange={setSnapGuides} />}
        {tempElement && canEdit && <DrawingPreview element={tempElement} />}
        <PresenceCursors peers={peers} />
      </div>

      {isMode('boxSelect') && selectionBoxData && (
        <SelectionBox
          startX={selectionBoxData.startX}
          startY={selectionBoxData.startY}
          currentX={selectionBoxData.currentX}
          currentY={selectionBoxData.currentY}
        />
      )}

      <SnapGuides guides={snapGuides} containerRef={containerRef} />

      <PenInputLayer containerRef={containerRef} active={canEdit && activeTool === 'smart_pen'} />
      <FrameInputLayer containerRef={containerRef} active={canEdit && activeTool === 'frame_tool'} />
      <PenFloatingToolbar isVisible={canEdit && activeTool === 'smart_pen'} />

    </div>
  );
};

export default InfiniteCanvas;
