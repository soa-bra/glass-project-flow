import { useState, useCallback, useRef } from 'react';
import { aiAnalysisService, AnalysisResult, StreamingCallback } from '../services/aiAnalysis';
import { toast } from 'sonner';

/**
 * Hook for AI analysis with streaming capabilities
 * هوك للتحليل الذكي مع البث المباشر
 */

interface UseAIAnalysisReturn {
  analyses: Map<string, AnalysisResult>;
  isAnalyzing: boolean;
  analyzeImage: (file: File, options?: any) => Promise<AnalysisResult>;
  analyzeText: (text: string, options?: any) => Promise<AnalysisResult>;
  analyzeDocument: (file: File) => Promise<AnalysisResult>;
  cancelAnalysis: (id: string) => void;
  clearAnalyses: () => void;
  getAnalysisResult: (id: string) => AnalysisResult | undefined;
}

export function useAIAnalysis(): UseAIAnalysisReturn {
  const [analyses, setAnalyses] = useState<Map<string, AnalysisResult>>(new Map());
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const activeStreams = useRef<Map<string, boolean>>(new Map());

  // تحديث نتيجة التحليل
  const updateAnalysis = useCallback((analysis: AnalysisResult) => {
    setAnalyses(prev => {
      const newAnalyses = new Map(prev);
      newAnalyses.set(analysis.id, analysis);
      return newAnalyses;
    });
  }, []);

  // إنشاء callbacks للـ streaming
  const createStreamingCallbacks = useCallback((analysisId: string): StreamingCallback => {
    return {
      onProgress: (progress: number, message: string) => {
        if (!activeStreams.current.get(analysisId)) return;
        
        setAnalyses(prev => {
          const newAnalyses = new Map(prev);
          const analysis = newAnalyses.get(analysisId);
          if (analysis) {
            newAnalyses.set(analysisId, {
              ...analysis,
              progress,
              status: 'processing'
            });
          }
          return newAnalyses;
        });

        // عرض التقدم كـ toast
        toast.loading(`${message} - ${progress.toFixed(0)}%`, {
          id: `analysis-${analysisId}`
        });
      },

      onResult: (result: any) => {
        if (!activeStreams.current.get(analysisId)) return;
        
        // يمكن معالجة النتائج الجزئية هنا
        // Partial results processing
      },

      onError: (error: string) => {
        activeStreams.current.delete(analysisId);
        setIsAnalyzing(false);
        
        setAnalyses(prev => {
          const newAnalyses = new Map(prev);
          const analysis = newAnalyses.get(analysisId);
          if (analysis) {
            newAnalyses.set(analysisId, {
              ...analysis,
              status: 'error',
              error
            });
          }
          return newAnalyses;
        });

        toast.error(`خطأ في التحليل: ${error}`, {
          id: `analysis-${analysisId}`
        });
      },

      onComplete: () => {
        activeStreams.current.delete(analysisId);
        setIsAnalyzing(false);
        
        toast.success('تم التحليل بنجاح', {
          id: `analysis-${analysisId}`
        });
      }
    };
  }, []);

  // تحليل الصور
  const analyzeImage = useCallback(async (
    file: File, 
    options = {}
  ): Promise<AnalysisResult> => {
    const analysisId = crypto.randomUUID();
    activeStreams.current.set(analysisId, true);
    setIsAnalyzing(true);

    // إنشاء نتيجة أولية
    const initialResult: AnalysisResult = {
      id: analysisId,
      type: 'image',
      status: 'processing',
      progress: 0,
      timestamp: Date.now()
    };

    updateAnalysis(initialResult);

    try {
      const callbacks = createStreamingCallbacks(analysisId);
      const result = await aiAnalysisService.analyzeImage(file, options, callbacks);
      
      updateAnalysis(result);
      return result;
    } catch (error) {
      const errorResult: AnalysisResult = {
        ...initialResult,
        status: 'error',
        error: error instanceof Error ? error.message : 'خطأ غير معروف'
      };
      
      updateAnalysis(errorResult);
      activeStreams.current.delete(analysisId);
      setIsAnalyzing(false);
      
      throw error;
    }
  }, [updateAnalysis, createStreamingCallbacks]);

  // تحليل النصوص
  const analyzeText = useCallback(async (
    text: string,
    options = {}
  ): Promise<AnalysisResult> => {
    const analysisId = crypto.randomUUID();
    activeStreams.current.set(analysisId, true);
    setIsAnalyzing(true);

    const initialResult: AnalysisResult = {
      id: analysisId,
      type: 'text',
      status: 'processing',
      progress: 0,
      timestamp: Date.now()
    };

    updateAnalysis(initialResult);

    try {
      const callbacks = createStreamingCallbacks(analysisId);
      const result = await aiAnalysisService.analyzeText(text, options, callbacks);
      
      updateAnalysis(result);
      return result;
    } catch (error) {
      const errorResult: AnalysisResult = {
        ...initialResult,
        status: 'error',
        error: error instanceof Error ? error.message : 'خطأ غير معروف'
      };
      
      updateAnalysis(errorResult);
      activeStreams.current.delete(analysisId);
      setIsAnalyzing(false);
      
      throw error;
    }
  }, [updateAnalysis, createStreamingCallbacks]);

  // تحليل المستندات
  const analyzeDocument = useCallback(async (file: File): Promise<AnalysisResult> => {
    const analysisId = crypto.randomUUID();
    activeStreams.current.set(analysisId, true);
    setIsAnalyzing(true);

    const initialResult: AnalysisResult = {
      id: analysisId,
      type: 'document',
      status: 'processing',
      progress: 0,
      timestamp: Date.now()
    };

    updateAnalysis(initialResult);

    try {
      const callbacks = createStreamingCallbacks(analysisId);
      const result = await aiAnalysisService.analyzeDocument(file, callbacks);
      
      updateAnalysis(result);
      return result;
    } catch (error) {
      const errorResult: AnalysisResult = {
        ...initialResult,
        status: 'error',
        error: error instanceof Error ? error.message : 'خطأ غير معروف'
      };
      
      updateAnalysis(errorResult);
      activeStreams.current.delete(analysisId);
      setIsAnalyzing(false);
      
      throw error;
    }
  }, [updateAnalysis, createStreamingCallbacks]);

  // إلغاء التحليل
  const cancelAnalysis = useCallback((id: string) => {
    activeStreams.current.delete(id);
    aiAnalysisService.cancelAnalysis(id);
    
    setAnalyses(prev => {
      const newAnalyses = new Map(prev);
      const analysis = newAnalyses.get(id);
      if (analysis && analysis.status === 'processing') {
        newAnalyses.set(id, {
          ...analysis,
          status: 'error',
          error: 'تم إلغاء التحليل'
        });
      }
      return newAnalyses;
    });

    toast.error('تم إلغاء التحليل', {
      id: `analysis-${id}`
    });

    // إذا لم يعد هناك تحليلات نشطة
    if (activeStreams.current.size === 0) {
      setIsAnalyzing(false);
    }
  }, []);

  // مسح جميع التحليلات
  const clearAnalyses = useCallback(() => {
    // إلغاء جميع التحليلات النشطة
    activeStreams.current.forEach((_, id) => {
      aiAnalysisService.cancelAnalysis(id);
    });
    
    activeStreams.current.clear();
    setAnalyses(new Map());
    setIsAnalyzing(false);
  }, []);

  // الحصول على نتيجة تحليل معين
  const getAnalysisResult = useCallback((id: string): AnalysisResult | undefined => {
    return analyses.get(id);
  }, [analyses]);

  return {
    analyses,
    isAnalyzing,
    analyzeImage,
    analyzeText,
    analyzeDocument,
    cancelAnalysis,
    clearAnalyses,
    getAnalysisResult
  };
}