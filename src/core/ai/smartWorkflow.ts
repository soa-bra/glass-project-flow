/**
 * Smart Workflow Generator - Sprint 8
 * تحويل Prompt إلى عقد وحواف Workflow
 */

import type { WorkflowNodeData, WorkflowEdgeData } from '@/types/workflow';

export interface GeneratedWorkflow {
  nodes: WorkflowNodeData[];
  edges: WorkflowEdgeData[];
  variables: Array<{ name: string; type: string; defaultValue?: unknown }>;
}

export interface WorkflowPrompt {
  description: string;
  context?: string;
  constraints?: string[];
}

/**
 * تحليل الوصف واستخراج الخطوات
 */
export function parseWorkflowDescription(description: string): string[] {
  const steps: string[] = [];
  
  // البحث عن قوائم مرقمة
  const numberedPattern = /\d+[.)]\s*(.+)/g;
  let match;
  while ((match = numberedPattern.exec(description)) !== null) {
    steps.push(match[1].trim());
  }
  
  // البحث عن كلمات مفتاحية للخطوات
  if (steps.length === 0) {
    const keywords = ['ثم', 'بعد ذلك', 'أولاً', 'ثانياً', 'أخيراً', 'then', 'next', 'finally'];
    const sentences = description.split(/[.،,]/);
    
    for (const sentence of sentences) {
      const trimmed = sentence.trim();
      if (trimmed.length > 5) {
        steps.push(trimmed);
      }
    }
  }
  
  return steps;
}

/**
 * تحديد نوع العقدة من الوصف
 */
export function inferNodeType(stepDescription: string): WorkflowNodeData['type'] {
  const lower = stepDescription.toLowerCase();
  
  if (lower.includes('موافقة') || lower.includes('اعتماد') || lower.includes('approve')) {
    return 'approval';
  }
  if (lower.includes('قرار') || lower.includes('اختيار') || lower.includes('decide') || lower.includes('if')) {
    return 'decision';
  }
  if (lower.includes('إشعار') || lower.includes('تنبيه') || lower.includes('notify') || lower.includes('email')) {
    return 'notification';
  }
  if (lower.includes('انتظار') || lower.includes('تأخير') || lower.includes('wait') || lower.includes('delay')) {
    return 'timer'; // استخدام timer بدلاً من delay
  }
  if (lower.includes('متوازي') || lower.includes('parallel')) {
    return 'parallel';
  }
  
  return 'task_stage';
}

/**
 * توليد Workflow من الوصف
 */
export function generateWorkflowFromPrompt(prompt: WorkflowPrompt): GeneratedWorkflow {
  const steps = parseWorkflowDescription(prompt.description);
  const nodes: WorkflowNodeData[] = [];
  const edges: WorkflowEdgeData[] = [];
  
  // إضافة عقدة البداية
  const startNode: WorkflowNodeData = {
    id: `node-start-${Date.now()}`,
    type: 'start',
    label: 'البداية',
    position: { x: 400, y: 50 }
  };
  nodes.push(startNode);
  
  let prevNodeId = startNode.id;
  let yPos = 150;
  
  // إنشاء عقد لكل خطوة
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const nodeType = inferNodeType(step);
    
    const node: WorkflowNodeData = {
      id: `node-${Date.now()}-${i}`,
      type: nodeType,
      label: step.substring(0, 50),
      description: step,
      position: { x: 400, y: yPos }
    };
    nodes.push(node);
    
    // إنشاء حافة
    const edge: WorkflowEdgeData = {
      id: `edge-${Date.now()}-${i}`,
      type: 'sequence',
      fromNodeId: prevNodeId,
      toNodeId: node.id
    };
    edges.push(edge);
    
    prevNodeId = node.id;
    yPos += 120;
  }
  
  // إضافة عقدة النهاية
  const endNode: WorkflowNodeData = {
    id: `node-end-${Date.now()}`,
    type: 'end',
    label: 'النهاية',
    position: { x: 400, y: yPos }
  };
  nodes.push(endNode);
  
  edges.push({
    id: `edge-end-${Date.now()}`,
    type: 'sequence',
    fromNodeId: prevNodeId,
    toNodeId: endNode.id
  });
  
  return { nodes, edges, variables: [] };
}
