/**
 * Graph Store - مصدر الحقيقة الموحد للكانفاس
 * 
 * يجمع:
 * - nodes: جميع العناصر
 * - edges: جميع الموصلات
 * - viewport: حالة الكاميرا
 * - selection: التحديد
 * - interactionMode: حالة التفاعل
 * 
 * ⚠️ قاعدة صارمة: جميع عمليات الكانفاس يجب أن تمر من هنا
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { Point, Bounds, Camera } from '@/core/canvasKernel';
import { canvasKernel } from '@/core/canvasKernel';
import type { 
  InteractionMode, 
  InteractionEvent,
  TypingMode,
  DraggingMode,
  BoxSelectMode
} from '@/core/interactionStateMachine';
import {
  createIdleMode,
  createTypingMode,
  createDraggingMode,
  createBoxSelectMode,
  shouldBlockToolShortcuts,
  getCursorForMode
} from '@/core/interactionStateMachine';

// =============================================================================
// Types
// =============================================================================

export interface GraphNodeData {
  id: string;
  type: string;
  position: Point;
  size: { width: number; height: number };
  rotation?: number;
  parentId?: string;
  childIds: string[];
  layerId: string;
  zIndex: number;
  visible: boolean;
  locked: boolean;
  data?: Record<string, any>;
  style?: Record<string, any>;
}

export interface GraphEdgeData {
  id: string;
  type: string;
  sourceNodeId?: string;
  sourceAnchor?: string;
  sourcePosition: Point;
  targetNodeId?: string;
  targetAnchor?: string;
  targetPosition: Point;
  controlPoints: Point[];
  style: {
    strokeColor: string;
    strokeWidth: number;
    strokeDash?: number[];
  };
  label?: string;
  zIndex: number;
  data?: Record<string, any>;
}

export interface ViewportState extends Camera {
  containerRect?: DOMRect;
  minZoom: number;
  maxZoom: number;
}

export interface SelectionState {
  nodeIds: Set<string>;
  edgeIds: Set<string>;
  /** أخر عنصر تم النقر عليه (للتحديد المتعدد) */
  anchorId?: string;
}

// =============================================================================
// Graph Store State
// =============================================================================

interface GraphStoreState {
  // === البيانات الأساسية ===
  nodes: Map<string, GraphNodeData>;
  edges: Map<string, GraphEdgeData>;
  
  // === الكاميرا ===
  viewport: ViewportState;
  
  // === التحديد ===
  selection: SelectionState;
  
  // === حالة التفاعل ===
  interactionMode: InteractionMode;
  
  // === الفهارس للأداء ===
  nodeEdgeIndex: Map<string, Set<string>>;
  parentChildIndex: Map<string, Set<string>>;
  
  // === Actions: Nodes ===
  addNode: (node: Omit<GraphNodeData, 'id' | 'childIds'> & { id?: string }) => string;
  updateNode: (nodeId: string, updates: Partial<GraphNodeData>) => void;
  removeNode: (nodeId: string) => void;
  removeNodes: (nodeIds: string[]) => void;
  moveNodes: (nodeIds: string[], delta: Point) => void;
  
  // === Actions: Edges ===
  addEdge: (edge: Omit<GraphEdgeData, 'id'> & { id?: string }) => string;
  updateEdge: (edgeId: string, updates: Partial<GraphEdgeData>) => void;
  removeEdge: (edgeId: string) => void;
  
  // === Actions: Viewport ===
  setZoom: (zoom: number) => void;
  setPan: (pan: Point) => void;
  setViewport: (viewport: Partial<ViewportState>) => void;
  zoomToPoint: (zoom: number, screenPoint: Point) => void;
  panBy: (delta: Point) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetViewport: () => void;
  fitToContent: (padding?: number) => void;
  setContainerRect: (rect: DOMRect) => void;
  
  // === Actions: Selection ===
  selectNode: (nodeId: string, additive?: boolean) => void;
  selectNodes: (nodeIds: string[], replace?: boolean) => void;
  deselectNode: (nodeId: string) => void;
  clearSelection: () => void;
  selectAll: () => void;
  selectNodesInBounds: (bounds: Bounds, additive?: boolean) => void;
  isNodeSelected: (nodeId: string) => boolean;
  getSelectedNodes: () => GraphNodeData[];
  
  // === Actions: Interaction Mode ===
  setInteractionMode: (mode: InteractionMode) => void;
  startTyping: (nodeId: string, editorId?: string) => void;
  stopTyping: () => void;
  startDragging: (nodeIds: string[], startWorld: Point) => void;
  updateDragging: (currentWorld: Point) => void;
  stopDragging: () => void;
  startBoxSelect: (startWorld: Point, additive?: boolean) => void;
  updateBoxSelect: (currentWorld: Point) => void;
  stopBoxSelect: () => void;
  resetToIdle: () => void;
  
  // === Queries ===
  getNode: (nodeId: string) => GraphNodeData | undefined;
  getEdge: (edgeId: string) => GraphEdgeData | undefined;
  getNodeEdges: (nodeId: string) => GraphEdgeData[];
  getChildren: (nodeId: string) => GraphNodeData[];
  getParent: (nodeId: string) => GraphNodeData | undefined;
  queryNodesInBounds: (bounds: Bounds) => GraphNodeData[];
  isTyping: () => boolean;
  shouldBlockShortcuts: () => boolean;
  getCursor: () => string;
  
  // === Coordinate Transforms ===
  screenToWorld: (screenPoint: Point) => Point;
  worldToScreen: (worldPoint: Point) => Point;
}

// =============================================================================
// Initial State
// =============================================================================

const initialViewport: ViewportState = {
  zoom: 1,
  pan: { x: 0, y: 0 },
  minZoom: 0.1,
  maxZoom: 5
};

const initialSelection: SelectionState = {
  nodeIds: new Set(),
  edgeIds: new Set()
};

// =============================================================================
// Store Implementation
// =============================================================================

export const useGraphStore = create<GraphStoreState>()(
  subscribeWithSelector((set, get) => ({
    // === Initial State ===
    nodes: new Map(),
    edges: new Map(),
    viewport: initialViewport,
    selection: initialSelection,
    interactionMode: createIdleMode(),
    nodeEdgeIndex: new Map(),
    parentChildIndex: new Map(),

    // =========================================================================
    // Node Actions
    // =========================================================================
    
    addNode: (nodeData) => {
      const id = nodeData.id || crypto.randomUUID();
      const node: GraphNodeData = {
        ...nodeData,
        id,
        childIds: []
      };
      
      set(state => {
        const newNodes = new Map(state.nodes);
        newNodes.set(id, node);
        
        // تحديث فهرس الأبوة
        const newParentChildIndex = new Map(state.parentChildIndex);
        if (node.parentId) {
          const siblings = newParentChildIndex.get(node.parentId) || new Set();
          siblings.add(id);
          newParentChildIndex.set(node.parentId, siblings);
        }
        
        // تحديث فهرس الموصلات
        const newNodeEdgeIndex = new Map(state.nodeEdgeIndex);
        newNodeEdgeIndex.set(id, new Set());
        
        return {
          nodes: newNodes,
          parentChildIndex: newParentChildIndex,
          nodeEdgeIndex: newNodeEdgeIndex
        };
      });
      
      return id;
    },
    
    updateNode: (nodeId, updates) => {
      set(state => {
        const node = state.nodes.get(nodeId);
        if (!node) return state;
        
        const updatedNode = { ...node, ...updates };
        const newNodes = new Map(state.nodes);
        newNodes.set(nodeId, updatedNode);
        
        // تحديث فهرس الأبوة إذا تغير الأب
        let newParentChildIndex = state.parentChildIndex;
        if (updates.parentId !== undefined && updates.parentId !== node.parentId) {
          newParentChildIndex = new Map(state.parentChildIndex);
          
          // إزالة من الأب القديم
          if (node.parentId) {
            const oldSiblings = newParentChildIndex.get(node.parentId);
            if (oldSiblings) {
              oldSiblings.delete(nodeId);
            }
          }
          
          // إضافة للأب الجديد
          if (updates.parentId) {
            const newSiblings = newParentChildIndex.get(updates.parentId) || new Set();
            newSiblings.add(nodeId);
            newParentChildIndex.set(updates.parentId, newSiblings);
          }
        }
        
        return {
          nodes: newNodes,
          parentChildIndex: newParentChildIndex
        };
      });
    },
    
    removeNode: (nodeId) => {
      set(state => {
        const node = state.nodes.get(nodeId);
        if (!node) return state;
        
        const newNodes = new Map(state.nodes);
        newNodes.delete(nodeId);
        
        // إزالة الموصلات المتصلة
        const newEdges = new Map(state.edges);
        const connectedEdges = state.nodeEdgeIndex.get(nodeId);
        if (connectedEdges) {
          connectedEdges.forEach(edgeId => newEdges.delete(edgeId));
        }
        
        // تحديث الفهارس
        const newNodeEdgeIndex = new Map(state.nodeEdgeIndex);
        newNodeEdgeIndex.delete(nodeId);
        
        const newParentChildIndex = new Map(state.parentChildIndex);
        if (node.parentId) {
          const siblings = newParentChildIndex.get(node.parentId);
          if (siblings) siblings.delete(nodeId);
        }
        newParentChildIndex.delete(nodeId);
        
        // إزالة من التحديد
        const newSelection = { ...state.selection };
        const newSelectedNodes = new Set(state.selection.nodeIds);
        newSelectedNodes.delete(nodeId);
        newSelection.nodeIds = newSelectedNodes;
        
        return {
          nodes: newNodes,
          edges: newEdges,
          nodeEdgeIndex: newNodeEdgeIndex,
          parentChildIndex: newParentChildIndex,
          selection: newSelection
        };
      });
    },
    
    removeNodes: (nodeIds) => {
      nodeIds.forEach(id => get().removeNode(id));
    },
    
    moveNodes: (nodeIds, delta) => {
      set(state => {
        const newNodes = new Map(state.nodes);
        
        nodeIds.forEach(nodeId => {
          const node = newNodes.get(nodeId);
          if (node && !node.locked) {
            newNodes.set(nodeId, {
              ...node,
              position: {
                x: node.position.x + delta.x,
                y: node.position.y + delta.y
              }
            });
          }
        });
        
        return { nodes: newNodes };
      });
    },

    // =========================================================================
    // Edge Actions
    // =========================================================================
    
    addEdge: (edgeData) => {
      const id = edgeData.id || crypto.randomUUID();
      const edge: GraphEdgeData = { ...edgeData, id };
      
      set(state => {
        const newEdges = new Map(state.edges);
        newEdges.set(id, edge);
        
        // تحديث فهرس الموصلات
        const newNodeEdgeIndex = new Map(state.nodeEdgeIndex);
        
        if (edge.sourceNodeId) {
          const sourceEdges = newNodeEdgeIndex.get(edge.sourceNodeId) || new Set();
          sourceEdges.add(id);
          newNodeEdgeIndex.set(edge.sourceNodeId, sourceEdges);
        }
        
        if (edge.targetNodeId) {
          const targetEdges = newNodeEdgeIndex.get(edge.targetNodeId) || new Set();
          targetEdges.add(id);
          newNodeEdgeIndex.set(edge.targetNodeId, targetEdges);
        }
        
        return {
          edges: newEdges,
          nodeEdgeIndex: newNodeEdgeIndex
        };
      });
      
      return id;
    },
    
    updateEdge: (edgeId, updates) => {
      set(state => {
        const edge = state.edges.get(edgeId);
        if (!edge) return state;
        
        const updatedEdge = { ...edge, ...updates };
        const newEdges = new Map(state.edges);
        newEdges.set(edgeId, updatedEdge);
        
        return { edges: newEdges };
      });
    },
    
    removeEdge: (edgeId) => {
      set(state => {
        const edge = state.edges.get(edgeId);
        if (!edge) return state;
        
        const newEdges = new Map(state.edges);
        newEdges.delete(edgeId);
        
        // تحديث فهرس الموصلات
        const newNodeEdgeIndex = new Map(state.nodeEdgeIndex);
        
        if (edge.sourceNodeId) {
          const sourceEdges = newNodeEdgeIndex.get(edge.sourceNodeId);
          if (sourceEdges) sourceEdges.delete(edgeId);
        }
        
        if (edge.targetNodeId) {
          const targetEdges = newNodeEdgeIndex.get(edge.targetNodeId);
          if (targetEdges) targetEdges.delete(edgeId);
        }
        
        return {
          edges: newEdges,
          nodeEdgeIndex: newNodeEdgeIndex
        };
      });
    },

    // =========================================================================
    // Viewport Actions
    // =========================================================================
    
    setZoom: (zoom) => {
      const { minZoom, maxZoom } = get().viewport;
      const clampedZoom = Math.max(minZoom, Math.min(maxZoom, zoom));
      
      set(state => ({
        viewport: { ...state.viewport, zoom: clampedZoom }
      }));
    },
    
    setPan: (pan) => {
      set(state => ({
        viewport: { ...state.viewport, pan }
      }));
    },
    
    setViewport: (viewport) => {
      set(state => ({
        viewport: { ...state.viewport, ...viewport }
      }));
    },
    
    zoomToPoint: (zoom, screenPoint) => {
      const state = get();
      const { minZoom, maxZoom, containerRect } = state.viewport;
      const clampedZoom = Math.max(minZoom, Math.min(maxZoom, zoom));
      
      const worldBefore = canvasKernel.screenToWorld(
        screenPoint.x,
        screenPoint.y,
        state.viewport,
        containerRect
      );
      
      const newPan = {
        x: screenPoint.x - (containerRect?.left ?? 0) - worldBefore.x * clampedZoom,
        y: screenPoint.y - (containerRect?.top ?? 0) - worldBefore.y * clampedZoom
      };
      
      set(state => ({
        viewport: { ...state.viewport, zoom: clampedZoom, pan: newPan }
      }));
    },
    
    panBy: (delta) => {
      set(state => ({
        viewport: {
          ...state.viewport,
          pan: {
            x: state.viewport.pan.x + delta.x,
            y: state.viewport.pan.y + delta.y
          }
        }
      }));
    },
    
    zoomIn: () => {
      const { zoom } = get().viewport;
      get().setZoom(zoom * 1.2);
    },
    
    zoomOut: () => {
      const { zoom } = get().viewport;
      get().setZoom(zoom / 1.2);
    },
    
    resetViewport: () => {
      set({ viewport: initialViewport });
    },
    
    fitToContent: (padding = 50) => {
      const state = get();
      const nodes = Array.from(state.nodes.values());
      
      if (nodes.length === 0) {
        get().resetViewport();
        return;
      }
      
      const bounds = canvasKernel.calculateBounds(
        nodes.map(n => ({ position: n.position, size: n.size }))
      );
      
      const containerWidth = state.viewport.containerRect?.width ?? 1000;
      const containerHeight = state.viewport.containerRect?.height ?? 800;
      
      const { zoom, pan } = canvasKernel.calculateZoomToFit(
        bounds,
        containerWidth,
        containerHeight,
        padding
      );
      
      set(state => ({
        viewport: { ...state.viewport, zoom, pan }
      }));
    },
    
    setContainerRect: (rect) => {
      set(state => ({
        viewport: { ...state.viewport, containerRect: rect }
      }));
    },

    // =========================================================================
    // Selection Actions
    // =========================================================================
    
    selectNode: (nodeId, additive = false) => {
      set(state => {
        const newNodeIds = additive
          ? new Set(state.selection.nodeIds)
          : new Set<string>();
        
        if (additive && newNodeIds.has(nodeId)) {
          newNodeIds.delete(nodeId);
        } else {
          newNodeIds.add(nodeId);
        }
        
        return {
          selection: {
            ...state.selection,
            nodeIds: newNodeIds,
            anchorId: nodeId
          }
        };
      });
    },
    
    selectNodes: (nodeIds, replace = true) => {
      set(state => {
        const newNodeIds = replace
          ? new Set(nodeIds)
          : new Set([...state.selection.nodeIds, ...nodeIds]);
        
        return {
          selection: {
            ...state.selection,
            nodeIds: newNodeIds,
            anchorId: nodeIds[nodeIds.length - 1]
          }
        };
      });
    },
    
    deselectNode: (nodeId) => {
      set(state => {
        const newNodeIds = new Set(state.selection.nodeIds);
        newNodeIds.delete(nodeId);
        
        return {
          selection: {
            ...state.selection,
            nodeIds: newNodeIds
          }
        };
      });
    },
    
    clearSelection: () => {
      set({
        selection: {
          nodeIds: new Set(),
          edgeIds: new Set()
        }
      });
    },
    
    selectAll: () => {
      set(state => ({
        selection: {
          nodeIds: new Set(state.nodes.keys()),
          edgeIds: new Set(state.edges.keys())
        }
      }));
    },
    
    selectNodesInBounds: (bounds, additive = false) => {
      const state = get();
      const nodesInBounds = get().queryNodesInBounds(bounds);
      const nodeIds = nodesInBounds.map(n => n.id);
      
      if (additive) {
        get().selectNodes(nodeIds, false);
      } else {
        get().selectNodes(nodeIds, true);
      }
    },
    
    isNodeSelected: (nodeId) => {
      return get().selection.nodeIds.has(nodeId);
    },
    
    getSelectedNodes: () => {
      const state = get();
      return Array.from(state.selection.nodeIds)
        .map(id => state.nodes.get(id))
        .filter((n): n is GraphNodeData => n !== undefined);
    },

    // =========================================================================
    // Interaction Mode Actions
    // =========================================================================
    
    setInteractionMode: (mode) => {
      set({ interactionMode: mode });
    },
    
    startTyping: (nodeId, editorId) => {
      set({ interactionMode: createTypingMode(nodeId, editorId) });
    },
    
    stopTyping: () => {
      const state = get();
      if (state.interactionMode.kind === 'typing') {
        set({ interactionMode: createIdleMode() });
      }
    },
    
    startDragging: (nodeIds, startWorld) => {
      const state = get();
      const startPositions = new Map<string, Point>();
      
      nodeIds.forEach(id => {
        const node = state.nodes.get(id);
        if (node) {
          startPositions.set(id, { ...node.position });
        }
      });
      
      set({
        interactionMode: createDraggingMode(nodeIds, startWorld, startPositions)
      });
    },
    
    updateDragging: (currentWorld) => {
      const state = get();
      if (state.interactionMode.kind !== 'dragging') return;
      
      const { startWorld, startPositions, nodeIds } = state.interactionMode as DraggingMode;
      const delta = {
        x: currentWorld.x - startWorld.x,
        y: currentWorld.y - startWorld.y
      };
      
      // تحديث مواقع العناصر
      const newNodes = new Map(state.nodes);
      
      nodeIds.forEach(nodeId => {
        const startPos = startPositions.get(nodeId);
        const node = newNodes.get(nodeId);
        
        if (startPos && node && !node.locked) {
          newNodes.set(nodeId, {
            ...node,
            position: {
              x: startPos.x + delta.x,
              y: startPos.y + delta.y
            }
          });
        }
      });
      
      set({
        nodes: newNodes,
        interactionMode: {
          ...state.interactionMode,
          isDragStarted: true
        } as DraggingMode
      });
    },
    
    stopDragging: () => {
      const state = get();
      if (state.interactionMode.kind === 'dragging') {
        set({ interactionMode: createIdleMode() });
      }
    },
    
    startBoxSelect: (startWorld, additive = false) => {
      set({
        interactionMode: createBoxSelectMode(startWorld, additive)
      });
    },
    
    updateBoxSelect: (currentWorld) => {
      const state = get();
      if (state.interactionMode.kind !== 'boxSelect') return;
      
      set({
        interactionMode: {
          ...state.interactionMode,
          currentWorld
        } as BoxSelectMode
      });
    },
    
    stopBoxSelect: () => {
      const state = get();
      if (state.interactionMode.kind !== 'boxSelect') return;
      
      const { startWorld, currentWorld, additive } = state.interactionMode as BoxSelectMode;
      
      // حساب bounds التحديد
      const bounds: Bounds = {
        x: Math.min(startWorld.x, currentWorld.x),
        y: Math.min(startWorld.y, currentWorld.y),
        width: Math.abs(currentWorld.x - startWorld.x),
        height: Math.abs(currentWorld.y - startWorld.y)
      };
      
      // تحديد العناصر داخل المنطقة
      get().selectNodesInBounds(bounds, additive);
      
      set({ interactionMode: createIdleMode() });
    },
    
    resetToIdle: () => {
      set({ interactionMode: createIdleMode() });
    },

    // =========================================================================
    // Query Functions
    // =========================================================================
    
    getNode: (nodeId) => {
      return get().nodes.get(nodeId);
    },
    
    getEdge: (edgeId) => {
      return get().edges.get(edgeId);
    },
    
    getNodeEdges: (nodeId) => {
      const state = get();
      const edgeIds = state.nodeEdgeIndex.get(nodeId);
      if (!edgeIds) return [];
      
      return Array.from(edgeIds)
        .map(id => state.edges.get(id))
        .filter((e): e is GraphEdgeData => e !== undefined);
    },
    
    getChildren: (nodeId) => {
      const state = get();
      const childIds = state.parentChildIndex.get(nodeId);
      if (!childIds) return [];
      
      return Array.from(childIds)
        .map(id => state.nodes.get(id))
        .filter((n): n is GraphNodeData => n !== undefined);
    },
    
    getParent: (nodeId) => {
      const state = get();
      const node = state.nodes.get(nodeId);
      if (!node?.parentId) return undefined;
      return state.nodes.get(node.parentId);
    },
    
    queryNodesInBounds: (bounds) => {
      const state = get();
      return Array.from(state.nodes.values()).filter(node => {
        if (!node.visible) return false;
        return canvasKernel.boundsIntersect(bounds, {
          x: node.position.x,
          y: node.position.y,
          width: node.size.width,
          height: node.size.height
        });
      });
    },
    
    isTyping: () => {
      return get().interactionMode.kind === 'typing';
    },
    
    shouldBlockShortcuts: () => {
      return shouldBlockToolShortcuts(get().interactionMode);
    },
    
    getCursor: () => {
      return getCursorForMode(get().interactionMode);
    },

    // =========================================================================
    // Coordinate Transforms
    // =========================================================================
    
    screenToWorld: (screenPoint) => {
      const { viewport } = get();
      return canvasKernel.screenToWorld(
        screenPoint.x,
        screenPoint.y,
        viewport,
        viewport.containerRect
      );
    },
    
    worldToScreen: (worldPoint) => {
      const { viewport } = get();
      return canvasKernel.worldToScreen(
        worldPoint.x,
        worldPoint.y,
        viewport,
        viewport.containerRect
      );
    }
  }))
);

// =============================================================================
// Selectors للأداء
// =============================================================================

export const selectViewport = (state: GraphStoreState) => state.viewport;
export const selectSelection = (state: GraphStoreState) => state.selection;
export const selectInteractionMode = (state: GraphStoreState) => state.interactionMode;
export const selectIsTyping = (state: GraphStoreState) => state.interactionMode.kind === 'typing';
export const selectSelectedNodeIds = (state: GraphStoreState) => state.selection.nodeIds;
