import { useCallback, useMemo } from "react";
import type { CanvasElementType } from "@/types/canvas-elements";
import { useCanvasStore } from "@/stores/canvasStore";

type ElementId = string;

export function useCanvasElements() {
  const elements = useCanvasStore((s) => s.elements);
  const selection = useCanvasStore((s) => s.selectedElementIds);

  const addElement = useCallback(
    (el: any) => {
      useCanvasStore.getState().addElement(el);
    },
    [],
  );

  const updateElement = useCallback(
    (id: ElementId, patch: Partial<any>) => {
      useCanvasStore.getState().updateElement(id, patch);
    },
    [],
  );

  const removeElement = useCallback(
    (id: ElementId) => {
      useCanvasStore.getState().deleteElements([id]);
    },
    [],
  );

  const setSelection = useCallback(
    (ids: ElementId[]) => {
      useCanvasStore.getState().selectElements(ids);
    },
    [],
  );

  const clearSelection = useCallback(() => {
    useCanvasStore.getState().clearSelection();
  }, []);

  return {
    elements,
    selection,
    addElement,
    updateElement,
    removeElement,
    setSelection,
    clearSelection,
  };
}
