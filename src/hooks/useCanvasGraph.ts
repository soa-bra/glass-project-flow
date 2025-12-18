/**
 * useCanvasGraph - Hook للتكامل بين Canvas Store و Graph Architecture
 * 
 * يوفر واجهة موحدة للعمل مع العناصر والموصلات
 */

import { useCallback, useEffect, useMemo } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import { 
  canvasGraph, 
  type GraphNode, 
  type GraphEdge, 
  type NodeType,
  type EdgeType,
  type GraphQuery 
} from '@/core/canvasGraph';
import type { CanvasElement } from '@/types/canvas';

interface UseCanvasGraphReturn {
  /** جميع العناصر كـ GraphNodes */
  nodes: GraphNode[];
  /** جميع الموصلات كـ GraphEdges */
  edges: GraphEdge[];
  /** استعلام العناصر */
  queryNodes: (query: GraphQuery) => GraphNode[];
  /** الحصول على الموصلات المتصلة بعنصر */
  getNodeEdges: (nodeId: string) => GraphEdge[];
  /** الحصول على أبناء عنصر */
  getChildren: (nodeId: string) => GraphNode[];
  /** الحصول على الأب */
  getParent: (nodeId: string) => GraphNode | undefined;
  /** نقل عناصر إلى أب جديد */
  reparent: (nodeIds: string[], newParentId: string | null) => void;
  /** إيجاد أقرب نقطة ربط */
  findNearestAnchor: (nodeId: string, point: { x: number; y: number }, threshold?: number) => {
    anchor: string;
    position: { x: number; y: number };
    distance: number;
  } | null;
  /** إحصائيات */
  stats: {
    nodeCount: number;
    edgeCount: number;
    connectedNodes: number;
    isolatedNodes: number;
  };
}

/**
 * تحويل CanvasElement إلى GraphNode
 */
const elementToNode = (element: CanvasElement): GraphNode => {
  // تحديد نوع العنصر
  let nodeType: NodeType = 'shape';
  if (element.type === 'text') nodeType = 'text';
  else if (element.type === 'image') nodeType = 'image';
  else if (element.type === 'frame') nodeType = 'frame';
  else if (element.type === 'file') nodeType = 'file';
  else if (element.data?.shapeType === 'sticky') nodeType = 'sticky';

  // التحقق من كون العنصر موصلاً (سهم)
  const isConnector = element.type === 'shape' && 
    element.data?.shapeType?.toString().startsWith('arrow_');

  return {
    id: element.id,
    type: nodeType,
    position: element.position,
    size: element.size,
    rotation: typeof element.rotation === 'number' ? element.rotation : 0,
    anchors: generateAnchorsForElement(element.id),
    parentId: element.data?.parentId,
    childIds: element.data?.children || [],
    data: {
      ...element.data,
      style: element.style,
      originalType: element.type,
      isConnector
    },
    layerId: element.layerId || 'default',
    zIndex: typeof element.zIndex === 'number' ? element.zIndex : 0,
    visible: element.visible !== false,
    locked: element.locked === true
  };
};

/**
 * توليد نقاط الربط
 */
const generateAnchorsForElement = (elementId: string) => {
  const positions = ['top', 'bottom', 'left', 'right', 'center'] as const;
  return positions.map(position => ({
    id: `${elementId}-${position}`,
    position
  }));
};

/**
 * استخراج الموصلات (الأسهم) من العناصر
 */
const extractEdgesFromElements = (elements: CanvasElement[]): GraphEdge[] => {
  const edges: GraphEdge[] = [];

  elements.forEach(element => {
    // التحقق من كون العنصر سهماً
    if (element.type === 'shape' && element.data?.shapeType?.toString().startsWith('arrow_')) {
      const arrowData = element.data?.arrowData;
      
      if (arrowData) {
        const edge: GraphEdge = {
          id: element.id,
          type: arrowData.arrowType === 'orthogonal' ? 'orthogonal' : 'arrow',
          source: {
            nodeId: arrowData.startConnection?.elementId,
            anchor: arrowData.startConnection?.anchorPoint,
            position: arrowData.startPoint || element.position,
            style: 'none'
          },
          target: {
            nodeId: arrowData.endConnection?.elementId,
            anchor: arrowData.endConnection?.anchorPoint,
            position: arrowData.endPoint || {
              x: element.position.x + element.size.width,
              y: element.position.y + element.size.height
            },
            style: 'arrow'
          },
          controlPoints: arrowData.controlPoints || [],
          style: {
            strokeColor: element.style?.fillColor || '#0B0F12',
            strokeWidth: element.style?.strokeWidth || 2,
            strokeDash: arrowData.strokeDash
          },
          label: arrowData.label,
          data: { originalElement: element },
          zIndex: element.zIndex || 0
        };

        edges.push(edge);
      }
    }
  });

  return edges;
};

export const useCanvasGraph = (): UseCanvasGraphReturn => {
  const elements = useCanvasStore(state => state.elements);

  // مزامنة العناصر مع الرسم البياني
  useEffect(() => {
    // تحويل العناصر إلى nodes
    const nodes = elements
      .filter(el => !(el.type === 'shape' && el.data?.shapeType?.toString().startsWith('arrow_')))
      .map(elementToNode);

    // استخراج الموصلات
    const edges = extractEdgesFromElements(elements);

    // تحديث الرسم البياني
    canvasGraph.import({ nodes, edges });
  }, [elements]);

  // الحصول على العناصر
  const nodes = useMemo(() => canvasGraph.getAllNodes(), [elements]);
  const edges = useMemo(() => canvasGraph.getAllEdges(), [elements]);

  // استعلام العناصر
  const queryNodes = useCallback((query: GraphQuery) => {
    return canvasGraph.queryNodes(query);
  }, []);

  // الحصول على الموصلات المتصلة
  const getNodeEdges = useCallback((nodeId: string) => {
    return canvasGraph.getNodeEdges(nodeId);
  }, []);

  // الحصول على الأبناء
  const getChildren = useCallback((nodeId: string) => {
    return canvasGraph.getChildren(nodeId);
  }, []);

  // الحصول على الأب
  const getParent = useCallback((nodeId: string) => {
    return canvasGraph.getParent(nodeId);
  }, []);

  // نقل العناصر
  const reparent = useCallback((nodeIds: string[], newParentId: string | null) => {
    canvasGraph.reparent(nodeIds, newParentId);
    
    // تحديث الـ Store
    const { updateElement } = useCanvasStore.getState();
    nodeIds.forEach(nodeId => {
      updateElement(nodeId, { 
        data: { 
          ...useCanvasStore.getState().elements.find(e => e.id === nodeId)?.data,
          parentId: newParentId 
        } 
      });
    });
  }, []);

  // إيجاد أقرب نقطة ربط
  const findNearestAnchor = useCallback((
    nodeId: string, 
    point: { x: number; y: number }, 
    threshold = 20
  ) => {
    return canvasGraph.findNearestAnchor(nodeId, point, threshold);
  }, []);

  // الإحصائيات
  const stats = useMemo(() => canvasGraph.getStats(), [elements]);

  return {
    nodes,
    edges,
    queryNodes,
    getNodeEdges,
    getChildren,
    getParent,
    reparent,
    findNearestAnchor,
    stats
  };
};

export default useCanvasGraph;
