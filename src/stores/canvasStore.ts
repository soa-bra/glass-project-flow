import { useSyncExternalStore } from "react";
import type { CanvasElementModel, ElementsById, ElementId } from "./canvas-elements";
import { applyElementPatch, createElement, normalizeElement, toById } from "./canvas-elements";

export type Camera = {
  x: number;
  y: number;
  zoom: number;
};

export type CanvasState = {
  camera: Camera;
  elementsById: ElementsById;
  elementOrder: ElementId[]; // rendering order (z)
  selection: { ids: ElementId[]; primaryId?: ElementId };
};

export type CanvasActions = {
  setCamera(patch: Partial<Camera> | ((c: Camera) => Partial<Camera>)): void;

  setSelection(ids: ElementId[], primaryId?: ElementId): void;
  clearSelection(): void;

  addElement(el: CanvasElementModel): void;
  addElements(els: CanvasElementModel[]): void;

  updateElement(id: ElementId, patch: Partial<CanvasElementModel>): void;
  updateElements(patches: Array<{ id: ElementId; patch: Partial<CanvasElementModel> }>): void;

  removeElement(id: ElementId): void;
  removeElements(ids: ElementId[]): void;

  bringToFront(ids: ElementId[]): void;
  sendToBack(ids: ElementId[]): void;

  reset(initial?: Partial<CanvasState>): void;
};

export type CanvasStore = {
  getState(): CanvasState;
  setState(next: CanvasState): void;
  subscribe(cb: () => void): () => void;
  actions: CanvasActions;
};

const DEFAULT_STATE: CanvasState = {
  camera: { x: 0, y: 0, zoom: 1 },
  elementsById: {},
  elementOrder: [],
  selection: { ids: [], primaryId: undefined },
};

function shallowEq(a: any, b: any) {
  if (Object.is(a, b)) return true;
  if (typeof a !== "object" || typeof b !== "object" || !a || !b) return false;
  const ak = Object.keys(a);
  const bk = Object.keys(b);
  if (ak.length !== bk.length) return false;
  for (const k of ak) if (!Object.is(a[k], b[k])) return false;
  return true;
}

export function createCanvasStore(initial?: Partial<CanvasState>): CanvasStore {
  let state: CanvasState = {
    ...DEFAULT_STATE,
    ...(initial ?? {}),
    camera: { ...DEFAULT_STATE.camera, ...(initial?.camera ?? {}) },
    elementsById: initial?.elementsById ?? DEFAULT_STATE.elementsById,
    elementOrder: initial?.elementOrder ?? DEFAULT_STATE.elementOrder,
    selection: initial?.selection ?? DEFAULT_STATE.selection,
  };

  const subs = new Set<() => void>();
  const notify = () => subs.forEach((s) => s());

  const setState = (next: CanvasState) => {
    state = next;
    notify();
  };

  const getState = () => state;

  const subscribe = (cb: () => void) => {
    subs.add(cb);
    return () => subs.delete(cb);
  };

  const actions: CanvasActions = {
    setCamera(patch) {
      const cur = state.camera;
      const nextPatch = typeof patch === "function" ? patch(cur) : patch;
      const nextCamera = { ...cur, ...nextPatch };
      if (shallowEq(cur, nextCamera)) return;
      setState({ ...state, camera: nextCamera });
    },

    setSelection(ids, primaryId) {
      const uniq = Array.from(new Set(ids));
      const next = { ids: uniq, primaryId: primaryId ?? uniq[0] };
      if (shallowEq(state.selection, next)) return;
      setState({ ...state, selection: next });
    },

    clearSelection() {
      if (state.selection.ids.length === 0) return;
      setState({ ...state, selection: { ids: [], primaryId: undefined } });
    },

    addElement(el) {
      const nextEl = normalizeElement(el);
      const nextById = { ...state.elementsById, [nextEl.id]: nextEl };
      const nextOrder = state.elementOrder.includes(nextEl.id)
        ? state.elementOrder
        : [...state.elementOrder, nextEl.id];
      setState({ ...state, elementsById: nextById, elementOrder: nextOrder });
    },

    addElements(els) {
      if (els.length === 0) return;
      const nextById = { ...state.elementsById };
      const nextOrder = [...state.elementOrder];
      for (const e of els) {
        const ne = normalizeElement(e);
        nextById[ne.id] = ne;
        if (!nextOrder.includes(ne.id)) nextOrder.push(ne.id);
      }
      setState({ ...state, elementsById: nextById, elementOrder: nextOrder });
    },

    updateElement(id, patch) {
      const cur = state.elementsById[id];
      if (!cur) return;
      const next = applyElementPatch(cur, patch);
      if (shallowEq(cur, next)) return;
      setState({
        ...state,
        elementsById: { ...state.elementsById, [id]: next },
      });
    },

    updateElements(patches) {
      if (patches.length === 0) return;
      let changed = false;
      const nextById = { ...state.elementsById };
      for (const { id, patch } of patches) {
        const cur = state.elementsById[id];
        if (!cur) continue;
        const next = applyElementPatch(cur, patch);
        if (!shallowEq(cur, next)) {
          nextById[id] = next;
          changed = true;
        }
      }
      if (!changed) return;
      setState({ ...state, elementsById: nextById });
    },

    removeElement(id) {
      if (!state.elementsById[id]) return;
      const nextById = { ...state.elementsById };
      delete nextById[id];
      const nextOrder = state.elementOrder.filter((x) => x !== id);
      const nextSelIds = state.selection.ids.filter((x) => x !== id);
      const nextPrimary = nextSelIds[0];
      setState({
        ...state,
        elementsById: nextById,
        elementOrder: nextOrder,
        selection: { ids: nextSelIds, primaryId: nextPrimary },
      });
    },

    removeElements(ids) {
      if (ids.length === 0) return;
      const set = new Set(ids);
      let changed = false;
      const nextById = { ...state.elementsById };
      for (const id of set) {
        if (nextById[id]) {
          delete nextById[id];
          changed = true;
        }
      }
      if (!changed) return;
      const nextOrder = state.elementOrder.filter((x) => !set.has(x));
      const nextSelIds = state.selection.ids.filter((x) => !set.has(x));
      const nextPrimary = nextSelIds[0];
      setState({
        ...state,
        elementsById: nextById,
        elementOrder: nextOrder,
        selection: { ids: nextSelIds, primaryId: nextPrimary },
      });
    },

    bringToFront(ids) {
      if (ids.length === 0) return;
      const set = new Set(ids);
      const rest = state.elementOrder.filter((id) => !set.has(id));
      const nextOrder = [...rest, ...ids.filter((id) => state.elementOrder.includes(id))];
      if (nextOrder.join("|") === state.elementOrder.join("|")) return;
      setState({ ...state, elementOrder: nextOrder });
    },

    sendToBack(ids) {
      if (ids.length === 0) return;
      const set = new Set(ids);
      const rest = state.elementOrder.filter((id) => !set.has(id));
      const nextOrder = [...ids.filter((id) => state.elementOrder.includes(id)), ...rest];
      if (nextOrder.join("|") === state.elementOrder.join("|")) return;
      setState({ ...state, elementOrder: nextOrder });
    },

    reset(initial2) {
      const base = { ...DEFAULT_STATE, ...(initial2 ?? {}) } as CanvasState;
      setState({
        ...base,
        camera: { ...DEFAULT_STATE.camera, ...(base.camera ?? {}) },
        elementsById: base.elementsById ?? {},
        elementOrder: base.elementOrder ?? Object.keys(base.elementsById ?? {}),
        selection: base.selection ?? { ids: [], primaryId: undefined },
      });
    },
  };

  return { getState, setState, subscribe, actions };
}

// -----------------------------
// Singleton store (optional)
// -----------------------------
export const canvasStore = createCanvasStore();

// -----------------------------
// React selector hook (fast)\n// -----------------------------
export function useCanvasStore<T>(selector: (s: CanvasState) => T, isEqual: (a: T, b: T) => boolean = Object.is): T {
  const getSnapshot = () => selector(canvasStore.getState());

  return useSyncExternalStore(
    canvasStore.subscribe,
    () => getSnapshot(),
    () => getSnapshot(),
  );
}

// Convenience selectors
export function useCamera() {
  return useCanvasStore((s) => s.camera, shallowEq);
}

export function useSelection() {
  return useCanvasStore((s) => s.selection, shallowEq);
}

export function useOrderedElements(): CanvasElementModel[] {
  return useCanvasStore((s) => {
    const out: CanvasElementModel[] = [];
    for (const id of s.elementOrder) {
      const el = s.elementsById[id];
      if (el && !el.hidden) out.push(el);
    }
    return out;
  });
}

// Factory helper for quick add (optional)
export function addNewElement(type: CanvasElementModel["type"], partial?: Partial<CanvasElementModel>) {
  const el = createElement({ type, ...(partial ?? {}) } as any);
  canvasStore.actions.addElement(el);
  canvasStore.actions.setSelection([el.id], el.id);
  return el;
}
