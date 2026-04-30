import { useEffect } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import type { CanvasBoard } from '@/types/planning';
import { DEFAULT_LAYER } from '@/features/planning/state/types';

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

export function useBoardCanvasLifecycle(board: CanvasBoard | null): void {
  useEffect(() => {
    const canvasStore = useCanvasStore.getState();

    if (!board) {
      useCanvasStore.setState({
        elements: [],
        layers: [{ ...DEFAULT_LAYER, elements: [] }],
        selectedElementIds: [],
        viewport: { zoom: 1, pan: { x: 0, y: 0 } },
        activeLayerId: DEFAULT_LAYER.id,
        history: { past: [], future: [] },
      });
      return;
    }

    const snapshot = board.canvasState;

    useCanvasStore.setState({
      elements: snapshot?.elements ? clone(snapshot.elements) : [],
      layers: snapshot?.layers?.length ? clone(snapshot.layers) : [{ ...DEFAULT_LAYER, elements: [] }],
      selectedElementIds: snapshot?.selectedElementIds ? clone(snapshot.selectedElementIds) : [],
      viewport: snapshot?.viewport ? clone(snapshot.viewport) : { zoom: 1, pan: { x: 0, y: 0 } },
      activeLayerId: snapshot?.activeLayerId ?? DEFAULT_LAYER.id,
      history: { past: [], future: [] },
    });

    canvasStore.stopEditingText?.();
    canvasStore.clearSelection?.();
  }, [board?.id]);
}

export default useBoardCanvasLifecycle;
