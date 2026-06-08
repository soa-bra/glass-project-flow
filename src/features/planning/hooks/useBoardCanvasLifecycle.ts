import { useEffect } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import type { CanvasBoard } from '@/types/planning';
import { DEFAULT_LAYER, type LayerInfo } from '@/features/planning/state/types';

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function stripLayerElementRefs(layers: LayerInfo[]): LayerInfo[] {
  return layers.map((layer) => ({
    ...layer,
    elements: [],
  }));
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
    const snapshotLayers = snapshot?.layers?.length
      ? clone(snapshot.layers)
      : [{ ...DEFAULT_LAYER, elements: [] }];
    const layers = stripLayerElementRefs(snapshotLayers);
    const layerIds = new Set(layers.map((layer) => layer.id));
    const activeLayerId = snapshot?.activeLayerId && layerIds.has(snapshot.activeLayerId)
      ? snapshot.activeLayerId
      : layers[0]?.id ?? DEFAULT_LAYER.id;

    useCanvasStore.setState((state) => ({
      ...state,
      layers,
      selectedElementIds: [],
      viewport: snapshot?.viewport ? clone(snapshot.viewport) : state.viewport,
      activeLayerId,
      editingTextId: null,
      history: { past: [], future: [] },
    }) as any);
  }, [board?.id]);
}

export default useBoardCanvasLifecycle;
