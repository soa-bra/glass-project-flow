/**
 * Suggestions Engine - Sprint 8
 * اقتراحات الانتقالات والإجراءات
 */

import type { WorkflowNodeData, WorkflowEdgeData } from '@/types/workflow';

export interface Suggestion {
  id: string;
  type: 'add_node' | 'add_edge' | 'add_condition' | 'add_action' | 'optimize';
  title: string;
  description: string;
  confidence: number;
  apply: () => { nodes?: WorkflowNodeData[]; edges?: WorkflowEdgeData[] };
}

/**
 * توليد اقتراحات بناءً على العقد الحالية
 */
export function generateSuggestions(
  nodes: WorkflowNodeData[],
  edges: WorkflowEdgeData[]
): Suggestion[] {
  const suggestions: Suggestion[] = [];
  
  // اقتراح إضافة عقدة نهاية إذا لم تكن موجودة
  const hasEnd = nodes.some(n => n.type === 'end');
  if (!hasEnd && nodes.length > 0) {
    suggestions.push({
      id: 'add-end-node',
      type: 'add_node',
      title: 'إضافة عقدة نهاية',
      description: 'يجب أن يحتوي كل Workflow على عقدة نهاية',
      confidence: 0.95,
      apply: () => ({
        nodes: [{
          id: `node-end-${Date.now()}`,
          type: 'end',
          label: 'النهاية',
          position: { x: 400, y: 500 }
        }]
      })
    });
  }
  
  // اقتراح إضافة شرط للقرارات بدون شروط
  const decisionNodes = nodes.filter(n => n.type === 'decision');
  for (const decision of decisionNodes) {
    const outEdges = edges.filter(e => e.fromNodeId === decision.id);
    const hasConditions = outEdges.some(e => e.conditions && e.conditions.length > 0);
    
    if (!hasConditions) {
      suggestions.push({
        id: `add-condition-${decision.id}`,
        type: 'add_condition',
        title: `إضافة شروط لـ "${decision.label}"`,
        description: 'عقد القرار تحتاج شروطاً لتوجيه التدفق',
        confidence: 0.9,
        apply: () => ({ edges: [] })
      });
    }
  }
  
  // اقتراح إضافة إشعار بعد الموافقة
  const approvalNodes = nodes.filter(n => n.type === 'approval');
  for (const approval of approvalNodes) {
    const outEdges = edges.filter(e => e.fromNodeId === approval.id);
    const hasNotification = outEdges.some(e => {
      const targetNode = nodes.find(n => n.id === e.toNodeId);
      return targetNode?.type === 'notification';
    });
    
    if (!hasNotification) {
      suggestions.push({
        id: `add-notification-${approval.id}`,
        type: 'add_node',
        title: 'إضافة إشعار بعد الموافقة',
        description: 'من الأفضل إرسال إشعار بعد الموافقة',
        confidence: 0.7,
        apply: () => ({
          nodes: [{
            id: `node-notify-${Date.now()}`,
            type: 'notification',
            label: 'إشعار بالموافقة',
            position: { x: (approval.position?.x || 400) + 150, y: approval.position?.y || 300 }
          }]
        })
      });
    }
  }
  
  return suggestions.sort((a, b) => b.confidence - a.confidence);
}
