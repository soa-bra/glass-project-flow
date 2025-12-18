import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SmartElementType } from '@/types/smart-elements';
import { toast } from 'sonner';

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
  generateElements: (prompt: string, preferredType?: SmartElementType) => Promise<GenerationResult | null>;
  analyzeSelection: (elements: any[], additionalPrompt?: string) => Promise<AnalysisResult | null>;
  transformElements: (elements: any[], targetType: SmartElementType, prompt?: string) => Promise<GenerationResult | null>;
}

export function useSmartElementAI(): UseSmartElementAIReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callAI = useCallback(async (
    action: 'generate' | 'analyze' | 'transform',
    payload: {
      prompt?: string;
      selectedElements?: any[];
      context?: Record<string, any>;
    }
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('smart-elements-ai', {
        body: {
          action,
          prompt: payload.prompt,
          selectedElements: payload.selectedElements,
          context: payload.context
        }
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (!data.success) {
        const errorMessage = data.error || 'فشل في معالجة الطلب';
        
        // Handle specific error codes
        if (data.code === 'RATE_LIMIT_EXCEEDED') {
          toast.error('تم تجاوز حد الطلبات', {
            description: 'يرجى الانتظار قليلاً ثم المحاولة مجدداً'
          });
        } else if (data.code === 'PAYMENT_REQUIRED') {
          toast.error('الرصيد غير كافٍ', {
            description: 'يرجى إضافة رصيد لاستخدام الذكاء الاصطناعي'
          });
        }
        
        throw new Error(errorMessage);
      }

      return data.result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'حدث خطأ غير متوقع';
      setError(message);
      console.error('[useSmartElementAI] Error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateElements = useCallback(async (
    prompt: string,
    preferredType?: SmartElementType
  ): Promise<GenerationResult | null> => {
    const result = await callAI('generate', {
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

    return await callAI('analyze', {
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

    const result = await callAI('transform', {
      selectedElements: elements,
      prompt,
      context: { targetType }
    });

    if (result) {
      toast.success('تم تحويل العناصر بنجاح', {
        description: result.summary
      });
    }

    return result;
  }, [callAI]);

  return {
    isLoading,
    error,
    generateElements,
    analyzeSelection,
    transformElements
  };
}
