import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  LayoutGrid,
  Network,
  Calendar,
  Table2,
  Zap,
  Loader2,
  X,
  ChevronDown
} from 'lucide-react';
import { useCanvasStore } from '@/stores/canvasStore';
import { useSmartElementsStore } from '@/stores/smartElementsStore';
import { useSmartElementAI } from '@/hooks/useSmartElementAI';
import type { SmartElementType } from '@/types/smart-elements';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface TransformOption {
  type: SmartElementType;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const TRANSFORM_OPTIONS: TransformOption[] = [
  {
    type: 'kanban',
    label: 'لوحة كانبان',
    icon: <LayoutGrid size={16} />,
    description: 'تحويل إلى أعمدة ومهام'
  },
  {
    type: 'mind_map',
    label: 'خريطة ذهنية',
    icon: <Network size={16} />,
    description: 'تنظيم كخريطة مترابطة'
  },
  {
    type: 'timeline',
    label: 'خط زمني',
    icon: <Calendar size={16} />,
    description: 'ترتيب على محور زمني'
  },
  {
    type: 'decisions_matrix',
    label: 'مصفوفة قرارات',
    icon: <Table2 size={16} />,
    description: 'تقييم ومقارنة الخيارات'
  },
  {
    type: 'brainstorming',
    label: 'عصف ذهني',
    icon: <Zap size={16} />,
    description: 'تجميع كأفكار للنقاش'
  },
];

const ContextSmartMenu: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isTransforming, setIsTransforming] = useState(false);

  const { elements, selectedElementIds, viewport } = useCanvasStore();
  const { addSmartElement } = useSmartElementsStore();
  const { analyzeSelection, transformElements, isLoading } = useSmartElementAI();

  // Get selected elements
  const selectedElements = useMemo(() => {
    return elements.filter(el => selectedElementIds.includes(el.id));
  }, [elements, selectedElementIds]);

  // Calculate menu position based on selection bounds
  useEffect(() => {
    if (selectedElements.length < 2) {
      setIsVisible(false);
      return;
    }

    // Calculate bounding box of selected elements
    let minX = Infinity, minY = Infinity;
    let maxX = -Infinity, maxY = -Infinity;

    selectedElements.forEach(el => {
      const x = el.position?.x || 0;
      const y = el.position?.y || 0;
      const width = el.size?.width || 100;
      const height = el.size?.height || 100;

      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x + width);
      maxY = Math.max(maxY, y + height);
    });

    // Convert to screen coordinates
    const screenX = (minX + maxX) / 2 * viewport.zoom + viewport.pan.x;
    const screenY = minY * viewport.zoom + viewport.pan.y - 60;

    setPosition({ x: screenX, y: Math.max(60, screenY) });
    setIsVisible(true);
    setIsExpanded(false);
  }, [selectedElements, viewport]);

  // Extract content from selected elements for AI
  const getSelectionContent = () => {
    return selectedElements.map(el => ({
      type: el.type,
      content: el.content || '',
      smartType: el.smartType,
      position: el.position,
    }));
  };

  // Handle AI analysis
  const handleAnalyze = async () => {
    const content = getSelectionContent();
    const result = await analyzeSelection(content, 'حلل هذه العناصر واقترح أفضل طريقة لتنظيمها');
    
    if (result?.suggestions && result.suggestions.length > 0) {
      toast.success(`تم تحليل ${selectedElements.length} عنصر`, {
        description: result.suggestions[0].reasoning
      });
    }
  };

  // Handle transform to smart element
  const handleTransform = async (targetType: SmartElementType) => {
    setIsTransforming(true);
    
    try {
      const content = getSelectionContent();
      const contentText = selectedElements
        .map(el => el.content || '')
        .filter(Boolean)
        .join('\n');

      const result = await transformElements(
        content,
        targetType,
        `حوّل هذه العناصر إلى ${targetType}: ${contentText}`
      );

      if (result?.elements && result.elements.length > 0) {
        // Calculate center position
        const centerX = selectedElements.reduce((sum, el) => sum + (el.position?.x || 0), 0) / selectedElements.length;
        const centerY = selectedElements.reduce((sum, el) => sum + (el.position?.y || 0), 0) / selectedElements.length;

        // Add transformed elements
        result.elements.forEach((element, index) => {
          addSmartElement(
            element.type as SmartElementType,
            { x: centerX + index * 30, y: centerY + index * 30 },
            element.data
          );
        });

        toast.success(`تم تحويل ${selectedElements.length} عنصر إلى ${TRANSFORM_OPTIONS.find(o => o.type === targetType)?.label}`);
        setIsVisible(false);
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء التحويل');
    } finally {
      setIsTransforming(false);
    }
  };

  // Quick generate without specifying type
  const handleQuickGenerate = async () => {
    const content = getSelectionContent();
    const contentText = selectedElements
      .map(el => el.content || '')
      .filter(Boolean)
      .join('\n');

    const result = await analyzeSelection(
      content,
      `حلل هذه العناصر وأنشئ عنصر ذكي مناسب: ${contentText}`
    );

    // Use first suggestion's targetType
    if (result?.suggestions && result.suggestions.length > 0) {
      const suggestion = result.suggestions[0];
      if (suggestion.targetType) {
        await handleTransform(suggestion.targetType);
      }
    }
  };

  if (!isVisible || selectedElements.length < 2) {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="fixed z-[9999] pointer-events-auto"
        style={{
          left: position.x,
          top: position.y,
          transform: 'translateX(-50%)',
        }}
      >
        <div className="bg-background/95 backdrop-blur-lg border border-border rounded-2xl shadow-xl overflow-hidden">
          {/* Main Action Bar */}
          <div className="flex items-center gap-1 p-1.5">
            {/* Quick Generate Button */}
            <Button
              onClick={handleQuickGenerate}
              disabled={isLoading || isTransforming}
              className="h-8 px-3 gap-2 bg-gradient-to-r from-[hsl(var(--accent-green))] to-[hsl(var(--accent-blue))] hover:opacity-90 text-white text-[11px] font-medium"
            >
              {isLoading || isTransforming ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Sparkles size={14} />
              )}
              <span>إنشاء عنصر ذكي</span>
            </Button>

            {/* Expand Options */}
            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <ChevronDown 
                size={16} 
                className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              />
            </Button>

            {/* Close */}
            <Button
              onClick={() => setIsVisible(false)}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            >
              <X size={14} />
            </Button>
          </div>

          {/* Selection Info */}
          <div className="px-3 pb-2 text-[10px] text-muted-foreground text-center">
            {selectedElements.length} عنصر محدد
          </div>

          {/* Expanded Options */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-border overflow-hidden"
              >
                <div className="p-2 space-y-1">
                  <div className="text-[10px] text-muted-foreground px-2 py-1">
                    تحويل إلى:
                  </div>
                  {TRANSFORM_OPTIONS.map((option) => (
                    <button
                      key={option.type}
                      onClick={() => handleTransform(option.type)}
                      disabled={isLoading || isTransforming}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/80 transition-colors text-right disabled:opacity-50"
                    >
                      <span className="text-[hsl(var(--accent-green))]">
                        {option.icon}
                      </span>
                      <div className="flex-1">
                        <div className="text-[12px] font-medium text-foreground">
                          {option.label}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {option.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default ContextSmartMenu;
