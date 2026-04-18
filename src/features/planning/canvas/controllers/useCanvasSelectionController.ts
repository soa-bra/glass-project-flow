import { useCallback, useMemo, useRef } from 'react';
import type { RefObject } from 'react';
import { canvasKernel } from '@/engine/canvas/kernel/canvasKernel';

interface BoxSelectData {
  startWorld: { x: number; y: number };
  currentWorld: { x: number; y: number };
  additive: boolean;
}

interface UseCanvasSelectionControllerOptions {
  containerRef: RefObject<HTMLDivElement>;
  viewport: { zoom: number; pan: { x: number; y: number } };
  boxSelectData: BoxSelectData | null;
  startPanning: (pointer: { x: number; y: number }, currentPan: { x: number; y: number }) => void;
  startBoxSelect: (point: { x: number; y: number }, additive: boolean) => void;
  updateBoxSelect: (point: { x: number; y: number }) => void;
  resetToIdle: () => void;
  finishSelection: (startX: number, startY: number, endX: number, endY: number, additive?: boolean) => void;
  updatePointerFromClient: (clientX: number, clientY: number) => { x: number; y: number } | null;
}

export function useCanvasSelectionController({
  containerRef,
  viewport,
  boxSelectData,
  startPanning,
  startBoxSelect,
  updateBoxSelect,
  resetToIdle,
  finishSelection,
  updatePointerFromClient,
}: UseCanvasSelectionControllerOptions) {
  const lastPanPositionRef = useRef({ x: 0, y: 0 });

  const beginPanning = useCallback(
    (clientX: number, clientY: number) => {
      startPanning({ x: clientX, y: clientY }, { x: viewport.pan.x, y: viewport.pan.y });
      lastPanPositionRef.current = { x: clientX, y: clientY };
    },
    [startPanning, viewport.pan.x, viewport.pan.y],
  );

  const updatePan = useCallback(
    (clientX: number, clientY: number, panBy: (deltaX: number, deltaY: number) => void) => {
      const deltaX = clientX - lastPanPositionRef.current.x;
      const deltaY = clientY - lastPanPositionRef.current.y;
      panBy(deltaX, deltaY);
      lastPanPositionRef.current = { x: clientX, y: clientY };
    },
    [],
  );

  const beginBoxSelection = useCallback(
    (clientX: number, clientY: number, additive: boolean) => {
      const worldPoint = updatePointerFromClient(clientX, clientY);
      if (!worldPoint) return false;
      startBoxSelect(worldPoint, additive);
      return true;
    },
    [startBoxSelect, updatePointerFromClient],
  );

  const updateBoxSelectionFromClient = useCallback(
    (clientX: number, clientY: number) => {
      const worldPoint = updatePointerFromClient(clientX, clientY);
      if (worldPoint) {
        updateBoxSelect(worldPoint);
      }
    },
    [updateBoxSelect, updatePointerFromClient],
  );

  const completeBoxSelection = useCallback(() => {
    if (!boxSelectData) return;
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    const startScreen = canvasKernel.worldToScreen(boxSelectData.startWorld.x, boxSelectData.startWorld.y, viewport, containerRect);
    const endScreen = canvasKernel.worldToScreen(boxSelectData.currentWorld.x, boxSelectData.currentWorld.y, viewport, containerRect);

    const startX = startScreen.x - containerRect.left;
    const startY = startScreen.y - containerRect.top;
    const endX = endScreen.x - containerRect.left;
    const endY = endScreen.y - containerRect.top;
    const boxWidth = Math.abs(endX - startX);
    const boxHeight = Math.abs(endY - startY);

    if (boxWidth >= 5 || boxHeight >= 5) {
      finishSelection(startX, startY, endX, endY, boxSelectData.additive);
    }

    resetToIdle();
  }, [boxSelectData, containerRef, finishSelection, resetToIdle, viewport]);

  const selectionBoxData = useMemo(() => {
    if (!boxSelectData) return null;
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return null;

    const startScreen = canvasKernel.worldToScreen(boxSelectData.startWorld.x, boxSelectData.startWorld.y, viewport, containerRect);
    const currentScreen = canvasKernel.worldToScreen(boxSelectData.currentWorld.x, boxSelectData.currentWorld.y, viewport, containerRect);

    return {
      startX: startScreen.x - containerRect.left,
      startY: startScreen.y - containerRect.top,
      currentX: currentScreen.x - containerRect.left,
      currentY: currentScreen.y - containerRect.top,
    };
  }, [boxSelectData, containerRef, viewport]);

  return {
    lastPanPositionRef,
    beginPanning,
    updatePan,
    beginBoxSelection,
    updateBoxSelectionFromClient,
    completeBoxSelection,
    selectionBoxData,
  };
}

export default useCanvasSelectionController;
