import { supabase } from '@/integrations/supabase/client';
import { buildAIContext } from '@/features/ai/context/contextBuilder';
import { sanitizeAIContext } from '@/features/ai/context/contextSanitizer';
import { getAIDepartmentDefinition, type AIDepartmentId } from '@/features/ai/context/departmentRegistry';
import {
  getAIActionDefinition,
  type AIActionContext,
  type AIActionName,
  type AIActionSensitivity,
} from './aiActionRegistry';

export type AIGatewayErrorCode =
  | 'AI_PERMISSION_DENIED'
  | 'HUMAN_APPROVAL_REQUIRED'
  | 'INVALID_INPUT'
  | 'RATE_LIMIT_EXCEEDED'
  | 'PAYMENT_REQUIRED'
  | 'UNAUTHORIZED'
  | 'INTERNAL_ERROR'
  | 'UNKNOWN_ERROR';

export interface AIGatewayInvokeInput {
  action: AIActionName;
  prompt?: string;
  selectedElements?: unknown[];
  context?: AIActionContext;
  departmentId?: AIDepartmentId;
}

export interface AIGatewayResponse<TResult = unknown> {
  success: boolean;
  result: TResult;
  action?: string;
  safety?: unknown;
}

export interface AIGatewayErrorPayload {
  code?: AIGatewayErrorCode | string;
  error?: string;
  message?: string;
  sensitivity?: unknown;
  [key: string]: unknown;
}

export class AIGatewayError extends Error {
  code: AIGatewayErrorCode;
  payload: AIGatewayErrorPayload | null;
  sensitivity?: unknown;

  constructor(code: AIGatewayErrorCode, message: string, payload: AIGatewayErrorPayload | null = null) {
    super(message);
    this.name = 'AIGatewayError';
    this.code = code;
    this.payload = payload;
    this.sensitivity = payload?.sensitivity;
  }
}

export class HumanApprovalRequiredError extends AIGatewayError {
  constructor(message: string, payload: AIGatewayErrorPayload | null = null) {
    super('HUMAN_APPROVAL_REQUIRED', message, payload);
    this.name = 'HumanApprovalRequiredError';
  }
}

const EDGE_CONTEXT_KEYS = ['boardId', 'projectId', 'preferredType', 'targetType', 'humanApproval'] as const;

type SmartElementsAIContext = Pick<AIActionContext, typeof EDGE_CONTEXT_KEYS[number]>;

async function readFunctionErrorPayload(fnError: any): Promise<AIGatewayErrorPayload | null> {
  const context = fnError?.context;
  if (!context || typeof context.json !== 'function') return null;

  try {
    return await context.clone().json();
  } catch {
    try {
      return await context.json();
    } catch {
      return null;
    }
  }
}

const normalizeErrorCode = (code: unknown): AIGatewayErrorCode => {
  if (
    code === 'AI_PERMISSION_DENIED' ||
    code === 'HUMAN_APPROVAL_REQUIRED' ||
    code === 'INVALID_INPUT' ||
    code === 'RATE_LIMIT_EXCEEDED' ||
    code === 'PAYMENT_REQUIRED' ||
    code === 'UNAUTHORIZED' ||
    code === 'INTERNAL_ERROR'
  ) {
    return code;
  }

  return 'UNKNOWN_ERROR';
};

const createGatewayError = (payload: AIGatewayErrorPayload | null, fallbackMessage: string): AIGatewayError => {
  const code = normalizeErrorCode(payload?.code);
  const message = payload?.error || payload?.message || fallbackMessage;

  if (code === 'HUMAN_APPROVAL_REQUIRED') {
    return new HumanApprovalRequiredError(message, payload);
  }

  return new AIGatewayError(code, message, payload);
};

const hasValue = (value: unknown): boolean => value !== undefined && value !== null && value !== '';

const toSmartElementsAIContext = (context: AIActionContext): SmartElementsAIContext => {
  const filteredContext = EDGE_CONTEXT_KEYS.reduce<SmartElementsAIContext>((result, key) => {
    const value = context[key];
    if (!hasValue(value)) return result;

    if (key === 'humanApproval' && value && typeof value === 'object') {
      const humanApproval = value as NonNullable<AIActionContext['humanApproval']>;
      result.humanApproval = {
        approved: humanApproval.approved,
        ...(humanApproval.approverId ? { approverId: humanApproval.approverId } : {}),
        ...(humanApproval.approvedAt ? { approvedAt: humanApproval.approvedAt } : {}),
      };
      return result;
    }

    result[key] = value as never;
    return result;
  }, {});

  return filteredContext;
};

export async function invokeAIAction<TResult = unknown>({
  action,
  prompt,
  selectedElements,
  context = {},
  departmentId,
}: AIGatewayInvokeInput): Promise<TResult> {
  const actionDefinition = getAIActionDefinition(action);
  const department = getAIDepartmentDefinition(departmentId);
  const rawContext = buildAIContext({
    boardId: context.boardId,
    selectedElements,
    activeSection: context.activeSection,
    activeTab: context.activeTab,
    permissions: context.permissions,
    availableLinks: context.availableLinks,
    extraContext: {
      ...context,
      department: department.id,
      departmentPermissions: department.defaultPermissions,
      actionSensitivity: actionDefinition.sensitivity satisfies AIActionSensitivity,
      requiredPermissions: actionDefinition.requiredPermissions,
    },
  });
  const sanitizedContext = sanitizeAIContext(rawContext);
  const edgeContext = toSmartElementsAIContext(sanitizedContext as AIActionContext);

  const { data, error: fnError } = await supabase.functions.invoke<AIGatewayResponse<TResult>>('smart-elements-ai', {
    body: {
      action: actionDefinition.edgeAction,
      prompt,
      selectedElements: Array.isArray(selectedElements) ? sanitizedContext.selectedElements : selectedElements,
      context: edgeContext,
    },
  });

  const errorPayload = fnError ? await readFunctionErrorPayload(fnError) : null;
  const responsePayload = errorPayload || ((data as unknown) as AIGatewayErrorPayload | null);

  if (fnError) {
    throw createGatewayError(errorPayload, fnError.message || 'فشل استدعاء بوابة الذكاء الاصطناعي');
  }

  if (!data?.success) {
    throw createGatewayError(responsePayload, 'فشل في معالجة الطلب');
  }

  return data.result;
}

export const aiGatewayClient = {
  async request<TResult = unknown>(input: {
    action: AIGatewayInvokeInput['action'];
    prompt?: string;
    context?: Record<string, unknown>;
    payload?: Record<string, unknown>;
    selectedElements?: AIGatewayInvokeInput['selectedElements'];
    departmentId?: AIGatewayInvokeInput['departmentId'];
  }): Promise<{ result: TResult }> {
    const result = await invokeAIAction<TResult>({
      action: input.action,
      prompt: input.prompt,
      selectedElements: input.selectedElements,
      departmentId: input.departmentId,
      context: { ...(input.context ?? {}), payload: input.payload },
    });
    return { result };
  },
};
