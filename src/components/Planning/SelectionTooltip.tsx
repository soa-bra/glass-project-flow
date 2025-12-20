/**
 * SelectionTooltip - عرض معلومات العناصر المحددة
 * يظهر عدد العناصر وأبعادها وموقعها
 */

import { memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Square, 
  Move, 
  Maximize2, 
  Layers, 
  Type,
  Image,
  StickyNote,
  Circle,
  Minus,
  Pencil,
} from 'lucide-react';
import type { CanvasElement } from '@/types/canvas';

interface SelectionTooltipProps {
  selectedElements: CanvasElement[];
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
  position?: 'top' | 'bottom';
}

const typeIcons: Record<string, React.ElementType> = {
  text: Type,
  sticky_note: StickyNote,
  shape: Square,
  image: Image,
  drawing: Pencil,
  connector: Minus,
  frame: Square,
  mindmap: Circle,
};

const typeLabels: Record<string, string> = {
  text: 'نص',
  sticky_note: 'ملاحظة',
  shape: 'شكل',
  image: 'صورة',
  drawing: 'رسم',
  connector: 'رابط',
  frame: 'إطار',
  mindmap: 'خريطة ذهنية',
  smart: 'عنصر ذكي',
};

export const SelectionTooltip = memo(function SelectionTooltip({
  selectedElements,
  viewport,
  position = 'top',
}: SelectionTooltipProps) {
  // حساب مركز وأبعاد التحديد
  const selectionInfo = useMemo(() => {
    if (selectedElements.length === 0) return null;

    let minX = Infinity, minY = Infinity;
    let maxX = -Infinity, maxY = -Infinity;

    for (const el of selectedElements) {
      minX = Math.min(minX, el.x);
      minY = Math.min(minY, el.y);
      maxX = Math.max(maxX, el.x + el.width);
      maxY = Math.max(maxY, el.y + el.height);
    }

    const width = maxX - minX;
    const height = maxY - minY;
    const centerX = minX + width / 2;
    const centerY = minY + height / 2;

    // تحويل للشاشة
    const screenCenterX = (centerX - viewport.x) * viewport.zoom;
    const screenCenterY = (centerY - viewport.y) * viewport.zoom;
    const screenTop = (minY - viewport.y) * viewport.zoom;
    const screenBottom = (maxY - viewport.y) * viewport.zoom;

    // إحصاء الأنواع
    const typeCounts: Record<string, number> = {};
    for (const el of selectedElements) {
      typeCounts[el.type] = (typeCounts[el.type] || 0) + 1;
    }

    return {
      count: selectedElements.length,
      width: Math.round(width),
      height: Math.round(height),
      centerX: Math.round(centerX),
      centerY: Math.round(centerY),
      screenCenterX,
      screenCenterY,
      screenTop,
      screenBottom,
      typeCounts,
    };
  }, [selectedElements, viewport]);

  if (!selectionInfo || selectionInfo.count === 0) return null;

  const tooltipY = position === 'top' 
    ? selectionInfo.screenTop - 52 
    : selectionInfo.screenBottom + 12;

  return (
    <AnimatePresence>
      <motion.div
        className="pointer-events-none absolute z-50"
        style={{
          left: selectionInfo.screenCenterX,
          top: tooltipY,
          transform: 'translateX(-50%)',
        }}
        initial={{ opacity: 0, y: position === 'top' ? 8 : -8, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: position === 'top' ? 8 : -8, scale: 0.95 }}
        transition={{
          duration: 0.2,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div
          className="flex items-center gap-2 rounded-lg border border-border bg-background/95 px-3 py-1.5 shadow-lg backdrop-blur-sm"
          style={{
            boxShadow: '0 4px 12px rgba(0,0,0,0.08), 0 0 1px rgba(0,0,0,0.1)',
          }}
        >
          {/* عدد العناصر */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
            <Layers className="h-3.5 w-3.5 text-accent-blue" />
            <span>{selectionInfo.count}</span>
            <span className="text-muted-foreground">
              {selectionInfo.count === 1 ? 'عنصر' : 'عناصر'}
            </span>
          </div>

          {/* فاصل */}
          <div className="h-3 w-px bg-border" />

          {/* أيقونات الأنواع */}
          <div className="flex items-center gap-1">
            {Object.entries(selectionInfo.typeCounts).slice(0, 3).map(([type, count]) => {
              const Icon = typeIcons[type] || Square;
              return (
                <div
                  key={type}
                  className="flex items-center gap-0.5 text-xs text-muted-foreground"
                  title={`${count} ${typeLabels[type] || type}`}
                >
                  <Icon className="h-3 w-3" />
                  {count > 1 && <span className="text-[10px]">{count}</span>}
                </div>
              );
            })}
            {Object.keys(selectionInfo.typeCounts).length > 3 && (
              <span className="text-[10px] text-muted-foreground">
                +{Object.keys(selectionInfo.typeCounts).length - 3}
              </span>
            )}
          </div>

          {/* فاصل */}
          <div className="h-3 w-px bg-border" />

          {/* الأبعاد */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Maximize2 className="h-3 w-3" />
            <span>{selectionInfo.width}</span>
            <span>×</span>
            <span>{selectionInfo.height}</span>
          </div>

          {/* الموقع (للعنصر الواحد فقط) */}
          {selectionInfo.count === 1 && (
            <>
              <div className="h-3 w-px bg-border" />
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Move className="h-3 w-3" />
                <span>{selectionInfo.centerX}</span>
                <span>,</span>
                <span>{selectionInfo.centerY}</span>
              </div>
            </>
          )}
        </div>

        {/* سهم التوجيه */}
        <div
          className="absolute left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-border bg-background/95"
          style={{
            ...(position === 'top' 
              ? { bottom: -4, borderRight: '1px solid', borderBottom: '1px solid' }
              : { top: -4, borderLeft: '1px solid', borderTop: '1px solid' }
            ),
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
});

/**
 * Quick Action Tooltip - أزرار سريعة للتحديد
 */
interface QuickActionsTooltipProps {
  selectedElements: CanvasElement[];
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
  onDelete?: () => void;
  onDuplicate?: () => void;
  onGroup?: () => void;
  onAlign?: (direction: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
}

export const QuickActionsTooltip = memo(function QuickActionsTooltip({
  selectedElements,
  viewport,
  onDelete,
  onDuplicate,
  onGroup,
}: QuickActionsTooltipProps) {
  const bounds = useMemo(() => {
    if (selectedElements.length === 0) return null;

    let minX = Infinity, maxX = -Infinity, maxY = -Infinity;

    for (const el of selectedElements) {
      minX = Math.min(minX, el.x);
      maxX = Math.max(maxX, el.x + el.width);
      maxY = Math.max(maxY, el.y + el.height);
    }

    return {
      centerX: (minX + maxX) / 2,
      bottom: maxY,
    };
  }, [selectedElements]);

  if (!bounds || selectedElements.length === 0) return null;

  const screenX = (bounds.centerX - viewport.x) * viewport.zoom;
  const screenY = (bounds.bottom - viewport.y) * viewport.zoom + 16;

  return (
    <motion.div
      className="pointer-events-auto absolute z-50"
      style={{
        left: screenX,
        top: screenY,
        transform: 'translateX(-50%)',
      }}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.15 }}
    >
      <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1 shadow-lg">
        {onDuplicate && (
          <button
            onClick={onDuplicate}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="نسخ"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
          </button>
        )}

        {onGroup && selectedElements.length > 1 && (
          <button
            onClick={onGroup}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="تجميع"
          >
            <Layers className="h-4 w-4" />
          </button>
        )}

        {onDelete && (
          <button
            onClick={onDelete}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent-red/10 hover:text-accent-red"
            title="حذف"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            </svg>
          </button>
        )}
      </div>
    </motion.div>
  );
});
