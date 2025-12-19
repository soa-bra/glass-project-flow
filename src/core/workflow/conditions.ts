/**
 * محرك تقييم شروط Workflow
 * يدعم تعبيرات منطقية بسيطة وآمنة
 */

import type { ConditionContext } from '@/types/workflow-runtime';
import type { WorkflowCondition } from '@/types/workflow';

export type ComparisonOperator = 
  | 'equals' 
  | 'not_equals' 
  | 'greater_than' 
  | 'less_than' 
  | 'greater_or_equal' 
  | 'less_or_equal'
  | 'contains'
  | 'not_contains'
  | 'starts_with'
  | 'ends_with'
  | 'is_empty'
  | 'is_not_empty'
  | 'is_true'
  | 'is_false';

export type LogicalOperator = 'and' | 'or';

export interface ConditionExpression {
  field: string;
  operator: ComparisonOperator;
  value?: unknown;
}

export interface ConditionGroup {
  logic: LogicalOperator;
  conditions: (ConditionExpression | ConditionGroup)[];
}

/**
 * تقييم شرط Workflow
 */
export function evaluateCondition(
  condition: WorkflowCondition,
  context: ConditionContext
): boolean {
  try {
    const { field, operator, value } = condition;
    const actualValue = resolveFieldValue(field, context);
    
    return compareValues(actualValue, operator as ComparisonOperator, value);
  } catch (error) {
    console.error('Error evaluating condition:', error);
    return false;
  }
}

/**
 * تقييم مجموعة شروط
 */
export function evaluateConditionGroup(
  group: ConditionGroup,
  context: ConditionContext
): boolean {
  const { logic, conditions } = group;
  
  if (conditions.length === 0) return true;
  
  const results = conditions.map(cond => {
    if ('logic' in cond) {
      return evaluateConditionGroup(cond, context);
    }
    return evaluateExpression(cond, context);
  });
  
  if (logic === 'and') {
    return results.every(Boolean);
  }
  return results.some(Boolean);
}

/**
 * تقييم تعبير شرط واحد
 */
export function evaluateExpression(
  expr: ConditionExpression,
  context: ConditionContext
): boolean {
  const actualValue = resolveFieldValue(expr.field, context);
  return compareValues(actualValue, expr.operator, expr.value);
}

/**
 * حل قيمة حقل من السياق
 */
export function resolveFieldValue(
  field: string,
  context: ConditionContext
): unknown {
  // دعم المسارات المنقطة: variables.status, nodeStates.node1.status
  const parts = field.split('.');
  let current: unknown = context;
  
  for (const part of parts) {
    if (current === null || current === undefined) {
      return undefined;
    }
    if (typeof current === 'object') {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  
  return current;
}

/**
 * مقارنة القيم حسب المشغل
 */
export function compareValues(
  actual: unknown,
  operator: ComparisonOperator,
  expected?: unknown
): boolean {
  switch (operator) {
    case 'equals':
      return actual === expected;
      
    case 'not_equals':
      return actual !== expected;
      
    case 'greater_than':
      return Number(actual) > Number(expected);
      
    case 'less_than':
      return Number(actual) < Number(expected);
      
    case 'greater_or_equal':
      return Number(actual) >= Number(expected);
      
    case 'less_or_equal':
      return Number(actual) <= Number(expected);
      
    case 'contains':
      if (typeof actual === 'string' && typeof expected === 'string') {
        return actual.includes(expected);
      }
      if (Array.isArray(actual)) {
        return actual.includes(expected);
      }
      return false;
      
    case 'not_contains':
      if (typeof actual === 'string' && typeof expected === 'string') {
        return !actual.includes(expected);
      }
      if (Array.isArray(actual)) {
        return !actual.includes(expected);
      }
      return true;
      
    case 'starts_with':
      return typeof actual === 'string' && 
             typeof expected === 'string' && 
             actual.startsWith(expected);
      
    case 'ends_with':
      return typeof actual === 'string' && 
             typeof expected === 'string' && 
             actual.endsWith(expected);
      
    case 'is_empty':
      if (actual === null || actual === undefined) return true;
      if (typeof actual === 'string') return actual.length === 0;
      if (Array.isArray(actual)) return actual.length === 0;
      if (typeof actual === 'object') return Object.keys(actual).length === 0;
      return false;
      
    case 'is_not_empty':
      return !compareValues(actual, 'is_empty');
      
    case 'is_true':
      return actual === true || actual === 'true' || actual === 1;
      
    case 'is_false':
      return actual === false || actual === 'false' || actual === 0;
      
    default:
      console.warn(`Unknown operator: ${operator}`);
      return false;
  }
}

/**
 * تقييم شروط دخول عقدة
 */
export function evaluateEntryConditions(
  conditions: WorkflowCondition[] | undefined,
  context: ConditionContext
): { passed: boolean; failedConditions: WorkflowCondition[] } {
  if (!conditions || conditions.length === 0) {
    return { passed: true, failedConditions: [] };
  }
  
  const failedConditions: WorkflowCondition[] = [];
  
  for (const condition of conditions) {
    if (!evaluateCondition(condition, context)) {
      failedConditions.push(condition);
    }
  }
  
  return {
    passed: failedConditions.length === 0,
    failedConditions
  };
}

/**
 * تقييم شرط انتقال على حافة
 */
export function evaluateEdgeCondition(
  conditionExpr: string | undefined,
  context: ConditionContext
): boolean {
  if (!conditionExpr) return true;
  
  // تعبيرات بسيطة: "variable == value"
  const match = conditionExpr.match(/^(\w+(?:\.\w+)*)\s*(==|!=|>|<|>=|<=)\s*(.+)$/);
  
  if (!match) {
    console.warn('Invalid condition expression:', conditionExpr);
    return true;
  }
  
  const [, field, op, rawValue] = match;
  const actual = resolveFieldValue(field, context);
  
  // محاولة تحويل القيمة
  let expected: unknown = rawValue.trim();
  if (expected === 'true') expected = true;
  else if (expected === 'false') expected = false;
  else if (expected === 'null') expected = null;
  else if (!isNaN(Number(expected))) expected = Number(expected);
  else if ((expected as string).startsWith('"') && (expected as string).endsWith('"')) {
    expected = (expected as string).slice(1, -1);
  }
  
  const operatorMap: Record<string, ComparisonOperator> = {
    '==': 'equals',
    '!=': 'not_equals',
    '>': 'greater_than',
    '<': 'less_than',
    '>=': 'greater_or_equal',
    '<=': 'less_or_equal'
  };
  
  return compareValues(actual, operatorMap[op], expected);
}
