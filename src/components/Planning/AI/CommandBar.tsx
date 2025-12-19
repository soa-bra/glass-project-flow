/**
 * Command Bar - شريط الأوامر الذكي
 * Sprint 8: Smart Layer
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Command,
  Sparkles,
  Workflow,
  FileText,
  CheckSquare,
  Loader2,
  ArrowLeft,
  Zap,
  Brain,
  Wand2
} from 'lucide-react';
import { generateWorkflowFromPrompt } from '@/core/ai';
import type { GeneratedWorkflow } from '@/core/ai/smartWorkflow';

interface CommandBarProps {
  isOpen: boolean;
  onClose: () => void;
  onWorkflowGenerated?: (workflow: GeneratedWorkflow) => void;
  onTasksGenerated?: (tasks: any[]) => void;
}

type CommandMode = 'idle' | 'workflow' | 'tasks' | 'document';

const CommandBar: React.FC<CommandBarProps> = ({
  isOpen,
  onClose,
  onWorkflowGenerated,
  onTasksGenerated
}) => {
  const [mode, setMode] = useState<CommandMode>('idle');
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = useCallback(async () => {
    if (!prompt.trim() || isProcessing) return;

    setIsProcessing(true);

    try {
      if (mode === 'workflow' || mode === 'idle') {
        const workflow = generateWorkflowFromPrompt({
          description: prompt,
          context: 'user_command'
        });
        onWorkflowGenerated?.(workflow);
      }
      
      setPrompt('');
      onClose();
    } catch (error) {
      console.error('Error processing command:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [prompt, mode, isProcessing, onWorkflowGenerated, onClose]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const quickActions = [
    {
      id: 'workflow',
      icon: Workflow,
      label: 'إنشاء Workflow',
      description: 'توليد سير عمل من وصف',
      color: 'text-[hsl(var(--accent-blue))]'
    },
    {
      id: 'tasks',
      icon: CheckSquare,
      label: 'استخراج مهام',
      description: 'استخراج مهام من نص',
      color: 'text-[hsl(var(--accent-green))]'
    },
    {
      id: 'document',
      icon: FileText,
      label: 'تحليل مستند',
      description: 'تحليل محتوى مستند',
      color: 'text-[hsl(var(--accent-yellow))]'
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Command Bar */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[600px] max-w-[90vw] z-50"
          >
            <div className="bg-white rounded-[18px] shadow-[0_12px_28px_rgba(0,0,0,0.10)] border border-[hsl(var(--border))] overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-3 p-4 border-b border-[hsl(var(--border))]">
                {mode !== 'idle' && (
                  <button
                    onClick={() => setMode('idle')}
                    className="p-1.5 hover:bg-[hsl(var(--panel))] rounded-lg transition-colors"
                  >
                    <ArrowLeft size={18} className="text-[hsl(var(--ink-60))]" />
                  </button>
                )}
                
                <div className="flex-1 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-[#3DBE8B] to-[#3DA8F5] rounded-lg">
                    <Brain size={18} className="text-white" />
                  </div>
                  
                  <input
                    ref={inputRef}
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      mode === 'workflow' 
                        ? 'صف سير العمل المطلوب...'
                        : mode === 'tasks'
                        ? 'الصق النص لاستخراج المهام...'
                        : 'اكتب أمرك هنا... (⌘K)'
                    }
                    className="flex-1 text-[14px] text-[hsl(var(--ink))] placeholder:text-[hsl(var(--ink-30))] bg-transparent outline-none"
                    dir="rtl"
                  />
                </div>

                {isProcessing ? (
                  <Loader2 size={20} className="text-[hsl(var(--accent-blue))] animate-spin" />
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!prompt.trim()}
                    className="p-2 bg-[hsl(var(--ink))] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                  >
                    <Wand2 size={18} />
                  </button>
                )}
              </div>

              {/* Quick Actions */}
              {mode === 'idle' && !prompt && (
                <div className="p-3 space-y-1">
                  <p className="text-[11px] text-[hsl(var(--ink-30))] px-2 mb-2">إجراءات سريعة</p>
                  
                  {quickActions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => setMode(action.id as CommandMode)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[hsl(var(--panel))] transition-colors text-right"
                    >
                      <div className={`p-2 rounded-lg bg-[hsl(var(--panel))] ${action.color}`}>
                        <action.icon size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="text-[13px] font-medium text-[hsl(var(--ink))]">{action.label}</p>
                        <p className="text-[11px] text-[hsl(var(--ink-60))]">{action.description}</p>
                      </div>
                      <Zap size={14} className="text-[hsl(var(--ink-30))]" />
                    </button>
                  ))}
                </div>
              )}

              {/* Hints */}
              <div className="px-4 py-2 bg-[hsl(var(--panel))] border-t border-[hsl(var(--border))]">
                <div className="flex items-center justify-between text-[11px] text-[hsl(var(--ink-60))]">
                  <span>اضغط Enter للتنفيذ</span>
                  <span>ESC للإغلاق</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommandBar;
