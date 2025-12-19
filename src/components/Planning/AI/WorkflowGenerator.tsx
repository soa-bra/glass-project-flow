/**
 * Workflow Generator - مولد Workflow من Prompt
 * Sprint 8: Smart Layer
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Workflow,
  Sparkles,
  Play,
  Loader2,
  Check,
  X,
  RefreshCw,
  Eye,
  Download,
  ChevronRight
} from 'lucide-react';
import { generateWorkflowFromPrompt } from '@/core/ai/smartWorkflow';
import type { GeneratedWorkflow } from '@/core/ai/smartWorkflow';

interface WorkflowGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (workflow: GeneratedWorkflow) => void;
}

const WorkflowGenerator: React.FC<WorkflowGeneratorProps> = ({
  isOpen,
  onClose,
  onGenerate
}) => {
  const [prompt, setPrompt] = useState('');
  const [context, setContext] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorkflow, setGeneratedWorkflow] = useState<GeneratedWorkflow | null>(null);
  const [step, setStep] = useState<'input' | 'preview' | 'done'>('input');

  const examplePrompts = [
    'عملية موافقة على الفواتير: استلام الفاتورة، مراجعة المبلغ، موافقة المدير، الدفع',
    'سير عمل المشتريات: طلب شراء، اعتماد الميزانية، إرسال للمورد، استلام البضاعة',
    'توظيف موظف جديد: فرز السير الذاتية، مقابلة أولية، مقابلة تقنية، عرض العمل'
  ];

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    
    try {
      // Simulate some processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const workflow = generateWorkflowFromPrompt({
        description: prompt,
        context: context || undefined
      });
      
      setGeneratedWorkflow(workflow);
      setStep('preview');
    } catch (error) {
      console.error('Error generating workflow:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, context]);

  const handleApply = useCallback(() => {
    if (generatedWorkflow) {
      onGenerate(generatedWorkflow);
      setStep('done');
      setTimeout(() => {
        onClose();
        // Reset state
        setPrompt('');
        setContext('');
        setGeneratedWorkflow(null);
        setStep('input');
      }, 1500);
    }
  }, [generatedWorkflow, onGenerate, onClose]);

  const handleRegenerate = useCallback(() => {
    setGeneratedWorkflow(null);
    setStep('input');
  }, []);

  const getNodeTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      start: 'بداية',
      end: 'نهاية',
      task_stage: 'مرحلة',
      decision: 'قرار',
      approval: 'موافقة',
      notification: 'إشعار',
      timer: 'مؤقت',
      parallel: 'تفرع'
    };
    return labels[type] || type;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] max-w-[95vw] max-h-[85vh] z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-[24px] shadow-[0_12px_28px_rgba(0,0,0,0.10)] border border-[hsl(var(--border))] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-[hsl(var(--border))]">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-br from-[#3DBE8B] to-[#3DA8F5] rounded-xl">
                    <Workflow size={22} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-[16px] font-bold text-[hsl(var(--ink))]">
                      مولد Workflow الذكي
                    </h2>
                    <p className="text-[12px] text-[hsl(var(--ink-60))]">
                      صف سير العمل وسنقوم بإنشائه تلقائياً
                    </p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 hover:bg-[hsl(var(--panel))] rounded-lg transition-colors"
                >
                  <X size={20} className="text-[hsl(var(--ink-60))]" />
                </button>
              </div>

              {/* Content */}
              <div className="p-5 max-h-[60vh] overflow-y-auto">
                {step === 'input' && (
                  <div className="space-y-4">
                    {/* Prompt Input */}
                    <div>
                      <label className="block text-[13px] font-medium text-[hsl(var(--ink))] mb-2">
                        وصف سير العمل
                      </label>
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="اكتب وصفاً لسير العمل المطلوب، مثل: عملية موافقة على الفواتير..."
                        className="w-full h-32 p-4 text-[14px] text-[hsl(var(--ink))] placeholder:text-[hsl(var(--ink-30))] bg-[hsl(var(--panel))] border border-[hsl(var(--border))] rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-blue))]/20 focus:border-[hsl(var(--accent-blue))]"
                        dir="rtl"
                      />
                    </div>

                    {/* Context Input */}
                    <div>
                      <label className="block text-[13px] font-medium text-[hsl(var(--ink))] mb-2">
                        سياق إضافي (اختياري)
                      </label>
                      <input
                        type="text"
                        value={context}
                        onChange={(e) => setContext(e.target.value)}
                        placeholder="مثل: قسم المالية، فريق المشتريات..."
                        className="w-full p-3 text-[14px] text-[hsl(var(--ink))] placeholder:text-[hsl(var(--ink-30))] bg-[hsl(var(--panel))] border border-[hsl(var(--border))] rounded-xl focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-blue))]/20 focus:border-[hsl(var(--accent-blue))]"
                        dir="rtl"
                      />
                    </div>

                    {/* Example Prompts */}
                    <div>
                      <p className="text-[12px] font-medium text-[hsl(var(--ink-60))] mb-2">
                        أمثلة للبدء السريع:
                      </p>
                      <div className="space-y-2">
                        {examplePrompts.map((example, index) => (
                          <button
                            key={index}
                            onClick={() => setPrompt(example)}
                            className="w-full p-3 text-right text-[12px] text-[hsl(var(--ink-80))] bg-[hsl(var(--panel))] hover:bg-[hsl(var(--panel))]/80 border border-[hsl(var(--border))] rounded-lg transition-colors"
                          >
                            <span className="flex items-center gap-2">
                              <ChevronRight size={14} className="text-[hsl(var(--ink-30))] rotate-180" />
                              {example}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 'preview' && generatedWorkflow && (
                  <div className="space-y-4">
                    {/* Preview Header */}
                    <div className="flex items-center justify-between p-3 bg-[hsl(var(--accent-green))]/10 border border-[hsl(var(--accent-green))]/20 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Check size={18} className="text-[hsl(var(--accent-green))]" />
                        <span className="text-[13px] font-medium text-[hsl(var(--accent-green))]">
                          تم توليد Workflow بنجاح!
                        </span>
                      </div>
                      <button
                        onClick={handleRegenerate}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-[hsl(var(--ink-60))] hover:text-[hsl(var(--ink))] hover:bg-white rounded-lg transition-colors"
                      >
                        <RefreshCw size={14} />
                        إعادة التوليد
                      </button>
                    </div>

                    {/* Workflow Preview */}
                    <div className="p-4 bg-[hsl(var(--panel))] border border-[hsl(var(--border))] rounded-xl">
                      <h4 className="text-[13px] font-semibold text-[hsl(var(--ink))] mb-3">
                        العقد ({generatedWorkflow.nodes.length})
                      </h4>
                      <div className="space-y-2">
                        {generatedWorkflow.nodes.map((node, index) => (
                          <div
                            key={node.id}
                            className="flex items-center gap-3 p-2 bg-white rounded-lg"
                          >
                            <span className="w-6 h-6 flex items-center justify-center bg-[hsl(var(--ink))] text-white text-[11px] font-bold rounded-full">
                              {index + 1}
                            </span>
                            <span className="px-2 py-0.5 bg-[hsl(var(--panel))] text-[11px] text-[hsl(var(--ink-60))] rounded">
                              {getNodeTypeLabel(node.type)}
                            </span>
                            <span className="text-[13px] text-[hsl(var(--ink))]">
                              {node.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 'done' && (
                  <div className="py-12 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', duration: 0.5 }}
                      className="w-16 h-16 mx-auto mb-4 bg-[hsl(var(--accent-green))] rounded-full flex items-center justify-center"
                    >
                      <Check size={32} className="text-white" />
                    </motion.div>
                    <p className="text-[16px] font-semibold text-[hsl(var(--ink))]">
                      تم إضافة Workflow للوحة!
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              {step !== 'done' && (
                <div className="flex items-center justify-between p-4 border-t border-[hsl(var(--border))] bg-[hsl(var(--panel))]">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-[13px] font-medium text-[hsl(var(--ink-60))] hover:text-[hsl(var(--ink))] transition-colors"
                  >
                    إلغاء
                  </button>

                  {step === 'input' ? (
                    <button
                      onClick={handleGenerate}
                      disabled={!prompt.trim() || isGenerating}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-[#3DBE8B] to-[#3DA8F5] text-white rounded-xl font-medium text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          جاري التوليد...
                        </>
                      ) : (
                        <>
                          <Sparkles size={16} />
                          توليد Workflow
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={handleApply}
                      className="flex items-center gap-2 px-5 py-2.5 bg-[hsl(var(--ink))] text-white rounded-xl font-medium text-[13px] hover:opacity-90 transition-opacity"
                    >
                      <Download size={16} />
                      إضافة للوحة
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WorkflowGenerator;
