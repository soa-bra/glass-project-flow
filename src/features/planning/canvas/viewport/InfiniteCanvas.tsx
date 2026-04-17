// InfiniteCanvas - v2 optimized connection handling
import React, { useRef, useCallback, useEffect, useMemo, useState } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import { useInteractionStore, selectBoxSelectData } from '@/stores/interactionStore';
import { useSmartElementsStore } from '@/stores/smartElementsStore';
import CanvasElement from '@/features/planning/canvas/layers/CanvasElement';
import DrawingPreview from '@/features/planning/canvas/viewport/DrawingPreview';
import SelectionBox, { useSelectionBox } from '@/features/planning/canvas/selection/SelectionBox';
import StrokesLayer from '@/features/planning/canvas/gestures/StrokesLayer';
import PenInputLayer from '@/features/planning/canvas/gestures/PenInputLayer';
import FrameInputLayer from '@/features/planning/canvas/gestures/FrameInputLayer';
import { BoundingBox } from '@/features/planning/canvas/selection/BoundingBox';
import { SnapGuides } from '@/features/planning/canvas/transforms/SnapGuides';
import { useToolInteraction } from '@/hooks/useToolInteraction';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useTouchGestures } from '@/hooks/useTouchGestures';
import { useCanvasPaste } from '@/hooks/useCanvasPaste';
import { canvasKernel, getContainerRect } from '@/engine/canvas/kernel/canvasKernel';
import { getCursorForMode } from '@/engine/canvas/interaction/interactionStateMachine';
import { selectionCoordinator } from '@/engine/canvas/interaction/selectionCoordinator';
import { toast } from 'sonner';
import { PenFloatingToolbar } from '@/components/ui/penToolbar';
import { CanvasGridLayer } from '@/features/planning/canvas/viewport/CanvasGridLayer';
import { RealtimeSyncManager } from '@/features/planning/integration/collaboration';
import { useCollaborationUser } from '@/hooks/useCollaborationUser';
import MindMapConnectionLine from '@/features/planning/elements/mindmap/MindMapConnectionLine';

import { findNearestAnchor, calculateConnectorBounds, type NodeAnchorPoint, type MindMapConnectorData } from '@/types/mindmap-canvas';
import type { SnapLine } from '@/engine/canvas/interaction/snapEngine';

interface InfiniteCanvasProps {
  boardId: string;
}

function getCanvasHostSize(container: HTMLDivElement | null): { width: number; height: number } {
  if (container) {
    return {
      width: container.clientWidth,
      height: container.clientHeight,
    };
  }

  if (typeof window !== 'undefined') {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  return { width: 1280, height: 720 };
}

const InfiniteCanvas: React.FC<InfiniteCanvasProps> = ({
  boardId,
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
  const clearSelection = useCanvasStore((state) => state.clearSelection);
  const selectElement = useCanvasStore((state) => state.selectElement);

  const {
    mode: interactionMode,
    startPanning,
    startBoxSelect,
    updateBoxSelect,
    resetToIdle,
    isMode,
  } = useInteractionStore();

  const boxSelectData = useInteractionStore(selectBoxSelectData);

  const {
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
  } = useToolInteraction(containerRef);

  const { finishSelection } = useSelectionBox();

  useKeyboardShortcuts();

  useTouchGestures({
    containerRef: containerRef as React.RefObject<HTMLElement>,
    onLongPress: (point) => {
      console.log('Long press at:', point);
    },
  });

  const collaborationUser = useCollaborationUser();
  const lastPanPositionRef = useRef({ x: 0, y: 0 });
  const lastPointerPositionRef = useRef<{ x: number; y: number } | null>(null);
  const [snapGuides, setSnapGuides] = useState<SnapLine[]>([]);
  const [containerSize, setContainerSize] = useState(() => getCanvasHostSize(null));

  const mindMapConnectionRef = useRef<{
    isConnecting: boolean;
    sourceNodeId: string | null;
    sourceAnchor: 'top' | 'bottom' | 'left' | 'right' | null;
    startPosition: { x: number; y: number } | null;
    currentPosition: { x: number; y: number } | null;
    nearestAnchor: NodeAnchorPoint | null;
  }>({
    isConnecting: false,
    sourceNodeId: null,
    sourceAnchor: null,
    startPosition: null,
    currentPosition: null,
    nearestAnchor: null,
  });

  const [mindMapConnectionUI, setMindMapConnectionUI] = useState<{
    isConnecting: boolean;
    startPosition: { x: number; y: number } | null;
    currentPosition: { x: number; y: number } | null;
    nearestAnchor: NodeAnchorPoint | null;
  }>({
    isConnecting: false,
    startPosition: null,
    currentPosition: null,
    nearestAnchor: null,
  });

  const updateUIRef = useRef<number | null>(null);
  const updateConnectionUI = useCallback(() => {
    if (updateUIRef.current) return;
    updateUIRef.current = requestAnimationFrame(() => {
      const conn = mindMapConnectionRef.current;
      setMindMapConnectionUI({
        isConnecting: conn.isConnecting,
        startPosition: conn.startPosition,
        currentPosition: conn.currentPosition,
        nearestAnchor: conn.nearestAnchor,
      });
      updateUIRef.current = null;
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const syncContainerSize = () => {
      setContainerSize(getCanvasHostSize(container));
    };

    syncContainerSize();

    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver(() => {
      syncContainerSize();
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const handleStartConnection = useCallback((
    nodeId: string,
    anchor: 'top' | 'bottom' | 'left' | 'right',
    position: { x: number; y: number },
  ) => {
    mindMapConnectionRef.current = {
      isConnecting: true,
      sourceNodeId: nodeId,
      sourceAnchor: anchor,
      startPosition: position,
      currentPosition: position,
      nearestAnchor: null,
    };
    updateConnectionUI();
  }, [updateConnectionUI]);

  const handleEndConnection = useCallback((
    nodeId: string,
    anchor: 'top' | 'bottom' | 'left' | 'right',
  ) => {
    const conn = mindMapConnectionRef.current;
    if (!conn.isConnecting || !conn.sourceNodeId) return;
    if (conn.sourceNodeId === nodeId) return;

    const sourceNode = elements.find((el) => el.id === conn.sourceNodeId);
    if (!sourceNode) return;

    const targetNode = elements.find((el) => el.id === nodeId);
    if (!targetNode) return;

    const connectorBounds = calculateConnectorBounds(sourceNode, targetNode);

    useCanvasStore.getState().addElement({
      type: 'mindmap_connector',
      position: connectorBounds.position,
      size: connectorBounds.size,
      data: {
        startNodeId: conn.sourceNodeId,
        endNodeId: nodeId,
        startAnchor: { nodeId: conn.sourceNodeId, anchor: conn.sourceAnchor },
        endAnchor: { nodeId, anchor },
        curveStyle: 'bezier',
        color: sourceNode.data?.color || '#3DA8F5',
        strokeWidth: 2,
      } as MindMapConnectorData,
    });

    mindMapConnectionRef.current = {
      isConnecting: false,
      sourceNodeId: null,
      sourceAnchor: null,
      startPosition: null,
      currentPosition: null,
      nearestAnchor: null,
    };
    updateConnectionUI();
  }, [elements, updateConnectionUI]);

  const updateConnectionPosition = useCallback((clientX: number, clientY: number) => {
    const conn = mindMapConnectionRef.current;
    if (!conn.isConnecting) return;

    const containerRect = getContainerRect(containerRef);
    if (!containerRect) return;

    const canvasPoint = canvasKernel.screenToWorld(clientX, clientY, viewport, containerRect);

    const connectableElements = elements.filter((el) => {
      if (el.id === conn.sourceNodeId) return false;
      if (el.type === 'mindmap_connector' || el.type === 'visual_connector') return false;
      return ['mindmap_node', 'visual_node', 'shape', 'text', 'image', 'sticky', 'frame', 'smart', 'file'].includes(el.type);
    });

    let nearest: NodeAnchorPoint | null = null;
    let nearestDistance = 60;

    for (const node of connectableElements) {
      const result = findNearestAnchor(canvasPoint, node.position, node.size);
      if (result.distance < nearestDistance) {
        nearestDistance = result.distance;
        nearest = {
          id: `${node.id}-${result.anchor}`,
          nodeId: node.id,
          anchor: result.anchor,
          position: result.position,
        };
      }
    }

    mindMapConnectionRef.current.currentPosition = canvasPoint;
    mindMapConnectionRef.current.nearestAnchor = nearest;
    updateConnectionUI();
  }, [elements, viewport, updateConnectionUI]);

  const cancelConnection = useCallback(() => {
    if (mindMapConnectionRef.current.isConnecting) {
      mindMapConnectionRef.current = {
        isConnecting: false,
        sourceNodeId: null,
        sourceAnchor: null,
        startPosition: null,
        currentPosition: null,
        nearestAnchor: null,
      };
      updateConnectionUI();
    }
  }, [updateConnectionUI]);

  const viewportBounds = useMemo(() => {
    return canvasKernel.getVisibleBounds(viewport, containerSize.width, containerSize.height);
  }, [viewport, containerSize.width, containerSize.height]);

  useCanvasPaste({
    lastPointerPosition: lastPointerPositionRef,
    viewportBounds,
    enabled: true,
  });

  const selectedIdsSet = useMemo(() => new Set(selectedElementIds), [selectedElementIds]);
  const layerVisibilityMap = useMemo(() => {
    return new Map(layers.map((layer) => [layer.id, layer.visible]));
  }, [layers]);

  const visibleElements = useMemo(() => {
    const padding = 200;
    return elements.filter((el) => {
      const isLayerVisible = el.layerId ? layerVisibilityMap.get(el.layerId) : undefined;
      if (!isLayerVisible || !el.visible) return false;

      if (el.type === 'mindmap_connector') return true;

      return el.position.x + el.size.width >= viewportBounds.x - padding &&
             el.position.x <= viewportBounds.x + viewportBounds.width + padding &&
             el.position.y + el.size.height >= viewportBounds.y - padding &&
             el.position.y <= viewportBounds.y + viewportBounds.height + padding;
    });
  }, [elements, viewportBounds, layerVisibilityMap]);

  const snapToGrid = useCallback((x: number, y: number) => {
    return canvasKernel.snapToGrid({ x, y }, settings.gridSize, settings.snapToGrid);
  }, [settings.snapToGrid, settings.gridSize]);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      zoomByWheel(e.deltaY, e.clientX, e.clientY);
    } else {
      panBy(-e.deltaX, -e.deltaY);
    }
  }, [zoomByWheel, panBy]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      startPanning(
        { x: e.clientX, y: e.clientY },
        { x: viewport.pan.x, y: viewport.pan.y },
      );
      lastPanPositionRef.current = { x: e.clientX, y: e.clientY };

      if (containerRef.current) {
        containerRef.current.style.cursor = 'grabbing';
      }
      e.preventDefault();
      return;
    }

    const target = selectionCoordinator.identifyTarget(e.target as HTMLElement);

    if (e.button === 0 && activeTool === 'selection_tool' && target.type === 'canvas') {
      if (!e.shiftKey) {
        clearSelection();
      }

      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;

      const worldPoint = canvasKernel.screenToWorld(
        e.clientX,
        e.clientY,
        viewport,
        containerRect,
      );
      lastPointerPositionRef.current = worldPoint;
      startBoxSelect(worldPoint, e.shiftKey);
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

    if (e.button === 0 && (
      activeTool === 'file_uploader' ||
      activeTool === 'frame_tool' ||
      activeTool === 'smart_pen' ||
      activeTool === 'shapes_tool' ||
      activeTool === 'text_tool' ||
      activeTool === 'smart_element_tool' ||
      activeTool === 'sticky_tool' ||
      activeTool === 'mindmap_tool' ||
      activeTool === 'smart_doc_tool'
    )) {
      handleCanvasMouseDown(e);
      return;
    }

    if (e.button === 0 && target.type === 'canvas') {
      clearSelection();
    }
  }, [activeTool, handleCanvasMouseDown, clearSelection, viewport, startPanning, startBoxSelect]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (containerRect) {
      const worldPoint = canvasKernel.screenToWorld(
        e.clientX,
        e.clientY,
        viewport,
        containerRect,
      );
      lastPointerPositionRef.current = worldPoint;
    }

    if (mindMapConnectionRef.current.isConnecting) {
      updateConnectionPosition(e.clientX, e.clientY);
    }

    if (isMode('panning')) {
      const deltaX = e.clientX - lastPanPositionRef.current.x;
      const deltaY = e.clientY - lastPanPositionRef.current.y;
      panBy(deltaX, deltaY);
      lastPanPositionRef.current = { x: e.clientX, y: e.clientY };
      return;
    }

    if (isMode('boxSelect') && boxSelectData) {
      const moveContainerRect = containerRef.current?.getBoundingClientRect();
      if (moveContainerRect) {
        const worldPoint = canvasKernel.screenToWorld(
          e.clientX,
          e.clientY,
          viewport,
          moveContainerRect,
        );
        updateBoxSelect(worldPoint);
      }
      return;
    }

    handleCanvasMouseMove(e);
  }, [panBy, handleCanvasMouseMove, updateConnectionPosition, isMode, boxSelectData, updateBoxSelect, viewport]);

  const handleMouseUp = useCallback(() => {
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
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (containerRect) {
        const startScreen = canvasKernel.worldToScreen(
          boxSelectData.startWorld.x,
          boxSelectData.startWorld.y,
          viewport,
          containerRect,
        );
        const endScreen = canvasKernel.worldToScreen(
          boxSelectData.currentWorld.x,
          boxSelectData.currentWorld.y,
          viewport,
          containerRect,
        );

        const startX = startScreen.x - containerRect.left;
        const startY = startScreen.y - containerRect.top;
        const endX = endScreen.x - containerRect.left;
        const endY = endScreen.y - containerRect.top;

        const boxWidth = Math.abs(endX - startX);
        const boxHeight = Math.abs(endY - startY);

        if (boxWidth >= 5 || boxHeight >= 5) {
          finishSelection(startX, startY, endX, endY, boxSelectData.additive);
        }
      }

      resetToIdle();
    }

    handleCanvasMouseUp();
  }, [handleCanvasMouseUp, handleEndConnection, cancelConnection, isMode, boxSelectData, resetToIdle, viewport, finishSelection]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();

    const containerRect = getContainerRect(containerRef);
    if (!containerRect) return;
    const canvasPoint = canvasKernel.screenToWorld(e.clientX, e.clientY, viewport, containerRect);

    const smartElementData = e.dataTransfer.getData('application/smart-element');
    if (smartElementData) {
      try {
        const { type, name } = JSON.parse(smartElementData);
        const { addSmartElement } = useSmartElementsStore.getState();
        addSmartElement(type, canvasPoint, { title: name });
        toast.success(`تم إدراج ${name}`);
        return;
      } catch (err) {
        console.error('Failed to parse smart element data:', err);
      }
    }

    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;
    const file = e.dataTransfer.files[0];

    if (file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      useCanvasStore.getState().addElement({
        type: 'image',
        position: canvasPoint,
        size: { width: 300, height: 200 },
        src: imageUrl,
        alt: file.name,
      });
      toast.success(`تم إدراج الصورة: ${file.name}`);
    } else {
      useCanvasStore.getState().addElement({
        type: 'file',
        position: canvasPoint,
        size: { width: 250, height: 120 },
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        fileUrl: URL.createObjectURL(file),
      });
      toast.success(`تم إدراج الملف: ${file.name}`);
    }
  }, [viewport]);

  const handleFileDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const getCursorStyle = useCallback(() => {
    if (interactionMode.kind !== 'idle') {
      return getCursorForMode(interactionMode);
    }

    switch (activeTool) {
      case 'text_tool':
        return 'text';
      case 'smart_pen':
      case 'shapes_tool':
      case 'frame_tool':
      case 'smart_element_tool':
      case 'smart_doc_tool':
        return 'crosshair';
      case 'file_uploader':
        return 'copy';
      default:
        return 'default';
    }
  }, [activeTool, interactionMode]);

  const selectionBoxData = useMemo(() => {
    if (!boxSelectData) return null;

    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return null;

    const startScreen = canvasKernel.worldToScreen(
      boxSelectData.startWorld.x,
      boxSelectData.startWorld.y,
      viewport,
      containerRect,
    );
    const currentScreen = canvasKernel.worldToScreen(
      boxSelectData.currentWorld.x,
      boxSelectData.currentWorld.y,
      viewport,
      containerRect,
    );

    return {
      startX: startScreen.x - containerRect.left,
      startY: startScreen.y - containerRect.top,
      currentX: currentScreen.x - containerRect.left,
      currentY: currentScreen.y - containerRect.top,
    };
  }, [boxSelectData, viewport]);

  return (
    <div
      ref={containerRef}
      data-canvas-container="true"
      className={`relative w-full h-full overflow-hidden infinite-canvas-container ${
        activeTool === 'text_tool' ? 'text-tool-active' : ''
      }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDrop={handleFileDrop}
      onDragOver={handleFileDragOver}
      style={{
        backgroundColor: settings.background,
        cursor: getCursorStyle(),
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
        }}
      >
        <StrokesLayer />

        {visibleElements.map((element) => (
          <CanvasElement
            key={element.id}
            element={element}
            isSelected={selectedIdsSet.has(element.id)}
            onSelect={(multiSelect) => selectElement(element.id, multiSelect)}
            snapToGrid={settings.snapToGrid ? snapToGrid : undefined}
            activeTool={activeTool}
            onStartConnection={handleStartConnection}
            onEndConnection={handleEndConnection}
            isConnecting={mindMapConnectionUI.isConnecting}
            nearestAnchor={mindMapConnectionUI.nearestAnchor}
          />
        ))}

        {mindMapConnectionUI.isConnecting && mindMapConnectionUI.startPosition && mindMapConnectionUI.currentPosition && (
          <MindMapConnectionLine
            startPosition={mindMapConnectionUI.startPosition}
            endPosition={mindMapConnectionUI.nearestAnchor?.position || mindMapConnectionUI.currentPosition}
            startAnchor={mindMapConnectionRef.current.sourceAnchor || 'right'}
            color={elements.find((el) => el.id === mindMapConnectionRef.current.sourceNodeId)?.data?.color}
            isSnapped={!!mindMapConnectionUI.nearestAnchor}
          />
        )}

        <BoundingBox onGuidesChange={setSnapGuides} />
        {tempElement && <DrawingPreview element={tempElement} />}
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

      <PenInputLayer
        containerRef={containerRef}
        active={activeTool === 'smart_pen'}
      />

      <FrameInputLayer
        containerRef={containerRef}
        active={activeTool === 'frame_tool'}
      />

      <PenFloatingToolbar isVisible={activeTool === 'smart_pen'} />

      <RealtimeSyncManager
        boardId={boardId}
        userId={collaborationUser.id}
        userName={collaborationUser.name}
        enabled={true}
        viewport={viewport}
        onSyncStatusChange={(status) => {
          console.log('Sync status:', status);
        }}
      />
    </div>
  );
};

export default InfiniteCanvas;
