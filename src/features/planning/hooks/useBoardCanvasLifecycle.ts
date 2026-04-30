import { useEffect } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import type { CanvasBoard } from '@/types/planning';
import { DEFAULT_LAYER } from '@/features/planning/state/types';

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

export function useBoardCanvasLifecycle(board: CanvasBoard | null): void {
  useEffect(() => {
    if (!board) {
      useCanvasStore.setState({
        elements: [],
        layers: [{ ...DEFAULT_LAYER, elements: [] }],
        selectedElementIds: [],
        viewport: { zoom: 1, pan: { x: 0, y: 0 } },
        activeLayerId: DEFAULT_LAYER.id,
        editingTextId: null,
        history: { past: [], future: [] },
      } as any);
      return;
    }

    const snapshot = board.canvasState;
    const elements = snapshot?.elements ? clone(snapshot.elements) : [];
    const layers = snapshot?.layers?.length ? clone(snapshot.layers) : [{ ...DEFAULT_LAYER, elements: [] }];
    const layerIds = new Set(layers.map((layer) => layer.id));
    const elementIds = new Set(elements.map((element) => element.id));
    const activeLayerId = snapshot?.activeLayerId && layerIds.has(snapshot.activeLayerId)
      ? snapshot.activeLayerId
      : layers[0]?.id ?? DEFAULT_LAYER.id;

    useCanvasStore.setState({
      elements,
      layers,
      selectedElementIds: snapshot?.selectedElementIds
        ? clone(snapshot.selectedElementIds).filter((elementId: string) => elementIds.has(elementId))
        : [],
      viewport: snapshot?.viewport ? clone(snapshot.viewport) : { zoom: 1, pan: { x: 0, y: 0 } },
      activeLayerId,
      editingTextId: null,
      history: { past: [], future: [] },
    } as any);
  }, [board?.id]);
}

export default useBoardCanvasLifecycle;
