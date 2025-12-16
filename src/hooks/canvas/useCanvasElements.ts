import { useCallback, useMemo } from "react";
import type { CanvasElementModel, ElementId } from "./canvas-elements";
import { canvasStore, useOrderedElements, useSelection } from "./canvasStore";

export function useCanvasElements() {
  const elements = useOrderedElements();
  const selection = useSelection();

  const actions = useMemo(() => canvasStore.actions, []);

  const addElement = useCallback(
    (el: CanvasElementModel) => {
      actions.addElement(el);
    },
    [actions],
  );

  const addElements = useCallback(
    (els: CanvasElementModel[]) => {
      actions.addElements(els);
    },
    [actions],
  );

  const updateElement = useCallback(
    (id: ElementId, patch: Partial<CanvasElementModel>) => {
      actions.updateElement(id, patch);
    },
    [actions],
  );

  const updateElements = useCallback(
    (patches: Array<{ id: ElementId; patch: Partial<CanvasElementModel> }>) => {
      actions.updateElements(patches);
    },
    [actions],
  );

  const removeElement = useCallback(
    (id: ElementId) => {
      actions.removeElement(id);
    },
    [actions],
  );

  const removeElements = useCallback(
    (ids: ElementId[]) => {
      actions.removeElements(ids);
    },
    [actions],
  );

  const setSelection = useCallback(
    (ids: ElementId[], primaryId?: ElementId) => {
      actions.setSelection(ids, primaryId);
    },
    [actions],
  );

  const clearSelection = useCallback(() => {
    actions.clearSelection();
  }, [actions]);

  const bringToFront = useCallback(
    (ids: ElementId[]) => {
      actions.bringToFront(ids);
    },
    [actions],
  );

  const sendToBack = useCallback(
    (ids: ElementId[]) => {
      actions.sendToBack(ids);
    },
    [actions],
  );

  return {
    elements,
    selection,
    actions,
    addElement,
    addElements,
    updateElement,
    updateElements,
    removeElement,
    removeElements,
    setSelection,
    clearSelection,
    bringToFront,
    sendToBack,
  };
}
