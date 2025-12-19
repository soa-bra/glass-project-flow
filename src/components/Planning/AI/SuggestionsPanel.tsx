/**
 * Suggestions Panel - لوحة الاقتراحات الذكية
 * Sprint 8: Smart Layer
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lightbulb,
  Plus,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Workflow,
  X,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { useCanvasStore } from '@/stores/canvasStore';
import { generateSuggestions } from '@/core/ai/suggestions';
import type { WorkflowSuggestion } from '@/core/ai/suggestions';

interface SuggestionsPanelProps {
  workflowNodes?: any[];
  workflowEdges?: any[];
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const SuggestionsPanel: React.FC<SuggestionsPanelProps> = ({
  workflowNodes = [],
  workflowEdges = [],
  isCollapsed = false,
  onToggleCollapse
}) => {
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set());
  const [dismissedSuggestions, setDismissedSuggestions] = useState<Set<string>>(new Set());

  const suggestions = useMemo(() => {
    if (workflowNodes.length === 0) return [];
    return generateSuggestions(workflowNodes, workflowEdges);
  }, [workflowNodes, workflowEdges]);

  const visibleSuggestions = suggestions.filter(
    s => !dismissedSuggestions.has(s.id) && !appliedSuggestions.has(s.id)
  );

  const handleApplySuggestion = (suggestion: WorkflowSuggestion) => {
    setAppliedSuggestions(prev => new Set([...prev, suggestion.id]));
    // TODO: تطبيق الاقتراح على الـ workflow
  };

  const handleDismissSuggestion = (suggestionId: string) => {
    setDismissedSuggestions(prev => new Set([...prev, suggestionId]));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-[hsl(var(--accent-red))]';
      case 'medium': return 'text-[hsl(var(--accent-yellow))]';
      default: return 'text-[hsl(var(--accent-blue))]';
    }
  };

  const getPriorityBg = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50';
      case 'medium': return 'bg-amber-50';
      default: return 'bg-blue-50';
    }
  };

  if (workflowNodes.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute left-4 top-20 w-[280px] z-30"
    >
      <div className="bg-white rounded-[18px] shadow-[0_8px_24px_rgba(0,0,0,0.06)] border border-[hsl(var(--border))] overflow-hidden">
        {/* Header */}
        <div 
          className="flex items-center justify-between p-3 border-b border-[hsl(var(--border))] cursor-pointer hover:bg-[hsl(var(--panel))] transition-colors"
          onClick={onToggleCollapse}
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-[#3DBE8B] to-[#3DA8F5] rounded-lg">
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="text-[13px] font-semibold text-[hsl(var(--ink))]">
              اقتراحات ذكية
            </span>
            {visibleSuggestions.length > 0 && (
              <span className="px-1.5 py-0.5 bg-[hsl(var(--accent-blue))] text-white text-[10px] font-medium rounded-full">
                {visibleSuggestions.length}
              </span>
            )}
          </div>
          
          {isCollapsed ? (
            <ChevronDown size={16} className="text-[hsl(var(--ink-60))]" />
          ) : (
            <ChevronUp size={16} className="text-[hsl(var(--ink-60))]" />
          )}
        </div>

        {/* Content */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {visibleSuggestions.length === 0 ? (
                <div className="p-4 text-center">
                  <CheckCircle size={32} className="mx-auto text-[hsl(var(--accent-green))] mb-2" />
                  <p className="text-[12px] text-[hsl(var(--ink-60))]">
                    لا توجد اقتراحات حالياً
                  </p>
                </div>
              ) : (
                <div className="max-h-[300px] overflow-y-auto p-2 space-y-2">
                  {visibleSuggestions.map((suggestion) => (
                    <motion.div
                      key={suggestion.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className={`p-3 rounded-xl ${getPriorityBg(suggestion.priority)} border border-[hsl(var(--border))]`}
                    >
                      <div className="flex items-start gap-2">
                        <div className={`mt-0.5 ${getPriorityColor(suggestion.priority)}`}>
                          {suggestion.priority === 'high' ? (
                            <AlertCircle size={16} />
                          ) : (
                            <Lightbulb size={16} />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-medium text-[hsl(var(--ink))] mb-1">
                            {suggestion.title}
                          </p>
                          <p className="text-[11px] text-[hsl(var(--ink-60))] line-clamp-2">
                            {suggestion.description}
                          </p>
                        </div>

                        <button
                          onClick={() => handleDismissSuggestion(suggestion.id)}
                          className="p-1 hover:bg-white/50 rounded transition-colors"
                        >
                          <X size={12} className="text-[hsl(var(--ink-30))]" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[hsl(var(--border))]">
                        <button
                          onClick={() => handleApplySuggestion(suggestion)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-white rounded-lg text-[11px] font-medium text-[hsl(var(--ink))] hover:bg-[hsl(var(--panel))] transition-colors"
                        >
                          <Plus size={12} />
                          تطبيق
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SuggestionsPanel;
