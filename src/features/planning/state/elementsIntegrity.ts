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
