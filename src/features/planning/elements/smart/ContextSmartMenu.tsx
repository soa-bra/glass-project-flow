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
  ChevronDown,
  FileText,
  FolderKanban,
  CheckSquare,
  Search
} from 'lucide-react';
import { useCanvasStore } from '@/stores/canvasStore';
import { useSmartElementAI } from '@/hooks/useSmartElementAI';
import type { SmartElementType } from '@/types/smart-elements';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { createSmartCanvasElement } from './factories/createTypedSmartElement';

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

interface SelectedMenuElement {
  position?: { x?: number; y?: number };
  size?: { width?: number; height?: number };
}

interface MenuViewport {
  zoom: number;
  pan: { x: number; y: number };
}

interface BoardFrameOffset {
  left: number;
  top: number;
}

export function calculateContextSmartMenuPosition(
  selectedElements: SelectedMenuElement[],
  viewport: MenuViewport,
  boardFrameOffset: BoardFrameOffset = { left: 0, top: 0 },
): { x: number; y: number } {
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

  const screenX = boardFrameOffset.left + ((minX + maxX) / 2) * viewport.zoom + viewport.pan.x;
  const screenY = boardFrameOffset.top + minY * viewport.zoom + viewport.pan.y - 60;

  return { x: screenX, y: Math.max(boardFrameOffset.top + 60, screenY) };
}

interface ContextSmartMenuProps {
  boardId?: string | null;
}

const ContextSmartMenu: React.FC<ContextSmartMenuProps> = ({ boardId }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isTransforming, setIsTransforming] = useState(false);

  const { elements, selectedElementIds, viewport, addElement } = useCanvasStore();
  const { analyzeSelection, transformElements, isLoading, approvalDialog, canUseAI, denialReason } = useSmartElementAI(boardId);

  // Get selected elements
  const selectedElements = useMemo(() => {
    return elements.filter(el => selectedElementIds.includes(el.id));
  }, [elements, selectedElementIds]);

  // Calculate menu position based on selection bounds
  useEffect(() => {
    if (selectedElements.length < 1) {
      setIsVisible(false);
      return;
    }

    const boardFrame = document.querySelector('[data-board-frame="true"]');
    const boardRect = boardFrame?.getBoundingClientRect();
    const boardFrameOffset = {
      left: boardRect?.left ?? 0,
      top: boardRect?.top ?? 0,
    };

    setPosition(calculateContextSmartMenuPosition(selectedElements, viewport, boardFrameOffset));
    setIsVisible(true);
    setIsExpanded(false);
  }, [selectedElements, viewport]);

  // Extract content from selected elements for AI
  const getSelectionContent = () => {
    return selectedElements.map(el => ({
      type: el.type,
      content: el.content || '',
      data: el.data,
      smartType: el.smartType ?? el.data?.smartType,
      position: el.position,
    }));
  };

  const ensureSelectionWithinLimit = () => {
    if (selectedElements.length <= 50) return true;
    toast.error('لا يمكن معالجة أكثر من 50 عنصر في طلب AI واحد');
    return false;
  };

  const ensureAIAllowed = () => {
    if (canUseAI) return true;
    toast.error('تعذر بدء إجراء الذكاء الاصطناعي', {
      description: denialReason || 'لا تملك صلاحية استخدام AI على هذه اللوحة',
    });
    return false;
  };

  const getSelectionText = () =>
    selectedElements
      .map((el) => {
        if (typeof el.content === 'string' && el.content.trim()) return el.content.trim();
        if (typeof el.data?.title === 'string') return el.data.title;
        if (typeof el.data?.label === 'string') return el.data.label;
        if (typeof el.data?.content === 'string') return el.data.content;
        return el.type;
      })
      .filter(Boolean)
      .join('\n');

  const getInsertionPosition = () => {
    const centerX = selectedElements.reduce((sum, el) => sum + (el.position?.x || 0), 0) / selectedElements.length;
    const centerY = selectedElements.reduce((sum, el) => sum + (el.position?.y || 0), 0) / selectedElements.length;
    return { x: centerX + 80, y: centerY + 80 };
  };

  // Handle AI analysis
  const handleAnalyze = async () => {
    if (!ensureSelectionWithinLimit() || !ensureAIAllowed()) return;
    const content = getSelectionContent();
    const result = await analyzeSelection(content, 'حلل هذه العناصر واقترح أفضل طريقة لتنظيمها');
    
    if (result?.suggestions && result.suggestions.length > 0) {
      toast.success(`تم تحليل ${selectedElements.length} عنصر`, {
        description: result.suggestions[0].reasoning
      });
    }
  };

  const handleGenerateSmartDoc = async (smartType: 'smart_text_doc' | 'interactive_sheet') => {
    if (!ensureSelectionWithinLimit() || !ensureAIAllowed()) return;
    setIsTransforming(true);

    try {
      const contentText = getSelectionText();
      const analysis = await analyzeSelection(
        getSelectionContent(),
        smartType === 'interactive_sheet'
          ? `حوّل هذه العناصر إلى جدول تفاعلي منظم: ${contentText}`
          : `حوّل هذه العناصر إلى وثيقة نصية ذكية مهيكلة: ${contentText}`,
      );

      if (!analysis) {
        toast.error('فشل توليد المستند الذكي، بقي التحديد كما هو');
        return;
      }

      const title = smartType === 'interactive_sheet' ? 'جدول تفاعلي من التحديد' : 'مستند ذكي من التحديد';
      addElement(createSmartCanvasElement({
        smartType,
        position: getInsertionPosition(),
        title,
        data: smartType === 'interactive_sheet'
          ? {
              title,
              rows: Math.max(selectedElements.length + 1, 4),
              columns: 4,
              cells: selectedElements.reduce<Record<string, { value: string }>>((cells, element, index) => {
                cells[`A${index + 2}`] = { value: typeof element.content === 'string' ? element.content : element.data?.title ?? element.type };
                cells[`B${index + 2}`] = { value: element.type };
                return cells;
              }, {
                A1: { value: 'العنصر' },
                B1: { value: 'النوع' },
              }),
              version: 1,
              format: 'spreadsheet',
              sheet: {
                rows: Math.max(selectedElements.length + 1, 4),
                cols: 4,
                cells: selectedElements.reduce<Record<string, { value: string }>>((cells, element, index) => {
                  cells[`${index + 1}:0`] = { value: typeof element.content === 'string' ? element.content : element.data?.title ?? element.type };
                  cells[`${index + 1}:1`] = { value: element.type };
                  return cells;
                }, {
                  '0:0': { value: 'العنصر' },
                  '0:1': { value: 'النوع' },
                }),
              },
              meta: {
                sourceSummary: (analysis as any).summary,
                sourceElementIds: selectedElementIds,
                enableFormulas: true,
              },
            }
          : {
              title,
              content: (analysis as any).summary || contentText,
              aiAssist: true,
              showToolbar: true,
              readOnly: false,
              version: 1,
              format: 'rich-text',
              blocks: [
                { id: crypto.randomUUID(), type: 'heading', text: title, level: 2 },
                { id: crypto.randomUUID(), type: 'paragraph', text: (analysis as any).summary || contentText },
              ],
              meta: {
                aiAssist: true,
                sourceElementIds: selectedElementIds,
              },
            },
        metadata: {
          sourceElementIds: selectedElementIds,
          generatedBy: 'context-smart-menu',
          documentStatus: 'draft',
        },
      }));
      toast.success(smartType === 'interactive_sheet' ? 'تم إنشاء جدول تفاعلي' : 'تم إنشاء مستند ذكي');
      setIsVisible(false);
    } catch (error) {
      toast.error('فشل توليد المستند الذكي، بقي التحديد كما هو');
    } finally {
      setIsTransforming(false);
    }
  };

  const handleSuggestConversion = (targetEntityType: 'project' | 'task') => {
    if (!ensureSelectionWithinLimit() || !ensureAIAllowed()) return;
    const title = getSelectionText().split('\n').find(Boolean) || (targetEntityType === 'project' ? 'مشروع من التخطيط' : 'مهمة من التخطيط');

    window.dispatchEvent(new CustomEvent('planning:smart-conversion-suggested', {
      detail: {
        targetEntityType,
        suggestedData: {
          title,
          name: title,
          description: getSelectionText(),
        },
      },
    }));
    setIsVisible(false);
  };

  // Handle transform to smart element
  const handleTransform = async (targetType: SmartElementType) => {
    if (!ensureSelectionWithinLimit() || !ensureAIAllowed()) return;
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

        result.elements.forEach((element, index) => {
          addElement(createSmartCanvasElement({
            smartType: element.type as SmartElementType,
            position: { x: centerX + index * 30, y: centerY + index * 30 },
            title: element.title,
            description: element.description,
            data: element.data,
            metadata: {
              sourceElementIds: selectedElementIds,
              generatedBy: 'context-smart-menu',
            },
          }));
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
    if (!ensureSelectionWithinLimit() || !ensureAIAllowed()) return;
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

  if (!isVisible || selectedElements.length < 1) {
    return <>{approvalDialog}</>;
  }

  return createPortal(
    <>
      {approvalDialog}
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
        <div className="bg-background/95 backdrop-blur-lg border border-border rounded-lg shadow-xl overflow-hidden">
          {/* Main Action Bar */}
          <div className="flex items-center gap-1 p-1.5">
            <Button
              onClick={handleQuickGenerate}
              disabled={isLoading || isTransforming || !canUseAI}
              className="h-8 px-3 gap-2 bg-gradient-to-r from-[hsl(var(--accent-green))] to-[hsl(var(--accent-blue))] hover:opacity-90 text-white text-[11px] font-medium"
            >
              {isLoading || isTransforming ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Sparkles size={14} />
              )}
              <span>إنشاء عنصر ذكي</span>
            </Button>

            <Button
              onClick={handleAnalyze}
              disabled={isLoading || isTransforming || !canUseAI}
              variant="ghost"
              className="h-8 px-3 gap-2 text-[11px]"
            >
              <Search size={14} />
              تحليل
            </Button>

            <Button
              onClick={() => handleGenerateSmartDoc('smart_text_doc')}
              disabled={isLoading || isTransforming || !canUseAI}
              variant="ghost"
              className="h-8 px-3 gap-2 text-[11px]"
            >
              <FileText size={14} />
              وثيقة
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

          <div className="px-3 pb-2 text-[10px] text-muted-foreground text-center">
            {selectedElements.length} عنصر محدد
          </div>
          {!canUseAI && (
            <div className="px-3 pb-2 text-center text-[10px] text-destructive">
              {denialReason || 'أدوات AI غير متاحة لهذا الدور'}
            </div>
          )}

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
                    أوامر تنفيذية:
                  </div>
                  <button
                    onClick={() => handleSuggestConversion('project')}
                    disabled={isLoading || isTransforming || !canUseAI}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/80 transition-colors text-right disabled:opacity-50"
                  >
                    <FolderKanban size={16} className="text-[hsl(var(--accent-green))]" />
                    <div className="flex-1">
                      <div className="text-[12px] font-medium text-foreground">تحويل إلى مشروع</div>
                      <div className="text-[10px] text-muted-foreground">إنشاء سجل مشروع وربطه بالعناصر المصدر</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleSuggestConversion('task')}
                    disabled={isLoading || isTransforming || !canUseAI}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/80 transition-colors text-right disabled:opacity-50"
                  >
                    <CheckSquare size={16} className="text-[hsl(var(--accent-green))]" />
                    <div className="flex-1">
                      <div className="text-[12px] font-medium text-foreground">تحويل إلى مهمة</div>
                      <div className="text-[10px] text-muted-foreground">إنشاء مهمة تنفيذية مرتبطة بالتخطيط</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleGenerateSmartDoc('interactive_sheet')}
                    disabled={isLoading || isTransforming || !canUseAI}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/80 transition-colors text-right disabled:opacity-50"
                  >
                    <Table2 size={16} className="text-[hsl(var(--accent-green))]" />
                    <div className="flex-1">
                      <div className="text-[12px] font-medium text-foreground">توليد جدول تفاعلي</div>
                      <div className="text-[10px] text-muted-foreground">جدول محفوظ داخل اللوحة وقابل للربط</div>
                    </div>
                  </button>
                  <div className="text-[10px] text-muted-foreground px-2 pt-2 pb-1">
                    تنظيم بصري:
                  </div>
                  {TRANSFORM_OPTIONS.map((option) => (
                    <button
                      key={option.type}
                      onClick={() => handleTransform(option.type)}
                      disabled={isLoading || isTransforming || !canUseAI}
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
      </AnimatePresence>
    </>,
    document.body
  );
};

export default ContextSmartMenu;
