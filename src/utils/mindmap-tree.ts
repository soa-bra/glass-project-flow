// Mind Map Tree Utilities
// إدارة علاقات الشجرة في الخريطة الذهنية

import type { CanvasElement } from '@/types/canvas';
import type { MindMapConnectorData } from '@/types/mindmap-canvas';

/**
 * البحث عن جذر الشجرة لأي عقدة
 */
export const findMindMapRoot = (nodeId: string, elements: CanvasElement[]): string => {
  const connectors = elements.filter(el => el.type === 'mindmap_connector');
  
  // البحث عن connector ينتهي بهذه العقدة (أي أنها فرع من عقدة أخرى)
  const parentConnector = connectors.find(conn => {
    const data = conn.data as MindMapConnectorData;
    return data?.endNodeId === nodeId;
  });
  
  if (!parentConnector) {
    // هذه هي العقدة الجذر
    return nodeId;
  }
  
  // ابحث عن جذر الأب
  const parentId = (parentConnector.data as MindMapConnectorData).startNodeId;
  return findMindMapRoot(parentId, elements);
};

/**
 * الحصول على كل العقد والروابط في شجرة معينة
 */
export const getMindMapTree = (
  rootId: string, 
  elements: CanvasElement[]
): { nodeIds: string[]; connectorIds: string[] } => {
  const nodeIds: string[] = [rootId];
  const connectorIds: string[] = [];
  const visited = new Set<string>([rootId]);
  
  const collectChildren = (parentId: string) => {
    const childConnectors = elements.filter(el => {
      if (el.type !== 'mindmap_connector') return false;
      const data = el.data as MindMapConnectorData;
      return data?.startNodeId === parentId;
    });
    
    childConnectors.forEach(conn => {
      const data = conn.data as MindMapConnectorData;
      const childId = data.endNodeId;
      
      connectorIds.push(conn.id);
      
      if (!visited.has(childId)) {
        visited.add(childId);
        nodeIds.push(childId);
        collectChildren(childId);
      }
    });
  };
  
  collectChildren(rootId);
  
  return { nodeIds, connectorIds };
};

/**
 * الحصول على الأبناء المباشرين لعقدة
 */
export const getChildNodes = (nodeId: string, elements: CanvasElement[]): string[] => {
  return elements
    .filter(el => {
      if (el.type !== 'mindmap_connector') return false;
      const data = el.data as MindMapConnectorData;
      return data?.startNodeId === nodeId;
    })
    .map(conn => (conn.data as MindMapConnectorData).endNodeId);
};

/**
 * الحصول على الأب المباشر لعقدة
 */
export const getParentNode = (nodeId: string, elements: CanvasElement[]): string | null => {
  const parentConnector = elements.find(el => {
    if (el.type !== 'mindmap_connector') return false;
    const data = el.data as MindMapConnectorData;
    return data?.endNodeId === nodeId;
  });
  
  if (!parentConnector) return null;
  return (parentConnector.data as MindMapConnectorData).startNodeId;
};

/**
 * الحصول على كل الأحفاد (recursively) لعقدة معينة
 */
export const getAllDescendants = (nodeId: string, elements: CanvasElement[]): string[] => {
  const descendants: string[] = [];
  const visited = new Set<string>();
  
  const collect = (parentId: string) => {
    const children = getChildNodes(parentId, elements);
    
    children.forEach(childId => {
      if (!visited.has(childId)) {
        visited.add(childId);
        descendants.push(childId);
        collect(childId);
      }
    });
  };
  
  collect(nodeId);
  return descendants;
};

/**
 * الحصول على كل الـ connectors المرتبطة بمجموعة عقد
 */
export const getConnectorsForNodes = (nodeIds: string[], elements: CanvasElement[]): string[] => {
  const nodeIdSet = new Set(nodeIds);
  
  return elements
    .filter(el => {
      if (el.type !== 'mindmap_connector') return false;
      const data = el.data as MindMapConnectorData;
      return nodeIdSet.has(data?.startNodeId) || nodeIdSet.has(data?.endNodeId);
    })
    .map(el => el.id);
};

/**
 * التحقق مما إذا كانت العقدة جزءًا من خريطة ذهنية
 */
export const isMindMapNode = (element: CanvasElement): boolean => {
  return element.type === 'mindmap_node';
};

/**
 * التحقق مما إذا كان العنصر connector للخريطة الذهنية
 */
export const isMindMapConnector = (element: CanvasElement): boolean => {
  return element.type === 'mindmap_connector';
};

/**
 * حساب عدد المستويات (العمق) من الجذر إلى عقدة معينة
 */
export const getNodeDepth = (nodeId: string, elements: CanvasElement[]): number => {
  let depth = 0;
  let currentId: string | null = nodeId;
  
  while (currentId) {
    const parent = getParentNode(currentId, elements);
    if (parent) {
      depth++;
      currentId = parent;
    } else {
      break;
    }
  }
  
  return depth;
};

/**
 * الحصول على كل الـ siblings (الأشقاء) لعقدة
 */
export const getSiblings = (nodeId: string, elements: CanvasElement[]): string[] => {
  const parent = getParentNode(nodeId, elements);
  if (!parent) return []; // العقدة الجذر ليس لها أشقاء
  
  return getChildNodes(parent, elements).filter(id => id !== nodeId);
};
