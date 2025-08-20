import { useEffect, useRef, useState } from 'react';
import { CanvasEngine, CanvasEngineOptions } from '@/lib/canvas/engine/canvas-engine';
import { CanvasNode, CanvasState, Point } from '@/lib/canvas/types';

export interface UseCanvasEngineReturn {
  engine: CanvasEngine | null;
  state: CanvasState | null;
  isReady: boolean;
  
  // Node operations
  addNode: (nodeData: Partial<CanvasNode>) => string | null;
  updateNode: (id: string, patch: Partial<CanvasNode>) => void;
  removeNode: (id: string) => void;
  getNode: (id: string) => CanvasNode | undefined;
  getNodes: () => CanvasNode[];
  
  // Selection
  selectNode: (id: string, multiSelect?: boolean) => void;
  clearSelection: () => void;
  
  // Camera
  pan: (delta: Point) => void;
  zoom: (delta: number, screenPoint?: Point) => void;
  zoomToFit: () => void;
  zoomToNodes: (nodeIds: string[]) => void;
  
  // Viewport
  setViewport: (size: { width: number; height: number }) => void;
  
  // Transform
  screenToWorld: (point: Point) => Point | null;
  worldToScreen: (point: Point) => Point | null;
}

export const useCanvasEngine = (options: CanvasEngineOptions = {}): UseCanvasEngineReturn => {
  const engineRef = useRef<CanvasEngine | null>(null);
  const [state, setState] = useState<CanvasState | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Initialize engine
  useEffect(() => {
    const engine = new CanvasEngine(options);
    engineRef.current = engine;

    // Set initial state
    setState(engine.getState());
    setIsReady(true);

    // Listen to state changes
    const handleStateChange = () => {
      setState({ ...engine.getState() });
    };

    engine.on('nodeAdded', handleStateChange);
    engine.on('nodeUpdated', handleStateChange);
    engine.on('nodeRemoved', handleStateChange);
    engine.on('selectionChanged', handleStateChange);
    engine.on('cameraChanged', handleStateChange);

    return () => {
      engine.destroy();
      engineRef.current = null;
      setIsReady(false);
      setState(null);
    };
  }, []); // Only run once on mount

  // Memoized operations
  const addNode = (nodeData: Partial<CanvasNode>): string | null => {
    return engineRef.current?.addNode(nodeData) || null;
  };

  const updateNode = (id: string, patch: Partial<CanvasNode>): void => {
    engineRef.current?.updateNode(id, patch);
  };

  const removeNode = (id: string): void => {
    engineRef.current?.removeNode(id);
  };

  const getNode = (id: string): CanvasNode | undefined => {
    return engineRef.current?.getNode(id);
  };

  const getNodes = (): CanvasNode[] => {
    return engineRef.current?.getNodes() || [];
  };

  const selectNode = (id: string, multiSelect: boolean = false): void => {
    engineRef.current?.selectNode(id, multiSelect);
  };

  const clearSelection = (): void => {
    engineRef.current?.clearSelection();
  };

  const pan = (delta: Point): void => {
    engineRef.current?.pan(delta);
  };

  const zoom = (delta: number, screenPoint?: Point): void => {
    engineRef.current?.zoom(delta, screenPoint);
  };

  const zoomToFit = (): void => {
    engineRef.current?.zoomToFit();
  };

  const zoomToNodes = (nodeIds: string[]): void => {
    engineRef.current?.zoomToNodes(nodeIds);
  };

  const setViewport = (size: { width: number; height: number }): void => {
    engineRef.current?.setViewport(size);
  };

  const screenToWorld = (point: Point): Point | null => {
    return engineRef.current?.screenToWorld(point) || null;
  };

  const worldToScreen = (point: Point): Point | null => {
    return engineRef.current?.worldToScreen(point) || null;
  };

  return {
    engine: engineRef.current,
    state,
    isReady,
    addNode,
    updateNode,
    removeNode,
    getNode,
    getNodes,
    selectNode,
    clearSelection,
    pan,
    zoom,
    zoomToFit,
    zoomToNodes,
    setViewport,
    screenToWorld,
    worldToScreen
  };
};