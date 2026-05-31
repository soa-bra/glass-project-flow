/**
 * Selection Slice - إدارة التحديد والحافظة
 * ✅ المرحلة 1: Deep Clone + Paste at Position + Fixed Types
 * ✅ المرحلة 2: Smart Offset محسّن + Overlap Detection
 * ✅ المرحلة 3: Transactional Paste/Cut + Stable Selection IDs
 * ✅ المرحلة 4: Reference Remapping + Canvas Host Aware Paste Center
 */

import { StateCreator } from 'zustand';
import { nanoid } from 'nanoid';
import type { CanvasElement, LayerInfo } from '@/types/canvas';
import { runCanvasTransaction } from '../transactions/runCanvasTransaction';

type CanvasStoreState = SelectionSlice & {
  elements: CanvasElement[];
  layers: LayerInfo[];
  viewport: { zoom: number; pan: { x: number; y: number } };
  viewportHostSize: { width: number; height: number };
  activeLayerId: string | null;
  deleteElements: (elementIds: string[]) => void;
  history: {
    past: unknown[];
    future: unknown[];
  };
};

export interface SelectionSlice {
  selectedElementIds: string[];
  clipboard: CanvasElement[];

  selectElement: (elementId: string, multiSelect?: boolean) => void;
  selectElements: (elementIds: string[]) => void;
  clearSelection: () => void;

  copyElements: (elementIds: string[]) => void;
  pasteElements: (position?: { x: number; y: number }) => void;
  cutElements: (elementIds: string[]) => void;
}

let lastPastePosition: { x: number; y: number } | null = null;
let consecutivePasteCount = 0;

const PASTE_OFFSET_BASE = 20;
const PASTE_OFFSET_INCREMENT = 15;
const OVERLAP_DETECTION_THRESHOLD = 5;
const DEFAULT_VIEWPORT_HOST_SIZE = { width: 1280, height: 720 };

function deepCloneElement(element: CanvasElement): CanvasElement {
  try {
    return structuredClone(element);
  } catch {
    return JSON.parse(JSON.stringify(element));
  }
}

function normalizeViewportHostSize(hostSize: { width: number; height: number } | undefined): { width: number; height: number } {
  return {
    width: hostSize && hostSize.width > 0 ? hostSize.width : DEFAULT_VIEWPORT_HOST_SIZE.width,
    height: hostSize && hostSize.height > 0 ? hostSize.height : DEFAULT_VIEWPORT_HOST_SIZE.height,
  };
}

function getViewportCenter(
  viewport: { zoom: number; pan: { x: number; y: number } },
  viewportHostSize: { width: number; height: number } | undefined,
): { x: number; y: number } {
  const hostSize = normalizeViewportHostSize(viewportHostSize);
  const screenCenterX = hostSize.width / 2;
  const screenCenterY = hostSize.height / 2;

  const worldX = (screenCenterX - viewport.pan.x) / viewport.zoom;
  const worldY = (screenCenterY - viewport.pan.y) / viewport.zoom;

  return { x: worldX, y: worldY };
}

function getElementsCenter(elements: CanvasElement[]): { x: number; y: number } {
  if (elements.length === 0) return { x: 0, y: 0 };

  const bounds = elements.reduce(
    (acc, el) => ({
      minX: Math.min(acc.minX, el.position.x),
      minY: Math.min(acc.minY, el.position.y),
      maxX: Math.max(acc.maxX, el.position.x + el.size.width),
      maxY: Math.max(acc.maxY, el.position.y + el.size.height),
    }),
    { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity },
  );

  return {
    x: (bounds.minX + bounds.maxX) / 2,
    y: (bounds.minY + bounds.maxY) / 2,
  };
}

function getElementsBounds(elements: CanvasElement[]): { width: number; height: number } {
  if (elements.length === 0) return { width: 0, height: 0 };

  const bounds = elements.reduce(
    (acc, el) => ({
      minX: Math.min(acc.minX, el.position.x),
      minY: Math.min(acc.minY, el.position.y),
      maxX: Math.max(acc.maxX, el.position.x + el.size.width),
      maxY: Math.max(acc.maxY, el.position.y + el.size.height),
    }),
    { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity },
  );

  return {
    width: bounds.maxX - bounds.minX,
    height: bounds.maxY - bounds.minY,
  };
}

function hasOverlapWithExisting(
  proposedPosition: { x: number; y: number },
  clipboardBounds: { width: number; height: number },
  existingElements: CanvasElement[],
): boolean {
  const proposedBounds = {
    x: proposedPosition.x - clipboardBounds.width / 2,
    y: proposedPosition.y - clipboardBounds.height / 2,
    width: clipboardBounds.width,
    height: clipboardBounds.height,
  };

  return existingElements.some((el) => {
    const elementBounds = {
      x: el.position.x,
      y: el.position.y,
      width: el.size.width,
      height: el.size.height,
    };

    return !(
      proposedBounds.x + proposedBounds.width < elementBounds.x - OVERLAP_DETECTION_THRESHOLD ||
      proposedBounds.x > elementBounds.x + elementBounds.width + OVERLAP_DETECTION_THRESHOLD ||
      proposedBounds.y + proposedBounds.height < elementBounds.y - OVERLAP_DETECTION_THRESHOLD ||
      proposedBounds.y > elementBounds.y + elementBounds.height + OVERLAP_DETECTION_THRESHOLD
    );
  });
}

function findSmartPastePosition(
  basePosition: { x: number; y: number },
  clipboardBounds: { width: number; height: number },
  existingElements: CanvasElement[],
): { x: number; y: number } {
  if (!hasOverlapWithExisting(basePosition, clipboardBounds, existingElements)) {
    return basePosition;
  }

  const directions = [
    { dx: 1, dy: 0 },
    { dx: 1, dy: 1 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 1 },
    { dx: -1, dy: 0 },
    { dx: -1, dy: -1 },
    { dx: 0, dy: -1 },
    { dx: 1, dy: -1 },
  ];

  const step = PASTE_OFFSET_BASE;

  for (let distance = 1; distance <= 10; distance++) {
    for (const dir of directions) {
      const testPosition = {
        x: basePosition.x + dir.dx * step * distance,
        y: basePosition.y + dir.dy * step * distance,
      };

      if (!hasOverlapWithExisting(testPosition, clipboardBounds, existingElements)) {
        return testPosition;
      }
    }
  }

  return {
    x: basePosition.x + PASTE_OFFSET_BASE * 5,
    y: basePosition.y + PASTE_OFFSET_BASE * 5,
  };
}

function buildIdMap(clipboard: CanvasElement[]): Map<string, string> {
  return new Map(clipboard.map((el) => [el.id, nanoid()]));
}

function buildGroupMap(clipboard: CanvasElement[]): Map<string, string> {
  const groupIds = new Set<string>();
  clipboard.forEach((el) => {
    const groupId = typeof el.metadata?.groupId === 'string' ? el.metadata.groupId : null;
    if (groupId) {
      groupIds.add(groupId);
    }
  });

  return new Map(Array.from(groupIds).map((groupId) => [groupId, nanoid()]));
}

function remapElementReferences(
  element: CanvasElement,
  idMap: Map<string, string>,
  groupMap: Map<string, string>,
): CanvasElement {
  const copy = deepCloneElement(element);

  if (copy.parentId && idMap.has(copy.parentId)) {
    copy.parentId = idMap.get(copy.parentId);
  }

  if (Array.isArray(copy.children)) {
    copy.children = copy.children.map((childId: string) => idMap.get(childId) ?? childId);
  }

  if (copy.metadata?.groupId && groupMap.has(copy.metadata.groupId)) {
    copy.metadata = {
      ...copy.metadata,
      groupId: groupMap.get(copy.metadata.groupId),
    };
  }

  if (copy.data?.attachedTo && idMap.has(copy.data.attachedTo)) {
    copy.data = {
      ...copy.data,
      attachedTo: idMap.get(copy.data.attachedTo),
    };
  }

  if (copy.data?.startNodeId && idMap.has(copy.data.startNodeId)) {
    copy.data = {
      ...copy.data,
      startNodeId: idMap.get(copy.data.startNodeId),
    };
  }

  if (copy.data?.endNodeId && idMap.has(copy.data.endNodeId)) {
    copy.data = {
      ...copy.data,
      endNodeId: idMap.get(copy.data.endNodeId),
    };
  }

  if (copy.data?.startAnchor?.nodeId && idMap.has(copy.data.startAnchor.nodeId)) {
    copy.data = {
      ...copy.data,
      startAnchor: {
        ...copy.data.startAnchor,
        nodeId: idMap.get(copy.data.startAnchor.nodeId),
      },
    };
  }

  if (copy.data?.endAnchor?.nodeId && idMap.has(copy.data.endAnchor.nodeId)) {
    copy.data = {
      ...copy.data,
      endAnchor: {
        ...copy.data.endAnchor,
        nodeId: idMap.get(copy.data.endAnchor.nodeId),
      },
    };
  }

  if (copy.data?.arrowData) {
    const arrowData = deepCloneElement(copy.data.arrowData);

    if (arrowData.startConnection?.elementId && idMap.has(arrowData.startConnection.elementId)) {
      arrowData.startConnection = {
        ...arrowData.startConnection,
        elementId: idMap.get(arrowData.startConnection.elementId),
      };
    }

    if (arrowData.endConnection?.elementId && idMap.has(arrowData.endConnection.elementId)) {
      arrowData.endConnection = {
        ...arrowData.endConnection,
        elementId: idMap.get(arrowData.endConnection.elementId),
      };
    }

    copy.data = {
      ...copy.data,
      arrowData,
    };
  }

  return copy;
}

function buildPastedElements(
  clipboard: CanvasElement[],
  offsetX: number,
  offsetY: number,
  fallbackLayerId: string | null,
): CanvasElement[] {
  const idMap = buildIdMap(clipboard);
  const groupMap = buildGroupMap(clipboard);

  return clipboard.map((el) => {
    const copy = remapElementReferences(el, idMap, groupMap);
    const newId = idMap.get(el.id) ?? nanoid();
    delete (copy as any).id;

    return {
      ...copy,
      id: newId,
      layerId: copy.layerId ?? fallbackLayerId ?? 'default',
      visible: copy.visible ?? true,
      locked: copy.locked ?? false,
      position: {
        x: el.position.x + offsetX,
        y: el.position.y + offsetY,
      },
    };
  });
}

export const createSelectionSlice: StateCreator<
  CanvasStoreState,
  [],
  [],
  SelectionSlice
> = (set, get) => ({
  selectedElementIds: [],
  clipboard: [],

  selectElement: (elementId, multiSelect = false) => {
    set((state) => {
      if (multiSelect) {
        const isSelected = state.selectedElementIds.includes(elementId);
        const newSelection = isSelected
          ? state.selectedElementIds.filter((id) => id !== elementId)
          : [...state.selectedElementIds, elementId];

        return { selectedElementIds: Array.from(new Set(newSelection)) };
      }

      return { selectedElementIds: [elementId] };
    });
  },

  selectElements: (elementIds) => {
    set({ selectedElementIds: elementIds });
  },

  clearSelection: () => {
    set({ selectedElementIds: [] });
  },

  copyElements: (elementIds) => {
    const elements = get().elements.filter((el) => elementIds.includes(el.id));
    const clonedElements = elements.map(deepCloneElement);

    set({ clipboard: clonedElements });

    lastPastePosition = null;
    consecutivePasteCount = 0;
  },

  pasteElements: (position) => {
    const clipboard = get().clipboard;
    if (clipboard.length === 0) return;

    const viewport = get().viewport;
    const viewportHostSize = get().viewportHostSize;
    const existingElements = get().elements;
    const clipboardCenter = getElementsCenter(clipboard);
    const clipboardBounds = getElementsBounds(clipboard);

    let basePosition: { x: number; y: number };

    if (position) {
      basePosition = position;
      consecutivePasteCount = 0;
    } else {
      const viewportCenter = getViewportCenter(viewport, viewportHostSize);

      if (
        lastPastePosition &&
        Math.abs(lastPastePosition.x - viewportCenter.x) < 50 &&
        Math.abs(lastPastePosition.y - viewportCenter.y) < 50
      ) {
        consecutivePasteCount++;
        const offset = PASTE_OFFSET_BASE + PASTE_OFFSET_INCREMENT * consecutivePasteCount;
        basePosition = {
          x: viewportCenter.x + offset,
          y: viewportCenter.y + offset,
        };
      } else {
        consecutivePasteCount = 0;
        basePosition = viewportCenter;
      }
    }

    const smartPosition = findSmartPastePosition(
      basePosition,
      clipboardBounds,
      existingElements,
    );

    lastPastePosition = smartPosition;

    const offsetX = smartPosition.x - clipboardCenter.x;
    const offsetY = smartPosition.y - clipboardCenter.y;
    const pastedElements = buildPastedElements(
      clipboard,
      offsetX,
      offsetY,
      get().activeLayerId,
    );
    const pastedIds = pastedElements.map((el) => el.id);

    runCanvasTransaction(set, (state: any) => {
      const frameElements = pastedElements.filter((el) => el.type === 'frame').reverse();
      const regularElements = pastedElements.filter((el) => el.type !== 'frame');

      const updatedLayers = state.layers.map((layer: LayerInfo) => {
        const layerElementIds = pastedElements
          .filter((el) => (el.layerId ?? 'default') === layer.id)
          .map((el) => el.id);

        if (layerElementIds.length === 0) {
          return layer;
        }

        return {
          ...layer,
          elements: [...layer.elements, ...layerElementIds],
        };
      });

      return {
        elements: [...frameElements, ...state.elements, ...regularElements],
        layers: updatedLayers,
        selectedElementIds: pastedIds,
      };
    });
  },

  cutElements: (elementIds) => {
    get().copyElements(elementIds);
    get().deleteElements(elementIds);

    lastPastePosition = null;
    consecutivePasteCount = 0;
  },
});
