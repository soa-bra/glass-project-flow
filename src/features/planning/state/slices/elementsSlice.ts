/**
 * Elements Slice - إدارة عناصر Canvas
 */

import { StateCreator } from 'zustand';
import { nanoid } from 'nanoid';
import type { CanvasElement, LayerInfo } from '@/types/canvas';
import { calculateElementsBounds } from '../helpers';
import { runCanvasTransaction } from '../transactions/runCanvasTransaction';
import { recomputeDependentGeometry, syncAttachedTextPositions } from '../elementsIntegrity';

export interface ElementsSlice {
  elements: CanvasElement[];
  
  // Element Actions
  addElement: (element: Omit<CanvasElement, 'id'> & { id?: string }) => void;
  updateElement: (elementId: string, updates: Partial<CanvasElement>) => void;
  deleteElement: (elementId: string) => void;
  deleteElements: (elementIds: string[]) => void;
  duplicateElement: (elementId: string) => void;
  moveElements: (elementIds: string[], deltaX: number, deltaY: number) => void;
  resizeElements: (elementIds: string[], scaleX: number, scaleY: number, origin: { x: number; y: number }) => void;
  rotateElements: (elementIds: string[], angle: number, origin: { x: number; y: number }) => void;
  flipHorizontally: (elementIds: string[]) => void;
  flipVertically: (elementIds: string[]) => void;
  lockElements: (elementIds: string[]) => void;
  unlockElements: (elementIds: string[]) => void;
  alignElements: (elementIds: string[], alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  groupElements: (elementIds: string[]) => void;
  ungroupElements: (groupId: string) => void;
}

type CanvasStoreState = ElementsSlice & {
  activeLayerId: string | null;
  layers: import('@/types/canvas').LayerInfo[];
  pushHistory: () => void;
  moveFrame: (frameId: string, deltaX: number, deltaY: number) => void;
  history: {
    past: unknown[];
    future: unknown[];
  };
};

const getGroupElementIds = (elementIds: string[], elements: CanvasElement[]): string[] => {
  const result = new Set<string>(elementIds);

  const groupIds = new Set<string>();
  elementIds.forEach((id) => {
    const element = elements.find((el) => el.id === id);
    if (element?.metadata?.groupId) {
      groupIds.add(element.metadata.groupId);
    }
  });

  if (groupIds.size > 0) {
    elements.forEach((el) => {
      if (el.metadata?.groupId && groupIds.has(el.metadata.groupId)) {
        result.add(el.id);
      }
    });
  }

  return Array.from(result);
};

const getConnectedConnectorIds = (elementId: string, elements: CanvasElement[]): string[] => {
  const element = elements.find((el) => el.id === elementId);
  if (!element) return [];

  if (element.type === 'mindmap_node') {
    return elements
      .filter((el) => {
        if (el.type !== 'mindmap_connector') return false;
        const data = el.data as any;
        return data?.startNodeId === elementId || data?.endNodeId === elementId;
      })
      .map((el) => el.id);
  }

  if (element.type === 'visual_node') {
    return elements
      .filter((el) => {
        if (el.type !== 'visual_connector') return false;
        const data = el.data as any;
        return data?.startNodeId === elementId || data?.endNodeId === elementId;
      })
      .map((el) => el.id);
  }

  return [];
};

const collectDeletionIds = (elementIds: string[], elements: CanvasElement[]): string[] => {
  const ids = new Set<string>();

  elementIds.forEach((elementId) => {
    ids.add(elementId);
    getConnectedConnectorIds(elementId, elements).forEach((connectorId) => ids.add(connectorId));
  });

  return Array.from(ids);
};

const syncAttachedTextsForElements = (
  elements: CanvasElement[],
  movedElementIds: string[],
): { elements: CanvasElement[]; changedIds: string[] } => {
  let updatedElements = [...elements];
  const changedIds = new Set<string>(movedElementIds);

  movedElementIds.forEach((elementId) => {
    const movedElement = updatedElements.find((entry) => entry.id === elementId);
    if (!movedElement) return;

    const synced = syncAttachedTextPositions(updatedElements, elementId, movedElement.position);
    updatedElements = synced.elements;
    synced.changedIds.forEach((id) => changedIds.add(id));
  });

  return {
    elements: updatedElements,
    changedIds: Array.from(changedIds),
  };
};

export const createElementsSlice: StateCreator<
  CanvasStoreState,
  [],
  [],
  ElementsSlice
> = (set, get) => ({
  elements: [],

  addElement: (elementData) => {
    const element: CanvasElement = {
      type: elementData.type || 'text',
      position: elementData.position || { x: 0, y: 0 },
      size: elementData.size || { width: 200, height: 100 },
      style: elementData.style || {},
      ...elementData,
      id: elementData.id || nanoid(),
      layerId: elementData.layerId ?? get().activeLayerId ?? 'default',
      visible: elementData.visible ?? true,
      locked: elementData.locked ?? false,
    };

    set((state: any) => {
      const updatedLayers = state.layers.map((layer: LayerInfo) =>
        layer.id === element.layerId
          ? { ...layer, elements: [...layer.elements, element.id] }
          : layer,
      );

      const newElements = element.type === 'frame'
        ? [element, ...state.elements]
        : [...state.elements, element];

      return {
        elements: newElements,
        layers: updatedLayers,
      };
    });

    get().pushHistory();
  },

  updateElement: (elementId, updates) => {
    set((state: any) => {
      let updatedElements = state.elements.map((el: CanvasElement) =>
        el.id === elementId ? { ...el, ...updates } : el,
      );

      if (updates.position) {
        const synced = syncAttachedTextsForElements(updatedElements, [elementId]);
        updatedElements = recomputeDependentGeometry(synced.elements, synced.changedIds);
      }

      return { elements: updatedElements };
    });
  },

  deleteElement: (elementId) => {
    get().deleteElements([elementId]);
  },

  deleteElements: (elementIds) => {
    if (elementIds.length === 0) return;

    runCanvasTransaction(set, (state: any) => {
      const idsToDelete = collectDeletionIds(Array.from(new Set(elementIds)), state.elements);
      const updatedLayers = state.layers.map((layer: LayerInfo) => ({
        ...layer,
        elements: layer.elements.filter((id: string) => !idsToDelete.includes(id)),
      }));

      return {
        elements: state.elements.filter((el: CanvasElement) => !idsToDelete.includes(el.id)),
        selectedElementIds: state.selectedElementIds.filter((id: string) => !idsToDelete.includes(id)),
        layers: updatedLayers,
      };
    });
  },

  duplicateElement: (elementId) => {
    const element = get().elements.find((el: CanvasElement) => el.id === elementId);
    if (!element) return;

    const duplicate = {
      ...element,
      position: {
        x: element.position.x + 20,
        y: element.position.y + 20,
      },
    };

    delete (duplicate as any).id;
    get().addElement(duplicate);
  },

  moveElements: (elementIds, deltaX, deltaY) => {
    const state = get();
    const expandedIds = getGroupElementIds(elementIds, state.elements);
    const uniqueIds = Array.from(new Set(expandedIds));
    const frameIds: string[] = [];
    const nonFrameIds: string[] = [];

    uniqueIds.forEach((id) => {
      const element = state.elements.find((entry: CanvasElement) => entry.id === id);
      if (element?.type === 'frame') {
        frameIds.push(id);
      } else if (element && !element.locked) {
        nonFrameIds.push(id);
      }
    });

    frameIds.forEach((frameId) => {
      get().moveFrame(frameId, deltaX, deltaY);
    });

    if (nonFrameIds.length > 0) {
      set((currentState: any) => {
        let updatedElements = currentState.elements.map((el: CanvasElement) =>
          nonFrameIds.includes(el.id)
            ? { ...el, position: { x: el.position.x + deltaX, y: el.position.y + deltaY } }
            : el,
        );

        const synced = syncAttachedTextsForElements(updatedElements, nonFrameIds);
        updatedElements = recomputeDependentGeometry(synced.elements, synced.changedIds);

        return { elements: updatedElements };
      });
    }

    if (frameIds.length === 0 && nonFrameIds.length > 0) {
      get().pushHistory();
    }
  },

  resizeElements: (elementIds, scaleX, scaleY, origin) => {
    const state = get();
    const expandedIds = getGroupElementIds(elementIds, state.elements);

    runCanvasTransaction(set, (currentState: any) => {
      let updatedElements = currentState.elements.map((el: CanvasElement) => {
        if (!expandedIds.includes(el.id) || el.locked) return el;

        const relX = el.position.x - origin.x;
        const relY = el.position.y - origin.y;

        return {
          ...el,
          position: { x: origin.x + relX * scaleX, y: origin.y + relY * scaleY },
          size: { width: el.size.width * scaleX, height: el.size.height * scaleY },
        };
      });

      const synced = syncAttachedTextsForElements(updatedElements, expandedIds);
      updatedElements = recomputeDependentGeometry(synced.elements, synced.changedIds);

      return { elements: updatedElements };
    });
  },

  rotateElements: (elementIds, angle, origin) => {
    const state = get();
    const expandedIds = getGroupElementIds(elementIds, state.elements);
    const rad = (angle * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    runCanvasTransaction(set, (currentState: any) => {
      let updatedElements = currentState.elements.map((el: CanvasElement) => {
        if (!expandedIds.includes(el.id) || el.locked) return el;

        const relX = el.position.x - origin.x;
        const relY = el.position.y - origin.y;

        return {
          ...el,
          position: {
            x: origin.x + relX * cos - relY * sin,
            y: origin.y + relX * sin + relY * cos,
          },
          rotation: (typeof el.rotation === 'number' ? el.rotation : 0) + angle,
        };
      });

      const synced = syncAttachedTextsForElements(updatedElements, expandedIds);
      updatedElements = recomputeDependentGeometry(synced.elements, synced.changedIds);

      return { elements: updatedElements };
    });
  },

  flipHorizontally: (elementIds) => {
    const selectedElements = get().elements.filter((el: CanvasElement) => elementIds.includes(el.id));
    if (selectedElements.length === 0) return;

    const bounds = calculateElementsBounds(selectedElements);
    const centerX = bounds.centerX;

    runCanvasTransaction(set, (currentState: any) => {
      let updatedElements = currentState.elements.map((el: CanvasElement) => {
        if (!elementIds.includes(el.id) || el.locked) return el;
        const distFromCenter = el.position.x + el.size.width / 2 - centerX;
        return {
          ...el,
          position: { ...el.position, x: centerX - distFromCenter - el.size.width / 2 },
          style: { ...el.style, transform: `scaleX(-1) ${el.style?.transform || ''}` },
        };
      });

      const synced = syncAttachedTextsForElements(updatedElements, elementIds);
      updatedElements = recomputeDependentGeometry(synced.elements, synced.changedIds);

      return { elements: updatedElements };
    });
  },

  flipVertically: (elementIds) => {
    const selectedElements = get().elements.filter((el: CanvasElement) => elementIds.includes(el.id));
    if (selectedElements.length === 0) return;

    const bounds = calculateElementsBounds(selectedElements);
    const centerY = bounds.centerY;

    runCanvasTransaction(set, (currentState: any) => {
      let updatedElements = currentState.elements.map((el: CanvasElement) => {
        if (!elementIds.includes(el.id) || el.locked) return el;
        const distFromCenter = el.position.y + el.size.height / 2 - centerY;
        return {
          ...el,
          position: { ...el.position, y: centerY - distFromCenter - el.size.height / 2 },
          style: { ...el.style, transform: `scaleY(-1) ${el.style?.transform || ''}` },
        };
      });

      const synced = syncAttachedTextsForElements(updatedElements, elementIds);
      updatedElements = recomputeDependentGeometry(synced.elements, synced.changedIds);

      return { elements: updatedElements };
    });
  },

  lockElements: (elementIds) => {
    if (elementIds.length === 0) return;

    runCanvasTransaction(set, (state: any) => ({
      elements: state.elements.map((el: CanvasElement) =>
        elementIds.includes(el.id) ? { ...el, locked: true } : el,
      ),
    }));
  },

  unlockElements: (elementIds) => {
    if (elementIds.length === 0) return;

    runCanvasTransaction(set, (state: any) => ({
      elements: state.elements.map((el: CanvasElement) =>
        elementIds.includes(el.id) ? { ...el, locked: false } : el,
      ),
    }));
  },

  alignElements: (elementIds, alignment) => {
    if (elementIds.length === 0) return;

    runCanvasTransaction(set, (state: any) => {
      const selectedElements = state.elements.filter((el: CanvasElement) => elementIds.includes(el.id));
      if (selectedElements.length === 0) {
        return {};
      }

      const bounds = calculateElementsBounds(selectedElements);
      let updatedElements = state.elements.map((el: CanvasElement) => {
        if (!elementIds.includes(el.id) || el.locked) return el;

        let newPosition = { ...el.position };

        switch (alignment) {
          case 'left': newPosition.x = bounds.minX; break;
          case 'center': newPosition.x = bounds.centerX - el.size.width / 2; break;
          case 'right': newPosition.x = bounds.maxX - el.size.width; break;
          case 'top': newPosition.y = bounds.minY; break;
          case 'middle': newPosition.y = bounds.centerY - el.size.height / 2; break;
          case 'bottom': newPosition.y = bounds.maxY - el.size.height; break;
        }

        return { ...el, position: newPosition };
      });

      const synced = syncAttachedTextsForElements(updatedElements, elementIds);
      updatedElements = recomputeDependentGeometry(synced.elements, synced.changedIds);

      return { elements: updatedElements };
    });
  },

  groupElements: (elementIds) => {
    if (elementIds.length < 2) return;

    const groupId = nanoid();

    runCanvasTransaction(set, (state: any) => ({
      elements: state.elements.map((el: CanvasElement) =>
        elementIds.includes(el.id)
          ? { ...el, metadata: { ...el.metadata, groupId } }
          : el,
      ),
    }));
  },

  ungroupElements: (groupId) => {
    runCanvasTransaction(set, (state: any) => ({
      elements: state.elements.map((el: CanvasElement) => {
        if (el.metadata?.groupId === groupId) {
          const { groupId: _removedGroupId, ...restMetadata } = el.metadata;
          return { ...el, metadata: restMetadata };
        }
        return el;
      }),
    }));
  },
});
