/**
 * منفذ إجراءات Workflow
 * يدعم أنواع مختلفة من الإجراءات مع معالجة الأخطاء
 */

import type { ActionContext } from '@/types/workflow-runtime';
import type { WorkflowAction } from '@/types/workflow';

export type ActionResult = {
  success: boolean;
  error?: string;
  data?: unknown;
};

export type ActionHandler = (
  action: WorkflowAction,
  context: ActionContext
) => Promise<ActionResult>;

const actionHandlers: Map<string, ActionHandler> = new Map();

export function registerActionHandler(type: string, handler: ActionHandler): void {
  actionHandlers.set(type, handler);
}

export async function executeAction(
  action: WorkflowAction,
  context: ActionContext
): Promise<ActionResult> {
  const handler = actionHandlers.get(action.type);
  
  if (handler) {
    try {
      return await handler(action, context);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      context.log(`خطأ في تنفيذ الإجراء ${action.type}: ${errorMessage}`, 'error');
      return { success: false, error: errorMessage };
    }
  }
  
  // الإجراءات المدمجة
  const config = (action.config || {}) as Record<string, unknown>;
  
  switch (action.type) {
    case 'set_variable': {
      const variableName = config.variableName as string;
      if (variableName) {
        context.updateVariable(variableName, config.value);
        context.log(`تم تعيين المتغير ${variableName}`);
      }
      return { success: true };
    }
    
    case 'notify': {
      context.log(`إشعار: ${config.title || config.message || 'إشعار'}`);
      return { success: true };
    }
    
    case 'delay': {
      const duration = (config.duration as number) || 1000;
      await new Promise(resolve => setTimeout(resolve, duration));
      return { success: true };
    }
    
    case 'assign': {
      context.log(`تم التعيين إلى: ${config.assigneeName || config.assigneeId}`);
      return { success: true };
    }
    
    case 'send_email': {
      context.log(`إرسال بريد إلى: ${config.to}`);
      return { success: true };
    }
    
    case 'create_task': {
      context.log(`إنشاء مهمة: ${config.title}`);
      return { success: true };
    }
    
    default:
      context.log(`نوع إجراء: ${action.type}`, 'info');
      return { success: true };
  }
}

export async function executeActions(
  actions: WorkflowAction[] | undefined,
  context: ActionContext
): Promise<{ allSucceeded: boolean; results: ActionResult[] }> {
  if (!actions || actions.length === 0) {
    return { allSucceeded: true, results: [] };
  }
  
  const results: ActionResult[] = [];
  let allSucceeded = true;
  
  for (const action of actions) {
    const result = await executeAction(action, context);
    results.push(result);
    if (!result.success) allSucceeded = false;
  }
  
  return { allSucceeded, results };
}

export function resolveTemplate(template: string, context: ActionContext): string {
  return template.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (_, path) => {
    const parts = path.split('.');
    let value: unknown = context.variables;
    
    for (const part of parts) {
      if (value === null || value === undefined) return '';
      if (typeof value === 'object') {
        value = (value as Record<string, unknown>)[part];
      } else {
        return '';
      }
    }
    
    return String(value ?? '');
  });
}
