import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useCanvasStore } from '@/stores/canvasStore';
import { useSmartElementAI } from '@/hooks/useSmartElementAI';
import type { SmartElementType } from '@/types/smart-elements';
import { isPlanningElementId } from '@/features/planning/state/createPlanningElementId';
import { AI_SELECTED_ELEMENTS_LIMIT_MESSAGE, MAX_AI_SELECTED_ELEMENTS } from '@/features/ai/context/limits';
import { createSmartCanvasElement } from './factories/createTypedSmartElement';

export async function areContextSmartMenuSelectionIdsPersisted(
  boardId: string | null | undefined,
  selectedElementIds: string[],
): Promise<boolean> {
  if (!boardId || selectedElementIds.length === 0) return false;
  if (!selectedElementIds.every(isPlanningElementId)) return false;

  const { data, error } = await supabase
    .from('planning_elements')
    .select('id')
    .eq('board_id', boardId)
    .in('id', selectedElementIds);

  if (error) return false;

  const persistedIds = new Set((data ?? []).map((row) => row.id));
  return selectedElementIds.every((id) => persistedIds.has(id));
}

export const CONTEXT_SMART_TRANSFORM_OPTIONS = [
  { type: 'kanban' as SmartElementType, label: 'لوحة كانبان', description: 'تحويل إلى أعمدة ومهام' },
  { type: 'mind_map' as SmartElementType, label: 'خريطة ذهنية', description: 'تنظيم كخريطة مترابطة' },
  { type: 'timeline' as SmartElementType, label: 'خط زمني', description: 'ترتيب على محور زمني' },
  { type: 'decisions_matrix' as SmartElementType, label: 'مصفوفة قرارات', description: 'تقييم ومقارنة الخيارات' },
  { type: 'brainstorming' as SmartElementType, label: 'عصف ذهني', description: 'تجميع كأفكار للنقاش' },
];

export function useContextSmartActions(boardId?: string | null) {
  const [isTransforming, setIsTransforming] = useState(false);
  const { elements, selectedElementIds, addElement } = useCanvasStore();
  const { analyzeSelection, transformElements, isLoading, approvalDialog, canUseAI, denialReason } = useSmartElementAI(boardId);

  const selectedElements = useMemo(
    () => elements.filter((el) => selectedElementIds.includes(el.id)),
    [elements, selectedElementIds],
  );

  const getSelectionContent = useCallback(() => selectedElements.map((el) => ({
    type: el.type,
    content: el.content || '',
    data: el.data,
    smartType: el.smartType ?? el.data?.smartType,
    position: el.position,
  })), [selectedElements]);

  const ensureSelectionWithinLimit = useCallback(() => {
    if (selectedElements.length <= MAX_AI_SELECTED_ELEMENTS) return true;
    toast.error(AI_SELECTED_ELEMENTS_LIMIT_MESSAGE);
    return false;
  }, [selectedElements.length]);

  const ensureAIAllowed = useCallback(() => {
    if (canUseAI) return true;
    toast.error('تعذر بدء إجراء الذكاء الاصطناعي', {
      description: denialReason || 'لا تملك صلاحية استخدام AI على هذه اللوحة',
    });
    return false;
  }, [canUseAI, denialReason]);

  const getSelectionText = useCallback(() => selectedElements
    .map((el) => {
      if (typeof el.content === 'string' && el.content.trim()) return el.content.trim();
      if (typeof el.data?.title === 'string') return el.data.title;
      if (typeof el.data?.label === 'string') return el.data.label;
      if (typeof el.data?.content === 'string') return el.data.content;
      return el.type;
    })
    .filter(Boolean)
    .join('\n'), [selectedElements]);

  const getInsertionPosition = useCallback(() => {
    const centerX = selectedElements.reduce((sum, el) => sum + (el.position?.x || 0), 0) / selectedElements.length;
    const centerY = selectedElements.reduce((sum, el) => sum + (el.position?.y || 0), 0) / selectedElements.length;
    return { x: centerX + 80, y: centerY + 80 };
  }, [selectedElements]);

  const analyze = useCallback(async () => {
    if (!ensureSelectionWithinLimit() || !ensureAIAllowed()) return;
    const result = await analyzeSelection(getSelectionContent(), 'حلل هذه العناصر واقترح أفضل طريقة لتنظيمها');
    if (result?.suggestions && result.suggestions.length > 0) {
      toast.success(`تم تحليل ${selectedElements.length} عنصر`, { description: result.suggestions[0].reasoning });
    }
  }, [analyzeSelection, ensureAIAllowed, ensureSelectionWithinLimit, getSelectionContent, selectedElements.length]);

  const generateSmartDoc = useCallback(async (smartType: 'smart_text_doc' | 'interactive_sheet') => {
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
      const checkedSourceElementIds = selectedElementIds.filter(isPlanningElementId);
      const textCellValue = (element: typeof selectedElements[number]) =>
        typeof element.content === 'string' ? element.content : element.data?.title ?? element.type;

      addElement(createSmartCanvasElement({
        smartType,
        position: getInsertionPosition(),
        title,
        data: smartType === 'interactive_sheet'
          ? {
              title,
              sourceElementIds: checkedSourceElementIds,
              rows: Math.max(selectedElements.length + 1, 4),
              columns: 4,
              cells: selectedElements.reduce<Record<string, { value: string }>>((cells, element, index) => {
                cells[`A${index + 2}`] = { value: textCellValue(element) };
                cells[`B${index + 2}`] = { value: element.type };
                return cells;
              }, { A1: { value: 'العنصر' }, B1: { value: 'النوع' } }),
              version: 1,
              format: 'spreadsheet',
              sheet: {
                rows: Math.max(selectedElements.length + 1, 4),
                cols: 4,
                cells: selectedElements.reduce<Record<string, { value: string }>>((cells, element, index) => {
                  cells[`${index + 1}:0`] = { value: textCellValue(element) };
                  cells[`${index + 1}:1`] = { value: element.type };
                  return cells;
                }, { '0:0': { value: 'العنصر' }, '0:1': { value: 'النوع' } }),
              },
              meta: { sourceSummary: (analysis as any).summary, sourceElementIds: checkedSourceElementIds, enableFormulas: true },
            }
          : {
              title,
              sourceElementIds: checkedSourceElementIds,
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
              meta: { aiAssist: true, sourceElementIds: checkedSourceElementIds },
            },
        metadata: { sourceElementIds: checkedSourceElementIds, generatedBy: 'context-smart-menu', documentStatus: 'draft' },
      }));
      toast.success(smartType === 'interactive_sheet' ? 'تم إنشاء جدول تفاعلي' : 'تم إنشاء مستند ذكي');
    } catch {
      toast.error('فشل توليد المستند الذكي، بقي التحديد كما هو');
    } finally {
      setIsTransforming(false);
    }
  }, [addElement, analyzeSelection, ensureAIAllowed, ensureSelectionWithinLimit, getInsertionPosition, getSelectionContent, getSelectionText, selectedElementIds, selectedElements]);

  const suggestConversion = useCallback(async (targetEntityType: 'project' | 'task') => {
    if (!ensureSelectionWithinLimit() || !ensureAIAllowed()) return;
    const checkedSourceElementIds = [...selectedElementIds];
    const selectionText = getSelectionText();
    setIsTransforming(true);
    try {
      const selectionPersisted = await areContextSmartMenuSelectionIdsPersisted(boardId, checkedSourceElementIds);
      if (!selectionPersisted) {
        toast.error('لا يمكن تحويل عناصر لم تكتمل مزامنتها بعد', { description: 'انتظر اكتمال حفظ اللوحة ثم أعد محاولة التحويل.' });
        return;
      }
      const title = selectionText.split('\n').find(Boolean) || (targetEntityType === 'project' ? 'مشروع من التخطيط' : 'مهمة من التخطيط');
      window.dispatchEvent(new CustomEvent('planning:smart-conversion-suggested', {
        detail: { targetEntityType, sourceBoardId: boardId, sourceElementIds: checkedSourceElementIds, suggestedData: { title, name: title, description: selectionText } },
      }));
    } finally {
      setIsTransforming(false);
    }
  }, [boardId, ensureAIAllowed, ensureSelectionWithinLimit, getSelectionText, selectedElementIds]);

  const transform = useCallback(async (targetType: SmartElementType) => {
    if (!ensureSelectionWithinLimit() || !ensureAIAllowed()) return;
    setIsTransforming(true);
    try {
      const contentText = selectedElements.map((el) => el.content || '').filter(Boolean).join('\n');
      const result = await transformElements(getSelectionContent(), targetType, `حوّل هذه العناصر إلى ${targetType}: ${contentText}`);
      if (result?.elements && result.elements.length > 0) {
        const centerX = selectedElements.reduce((sum, el) => sum + (el.position?.x || 0), 0) / selectedElements.length;
        const centerY = selectedElements.reduce((sum, el) => sum + (el.position?.y || 0), 0) / selectedElements.length;
        result.elements.forEach((element, index) => {
          addElement(createSmartCanvasElement({
            smartType: element.type as SmartElementType,
            position: { x: centerX + index * 30, y: centerY + index * 30 },
            title: element.title,
            description: element.description,
            data: element.data,
            metadata: { sourceElementIds: selectedElementIds, generatedBy: 'context-smart-menu' },
          }));
        });
        toast.success(`تم تحويل ${selectedElements.length} عنصر إلى ${CONTEXT_SMART_TRANSFORM_OPTIONS.find((o) => o.type === targetType)?.label}`);
      }
    } catch {
      toast.error('حدث خطأ أثناء التحويل');
    } finally {
      setIsTransforming(false);
    }
  }, [addElement, ensureAIAllowed, ensureSelectionWithinLimit, getSelectionContent, selectedElementIds, selectedElements, transformElements]);

  const quickGenerate = useCallback(async () => {
    if (!ensureSelectionWithinLimit() || !ensureAIAllowed()) return;
    const contentText = selectedElements.map((el) => el.content || '').filter(Boolean).join('\n');
    const result = await analyzeSelection(getSelectionContent(), `حلل هذه العناصر وأنشئ عنصر ذكي مناسب: ${contentText}`);
    const targetType = result?.suggestions?.[0]?.targetType;
    if (targetType) await transform(targetType);
  }, [analyzeSelection, ensureAIAllowed, ensureSelectionWithinLimit, getSelectionContent, selectedElements, transform]);

  return {
    selectedElements,
    selectedElementIds,
    isLoading,
    isTransforming,
    approvalDialog,
    canUseAI,
    denialReason,
    analyze,
    quickGenerate,
    transform,
    generateSmartDoc,
    suggestConversion,
  };
}
