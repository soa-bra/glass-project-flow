import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Command,
  Sparkles,
  X,
  Loader2,
  LayoutGrid,
  GitBranch,
  Vote,
  Lightbulb,
  Clock,
  BarChart3,
  Table2,
  Network,
  FolderKanban,
  Wallet,
  Heart,
  Users,
  Link2,
  ArrowRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSmartElementAI } from '@/hooks/useSmartElementAI';
import { SmartElementType } from '@/types/smart-elements';
import { cn } from '@/lib/utils';

interface SmartCommandBarProps {
  isOpen: boolean;
  onClose: () => void;
  onElementsGenerated?: (elements: any[], layout: string) => void;
  position?: { x: number; y: number };
}

interface CommandExample {
  command: string;
  description: string;
  icon: React.ReactNode;
  type?: SmartElementType;
}

const COMMAND_EXAMPLES: CommandExample[] = [
  {
    command: '/ai kanban إدارة مشروع التسويق',
    description: 'إنشاء لوحة كانبان لإدارة المهام',
    icon: <LayoutGrid className="h-4 w-4" />,
    type: 'kanban'
  },
  {
    command: '/ai mindmap قيم الشركة: الابتكار، النزاهة، التعاون',
    description: 'إنشاء خريطة ذهنية للقيم',
    icon: <Network className="h-4 w-4" />,
    type: 'mind_map'
  },
  {
    command: '/ai timeline مراحل إطلاق المنتج',
    description: 'إنشاء خط زمني للمراحل',
    icon: <Clock className="h-4 w-4" />,
    type: 'timeline'
  },
  {
    command: '/ai gantt خطة التنفيذ الفصلية',
    description: 'إنشاء مخطط جانت للمشروع',
    icon: <BarChart3 className="h-4 w-4" />,
    type: 'gantt'
  },
  {
    command: '/ai voting أفضل اسم للمنتج الجديد',
    description: 'إنشاء استطلاع تصويت',
    icon: <Vote className="h-4 w-4" />,
    type: 'voting'
  },
  {
    command: '/ai brainstorm أفكار لحملة رمضان',
    description: 'بدء جلسة عصف ذهني',
    icon: <Lightbulb className="h-4 w-4" />,
    type: 'brainstorming'
  },
  {
    command: '/ai matrix مقارنة خيارات التوظيف',
    description: 'إنشاء مصفوفة قرارات',
    icon: <Table2 className="h-4 w-4" />,
    type: 'decisions_matrix'
  },
  {
    command: '/ai thinking تجميع أفكار المشروع',
    description: 'إنشاء لوحة تفكير',
    icon: <GitBranch className="h-4 w-4" />,
    type: 'thinking_board'
  }
];

const ELEMENT_TYPE_KEYWORDS: Record<string, SmartElementType> = {
  'kanban': 'kanban',
  'كانبان': 'kanban',
  'mindmap': 'mind_map',
  'mind_map': 'mind_map',
  'ذهنية': 'mind_map',
  'خريطة': 'mind_map',
  'timeline': 'timeline',
  'زمني': 'timeline',
  'خط': 'timeline',
  'gantt': 'gantt',
  'جانت': 'gantt',
  'voting': 'voting',
  'تصويت': 'voting',
  'استطلاع': 'voting',
  'brainstorm': 'brainstorming',
  'عصف': 'brainstorming',
  'أفكار': 'brainstorming',
  'matrix': 'decisions_matrix',
  'مصفوفة': 'decisions_matrix',
  'قرارات': 'decisions_matrix',
  'thinking': 'thinking_board',
  'تفكير': 'thinking_board',
  'sheet': 'interactive_sheet',
  'جدول': 'interactive_sheet',
  'project': 'project_card',
  'مشروع': 'project_card',
  'finance': 'finance_card',
  'مالي': 'finance_card',
  'csr': 'csr_card',
  'اجتماعية': 'csr_card',
  'crm': 'crm_card',
  'عملاء': 'crm_card'
};

export function SmartCommandBar({ 
  isOpen, 
  onClose, 
  onElementsGenerated,
  position 
}: SmartCommandBarProps) {
  const [input, setInput] = useState('');
  const [showExamples, setShowExamples] = useState(true);
  const [selectedExample, setSelectedExample] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isLoading, error, generateElements } = useSmartElementAI();

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
      setInput('');
      setShowExamples(true);
      setSelectedExample(-1);
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }

    if (e.key === 'ArrowDown' && showExamples) {
      e.preventDefault();
      setSelectedExample(prev => 
        prev < COMMAND_EXAMPLES.length - 1 ? prev + 1 : 0
      );
    }

    if (e.key === 'ArrowUp' && showExamples) {
      e.preventDefault();
      setSelectedExample(prev => 
        prev > 0 ? prev - 1 : COMMAND_EXAMPLES.length - 1
      );
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedExample >= 0 && showExamples) {
        handleExampleClick(COMMAND_EXAMPLES[selectedExample]);
      } else if (input.trim()) {
        handleSubmit();
      }
    }
  }, [showExamples, selectedExample, input, onClose]);

  // Parse input to detect preferred element type
  const detectPreferredType = (text: string): SmartElementType | undefined => {
    const lowerText = text.toLowerCase();
    for (const [keyword, type] of Object.entries(ELEMENT_TYPE_KEYWORDS)) {
      if (lowerText.includes(keyword)) {
        return type;
      }
    }
    return undefined;
  };

  // Handle command submission
  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    // Remove /ai prefix if present
    let prompt = input.trim();
    if (prompt.startsWith('/ai ')) {
      prompt = prompt.slice(4);
    }

    const preferredType = detectPreferredType(prompt);
    setShowExamples(false);

    const result = await generateElements(prompt, preferredType);
    
    if (result && result.elements?.length > 0) {
      onElementsGenerated?.(result.elements, result.layout);
      onClose();
    }
  };

  // Handle example click
  const handleExampleClick = (example: CommandExample) => {
    setInput(example.command);
    setShowExamples(false);
    // Auto-submit after a brief delay
    setTimeout(() => {
      const prompt = example.command.replace('/ai ', '');
      generateElements(prompt, example.type).then(result => {
        if (result && result.elements?.length > 0) {
          onElementsGenerated?.(result.elements, result.layout);
          onClose();
        }
      });
    }, 100);
  };

  // Filter examples based on input
  const filteredExamples = input.trim() 
    ? COMMAND_EXAMPLES.filter(ex => 
        ex.command.includes(input) || 
        ex.description.includes(input)
      )
    : COMMAND_EXAMPLES;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

        {/* Command Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl mx-4"
          onClick={e => e.stopPropagation()}
        >
          <div className="bg-card rounded-xl border shadow-2xl overflow-hidden">
            {/* Input Section */}
            <div className="flex items-center gap-3 p-4 border-b">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-[hsl(var(--accent-green))] to-[hsl(var(--accent-blue))]">
                {isLoading ? (
                  <Loader2 className="h-5 w-5 text-white animate-spin" />
                ) : (
                  <Sparkles className="h-5 w-5 text-white" />
                )}
              </div>
              
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    setShowExamples(true);
                    setSelectedExample(-1);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="اكتب أمرك هنا... مثال: /ai kanban إدارة المشروع"
                  className="h-12 text-lg border-0 bg-transparent focus-visible:ring-0 pr-4"
                  dir="auto"
                  disabled={isLoading}
                />
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="shrink-0"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="p-6 text-center">
                <div className="flex items-center justify-center gap-3 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>جاري إنشاء العناصر الذكية...</span>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <div className="p-4 bg-destructive/10 text-destructive text-center">
                {error}
              </div>
            )}

            {/* Examples Section */}
            {showExamples && !isLoading && filteredExamples.length > 0 && (
              <ScrollArea className="max-h-[400px]">
                <div className="p-2">
                  <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
                    أوامر سريعة
                  </div>
                  
                  {filteredExamples.map((example, index) => (
                    <button
                      key={example.command}
                      onClick={() => handleExampleClick(example)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-lg text-right transition-colors",
                        selectedExample === index 
                          ? "bg-accent" 
                          : "hover:bg-muted/50"
                      )}
                    >
                      <div className={cn(
                        "flex items-center justify-center w-9 h-9 rounded-lg shrink-0",
                        selectedExample === index 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted"
                      )}>
                        {example.icon}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-sm text-foreground truncate" dir="ltr">
                          {example.command}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {example.description}
                        </div>
                      </div>

                      <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    </button>
                  ))}
                </div>
              </ScrollArea>
            )}

            {/* Keyboard Hints */}
            <div className="flex items-center justify-between px-4 py-2 bg-muted/30 text-xs text-muted-foreground border-t">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono">↑↓</kbd>
                  للتنقل
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono">Enter</kbd>
                  للتنفيذ
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono">Esc</kbd>
                  للإغلاق
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                <Command className="h-3 w-3" />
                <span>Ctrl+K</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Hook for global keyboard shortcut
export function useSmartCommandBar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K to open
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen(prev => !prev)
  };
}
