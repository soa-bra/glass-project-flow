/**
 * Mindmap Slice - إدارة الخريطة الذهنية
 */

import { StateCreator } from 'zustand';
import type { CanvasElement } from '@/types/canvas';
import { calculateConnectorBounds } from '@/types/mindmap-canvas';
import { redistributeBranches } from '@/utils/mindmap-layout';

export interface MindmapSlice {
  // Mind Map Tree Actions
  moveElementWithChildren: (elementId: string, deltaX: number, deltaY: number) => void;
  selectMindMapTree: (nodeId: string) => void;
  autoResolveOverlapsForMindMap: () => void;
  expandSelectionToFullMindMapTrees: (selectedIds: string[]) => void;
}

export const createMindmapSlice: StateCreator<
  any,
  [],
  [],
  MindmapSlice
> = (set, get) => ({
  moveElementWithChildren: (elementId, deltaX, deltaY) => {
    const { elements } = get();
    
    const getAllChildren = (nodeId: string): string[] => {
      const children: string[] = [];
      const connectors = elements.filter((el: CanvasElement) => 
        el.type === 'mindmap_connector' && 
        (el.data as any)?.startNodeId === nodeId
      );
      
      connectors.forEach((conn: CanvasElement) => {
        const childId = (conn.data as any)?.endNodeId;
        if (childId) {
          children.push(childId);
          children.push(...getAllChildren(childId));
        }
      });
      
      return children;
    };
    
    const nodesToMove = [elementId, ...getAllChildren(elementId)];
    
    set((state: any) => {
      let updatedElements = state.elements.map((el: CanvasElement) => {
        if (nodesToMove.includes(el.id)) {
          return {
            ...el,
            position: {
              x: el.position.x + deltaX,
              y: el.position.y + deltaY
            }
          };
        }
        return el;
      });
      
      // تحديث bounds جميع الـ connectors المتصلة
      const affectedConnectors = updatedElements.filter((el: CanvasElement) => {
        if (el.type !== 'mindmap_connector') return false;
        const connectorData = el.data as any;
        return (
          nodesToMove.includes(connectorData?.startNodeId) ||
          nodesToMove.includes(connectorData?.endNodeId)
        );
      });
      
      affectedConnectors.forEach((connector: CanvasElement) => {
        const connectorData = connector.data as any;
        const startNode = updatedElements.find((el: CanvasElement) => el.id === connectorData?.startNodeId);
        const endNode = updatedElements.find((el: CanvasElement) => el.id === connectorData?.endNodeId);
        
        if (startNode && endNode) {
          const newBounds = calculateConnectorBounds(
            { position: startNode.position, size: startNode.size },
            { position: endNode.position, size: endNode.size }
          );
          
          const connIdx = updatedElements.findIndex((e: CanvasElement) => e.id === connector.id);
          if (connIdx !== -1) {
            updatedElements[connIdx] = {
              ...updatedElements[connIdx],
              position: newBounds.position,
              size: newBounds.size
            };
          }
        }
      });
      
      return { elements: updatedElements };
    });
    
    // اكتشاف وحل التداخلات
    const updatedElements = get().elements;
    const mindMapNodes = updatedElements.filter((el: CanvasElement) => el.type === 'mindmap_node');
    
    const overlaps: { nodeId1: string; nodeId2: string; overlapY: number }[] = [];
    const padding = 20;
    
    for (let i = 0; i < mindMapNodes.length; i++) {
      for (let j = i + 1; j < mindMapNodes.length; j++) {
        const a = mindMapNodes[i];
        const b = mindMapNodes[j];
        
        if (nodesToMove.includes(a.id) && nodesToMove.includes(b.id)) continue;
        if (!nodesToMove.includes(a.id) && !nodesToMove.includes(b.id)) continue;
        
        const ax1 = a.position.x - padding;
        const ay1 = a.position.y - padding;
        const ax2 = a.position.x + a.size.width + padding;
        const ay2 = a.position.y + a.size.height + padding;
        
        const bx1 = b.position.x - padding;
        const by1 = b.position.y - padding;
        const bx2 = b.position.x + b.size.width + padding;
        const by2 = b.position.y + b.size.height + padding;
        
        const overlapX = Math.max(0, Math.min(ax2, bx2) - Math.max(ax1, bx1));
        const overlapY = Math.max(0, Math.min(ay2, by2) - Math.max(ay1, by1));
        
        if (overlapX > 0 && overlapY > 0) {
          const nodeToMove = nodesToMove.includes(a.id) ? b.id : a.id;
          
          overlaps.push({
            nodeId1: nodeToMove,
            nodeId2: nodesToMove.includes(a.id) ? a.id : b.id,
            overlapY
          });
        }
      }
    }
    
    if (overlaps.length > 0) {
      set((state: any) => ({
        elements: state.elements.map((el: CanvasElement) => {
          const overlap = overlaps.find(o => o.nodeId1 === el.id);
          if (overlap) {
            const otherNode = state.elements.find((e: CanvasElement) => e.id === overlap.nodeId2);
            if (otherNode) {
              const direction = el.position.y < otherNode.position.y ? -1 : 1;
              return {
                ...el,
                position: {
                  ...el.position,
                  y: el.position.y + direction * (overlap.overlapY + 10)
                }
              };
            }
          }
          return el;
        })
      }));
    }
  },

  selectMindMapTree: (nodeId) => {
    const { elements } = get();
    
    const findRoot = (id: string): string => {
      const parentConnector = elements.find((el: CanvasElement) => {
        if (el.type !== 'mindmap_connector') return false;
        return (el.data as any)?.endNodeId === id;
      });
      
      if (!parentConnector) return id;
      return findRoot((parentConnector.data as any).startNodeId);
    };
    
    const rootId = findRoot(nodeId);
    
    const collectTree = (parentId: string): string[] => {
      const ids: string[] = [parentId];
      
      const childConnectors = elements.filter((el: CanvasElement) => {
        if (el.type !== 'mindmap_connector') return false;
        return (el.data as any)?.startNodeId === parentId;
      });
      
      childConnectors.forEach((conn: CanvasElement) => {
        ids.push(conn.id);
        const childId = (conn.data as any)?.endNodeId;
        if (childId) {
          ids.push(...collectTree(childId));
        }
      });
      
      return ids;
    };
    
    const treeIds = collectTree(rootId);
    set({ selectedElementIds: treeIds });
  },

  autoResolveOverlapsForMindMap: () => {
    const { elements } = get();
    const mindMapConnectors = elements.filter((el: CanvasElement) => el.type === 'mindmap_connector');
    
    if (mindMapConnectors.length === 0) return;
    
    const parentIds = new Set<string>();
    mindMapConnectors.forEach((conn: CanvasElement) => {
      const startNodeId = (conn.data as any)?.startNodeId;
      if (startNodeId) parentIds.add(startNodeId);
    });
    
    const rootIds = new Set<string>();
    parentIds.forEach((parentId: string) => {
      const hasParent = mindMapConnectors.some((conn: CanvasElement) => 
        (conn.data as any)?.endNodeId === parentId
      );
      if (!hasParent) {
        rootIds.add(parentId);
      }
    });
    
    elements.filter((el: CanvasElement) => el.type === 'mindmap_node' && (el.data as any)?.isRoot)
      .forEach((el: CanvasElement) => rootIds.add(el.id));
    
    let allAdjustments = new Map<string, { x: number; y: number }>();
    
    const processNode = (nodeId: string, currentElements: CanvasElement[]) => {
      const adjustments = redistributeBranches(nodeId, currentElements, 80);
      
      adjustments.forEach((pos: { x: number; y: number }, id: string) => {
        allAdjustments.set(id, pos);
      });
      
      const updatedElements = currentElements.map((el: CanvasElement) => {
        const adj = allAdjustments.get(el.id);
        if (adj) {
          return { ...el, position: adj };
        }
        return el;
      });
      
      const childConnectors = currentElements.filter((el: CanvasElement) => 
        el.type === 'mindmap_connector' && 
        (el.data as any)?.startNodeId === nodeId
      );
      
      childConnectors.forEach((conn: CanvasElement) => {
        const childId = (conn.data as any)?.endNodeId;
        if (childId && parentIds.has(childId)) {
          processNode(childId, updatedElements);
        }
      });
    };
    
    rootIds.forEach((rootId: string) => {
      processNode(rootId, elements);
    });
    
    if (allAdjustments.size > 0) {
      set((state: any) => ({
        elements: state.elements.map((el: CanvasElement) => {
          const adj = allAdjustments.get(el.id);
          if (adj) {
            return { ...el, position: adj };
          }
          return el;
        })
      }));
    }
  },

  // ✅ توسيع التحديد ليشمل كامل أشجار الخريطة الذهنية
  expandSelectionToFullMindMapTrees: (selectedIds: string[]) => {
    const { elements } = get();
    
    // التحقق مما إذا كانت أي من العناصر المحددة من نوع mindmap
    const hasMindMapElements = selectedIds.some(id => {
      const el = elements.find((e: CanvasElement) => e.id === id);
      return el && (el.type === 'mindmap_node' || el.type === 'mindmap_connector');
    });
    
    if (!hasMindMapElements) return;
    
    // دالة للعثور على الجذر
    const findRoot = (nodeId: string): string => {
      const parentConnector = elements.find((el: CanvasElement) => {
        if (el.type !== 'mindmap_connector') return false;
        return (el.data as any)?.endNodeId === nodeId;
      });
      
      if (!parentConnector) return nodeId;
      return findRoot((parentConnector.data as any).startNodeId);
    };
    
    // دالة لجمع كل عناصر الشجرة
    const collectTree = (parentId: string): string[] => {
      const ids: string[] = [parentId];
      
      const childConnectors = elements.filter((el: CanvasElement) => {
        if (el.type !== 'mindmap_connector') return false;
        return (el.data as any)?.startNodeId === parentId;
      });
      
      childConnectors.forEach((conn: CanvasElement) => {
        ids.push(conn.id);
        const childId = (conn.data as any)?.endNodeId;
        if (childId) {
          ids.push(...collectTree(childId));
        }
      });
      
      return ids;
    };
    
    // جمع كل الأشجار المرتبطة بالعناصر المحددة
    const allTreeIds = new Set<string>();
    
    selectedIds.forEach(id => {
      const el = elements.find((e: CanvasElement) => e.id === id);
      if (!el) return;
      
      if (el.type === 'mindmap_node') {
        const rootId = findRoot(id);
        const treeIds = collectTree(rootId);
        treeIds.forEach(treeId => allTreeIds.add(treeId));
      } else if (el.type === 'mindmap_connector') {
        const connectorData = el.data as any;
        if (connectorData?.startNodeId) {
          const rootId = findRoot(connectorData.startNodeId);
          const treeIds = collectTree(rootId);
          treeIds.forEach(treeId => allTreeIds.add(treeId));
        }
      }
    });
    
    if (allTreeIds.size > 0) {
      set({ selectedElementIds: Array.from(allTreeIds) });
    }
  }
});
