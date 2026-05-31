import { useCallback, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import { canvasKernel, getContainerRect } from '@/engine/canvas/kernel/canvasKernel';
import {
  findNearestAnchor,
  calculateConnectorBounds,
  type NodeAnchorPoint,
  type MindMapConnectorData,
} from '@/types/mindmap-canvas';
import type { CanvasElement } from '@/types/canvas';

interface UseMindMapConnectionControllerOptions {
  elements: CanvasElement[];
  containerRef: RefObject<HTMLDivElement>;
  viewport: { zoom: number; pan: { x: number; y: number } };
}

interface MindMapConnectionState {
  isConnecting: boolean;
  sourceNodeId: string | null;
  sourceAnchor: 'top' | 'bottom' | 'left' | 'right' | null;
  startPosition: { x: number; y: number } | null;
  currentPosition: { x: number; y: number } | null;
  nearestAnchor: NodeAnchorPoint | null;
}

export function useMindMapConnectionController({
  elements,
  containerRef,
  viewport,
}: UseMindMapConnectionControllerOptions) {
  const addElement = useCanvasStore((state) => state.addElement);
  const connectionRef = useRef<MindMapConnectionState>({
    isConnecting: false,
    sourceNodeId: null,
    sourceAnchor: null,
    startPosition: null,
    currentPosition: null,
    nearestAnchor: null,
  });

  const [connectionUI, setConnectionUI] = useState<{
    isConnecting: boolean;
    startPosition: { x: number; y: number } | null;
    currentPosition: { x: number; y: number } | null;
    nearestAnchor: NodeAnchorPoint | null;
  }>({
    isConnecting: false,
    startPosition: null,
    currentPosition: null,
    nearestAnchor: null,
  });

  const rafRef = useRef<number | null>(null);

  const syncConnectionUI = useCallback(() => {
    if (rafRef.current) return;

    rafRef.current = requestAnimationFrame(() => {
      const conn = connectionRef.current;
      setConnectionUI({
        isConnecting: conn.isConnecting,
        startPosition: conn.startPosition,
        currentPosition: conn.currentPosition,
        nearestAnchor: conn.nearestAnchor,
      });
      rafRef.current = null;
    });
  }, []);

  const resetConnection = useCallback(() => {
    connectionRef.current = {
      isConnecting: false,
      sourceNodeId: null,
      sourceAnchor: null,
      startPosition: null,
      currentPosition: null,
      nearestAnchor: null,
    };
    syncConnectionUI();
  }, [syncConnectionUI]);

  const handleStartConnection = useCallback(
    (nodeId: string, anchor: 'top' | 'bottom' | 'left' | 'right', position: { x: number; y: number }) => {
      connectionRef.current = {
        isConnecting: true,
        sourceNodeId: nodeId,
        sourceAnchor: anchor,
        startPosition: position,
        currentPosition: position,
        nearestAnchor: null,
      };
      syncConnectionUI();
    },
    [syncConnectionUI],
  );

  const handleEndConnection = useCallback(
    (nodeId: string, anchor: 'top' | 'bottom' | 'left' | 'right') => {
      const conn = connectionRef.current;
      if (!conn.isConnecting || !conn.sourceNodeId || conn.sourceNodeId === nodeId) return;

      const sourceNode = elements.find((el) => el.id === conn.sourceNodeId);
      const targetNode = elements.find((el) => el.id === nodeId);
      if (!sourceNode || !targetNode) return;

      const connectorBounds = calculateConnectorBounds(sourceNode, targetNode);

      addElement({
        type: 'mindmap_connector',
        position: connectorBounds.position,
        size: connectorBounds.size,
        data: {
          startNodeId: conn.sourceNodeId,
          endNodeId: nodeId,
          startAnchor: { nodeId: conn.sourceNodeId, anchor: conn.sourceAnchor },
          endAnchor: { nodeId, anchor },
          curveStyle: 'bezier',
          color: sourceNode.data?.color || '#3DA8F5',
          strokeWidth: 2,
        } as MindMapConnectorData,
      });

      resetConnection();
    },
    [addElement, elements, resetConnection],
  );

  const updateConnectionPosition = useCallback(
    (clientX: number, clientY: number) => {
      const conn = connectionRef.current;
      if (!conn.isConnecting) return;

      const containerRect = getContainerRect(containerRef);
      if (!containerRect) return;

      const canvasPoint = canvasKernel.screenToWorld(clientX, clientY, viewport, containerRect);
      const connectableElements = elements.filter((el) => {
        if (el.id === conn.sourceNodeId) return false;
        if (el.type === 'mindmap_connector' || el.type === 'visual_connector') return false;
        return ['mindmap_node', 'visual_node', 'shape', 'text', 'image', 'sticky', 'frame', 'smart', 'file'].includes(el.type);
      });

      let nearest: NodeAnchorPoint | null = null;
      let nearestDistance = 60;

      for (const node of connectableElements) {
        const result = findNearestAnchor(canvasPoint, node.position, node.size);
        if (result.distance < nearestDistance) {
          nearestDistance = result.distance;
          nearest = {
            id: `${node.id}-${result.anchor}`,
            nodeId: node.id,
            anchor: result.anchor,
            position: result.position,
          };
        }
      }

      connectionRef.current.currentPosition = canvasPoint;
      connectionRef.current.nearestAnchor = nearest;
      syncConnectionUI();
    },
    [containerRef, elements, syncConnectionUI, viewport],
  );

  const cancelConnection = useCallback(() => {
    if (!connectionRef.current.isConnecting) return;
    resetConnection();
  }, [resetConnection]);

  return {
    connectionRef,
    connectionUI,
    handleStartConnection,
    handleEndConnection,
    updateConnectionPosition,
    cancelConnection,
  };
}

export default useMindMapConnectionController;
