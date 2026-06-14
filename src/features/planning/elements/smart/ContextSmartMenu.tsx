import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, LayoutGrid, Network, Calendar, Table2, Zap, Loader2, X, ChevronDown, FileText, FolderKanban, CheckSquare, Search } from 'lucide-react';
import { useCanvasStore } from '@/stores/canvasStore';
import { Button } from '@/components/ui/button';
import type { SmartElementType } from '@/types/smart-elements';
import {
  areContextSmartMenuSelectionIdsPersisted,
  CONTEXT_SMART_TRANSFORM_OPTIONS,
  useContextSmartActions,
} from './useContextSmartActions';

export { areContextSmartMenuSelectionIdsPersisted };

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

const TRANSFORM_ICONS: Partial<Record<SmartElementType, React.ReactNode>> = {
  kanban: <LayoutGrid size={16} />,
  mind_map: <Network size={16} />,
  timeline: <Calendar size={16} />,
  decisions_matrix: <Table2 size={16} />,
  brainstorming: <Zap size={16} />,
  smart_text_doc: <FileText size={16} />,
  interactive_sheet: <Table2 size={16} />,
};

export function calculateContextSmartMenuPosition(
  selectedElements: SelectedMenuElement[],
  viewport: MenuViewport,
  boardFrameOffset: BoardFrameOffset = { left: 0, top: 0 },
): { x: number; y: number } {
  let minX = Infinity, minY = Infinity;
  let maxX = -Infinity;

  selectedElements.forEach((el) => {
    const x = el.position?.x || 0;
    const y = el.position?.y || 0;
    const width = el.size?.width || 100;
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + width);
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
  const { viewport } = useCanvasStore();
  const {
    selectedElements,
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
  } = useContextSmartActions(boardId);

  useEffect(() => {
    if (selectedElements.length < 1) {
      setIsVisible(false);
      return;
    }

    const boardFrame = document.querySelector('[data-board-frame="true"]');
    const boardRect = boardFrame?.getBoundingClientRect();
    setPosition(calculateContextSmartMenuPosition(selectedElements, viewport, {
      left: boardRect?.left ?? 0,
      top: boardRect?.top ?? 0,
    }));
    setIsVisible(true);
    setIsExpanded(false);
  }, [selectedElements, viewport]);

  const busy = isLoading || isTransforming;
  const closeAfter = (action: () => void | Promise<void>) => () => {
    void Promise.resolve(action()).then(() => setIsVisible(false));
  };

  if (!isVisible || selectedElements.length < 1) return <>{approvalDialog}</>;

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
          style={{ left: position.x, top: position.y, transform: 'translateX(-50%)' }}
        >
          <div className="bg-background/95 backdrop-blur-lg border border-border rounded-lg shadow-xl overflow-hidden">
            <div className="flex items-center gap-1 p-1.5">
              <Button onClick={closeAfter(quickGenerate)} disabled={busy || !canUseAI} className="h-8 px-3 gap-2 bg-gradient-to-r from-[hsl(var(--accent-green))] to-[hsl(var(--accent-blue))] hover:opacity-90 text-white text-[11px] font-medium">
                {busy ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                <span>إنشاء عنصر ذكي</span>
              </Button>
              <Button onClick={analyze} disabled={busy || !canUseAI} variant="ghost" className="h-8 px-3 gap-2 text-[11px]">
                <Search size={14} />
                تحليل
              </Button>
              <Button onClick={closeAfter(() => generateSmartDoc('smart_text_doc'))} disabled={busy || !canUseAI} variant="ghost" className="h-8 px-3 gap-2 text-[11px]">
                <FileText size={14} />
                وثيقة
              </Button>
              <Button onClick={() => setIsExpanded(!isExpanded)} variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ChevronDown size={16} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </Button>
              <Button onClick={() => setIsVisible(false)} variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                <X size={14} />
              </Button>
            </div>

            <div className="px-3 pb-2 text-[10px] text-muted-foreground text-center">{selectedElements.length} عنصر محدد</div>
            {!canUseAI && <div className="px-3 pb-2 text-center text-[10px] text-destructive">{denialReason || 'أدوات AI غير متاحة لهذا الدور'}</div>}

            <AnimatePresence>
              {isExpanded && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="border-t border-border overflow-hidden">
                  <div className="p-2 space-y-1">
                    <div className="text-[10px] text-muted-foreground px-2 py-1">أوامر تنفيذية:</div>
                    <button onClick={closeAfter(() => suggestConversion('project'))} disabled={busy || !canUseAI} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/80 transition-colors text-right disabled:opacity-50">
                      <FolderKanban size={16} className="text-[hsl(var(--accent-green))]" />
                      <div className="flex-1"><div className="text-[12px] font-medium text-foreground">تحويل إلى مشروع</div><div className="text-[10px] text-muted-foreground">إنشاء سجل مشروع وربطه بالعناصر المصدر</div></div>
                    </button>
                    <button onClick={closeAfter(() => suggestConversion('task'))} disabled={busy || !canUseAI} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/80 transition-colors text-right disabled:opacity-50">
                      <CheckSquare size={16} className="text-[hsl(var(--accent-green))]" />
                      <div className="flex-1"><div className="text-[12px] font-medium text-foreground">تحويل إلى مهمة</div><div className="text-[10px] text-muted-foreground">إنشاء مهمة تنفيذية مرتبطة بالتخطيط</div></div>
                    </button>
                    <button onClick={closeAfter(() => generateSmartDoc('interactive_sheet'))} disabled={busy || !canUseAI} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/80 transition-colors text-right disabled:opacity-50">
                      <Table2 size={16} className="text-[hsl(var(--accent-green))]" />
                      <div className="flex-1"><div className="text-[12px] font-medium text-foreground">توليد جدول تفاعلي</div><div className="text-[10px] text-muted-foreground">جدول محفوظ داخل اللوحة وقابل للربط</div></div>
                    </button>
                    <div className="text-[10px] text-muted-foreground px-2 pt-2 pb-1">تنظيم بصري:</div>
                    {CONTEXT_SMART_TRANSFORM_OPTIONS.map((option) => (
                      <button key={option.type} onClick={closeAfter(() => transform(option.type))} disabled={busy || !canUseAI} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/80 transition-colors text-right disabled:opacity-50">
                        <span className="text-[hsl(var(--accent-green))]">{TRANSFORM_ICONS[option.type]}</span>
                        <div className="flex-1"><div className="text-[12px] font-medium text-foreground">{option.label}</div><div className="text-[10px] text-muted-foreground">{option.description}</div></div>
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
    document.body,
  );
};

export default ContextSmartMenu;
