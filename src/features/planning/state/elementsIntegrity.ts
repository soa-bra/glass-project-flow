/**
 * Elements Integrity - دوال نزاهة وترابط عناصر اللوحة
 */

import type { CanvasElement } from '@/types/canvas';
import { resolveSnapConnection, type SnapEdge } from '@/utils/arrow-routing';
import { calculateConnectorBounds } from '@/types/mindmap-canvas';
import { getAnchorPositionForElement, deepCloneArrowData } from './helpers';

export function syncAttachedTextPositions(
  elements: CanvasElement[],
  parentId: string,
  newPosition: { x: number; y: number },
): { elements: CanvasElement[]; changedIds: string[] } {
  const updatedElements = [...elements];
  const changedIds: string[] = [];

  updatedElements.forEach((text, idx) => {
    if (text.type !== 'text') return;
    if (text.data?.attachedTo !== parentId) return;
    if (!text.data?.relativePosition) return;

    const nextPosition = {
      x: newPosition.x + text.data.relativePosition.x,
      y: newPosition.y + text.data.relativePosition.y,
    };

    if (text.position.x === nextPosition.x && text.position.y === nextPosition.y) {
      return;
    }

    updatedElements[idx] = {
      ...updatedElements[idx],
      position: nextPosition,
    };
    changedIds.push(text.id);
  });

  return { elements: updatedElements, changedIds };
}

export function syncAttachedTextsForElements(
  elements: CanvasElement[],
  movedElementIds: string[],
): { elements: CanvasElement[]; changedIds: string[] } {
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
}

export function moveFrameWithChildren(
  elements: CanvasElement[],
  frameId: string,
  dx: number,
  dy: number,
): { elements: CanvasElement[]; movedIds: string[] } {
  const frame = elements.find((el) => el.id === frameId && el.type === 'frame');
  if (!frame) {
    return { elements, movedIds: [] };
  }

  const frameRect = {
    x: frame.position.x,
    y: frame.position.y,
    width: frame.size.width,
    height: frame.size.height,
  };

  const updatedChildIds: string[] = [];
  elements.forEach((el) => {
    if (el.id === frameId || el.type === 'frame') return;

    const isFullyInside = (
      el.position.x >= frameRect.x &&
      el.position.y >= frameRect.y &&
      el.position.x + el.size.width <= frameRect.x + frameRect.width &&
      el.position.y + el.size.height <= frameRect.y + frameRect.height
    );

    if (isFullyInside) {
      updatedChildIds.push(el.id);
    }
  });

  const movedIds = [frameId, ...updatedChildIds];
  const updatedElements = elements.map((el) => {
    if (el.id === frameId) {
      return {
        ...el,
        children: updatedChildIds,
        position: {
          x: el.position.x + dx,
          y: el.position.y + dy,
        },
      };
    }

    if (updatedChildIds.includes(el.id)) {
      return {
        ...el,
        position: {
          x: el.position.x + dx,
          y: el.position.y + dy,
        },
      };
    }

    return el;
  });

  return { elements: updatedElements, movedIds };
}

export function recomputeDependentGeometry(
  elements: CanvasElement[],
  changedElementIds: string[],
): CanvasElement[] {
  let updatedElements = [...elements];
  const uniqueChangedIds = Array.from(new Set(changedElementIds));

  uniqueChangedIds.forEach((elementId) => {
    const updatedElement = updatedElements.find((el) => el.id === elementId);
    if (!updatedElement) return;

    const connectedArrows = updatedElements.filter((el) => {
      if (el.type !== 'shape') return false;
      const arrowData = el.data?.arrowData;
      if (!arrowData) return false;
      return (
        arrowData.startConnection?.elementId === elementId ||
        arrowData.endConnection?.elementId === elementId
      );
    });

    connectedArrows.forEach((arrow) => {
      let arrowData = deepCloneArrowData(arrow.data.arrowData);

      if (arrowData.startConnection?.elementId === elementId) {
        const anchorPos = getAnchorPositionForElement(updatedElement, arrowData.startConnection.anchorPoint);
        const newStartPoint = {
          x: anchorPos.x - arrow.position.x,
          y: anchorPos.y - arrow.position.y,
        };

        const relativeTargetElement = {
          id: updatedElement.id,
          position: {
            x: updatedElement.position.x - arrow.position.x,
            y: updatedElement.position.y - arrow.position.y,
          },
          size: updatedElement.size,
        };

        arrowData = resolveSnapConnection(
          arrowData,
          newStartPoint,
          arrowData.startConnection.anchorPoint as SnapEdge,
          relativeTargetElement,
          'start',
        );
      }

      if (arrowData.endConnection?.elementId === elementId) {
        const anchorPos = getAnchorPositionForElement(updatedElement, arrowData.endConnection.anchorPoint);
        const newEndPoint = {
          x: anchorPos.x - arrow.position.x,
          y: anchorPos.y - arrow.position.y,
        };

        const relativeTargetElement = {
          id: updatedElement.id,
          position: {
            x: updatedElement.position.x - arrow.position.x,
            y: updatedElement.position.y - arrow.position.y,
          },
          size: updatedElement.size,
        };

        arrowData = resolveSnapConnection(
          arrowData,
          newEndPoint,
          arrowData.endConnection.anchorPoint as SnapEdge,
          relativeTargetElement,
          'end',
        );
      }

      const arrowIndex = updatedElements.findIndex((entry) => entry.id === arrow.id);
      if (arrowIndex !== -1) {
        updatedElements[arrowIndex] = {
          ...updatedElements[arrowIndex],
          data: { ...updatedElements[arrowIndex].data, arrowData },
        };
      }
    });

    if (updatedElement.type === 'mindmap_node' || updatedElement.type === 'visual_node') {
      const connectorType = updatedElement.type === 'mindmap_node' ? 'mindmap_connector' : 'visual_connector';
      const connectedConnectors = updatedElements.filter((el) => {
        if (el.type !== connectorType) return false;
        const connectorData = el.data as any;
        return connectorData?.startNodeId === elementId || connectorData?.endNodeId === elementId;
      });

      connectedConnectors.forEach((connector) => {
        const connectorData = connector.data as any;
        const startNode = updatedElements.find((el) => el.id === connectorData?.startNodeId);
        const endNode = updatedElements.find((el) => el.id === connectorData?.endNodeId);

        if (!startNode || !endNode) return;

        const newBounds = calculateConnectorBounds(
          { position: startNode.position, size: startNode.size },
          { position: endNode.position, size: endNode.size },
        );

        const connectorIndex = updatedElements.findIndex((entry) => entry.id === connector.id);
        if (connectorIndex !== -1) {
          updatedElements[connectorIndex] = {
            ...updatedElements[connectorIndex],
            position: newBounds.position,
            size: newBounds.size,
          };
        }
      });
    }
  });

  return updatedElements;
}
