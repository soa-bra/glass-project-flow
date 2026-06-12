import { createElement, useCallback, useState } from 'react';
import type { ReactNode } from 'react';
import { SmartElementType } from '@/types/smart-elements';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import {
  SmartTransformationApprovalDialog,
  type SmartTransformationApprovalRequest,
  type TransformationSensitivity,
} from '@/components/smart-elements/SmartTransformationApprovalDialog';
import {
  getCanvasAIPermissions,
  useCanvasAIPermissions,
  type CanvasAIPermissionScope,
} from '@/features/planning/hooks/useCanvasAIPermissions';
import {
  AIGatewayError,
  HumanApprovalRequiredError,
  invokeAIAction,
} from '@/features/ai/gateway/aiGateway.client';
import { getAIActionDefinition, type AIActionName } from '@/features/ai/gateway/aiActionRegistry';

interface GeneratedElement {
  id: string;
  type: SmartElementType;
  title: string;
  description?: string;
  data: Record<string, any>;
  position: { x: number; y: number };
  connections?: Array<{
    targetIndex: number;
    label?: string;
    type: 'leads_to' | 'depends_on' | 'related_to' | 'contains';
  }>;
}

interface GenerationResult {
  elements: GeneratedElement[];
  layout: 'horizontal' | 'vertical' | 'radial' | 'grid' | 'freeform';
  summary: string;
}

interface AnalysisSuggestion {
  targetType: SmartElementType;
  confidence: number;
  reasoning: string;
  preview?: Record<string, any>;
}

interface AnalysisResult {
  suggestions: AnalysisSuggestion[];
  entities: Array<{
    name: string;
    type: 'person' | 'process' | 'system' | 'concept' | 'value' | 'goal' | 'task' | 'milestone';
    importance: 'primary' | 'secondary' | 'tertiary';
  }>;
  relationships?: Array<{
    from: string;
    to: string;
    type: string;
  }>;
}

interface UseSmartElementAIReturn {
  isLoading: boolean;
  error: string | null;
  canUseAI: boolean;
  denialReason: string | null;
  approvalDialog: ReactNode;
  generateElements: (prompt: string, preferredType?: SmartElementType) => Promise<GenerationResult | null>;
  analyzeSelection: (elements: any[], additionalPrompt?: string) => Promise<AnalysisResult | null>;
  transformElements: (elements: any[], targetType: SmartElementType, prompt?: string) => Promise<GenerationResult | null>;
}

interface ApprovalPayload {
  approved: boolean;
  approvedAt: string;
  approverId: string;
  approvalReason: string;
}

interface ApprovalDialogState extends SmartTransformationApprovalRequest {
  resolve: (approval: { approved: boolean; approvalReason?: string }) => void;
}

export function useSmartElementAI(boardId?: string | null): UseSmartElementAIReturn {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [approvalRequest, setApprovalRequest] = useState<ApprovalDialogState | null>(null);
  const boardPermissions = useCanvasAIPermissions(boardId);

  const ensureAIPermission = useCallback((scope: CanvasAIPermissionScope): boolean => {
    void scope;
    const permissions = boardId ? boardPermissions : getCanvasAIPermissions();

    if (permissions.canUseAI) return true;

    const message = permissions.denialReason || 'لا تملك صلاحية استخدام الذكاء الاصطناعي';
    setError(message);
    toast.error('تعذر بدء إجراء الذكاء الاصطناعي', {
      description: message
    });
    return false;
  }, [boardId, boardPermissions]);

  const callAI = useCallback(async (
    action: AIActionName,
    payload: {
      prompt?: string;
      selectedElements?: any[];
      context?: Record<string, any>;
    }
  ) => {
    const actionDefinition = getAIActionDefinition(action);
    if (!ensureAIPermission(actionDefinition.edgeAction as CanvasAIPermissionScope)) {
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      return await invokeAIAction({
        action,
        prompt: payload.prompt,
        selectedElements: payload.selectedElements,
        context: payload.context,
        departmentId: 'planning',
      });
    } catch (err) {
      if (err instanceof HumanApprovalRequiredError) {
        throw err;
      }

      if (err instanceof AIGatewayError) {
        if (err.code === 'RATE_LIMIT_EXCEEDED') {
          toast.error('تم تجاوز حد الطلبات', {
            description: 'يرجى الانتظار قليلاً ثم المحاولة مجدداً'
          });
        } else if (err.code === 'PAYMENT_REQUIRED') {
          toast.error('الرصيد غير كافٍ', {
            description: 'يرجى إضافة رصيد لاستخدام الذكاء الاصطناعي'
          });
        } else if (err.code === 'AI_PERMISSION_DENIED') {
          toast.error('تعذر بدء إجراء الذكاء الاصطناعي', {
            description: err.message
          });
        } else if (err.code === 'INVALID_INPUT') {
          toast.error('مدخلات الذكاء الاصطناعي غير صالحة', {
            description: err.message
          });
        }
      }

      const message = err instanceof Error ? err.message : 'حدث خطأ غير متوقع';
      setError(message);
      console.error('[useSmartElementAI] Error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [ensureAIPermission]);

  const requestHumanApproval = useCallback((request: SmartTransformationApprovalRequest) => {
    return new Promise<{ approved: boolean; approvalReason?: string }>((resolve) => {
      setApprovalRequest({ ...request, resolve });
    });
  }, []);

  const handleApprove = useCallback((approvalReason: string) => {
    setApprovalRequest((current) => {
      current?.resolve({ approved: true, approvalReason });
      return null;
    });
  }, []);

  const handleCancelApproval = useCallback(() => {
    setApprovalRequest((current) => {
      current?.resolve({ approved: false });
      return null;
    });
  }, []);

  const generateElements = useCallback(async (
    prompt: string,
    preferredType?: SmartElementType
  ): Promise<GenerationResult | null> => {
    const result = await callAI('generate_smart_doc', {
      prompt,
      context: preferredType ? { preferredType } : undefined
    });
    
    if (result) {
      toast.success('تم إنشاء العناصر الذكية', {
        description: result.summary
      });
    }
    
    return result;
  }, [callAI]);

  const analyzeSelection = useCallback(async (
    elements: any[],
    additionalPrompt?: string
  ): Promise<AnalysisResult | null> => {
    if (!elements || elements.length === 0) {
      toast.error('لم يتم تحديد أي عناصر للتحليل');
      return null;
    }

    return await callAI('analyze_project_impact', {
      selectedElements: elements,
      prompt: additionalPrompt
    });
  }, [callAI]);

  const transformElements = useCallback(async (
    elements: any[],
    targetType: SmartElementType,
    prompt?: string
  ): Promise<GenerationResult | null> => {
    if (!elements || elements.length === 0) {
      toast.error('لم يتم تحديد أي عناصر للتحويل');
      return null;
    }

    if (!ensureAIPermission('transform')) {
      return null;
    }

    let result: GenerationResult | null = null;

    try {
      result = await callAI('convert_to_tasks', {
        selectedElements: elements,
        prompt,
        context: { targetType }
      });
    } catch (err) {
      if (!(err instanceof HumanApprovalRequiredError)) {
        const message = err instanceof Error ? err.message : 'حدث خطأ غير متوقع';
        setError(message);
        return null;
      }

      const approval = await requestHumanApproval({
        targetType,
        selectedElements: elements,
        prompt,
        sensitivity: (err.sensitivity as TransformationSensitivity) || { isSensitive: true, score: 1, reasons: [] },
      });

      if (!approval.approved) {
        toast.info('تم إلغاء التحويل الحساس قبل إرسال الاعتماد');
        return null;
      }

      if (!user?.id) {
        toast.error('تعذر تحديد المستخدم المعتمد', {
          description: 'يرجى تسجيل الدخول ثم إعادة المحاولة'
        });
        return null;
      }

      const humanApproval: ApprovalPayload = {
        approved: true,
        approvedAt: new Date().toISOString(),
        approverId: user.id,
        approvalReason: approval.approvalReason || 'اعتماد بشري من واجهة التحويل الذكي',
      };

      result = await callAI('convert_to_tasks', {
        selectedElements: elements,
        prompt,
        context: {
          targetType,
          humanApproval
        }
      });
    }

    if (result) {
      toast.success('تم تحويل العناصر بنجاح', {
        description: result.summary
      });
    }

    return result;
  }, [callAI, ensureAIPermission, requestHumanApproval, user?.id]);

  const approvalDialog: ReactNode = createElement(SmartTransformationApprovalDialog, {
    request: approvalRequest,
    onApprove: handleApprove,
    onCancel: handleCancelApproval,
  });

  return {
    isLoading,
    error,
    canUseAI: boardId ? boardPermissions.canUseAI : getCanvasAIPermissions().canUseAI,
    denialReason: boardId ? boardPermissions.denialReason : getCanvasAIPermissions().denialReason,
    approvalDialog,
    generateElements,
    analyzeSelection,
    transformElements
  };
}
