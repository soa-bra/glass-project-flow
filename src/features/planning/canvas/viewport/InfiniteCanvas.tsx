// InfiniteCanvas - v2 optimized connection handling
import React, { useRef, useCallback, useEffect, useState } from 'react';
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
import { RealtimeSyncManager } from '@/features/planning/integration/collaboration';
import MindMapConnectionLine from '@/features/planning/elements/mindmap/MindMapConnectionLine';
import type { SnapLine } from '@/engine/canvas/interaction/snapEngine';
import { useCanvasPointerTracking } from '@/features/planning/canvas/controllers/useCanvasPointerTracking';
import { useCanvasDropController } from '@/features/planning/canvas/controllers/useCanvasDropController';
import { useMindMapConnectionController } from '@/features/planning/canvas/controllers/useMindMapConnectionController';
import { useCanvasViewportController } from '@/features/planning/canvas/controllers/useCanvasViewportController';
import { useCanvasSelectionController } from '@/features/planning/canvas/controllers/useCanvasSelectionController';
import { useCanvasRealtimeController } from '@/features/planning/canvas/controllers/useCanvasRealtimeController';

interface InfiniteCanvasProps {
  boardId: string;
}

const InfiniteCanvas: React.FC<InfiniteCanvasProps> = ({ boardId }) => {
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

  const { handleCanvasMouseDown, handleCanvasMouseMove, handleCanvasMouseUp } = useToolInteraction(containerRef);
  const { finishSelection } = useSelectionBox();

  useKeyboardShortcuts();

  useTouchGestures({
    containerRef: containerRef as React.RefObject<HTMLElement>,
    onLongPress: (point) => {
      console.log('Long press at:', point);
    },
  });

  const [snapGuides, setSnapGuides] = useState<SnapLine[]>([]);

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
    updatePointerFromClient,
  });

  const { realtimeProps } = useCanvasRealtimeController({
    boardId,
    viewport,
  });

  useCanvasPaste({
    lastPointerPosition: lastPointerPositionRef,
    viewportBounds,
    enabled: true,
  });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
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
        if (!e.shiftKey) {
          clearSelection();
        }
        beginBoxSelection(e.clientX, e.clientY, e.shiftKey);
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
        handleCanvasMouseDown(e);
        return;
      }

      if (e.button === 0 && target.type === 'canvas') {
        clearSelection();
      }
    },
    [activeTool, beginBoxSelection, beginPanning, clearSelection, handleCanvasMouseDown],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      updatePointerFromClient(e.clientX, e.clientY);

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

      handleCanvasMouseMove(e);
    },
    [boxSelectData, handleCanvasMouseMove, isMode, mindMapConnectionRef, panBy, updateBoxSelectionFromClient, updateConnectionPosition, updatePan, updatePointerFromClient],
  );

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
      completeBoxSelection();
    }

    handleCanvasMouseUp();
  }, [boxSelectData, cancelConnection, completeBoxSelection, handleCanvasMouseUp, handleEndConnection, isMode, mindMapConnectionRef, resetToIdle]);

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
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDrop={handleFileDrop}
      onDragOver={handleFileDragOver}
      style={{ backgroundColor: settings.background, cursor: getCursorStyle() }}
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
            isSelected={selectedElementIds.includes(element.id)}
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

      <PenInputLayer containerRef={containerRef} active={activeTool === 'smart_pen'} />
      <FrameInputLayer containerRef={containerRef} active={activeTool === 'frame_tool'} />
      <PenFloatingToolbar isVisible={activeTool === 'smart_pen'} />

      <RealtimeSyncManager {...realtimeProps} />
    </div>
  );
};

export default InfiniteCanvas;
